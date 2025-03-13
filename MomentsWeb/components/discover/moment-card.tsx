"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"

interface MomentCardProps {
  moment: {
    id: number
    title: string
    description: string
    imageUrl: string
    tags: string
    participants: number
  }
  onClick: (id: number) => void
}

// Function to truncate text
const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + "..."
}

export default function MomentCard({ moment, onClick }: MomentCardProps) {
  return (
    <div
      className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white cursor-pointer"
      onClick={() => onClick(moment.id)}
    >
      <div className="aspect-square relative">
        <Image src={moment.imageUrl || "/placeholder.svg"} alt={moment.title} fill className="object-cover" />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{moment.title}</h3>
        <p className="text-gray-600 text-sm mb-3">{truncateText(moment.description, 150)}</p>
        <div className="flex justify-between items-center">
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">{moment.tags}</Badge>
          <span className="text-sm text-gray-500">{moment.participants} participants</span>
        </div>
      </div>
    </div>
  )
}

