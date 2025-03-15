"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import PublicMomentCard from "@/components/public-moment-card"
import { Button } from "@/components/ui/button"
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
}

export default function FeaturedMoments() {
  const [moments, setMoments] = useState<Moment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFeaturedMoments() {
      try {
        setLoading(true)
        const response = await fetch('/api/featured-moments')
        
        if (!response.ok) {
          throw new Error('Failed to fetch featured moments')
        }
        
        const data = await response.json()
        setMoments(data)
      } catch (error) {
        console.error('Error fetching featured moments:', error)
        setError('Failed to load featured moments')
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedMoments()
  }, [])

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold">Latest Public Moments</h2>
            <p className="text-gray-600 mt-2">Discover and mint these special moments from our community</p>
          </div>
          <Link href="/discover" className="mt-4 md:mt-0">
            <Button className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-6 rounded-full flex items-center">
              See More <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {loading ? (
          // Loading state
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-lg overflow-hidden shadow-md">
                <Skeleton className="aspect-video w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          // Error state
          <div className="text-center py-10">
            <p className="text-gray-500">{error}</p>
          </div>
        ) : moments.length === 0 ? (
          // Empty state
          <div className="text-center py-10">
            <p className="text-gray-500">No public moments available yet</p>
            <p className="text-sm text-gray-400 mt-1">Be the first to publish a moment!</p>
          </div>
        ) : (
          // Moments grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {moments.map((moment) => (
              <PublicMomentCard key={moment.id} moment={{
                id: moment.id, 
                title: moment.title,
                description: moment.description,
                imageUrl: moment.imageUrl,
                tags: moment.pricingType === "free" ? "Free" : `${moment.price} ETH`,
                participants: moment.participants,
                creator: moment.creatorAddress,
                date: new Date(moment.date)
              }} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

