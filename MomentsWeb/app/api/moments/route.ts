import { NextResponse } from "next/server"
import type { Moment } from "@/lib/types"

// Mock data - in a real app, this would come from a database
const mockMoments: Moment[] = [
  {
    id: "1",
    title: "Trip to Paris",
    description: "Our amazing vacation in the city of love",
    date: new Date("2023-10-15"),
    imageUrl: "/placeholder.svg?height=300&width=500",
    status: "completed",
    creator: {
      id: "1",
      name: "John",
      walletAddress: "0x1234...5678",
      ensName: "john.eth",
      joinedDate: new Date("2023-03-01"),
      isVerified: true,
    },
    participants: [
      {
        id: "1",
        name: "John",
        walletAddress: "0x1234...5678",
        ensName: "john.eth",
        joinedDate: new Date("2023-03-01"),
        isVerified: true,
      },
      {
        id: "2",
        name: "Jane",
        walletAddress: "0xabcd...ef01",
        joinedDate: new Date("2023-02-15"),
        isVerified: false,
      },
    ],
    nftTokenId: "12345",
  },
  {
    id: "2",
    title: "Wedding Anniversary",
    description: "Celebrating 5 years of marriage",
    date: new Date("2023-08-15"),
    imageUrl: "/placeholder.svg?height=300&width=500",
    status: "proposed",
    creator: {
      id: "2",
      name: "Jane",
      walletAddress: "0xabcd...ef01",
      joinedDate: new Date("2023-02-15"),
      isVerified: false,
    },
    participants: [
      {
        id: "2",
        name: "Jane",
        walletAddress: "0xabcd...ef01",
        joinedDate: new Date("2023-02-15"),
        isVerified: false,
      },
      {
        id: "3",
        name: "Mike",
        walletAddress: "0xef01...2345",
        joinedDate: new Date("2023-04-10"),
        isVerified: true,
      },
    ],
  },
]

export async function GET() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json(mockMoments)
}

export async function POST(request: Request) {
  try {
    const moment = await request.json()

    // In a real app, you would save to a database and generate an ID
    const newMoment = {
      ...moment,
      id: Math.random().toString(36).substring(2, 9),
      date: new Date(),
      status: "proposed",
    }

    return NextResponse.json(newMoment, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create moment" }, { status: 400 })
  }
}

