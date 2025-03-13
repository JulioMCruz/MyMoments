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

// Mock data for the gallery with more detailed descriptions
const mockImages = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  title: `Moment ${i + 1}`,
  description: `This is a beautiful moment captured in time. It represents a special occasion where people came together to celebrate life, love, and friendship. The memory of this day will be cherished forever as it marks an important milestone in the journey of those involved. Every detail of this moment has been carefully preserved to ensure that the emotions and experiences can be relived through this digital artifact.`,
  creator: `Creator${i + 1}.eth`,
  date: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
  participants: Math.floor(Math.random() * 5) + 1,
  imageUrl: `/placeholder.svg?height=400&width=400&text=Moment${i + 1}`,
  tags: ["love", "friendship", "celebration"][Math.floor(Math.random() * 3)],
  price: (Math.random() * 0.2 + 0.05).toFixed(3),
}))

// Move the categories/badges data outside the component to ensure consistency
const MOMENT_CATEGORIES = [
  { id: 1, label: "love", color: "bg-purple-500" },
  { id: 2, label: "celebration", color: "bg-pink-500" },
  // ... other categories
] as const

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [isMinting, setIsMinting] = useState(false)

  // Handle highlight parameter from URL
  useEffect(() => {
    const { searchParams } = new URL(window.location.href)
    const highlightId = searchParams.get("highlight")

    if (highlightId) {
      const id = Number.parseInt(highlightId)
      const foundImage = mockImages.find((img) => img.id === id)
      if (foundImage) {
        setSelectedImage(id)
      }
    }
  }, [])

  const filteredImages = mockImages.filter(
    (image) =>
      image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      image.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleMint = async () => {
    setIsMinting(true)
    // Simulate minting delay
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsMinting(false)
    setSelectedImage(null)
  }

  // Get the selected image data
  const selectedImageData = selectedImage !== null ? mockImages[selectedImage - 1] : null

  // Function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
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

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white cursor-pointer"
              onClick={() => setSelectedImage(image.id)}
            >
              <div className="aspect-square relative">
                <Image src={image.imageUrl || "/placeholder.svg"} alt={image.title} fill className="object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{image.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{truncateText(image.description, 150)}</p>
                <div className="flex justify-between items-center">
                  <Badge className={`${MOMENT_CATEGORIES.find(c => c.label === image.tags)?.color} text-white`}>
                    {image.tags}
                  </Badge>
                  <span className="text-sm text-gray-500">{image.participants} participants</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mint Dialog */}
        <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-2xl p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl">{selectedImageData?.title}</DialogTitle>
              <DialogDescription>
                Created by {selectedImageData?.creator} on {selectedImageData?.date.toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="aspect-square relative rounded-lg overflow-hidden">
                {selectedImageData && (
                  <Image
                    src={selectedImageData.imageUrl || "/placeholder.svg"}
                    alt={selectedImageData.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex flex-col">
                <div className="flex-1">
                  <h3 className="font-medium text-lg mb-2">Description</h3>
                  <p className="text-gray-600 mb-4">{selectedImageData?.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Participants:</span>
                      <span className="font-medium">{selectedImageData?.participants}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Category:</span>
                      <span className="font-medium">{selectedImageData?.tags}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Minting Price:</span>
                      <span className="font-medium">{selectedImageData?.price} ETH</span>
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
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  )
}

