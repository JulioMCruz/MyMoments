import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProfileCard() {
  return (
    <Card className="overflow-hidden">
      <div className="h-24 bg-gradient-to-r from-pink-300 to-purple-500" />
      <div className="p-6 pt-0 relative">
        <div className="absolute right-6 top-2">
          <Button variant="ghost" size="icon" className="rounded-full bg-white/80">
            <Share2 className="h-4 w-4" />
            <span className="sr-only">Share profile</span>
          </Button>
        </div>

        <div className="relative -mt-12 mb-4">
          <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-blue-500">
            <Image
              src="/placeholder.svg?height=96&width=96"
              alt="Profile"
              width={96}
              height={96}
              className="object-cover"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">JulioMCruz.base.eth</h2>
            <Badge variant="secondary">Verified</Badge>
          </div>

          <p className="text-sm text-gray-500">Joined March 2023</p>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold">6</p>
              <p className="text-sm text-gray-500">Active Moments</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">3</p>
              <p className="text-sm text-gray-500">NFTs Minted</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

