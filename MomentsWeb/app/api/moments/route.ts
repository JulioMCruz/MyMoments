import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET endpoint to retrieve moments by wallet address (either creator or participant)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const walletAddress = searchParams.get('walletAddress')

  try {
    if (walletAddress) {
      // Find moments where user is either creator or participant
      const moments = await prisma.moment.findMany({
        where: {
          OR: [
            // Where user is the creator
            {
              creator: {
                walletAddress: walletAddress
              }
            },
            // Where user is a participant
            {
              participants: {
                some: {
                  user: {
                    walletAddress: walletAddress
                  }
                }
              }
            }
          ]
        },
        include: {
          creator: true,
          participants: {
            include: {
              user: true
            }
          }
        }
      })

      return NextResponse.json(moments)
    } else {
      // If no wallet address is provided, return all moments
      const moments = await prisma.moment.findMany({
        include: {
          creator: true,
          participants: {
            include: {
              user: true
            }
          }
        }
      })

      return NextResponse.json(moments)
    }
  } catch (error) {
    console.error("Error fetching moments:", error)
    return NextResponse.json({ error: "Failed to fetch moments" }, { status: 500 })
  }
}

// POST endpoint to create a new moment
export async function POST(request: Request) {
  try {
    const { title, description, imageUrl, ipfsHash, creatorWalletAddress, participantWallets } = await request.json()

    if (!title || !description || !imageUrl || !ipfsHash || !creatorWalletAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Find or create the creator user
    let creator = await prisma.user.findUnique({
      where: { walletAddress: creatorWalletAddress }
    })

    if (!creator) {
      creator = await prisma.user.create({
        data: {
          walletAddress: creatorWalletAddress,
          isVerified: false
        }
      })
    }

    // Create the new moment
    const newMoment = await prisma.moment.create({
      data: {
        title,
        description,
        imageUrl,
        ipfsHash,
        creatorId: creator.id,
        status: "proposed"
      }
    })

    // Process participant wallets
    if (participantWallets && participantWallets.length > 0) {
      for (const walletAddress of participantWallets) {
        // Skip empty wallet addresses
        if (!walletAddress) continue

        // Find or create the participant user
        let participant = await prisma.user.findUnique({
          where: { walletAddress }
        })

        if (!participant) {
          participant = await prisma.user.create({
            data: {
              walletAddress,
              isVerified: false
            }
          })
        }

        // Create the moment participant relationship
        await prisma.momentParticipant.create({
          data: {
            userId: participant.id,
            momentId: newMoment.id,
            hasSigned: false
          }
        })
      }
    }

    // Return the created moment with creator and participants
    const createdMoment = await prisma.moment.findUnique({
      where: { id: newMoment.id },
      include: {
        creator: true,
        participants: {
          include: {
            user: true
          }
        }
      }
    })

    return NextResponse.json(createdMoment, { status: 201 })
  } catch (error) {
    console.error("Error creating moment:", error)
    return NextResponse.json({ error: "Failed to create moment" }, { status: 500 })
  }
}

