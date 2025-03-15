import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const walletAddress = searchParams.get("walletAddress")

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      )
    }

    // Find user by wallet address
    const user = await prisma.user.findUnique({
      where: {
        walletAddress: walletAddress,
      },
      select: {
        id: true,
        walletAddress: true,
        isVerified: true,
        createdAt: true,
      },
    })

    if (!user) {
      // If user doesn't exist, create a new unverified user
      const newUser = await prisma.user.create({
        data: {
          walletAddress: walletAddress,
          isVerified: false,
        },
        select: {
          id: true,
          walletAddress: true,
          isVerified: true,
          createdAt: true,
        },
      })
      
      return NextResponse.json({
        id: newUser.id,
        walletAddress: newUser.walletAddress,
        isVerified: newUser.isVerified,
        createdAt: newUser.createdAt,
      })
    }

    return NextResponse.json({
      id: user.id,
      walletAddress: user.walletAddress,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    })
  } catch (error) {
    console.error("Error fetching user information:", error)
    return NextResponse.json(
      { error: "Failed to fetch user information" },
      { status: 500 }
    )
  }
} 