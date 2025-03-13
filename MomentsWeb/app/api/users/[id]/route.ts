import { NextResponse } from "next/server"
import type { User } from "@/lib/types"

// Mock user data - in a real app, this would come from a database
const mockUser: User = {
  id: "1",
  name: "JulioMCruz",
  walletAddress: "0xc2564e...e8228f",
  ensName: "JulioMCruz.base.eth",
  joinedDate: new Date("2023-03-01"),
  avatarUrl: "/placeholder.svg?height=128&width=128",
  isVerified: true,
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // In a real app, you would fetch the user by ID from a database
  return NextResponse.json(mockUser)
}

