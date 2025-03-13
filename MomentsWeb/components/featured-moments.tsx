import Link from "next/link"
import { ArrowRight } from "lucide-react"
import PublicMomentCard from "@/components/public-moment-card"
import { Button } from "@/components/ui/button"

// Mock data for featured moments
const featuredMoments = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  title: `Featured Moment ${i + 1}`,
  description: `This is a beautiful moment captured in time. It represents a special occasion where people came together to celebrate life, love, and friendship.`,
  creator: `Creator${i + 1}.eth`,
  date: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
  participants: Math.floor(Math.random() * 5) + 1,
  imageUrl: `/placeholder.svg?height=300&width=500&text=Moment${i + 1}`,
  tags: ["love", "friendship", "celebration"][Math.floor(Math.random() * 3)],
}))

export default function FeaturedMoments() {
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredMoments.map((moment) => (
            <PublicMomentCard key={moment.id} moment={moment} />
          ))}
        </div>
      </div>
    </section>
  )
}

