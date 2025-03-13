import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import type { Moment } from "@/lib/types"

interface MomentCardProps {
  moment: Moment
}

export default function MomentCard({ moment }: MomentCardProps) {
  return (
    <Link href={`/moment/${moment.id}`}>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <h3 className="font-bold text-lg mb-1">{moment.title}</h3>
          <p className="text-gray-500 text-sm mb-3">{moment.date.toISOString().split("T")[0]}</p>
          <div className="bg-gray-100 h-40 rounded flex items-center justify-center mb-3">
            {moment.imageUrl ? (
              <Image
                src={moment.imageUrl || "/placeholder.svg"}
                alt={moment.title}
                width={300}
                height={200}
                className="object-cover w-full h-full rounded"
              />
            ) : (
              <span className="text-gray-400">Moment Image</span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span
              className={`text-sm font-medium ${
                moment.status === "completed"
                  ? "text-green-600"
                  : moment.status === "signed"
                    ? "text-blue-600"
                    : "text-amber-600"
              }`}
            >
              {moment.status.charAt(0).toUpperCase() + moment.status.slice(1)}
            </span>
            <span className="text-sm text-gray-500">{moment.participants.length} participants</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

