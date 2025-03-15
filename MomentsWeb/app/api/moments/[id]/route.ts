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
            user: true
          }
        }
      }
    })

    if (!moment) {
      return NextResponse.json({ error: "Moment not found" }, { status: 404 })
    }

    // Transform moment to include calculated status
    let currentStatus = moment.status === "proposed" ? "created" : moment.status.toLowerCase()
    
    // Calculate the actual status based on participant signatures
    if (moment.participants.length > 0) {
      const allSigned = moment.participants.every(p => p.hasSigned)
      
      if (allSigned) {
        currentStatus = "completed"
      } else if (moment.participants.some(p => p.hasSigned)) {
        currentStatus = "pending"
      } else {
        currentStatus = "created"
      }
    }
    
    const transformedMoment = {
      ...moment,
      status: currentStatus
    }

    return NextResponse.json(transformedMoment)
  } catch (error) {
    console.error("Error fetching moment:", error)
    return NextResponse.json({ error: "Failed to fetch moment" }, { status: 500 })
  }
} 