import { NextResponse } from "next/server"

// In a real app, this would come from a database or API
const mockMoments = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  title: `Moment ${i + 1}`,
  description: `This is a beautiful moment captured in time. It represents a special occasion where people came together to celebrate life, love, and friendship. The memory of this day will be cherished forever as it marks an important milestone in the journey of those involved.`,
  creator: `Creator${i + 1}.eth`,
  date: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
  participants: Math.floor(Math.random() * 5) + 1,
  imageUrl: `/placeholder.svg?height=400&width=400&text=Moment${i + 1}`,
  tags: ["love", "friendship", "celebration"][Math.floor(Math.random() * 3)],
  price: (Math.random() * 0.2 + 0.05).toFixed(3),
}))

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  // Filter moments based on search query
  const filteredMoments = query
    ? mockMoments.filter(
        (moment) =>
          moment.title.toLowerCase().includes(query.toLowerCase()) ||
          moment.description.toLowerCase().includes(query.toLowerCase()) ||
          moment.tags.includes(query.toLowerCase()),
      )
    : mockMoments

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return NextResponse.json(filteredMoments)
}

export async function POST(request: Request) {
  try {
    const { momentId } = await request.json()

    // Simulate minting process
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

