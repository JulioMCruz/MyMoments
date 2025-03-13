"use client"

import { useState } from "react"
import Image from "next/image"
import { Search, Lock, Shield } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for the user's collection
const mockCollection = [
  // Minted moments
  ...Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    title: `My Moment ${i + 1}`,
    description: `This is a special moment that I've minted. It represents a significant event in my life that I wanted to preserve on the blockchain.`,
    creator: `JulioMCruz.base.eth`,
    date: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
    participants: Math.floor(Math.random() * 3) + 2,
    imageUrl: `/placeholder.svg?height=400&width=400&text=Minted${i + 1}`,
    tags: ["personal", "family", "achievement"][Math.floor(Math.random() * 3)],
    type: "minted",
    tokenId: `TOKEN_${100000 + i}`,
  })),

  // Private/Invited moments
  ...Array.from({ length: 4 }, (_, i) => ({
    id: i + 100,
    title: `Private Moment ${i + 1}`,
    description: `You've been invited to participate in this private moment. Once all participants sign, it can be minted as an NFT.`,
    creator: `Friend${i + 1}.eth`,
    date: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
    participants: Math.floor(Math.random() * 3) + 2,
    imageUrl: `/placeholder.svg?height=400&width=400&text=Private${i + 1}`,
    tags: ["invitation", "private", "shared"][Math.floor(Math.random() * 3)],
    type: "private",
    status: ["pending", "ready to mint"][Math.floor(Math.random() * 2)],
  })),
]

export default function CollectionPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMoment, setSelectedMoment] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  const filteredMoments = mockCollection.filter(
    (moment) =>
      (activeTab === "all" ||
        (activeTab === "minted" && moment.type === "minted") ||
        (activeTab === "private" && moment.type === "private")) &&
      (moment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        moment.description.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Get the selected moment data
  const selectedMomentData = selectedMoment !== null ? mockCollection.find((m) => m.id === selectedMoment) : null

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
              placeholder="Search your collection..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-6 text-center">My Collection</h1>

        {/* Tabs */}
        <Tabs defaultValue="all" className="max-w-3xl mx-auto mb-8" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="minted">Minted</TabsTrigger>
            <TabsTrigger value="private">Private</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Moments Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMoments.map((moment) => (
            <div
              key={moment.id}
              className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white cursor-pointer"
              onClick={() => setSelectedMoment(moment.id)}
            >
              <div className="aspect-square relative">
                <Image src={moment.imageUrl || "/placeholder.svg"} alt={moment.title} fill className="object-cover" />
                {moment.type === "private" && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-purple-500 text-white flex items-center gap-1">
                      <Lock className="h-3 w-3" /> Private
                    </Badge>
                  </div>
                )}
                {moment.type === "minted" && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-green-500 text-white flex items-center gap-1">
                      <Shield className="h-3 w-3" /> Minted
                    </Badge>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{moment.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{truncateText(moment.description, 120)}</p>
                <div className="flex justify-between items-center">
                  <Badge
                    className={`${
                      moment.type === "minted" ? "bg-green-100 text-green-800" : "bg-purple-100 text-purple-800"
                    } hover:bg-opacity-80`}
                  >
                    {moment.tags}
                  </Badge>
                  <span className="text-sm text-gray-500">{moment.participants} participants</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMoments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No moments found matching your search.</p>
          </div>
        )}

        {/* Moment Detail Dialog */}
        <Dialog open={selectedMoment !== null} onOpenChange={() => setSelectedMoment(null)}>
          <DialogContent className="max-w-2xl p-4 sm:p-6">
            {selectedMomentData && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-xl sm:text-2xl flex items-center gap-2 flex-wrap">
                    {selectedMomentData.title}
                    {selectedMomentData.type === "private" && (
                      <Badge className="bg-purple-500 text-white ml-2 flex items-center gap-1">
                        <Lock className="h-3 w-3" /> Private
                      </Badge>
                    )}
                    {selectedMomentData.type === "minted" && (
                      <Badge className="bg-green-500 text-white ml-2 flex items-center gap-1">
                        <Shield className="h-3 w-3" /> Minted
                      </Badge>
                    )}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedMomentData.type === "minted"
                      ? `Minted by ${selectedMomentData.creator} on ${selectedMomentData.date.toLocaleDateString()}`
                      : `Created by ${selectedMomentData.creator} on ${selectedMomentData.date.toLocaleDateString()}`}
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="aspect-square relative rounded-lg overflow-hidden">
                    <Image
                      src={selectedMomentData.imageUrl || "/placeholder.svg"}
                      alt={selectedMomentData.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex-1">
                      <h3 className="font-medium text-lg mb-2">Description</h3>
                      <p className="text-gray-600 mb-4">{selectedMomentData.description}</p>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Participants:</span>
                          <span className="font-medium">{selectedMomentData.participants}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Category:</span>
                          <span className="font-medium">{selectedMomentData.tags}</span>
                        </div>
                        {selectedMomentData.type === "minted" && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Token ID:</span>
                            <span className="font-medium">{selectedMomentData.tokenId}</span>
                          </div>
                        )}
                        {selectedMomentData.type === "private" && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Status:</span>
                            <span className="font-medium capitalize">{selectedMomentData.status}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {selectedMomentData.type === "private" && selectedMomentData.status === "ready to mint" && (
                      <Button className="w-full bg-purple-500 hover:bg-purple-600 mt-auto">Mint this Moment</Button>
                    )}
                    {selectedMomentData.type === "private" && selectedMomentData.status === "pending" && (
                      <Button className="w-full bg-amber-500 hover:bg-amber-600 mt-auto">Sign this Moment</Button>
                    )}
                    {selectedMomentData.type === "minted" && (
                      <Button className="w-full bg-green-500 hover:bg-green-600 mt-auto">View on Blockchain</Button>
                    )}
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

