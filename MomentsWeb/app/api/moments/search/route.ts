import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const walletAddress = searchParams.get('walletAddress')

  if (!walletAddress) {
    return NextResponse.json({ error: "Wallet address is required" }, { status: 400 })
  }

  try {
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(moments)
  } catch (error) {
    console.error("Error searching moments:", error)
    return NextResponse.json({ error: "Failed to search moments" }, { status: 500 })
  }
} 