import Link from "next/link"
import { Plus } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useUser } from "@/context/UserContext"

interface CreateMomentCardProps {
  address?: string
}

export default function CreateMomentCard({ address }: CreateMomentCardProps) {
  // Get verification status directly from UserContext
  const { user } = useUser()
  const isVerified = user?.isVerified ?? false
  const isDisabled = !isVerified
  
  return (
    <div>
      {isDisabled ? (
        <Card className="bg-pink-50">
          <div className="p-6 flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gray-400 flex items-center justify-center flex-shrink-0">
              <Plus className="h-8 w-8 text-white opacity-50" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-700">Create New Moment</h3>
              <p className="text-gray-600">In order to create a moment, you need to be verified</p>
            </div>
          </div>
        </Card>
      ) : (
        <Link href="/create-moment">
          <Card className="bg-pink-50 hover:bg-pink-100/80 transition-colors">
            <div className="p-6 flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-pink-400 flex items-center justify-center flex-shrink-0">
                <Plus className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Create New Moment</h3>
                <p className="text-gray-600">Capture and verify your special experiences</p>
              </div>
            </div>
          </Card>
        </Link>
      )}
    </div>
  )
}

