import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  try {
    // Fetch published moments with non-private visibility
    const moments = await prisma.moment.findMany({
      where: {
        status: "published",
        publishInfo: {
          isPublished: true,
          isPrivate: false
        },
        // Add search query filtering if a query is provided
        ...(query ? {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } }
          ]
        } : {})
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
      }
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
        pricingType: moment.publishInfo?.pricingType || "free",
        status: moment.status
      }
    })

    return NextResponse.json(formattedMoments)
  } catch (error) {
    console.error("Error fetching discover moments:", error)
    return NextResponse.json(
      { error: "Failed to fetch moments" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { momentId } = await request.json()

    // Simulate minting process - this would be replaced with actual minting logic
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return NextResponse.json({
      success: true,
      message: "Moment minted successfully",
      tokenId: `TOKEN_${Date.now()}`,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to mint moment" }, { status: 400 })
  }
}

