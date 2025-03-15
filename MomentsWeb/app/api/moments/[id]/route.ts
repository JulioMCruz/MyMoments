import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET endpoint to retrieve a single moment by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params

  try {
    // Find the moment by ID
    const moment = await prisma.moment.findUnique({
      where: { id },
      include: {
        creator: true,
        participants: {
          include: {
            user: true,
          },
        },
        publishInfo: true  // Include the publishInfo relation
      }
    })

    if (!moment) {
      return NextResponse.json({ error: "Moment not found" }, { status: 404 })
    }

    // Transform the moment to include calculated status
    let status = moment.status
    // Convert old "proposed" to "created"
    if (status === "proposed") {
      status = "created"
    }

    // Calculate the actual status based on participant signatures
    if (status !== "published" && moment.participants.length > 0) {
      const allSigned = moment.participants.every(p => p.hasSigned)
      
      if (allSigned) {
        status = "completed"
      } else if (moment.participants.some(p => p.hasSigned)) {
        status = "pending"
      } else {
        status = "created"
      }
    }
    
    // Use the actual publishInfo from the database
    const transformedMoment = {
      ...moment,
      status,
    }

    return NextResponse.json(transformedMoment)
  } catch (error) {
    console.error("Error fetching moment:", error)
    return NextResponse.json({ error: "Failed to fetch moment" }, { status: 500 })
  }
} 