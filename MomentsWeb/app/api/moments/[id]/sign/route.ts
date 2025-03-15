import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getAddress } from "viem"

// POST endpoint to handle moment signing
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Get ID from params, ensuring it's properly awaited if needed
  const id = params.id

  try {
    // Parse the request body
    const { participantId, signature, message } = await request.json()

    if (!participantId || !signature || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Find the participant to verify they exist and are part of this moment
    const participant = await prisma.momentParticipant.findUnique({
      where: { id: participantId },
      include: {
        moment: true,
        user: true,
      },
    })

    if (!participant) {
      return NextResponse.json({ error: "Participant not found" }, { status: 404 })
    }

    if (participant.momentId !== id) {
      return NextResponse.json({ error: "Participant does not belong to this moment" }, { status: 400 })
    }

    if (participant.hasSigned) {
      return NextResponse.json({ error: "Participant has already signed this moment" }, { status: 400 })
    }

    // Verify the signature
    try {
      // In a real application, you would verify the SIWE message and signature here
      // For this demo, we'll just extract the address from the message to verify it matches
      
      // The message is already an object, no need to parse it
      const parsedMessage = message
      
      if (!parsedMessage.address) {
        throw new Error("Invalid message format")
      }
      
      // Verify that the address in the message matches the user's wallet address
      const messageAddress = getAddress(parsedMessage.address)
      const userAddress = getAddress(participant.user.walletAddress)
      
      if (messageAddress !== userAddress) {
        return NextResponse.json({ error: "Signature address does not match participant's wallet address" }, { status: 400 })
      }

      // In a production app, you would:
      // 1. Properly validate the SIWE message format and fields
      // 2. Verify the signature cryptographically
      // 3. Check the nonce, domain, and other security parameters
    } catch (error) {
      console.error("Error verifying signature:", error)
      return NextResponse.json({ error: "Invalid signature or message" }, { status: 400 })
    }

    // Update the participant's signing status
    await prisma.momentParticipant.update({
      where: { id: participantId },
      data: { hasSigned: true },
    })

    // Check if all participants have now signed
    const allParticipants = await prisma.momentParticipant.findMany({
      where: { momentId: id },
    })

    const allSigned = allParticipants.every(p => p.hasSigned)

    // If all participants have signed, update the moment status to completed
    if (allSigned && allParticipants.length > 0) {
      await prisma.moment.update({
        where: { id },
        data: { status: "completed" },
      })
    } else if (allParticipants.length > 0) {
      // If some participants have signed but not all, update status to pending
      await prisma.moment.update({
        where: { id },
        data: { status: "pending" },
      })
    }

    // Return the updated participant
    return NextResponse.json({ success: true, message: "Moment signed successfully" })
  } catch (error) {
    console.error("Error signing moment:", error)
    return NextResponse.json({ error: "Failed to sign moment" }, { status: 500 })
  }
} 