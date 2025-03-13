import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Heart } from "lucide-react"

interface PublicMomentCardProps {
  moment: {
    id: number
    title: string
    description: string
    imageUrl: string
    tags: string
    participants: number
    creator: string
    date: Date
  }
}

export default function PublicMomentCard({ moment }: PublicMomentCardProps) {
  // Function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  return (
    <Link href={`/discover?highlight=${moment.id}`}>
      <Card className="h-full hover:shadow-md transition-shadow overflow-hidden">
        <div className="aspect-video relative">
          <Image
            src={moment.imageUrl || "/placeholder.svg"}
            alt={moment.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          />
          <div className="absolute top-2 right-2">
            <Badge className="bg-purple-500 text-white">
              {moment.participants} <Heart className="h-3 w-3 ml-1" />
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-bold text-lg mb-1">{moment.title}</h3>
          <p className="text-gray-500 text-sm mb-2">
            By {moment.creator} • {moment.date.toLocaleDateString()}
          </p>
          <p className="text-gray-600 text-sm mb-3">{truncateText(moment.description, 100)}</p>
          <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">{moment.tags}</Badge>
        </CardContent>
      </Card>
    </Link>
  )
}

