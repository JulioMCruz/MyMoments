import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mountain, Timer, Users, Gift, Award, Heart, Star } from "lucide-react"
import { useUser } from "@/context/UserContext"

// Define types for our data
interface MomentParticipant {
  id: string
  userId: string
  momentId: string
  hasSigned: boolean
  user: {
    walletAddress: string
  }
}

interface Moment {
  id: string
  title: string
  description: string
  imageUrl: string
  ipfsHash: string
  status: string
  createdAt: string
  updatedAt: string
  creatorId: string
  nftTokenId?: string
  creator: {
    walletAddress: string
  }
  participants: MomentParticipant[]
}

// Map moment types to icons (used as fallback if image fails to load)
const momentIcons: Record<string, any> = {
  default: Heart,
  wedding: Heart,
  travel: Mountain,
  challenge: Timer,
  birthday: Gift,
  achievement: Award,
  personal: Star,
}

export default function MomentsList() {
  const [moments, setMoments] = useState<Moment[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useUser()

  useEffect(() => {
    // Only fetch moments if we have a user
    if (user?.walletAddress) {
      fetchMoments(user.walletAddress)
    }
  }, [user])

  const fetchMoments = async (walletAddress: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/moments?walletAddress=${walletAddress}`)
      if (!response.ok) {
        throw new Error("Failed to fetch moments")
      }
      const data = await response.json()
      
      // Convert any "proposed" status to "created"
      const updatedData = data.map((moment: Moment) => ({
        ...moment,
        status: moment.status === "proposed" ? "created" : moment.status.toLowerCase()
      }))
      
      setMoments(updatedData)
    } catch (error) {
      console.error("Error fetching moments:", error)
    } finally {
      setLoading(false)
    }
  }

  // Helper function to get status-specific styles
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return {
          bgColor: "bg-green-500",
          textColor: "text-green-700",
          lightBgColor: "bg-green-50",
          borderColor: "border-green-200",
        }
      case "pending":
        return {
          bgColor: "bg-amber-500",
          textColor: "text-amber-700",
          lightBgColor: "bg-amber-50",
          borderColor: "border-amber-200",
        }
      case "created":
        return {
          bgColor: "bg-purple-500",
          textColor: "text-purple-700",
          lightBgColor: "bg-purple-50",
          borderColor: "border-purple-200",
        }
      default:
        return {
          bgColor: "bg-gray-500",
          textColor: "text-gray-700",
          lightBgColor: "bg-gray-50",
          borderColor: "border-gray-200",
        }
    }
  }

  // Function to get the correct link based on moment status
  const getMomentLink = (moment: Moment) => {
    return moment.status.toLowerCase() === "completed" ? `/moment-publish/${moment.id}` : `/moment/${moment.id}`
  }

  // Function to determine moment progress (signed participants / total participants)
  const getMomentProgress = (moment: Moment) => {
    const totalParticipants = moment.participants.length + 1 // +1 for creator
    const signedParticipants = moment.participants.filter(p => p.hasSigned).length
    // If status is completed, everyone has signed
    return moment.status.toLowerCase() === "completed" 
      ? `${totalParticipants}/${totalParticipants} signed` 
      : `${signedParticipants}/${totalParticipants} signed`
  }

  // Calculate counts for each status
  const createdCount = moments.filter(m => m.status.toLowerCase() === "created").length
  const pendingCount = moments.filter(m => m.status.toLowerCase() === "pending").length
  const completedCount = moments.filter(m => m.status.toLowerCase() === "completed").length

  // Choose an appropriate icon for each moment (as fallback)
  const getIconForMoment = (moment: Moment) => {
    // This is a placeholder logic - in a real app, you might want to 
    // store the icon type in the moment data or derive it from content
    const momentType = moment.title.toLowerCase().includes("wedding") ? "wedding" :
                     moment.title.toLowerCase().includes("trip") ? "travel" :
                     moment.title.toLowerCase().includes("challenge") ? "challenge" :
                     moment.title.toLowerCase().includes("birthday") ? "birthday" :
                     moment.title.toLowerCase().includes("achievement") ? "achievement" :
                     moment.title.toLowerCase().includes("resolution") ? "personal" :
                     "default"
    
    return momentIcons[momentType] || Heart
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">My Moments</h2>
          <div className="animate-pulse">Loading...</div>
        </div>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-full animate-pulse">
              <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-2xl font-bold">My Moments</h2>
        <div className="flex items-center space-x-2 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-purple-500 mr-1"></div>
            <span>Created</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-amber-500 mr-1"></div>
            <span>Pending</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
            <span>Completed</span>
          </div>
        </div>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        <Card className="bg-purple-50 border-purple-200">
          <div className="p-4 flex items-center">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-purple-600">Created</p>
              <p className="text-2xl font-bold">{createdCount}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-amber-50 border-amber-200">
          <div className="p-4 flex items-center">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
              <Timer className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-amber-600">Pending</p>
              <p className="text-2xl font-bold">{pendingCount}</p>
            </div>
          </div>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <div className="p-4 flex items-center">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <Award className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-600">Completed</p>
              <p className="text-2xl font-bold">{completedCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {moments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No moments found. Create your first moment to get started!</p>
          <Link href="/create-moment" className="mt-4 inline-block bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
            Create a Moment
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {moments.map((moment) => {
            const styles = getStatusStyles(moment.status)
            const link = getMomentLink(moment)
            const Icon = getIconForMoment(moment)
            // Format date nicely
            const formattedDate = new Date(moment.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })
            
            // Count total participants (including creator)
            const totalParticipants = moment.participants.length + 1
            
            return (
              <Link key={moment.id} href={link}>
                <Card className={`h-full hover:shadow-md transition-all border-l-4 ${styles.borderColor}`}>
                  {/* Image Section - Display the actual image from the moment */}
                  <div className="aspect-video rounded-t-lg relative overflow-hidden">
                    {moment.imageUrl ? (
                      <Image 
                        src={moment.imageUrl}
                        alt={moment.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center ${styles.lightBgColor}`}>
                        <Icon className={`h-12 w-12 ${styles.textColor}`} />
                      </div>
                    )}
                    
                    {/* Status badge overlay */}
                    <div className="absolute top-2 right-2">
                      <Badge className={`${styles.bgColor} text-white hover:${styles.bgColor}`}>
                        {moment.status.charAt(0).toUpperCase() + moment.status.slice(1).toLowerCase()}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1">{moment.title}</h3>
                    
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-gray-500" />
                        <span className="text-sm text-gray-600">{totalParticipants} {totalParticipants === 1 ? 'Person' : 'People'}</span>
                      </div>
                      <span className="text-sm text-gray-600">{formattedDate}</span>
                    </div>
                    
                    {/* Progress indicator */}
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${styles.bgColor}`} 
                          style={{ 
                            width: moment.status.toLowerCase() === "completed" 
                              ? "100%" 
                              : `${(moment.participants.filter(p => p.hasSigned).length / totalParticipants) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className={`text-xs ${styles.textColor}`}>
                          {getMomentProgress(moment)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

