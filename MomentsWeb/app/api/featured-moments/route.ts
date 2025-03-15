import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Fetch the latest 6 published public moments
    const moments = await prisma.moment.findMany({
      where: {
        status: "published",
        publishInfo: {
          isPublished: true,
          isPrivate: false
        }
      },
      include: {
        creator: true,
        participants: {
          include: {
            user: true
          }
        },
        publishInfo: true
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: 6 // Limit to 6 results
    })

    // Transform the moments to include participant count and other necessary information
    const formattedMoments = moments.map(moment => {
      return {
        id: moment.id,
        title: moment.title,
        description: moment.description,
        imageUrl: moment.imageUrl,
        creatorAddress: moment.creator.walletAddress,
        date: moment.createdAt,
        participants: moment.participants.length + 1, // +1 for the creator
        price: moment.publishInfo?.price || 0,
        pricingType: moment.publishInfo?.pricingType || "free"
      }
    })

    return NextResponse.json(formattedMoments)
  } catch (error) {
    console.error("Error fetching featured moments:", error)
    return NextResponse.json(
      { error: "Failed to fetch featured moments" },
      { status: 500 }
    )
  }
} 