"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import Image from "next/image"
import { PenLine, Calendar, User, ArrowLeft, Clock, Users, Maximize2, X } from "lucide-react"
import Header from "@/components/dashboard/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useUser } from "@/context/UserContext"
import { Skeleton } from "@/components/ui/skeleton"

// Define types for our data
interface MomentParticipant {
  id: string
  userId: string
  momentId: string
  hasSigned: boolean
  user: {
    id: string
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
    id: string
    walletAddress: string
  }
  participants: MomentParticipant[]
}

export default function MomentPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const { user } = useUser()
  
  const [moment, setMoment] = useState<Moment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isImageFullscreen, setIsImageFullscreen] = useState(false)

  useEffect(() => {
    // Only fetch moment if we have an ID
    if (id) {
      fetchMoment(id)
    }
  }, [id])

  // Handle Escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isImageFullscreen) {
        setIsImageFullscreen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isImageFullscreen])

  const fetchMoment = async (momentId: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/moments/${momentId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Moment not found")
        }
        throw new Error("Failed to fetch moment")
      }
      
      const data = await response.json()
      setMoment(data)
    } catch (error) {
      console.error("Error fetching moment:", error)
      setError(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    router.push("/dashboard")
  }

  const toggleImageFullscreen = () => {
    setIsImageFullscreen(!isImageFullscreen)
  }

  // Get status-specific styles
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

  // If we're loading, show a skeleton UI
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-8 px-4">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="p-4 sm:p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-6 w-24" />
                </div>
                <Skeleton className="w-full h-64 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-6 w-32" />
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div>
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-4 w-48 mt-1" />
                        </div>
                      </div>
                      <Skeleton className="h-6 w-20" />
                    </div>
                  ))}
                </div>
                <div className="pt-4 space-y-3">
                  <Skeleton className="h-10 w-full rounded" />
                  <Skeleton className="h-10 w-full rounded" />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // If there's an error, show an error message
  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-8 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="mb-6">{error}</p>
            <Button onClick={handleBack}>Back to Dashboard</Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // If we don't have moment data, show a not found message
  if (!moment) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-8 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Moment Not Found</h1>
            <p className="mb-6">The moment you're looking for doesn't exist or you don't have permission to view it.</p>
            <Button onClick={handleBack}>Back to Dashboard</Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // We have moment data, render the moment
  const styles = getStatusStyles(moment.status)
  const formattedDate = new Date(moment.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  
  // Calculate creator status
  const isUserCreator = user?.id === moment.creator.id
  const totalParticipants = moment.participants.length + 1 // +1 for creator
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardContent className="p-4 sm:p-6 space-y-6">
              {/* Header with title, date and status */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <div>
                  <h1 className="text-2xl font-bold">{moment.title}</h1>
                  <div className="flex items-center text-gray-500 mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    <p>{formattedDate}</p>
                  </div>
                </div>
                <Badge className={`${styles.bgColor} text-white self-start`}>
                  {moment.status.charAt(0).toUpperCase() + moment.status.slice(1).toLowerCase()}
                </Badge>
              </div>

              {/* Moment Image */}
              <div 
                className="relative w-full h-[300px] bg-gray-100 rounded-lg overflow-hidden cursor-pointer group"
                onClick={moment.imageUrl ? toggleImageFullscreen : undefined}
              >
                {moment.imageUrl ? (
                  <>
                    <Image
                      src={moment.imageUrl}
                      alt={moment.title}
                      fill
                      className="object-contain" 
                      sizes="(max-width: 768px) 100vw, 768px"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Maximize2 className="h-8 w-8 text-white drop-shadow-lg" />
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-400">No image available</p>
                  </div>
                )}
              </div>

              {/* Fullscreen Image Modal */}
              {isImageFullscreen && moment.imageUrl && (
                <div 
                  className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
                  onClick={toggleImageFullscreen}
                >
                  <div className="absolute top-4 right-4">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-10 w-10 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleImageFullscreen()
                      }}
                    >
                      <X className="h-6 w-6" />
                    </Button>
                  </div>
                  <div className="relative w-full h-full max-w-5xl max-h-[80vh]">
                    <Image
                      src={moment.imageUrl}
                      alt={moment.title}
                      fill
                      className="object-contain"
                      sizes="90vw"
                      priority
                    />
                  </div>
                </div>
              )}

              {/* Moment stats */}
              <div className="grid grid-cols-2 gap-4 pb-2">
                <div className={`rounded-lg p-4 flex items-center ${styles.lightBgColor}`}>
                  <Users className={`h-5 w-5 mr-2 ${styles.textColor}`} />
                  <div>
                    <p className="text-sm text-gray-500">Participants</p>
                    <p className="font-medium">{totalParticipants} {totalParticipants === 1 ? 'Person' : 'People'}</p>
                  </div>
                </div>
                <div className={`rounded-lg p-4 flex items-center ${styles.lightBgColor}`}>
                  <Clock className={`h-5 w-5 mr-2 ${styles.textColor}`} />
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium">
                      {moment.status === "created" && "Awaiting Signatures"}
                      {moment.status === "pending" && "Partially Signed"}
                      {moment.status === "completed" && "Fully Signed"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h2 className="font-medium text-lg mb-2">Description</h2>
                <p className="text-gray-700 leading-relaxed">{moment.description}</p>
              </div>

              {/* Participants */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <h2 className="font-medium text-lg">Participants</h2>

                {/* Creator */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-gray-200">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                        <User className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <p className="font-medium">Creator</p>
                          {isUserCreator && <Badge variant="outline" className="ml-2 text-xs">You</Badge>}
                        </div>
                        <p className="text-sm text-gray-500">{moment.creator.walletAddress}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500 text-white">Creator</Badge>
                  </div>

                  {/* Participants */}
                  {moment.participants.map((participant) => {
                    const isCurrentUser = user?.id === participant.user.id
                    return (
                      <div key={participant.id} className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="flex items-center">
                              <p className="font-medium">Participant</p>
                              {isCurrentUser && <Badge variant="outline" className="ml-2 text-xs">You</Badge>}
                            </div>
                            <p className="text-sm text-gray-500">{participant.user.walletAddress}</p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            participant.hasSigned
                              ? "bg-green-50 text-green-600 border-green-200"
                              : "bg-amber-50 text-amber-600 border-amber-200"
                          }
                        >
                          {participant.hasSigned ? "Signed" : "Pending"}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 space-y-3">
                {/* Show sign button only if user is a participant and hasn't signed yet */}
                {moment.participants.some(p => p.user.id === user?.id && !p.hasSigned) && (
                  <Button className="w-full bg-purple-500 hover:bg-purple-600">
                    <PenLine className="mr-2 h-4 w-4" /> Sign This Moment
                  </Button>
                )}
                
                <Button variant="outline" className="w-full" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}

