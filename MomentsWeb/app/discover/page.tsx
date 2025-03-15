"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Search } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

// Define the moment type
interface Moment {
  id: string
  title: string
  description: string
  imageUrl: string
  creatorAddress: string
  date: string
  participants: number
  price: number
  pricingType: string
  status: string
}

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMoment, setSelectedMoment] = useState<Moment | null>(null)
  const [isMinting, setIsMinting] = useState(false)
  const [moments, setMoments] = useState<Moment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch moments from the API
  useEffect(() => {
    const fetchMoments = async () => {
      try {
        setLoading(true)
        const queryParam = searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ""
        const response = await fetch(`/api/discover${queryParam}`)
        
        if (!response.ok) {
          throw new Error("Failed to fetch moments")
        }
        
        const data = await response.json()
        setMoments(data)
      } catch (error) {
        console.error("Error fetching moments:", error)
        setError("Failed to load moments. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    
    fetchMoments()
  }, [searchQuery])

  // Handle highlight parameter from URL
  useEffect(() => {
    if (typeof window !== 'undefined' && moments.length > 0) {
      const { searchParams } = new URL(window.location.href)
      const highlightId = searchParams.get("highlight")

      if (highlightId) {
        const foundMoment = moments.find((m) => m.id === highlightId)
        if (foundMoment) {
          setSelectedMoment(foundMoment)
        }
      }
    }
  }, [moments])

  const handleMint = async () => {
    if (!selectedMoment) return
    
    setIsMinting(true)
    try {
      const response = await fetch('/api/discover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ momentId: selectedMoment.id }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to mint moment')
      }
      
      // Handle successful minting
      const result = await response.json()
      console.log('Minting successful:', result)
      
      // Close the dialog after successful minting
      setSelectedMoment(null)
    } catch (error) {
      console.error('Error minting moment:', error)
    } finally {
      setIsMinting(false)
    }
  }

  // Function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="container mx-auto px-4 py-8 flex-1">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="search"
              placeholder="Search moments..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-6 text-center">Discover Moments</h1>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-lg overflow-hidden shadow-md bg-white">
                <Skeleton className="aspect-square w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex justify-between pt-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-10">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && moments.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-2">No published moments found</p>
            <p className="text-gray-400">Be the first to publish a moment!</p>
          </div>
        )}

        {/* Image Grid */}
        {!loading && !error && moments.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {moments.map((moment) => (
              <div
                key={moment.id}
                className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white cursor-pointer"
                onClick={() => setSelectedMoment(moment)}
              >
                <div className="aspect-square relative">
                  <Image 
                    src={moment.imageUrl || "/placeholder.svg"} 
                    alt={moment.title} 
                    fill 
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{moment.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{truncateText(moment.description, 150)}</p>
                  <div className="flex justify-between items-center">
                    <Badge className="bg-purple-500 text-white">
                      {moment.pricingType === "free" ? "Free" : `${moment.price} ETH`}
                    </Badge>
                    <span className="text-sm text-gray-500">{moment.participants} participants</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mint Dialog */}
        <Dialog open={selectedMoment !== null} onOpenChange={(open) => !open && setSelectedMoment(null)}>
          <DialogContent className="max-w-2xl p-4 sm:p-6">
            {selectedMoment && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl sm:text-2xl">{selectedMoment.title}</DialogTitle>
                  <DialogDescription>
                    Created by {selectedMoment.creatorAddress} on {formatDate(selectedMoment.date)}
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="aspect-square relative rounded-lg overflow-hidden">
                    <Image
                      src={selectedMoment.imageUrl || "/placeholder.svg"}
                      alt={selectedMoment.title}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex-1">
                      <h3 className="font-medium text-lg mb-2">Description</h3>
                      <p className="text-gray-600 mb-4">{selectedMoment.description}</p>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Participants:</span>
                          <span className="font-medium">{selectedMoment.participants}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Status:</span>
                          <span className="font-medium capitalize">{selectedMoment.status}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Minting Price:</span>
                          <span className="font-medium">
                            {selectedMoment.pricingType === "free" 
                              ? "Free" 
                              : `${selectedMoment.price} ETH`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      className="w-full bg-purple-500 hover:bg-purple-600 mt-auto"
                      onClick={handleMint}
                      disabled={isMinting}
                    >
                      {isMinting ? "Minting..." : "Mint this Moment"}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  )
}

