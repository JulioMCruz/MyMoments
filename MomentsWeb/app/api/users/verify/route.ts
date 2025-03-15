import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

// Regular verification endpoint - only used for explicit verification through the QR code
export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json()

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      )
    }

    // Find user by wallet address and update verification status
    const updatedUser = await prisma.user.upsert({
      where: {
        walletAddress: walletAddress,
      },
      update: {
        isVerified: true,
      },
      create: {
        walletAddress: walletAddress,
        isVerified: false, // New users should not be verified automatically
      },
      select: {
        id: true,
        walletAddress: true,
        isVerified: true,
      },
    })

    // If this was a newly created user (still unverified), return with appropriate message
    if (!updatedUser.isVerified) {
      return NextResponse.json({ 
        message: "User created successfully, but verification is still required", 
        user: updatedUser 
      })
    }

    return NextResponse.json({ 
      message: "User verified successfully", 
      user: updatedUser 
    })
  } catch (error) {
    console.error("Error verifying user:", error)
    return NextResponse.json(
      { error: "Failed to verify user" },
      { status: 500 }
    )
  }
} 