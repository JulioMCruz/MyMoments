import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// User registration endpoint - used when user clicks "Get Started"
export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json()

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      )
    }

    // Find user by wallet address or create a new one (always unverified)
    const user = await prisma.user.upsert({
      where: {
        walletAddress: walletAddress,
      },
      update: {}, // Don't update anything if user exists
      create: {
        walletAddress: walletAddress,
        isVerified: false, // New users are NEVER verified automatically
      },
      select: {
        id: true,
        walletAddress: true,
        isVerified: true,
      },
    })

    return NextResponse.json({ 
      message: "User registered successfully", 
      user: user 
    })
  } catch (error) {
    console.error("Error registering user:", error)
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    )
  }
} 