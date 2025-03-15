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
        isVerified: true,
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
          isVerified: true,
        },
      })
      
      return NextResponse.json({ isVerified: newUser.isVerified })
    }

    return NextResponse.json({ isVerified: user.isVerified })
  } catch (error) {
    console.error("Error fetching user verification:", error)
    return NextResponse.json(
      { error: "Failed to fetch user verification status" },
      { status: 500 }
    )
  }
} 