"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { QRCodeSVG } from "qrcode.react"
import { Share2, Twitter, Copy, Edit, Eye, FileText, PenSquare } from "lucide-react"
import { UserInfoCard } from "@/components/UserInfoCard"
import { useToast } from "@/components/ui/use-toast"
import { Footer } from "@/components/Footer"


interface Moments {
  id: string
  title: string
  participant1Name: string
  participant1Address: string
  participant2Name: string
  participant2Address: string
  date: string
  status: "Created" | "Proposed" | "Signed" | "Rejected"
  imageUrl: string
}

interface UserInfo {
  name: string
  email: string
  walletAddress: string
  profileImage: string
}

export default function Dashboard() {
  const [momentss, setMomentss] = useState<Moments[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMoments, setSelectedMoments] = useState<Moments | null>(null)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [user, setUser] = useState<UserInfo>({
    name: "John Doe",
    email: "john.doe@example.com",
    walletAddress: "0x1234...5678",
    profileImage: "/placeholder.png?height=100&width=100",
  })
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchMomentss = async () => {
      try {
        // TODO: Replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay
        const mockMomentss: Moments[] = [
          {
            id: "1",
            title: "Alice & Bob's Union",
            participant1Name: "Alice",
            participant1Address: "0x1234...5678",
            participant2Name: "Bob",
            participant2Address: "0x5678...9abc",
            date: "2023-07-01",
            status: "Signed",
            imageUrl: "/placeholder.png?height=200&width=300",
          },
          {
            id: "2",
            title: "Carol & Dave's Commitment",
            participant1Name: "Carol",
            participant1Address: "0xabcd...ef01",
            participant2Name: "Dave",
            participant2Address: "0xef01...2345",
            date: "2023-08-15",
            status: "Proposed",
            imageUrl: "/placeholder.png?height=200&width=300",
          },
          {
            id: "3",
            title: "Eve & Frank's Partnership",
            participant1Name: "Eve",
            participant1Address: "0x2345...6789",
            participant2Name: "Frank",
            participant2Address: "0x6789...abcd",
            date: "2023-09-30",
            status: "Signed",
            imageUrl: "/placeholder.png?height=200&width=300",
          },
          {
            id: "4",
            title: "Grace & Henry's Moment",
            participant1Name: "Grace",
            participant1Address: "0xcdef...0123",
            participant2Name: "Henry",
            participant2Address: "0x0123...4567",
            date: "2023-10-15",
            status: "Created",
            imageUrl: "/placeholder.png?height=200&width=300",
          },
          {
            id: "5",
            title: "Ivy & Jack's Moment",
            participant1Name: "Ivy",
            participant1Address: "0x7890...abcd",
            participant2Name: "Jack",
            participant2Address: "0xefgh...5678",
            date: "2023-11-01",
            status: "Rejected",
            imageUrl: "/placeholder.png?height=200&width=300",
          },
        ]
        setMomentss(mockMomentss)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred while fetching momentss")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMomentss()
  }, [])

  const handleCreateMoment = () => {
    router.push("/propose")
  }

  const handleViewMoment = (moments: Moments) => {
    router.push(`/certificate/${moments.id}`)
  }

  const handleGenerateMoment = (moments: Moments) => {
    router.push(`/generate-nft/${moments.id}`)
  }

  const handleShareMoment = (moments: Moments) => {
    setSelectedMoments(moments)
    setIsShareDialogOpen(true)
  }

  const handleEditMoment = (id: string) => {
    router.push(`/edit/${id}`)
  }

  const handlePreviewMoment = (id: string) => {
    router.push(`/preview/${id}`)
  }

  const handleSignMoment = (id: string) => {
    router.push(`/sign-proposal/${id}`)
  }

  const handleCopyLink = () => {
    if (selectedMoments) {
      const link = `${window.location.origin}/certificate/${selectedMoments.id}`
      navigator.clipboard.writeText(link)
      toast({
        title: "Link Copied",
        description: "Moment link has been copied to clipboard.",
      })
    }
  }

  const handleShareTwitter = () => {
    if (selectedMoments) {
      const text = `Check out our blockchain moments certificate: ${selectedMoments.title}`
      const url = `${window.location.origin}/certificate/${selectedMoments.id}`
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
      window.open(twitterUrl, "_blank")
    }
  }

  const handleShareWarpcast = () => {
    if (selectedMoments) {
      const text = `Check out our blockchain moments certificate: ${selectedMoments.title}`
      const url = `${window.location.origin}/certificate/${selectedMoments.id}`
      const warpcastUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(url)}`
      window.open(warpcastUrl, "_blank")
    }
  }

  const handleSaveUserInfo = (updatedUser: UserInfo) => {
    // TODO: Implement API call to save user info
    setUser(updatedUser)
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated.",
    })
  }

  if (isLoading) {
    return <div className="text-center mt-8">Loading moments...</div>
  }

  if (error) {
    return (
      <div className="text-center mt-8">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  return (
    <>
    <div className="container mx-auto px-4 py-4 sm:py-8">
      {/* <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Your Dashboard</h1> */}

      <UserInfoCard />

      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-semibold">My Moments</h2>
        <Button onClick={handleCreateMoment} className="moments-button">+ Moment</Button>
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-1 lg:grid-cols-2">
        {momentss.map((moments) => (
          <Card key={moments.id} className="w-full">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">{moments.title}</CardTitle>
              <CardDescription>{moments.date}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/3">
                <Image
                  src={moments.imageUrl || "/placeholder.png"}
                  alt={moments.title}
                  width={300}
                  height={200}
                  className="rounded-lg object-cover w-full h-auto"
                />
              </div>
              <div className="w-full sm:w-2/3">
                <p className="text-sm">
                  <strong>Participant 1:</strong> {moments.participant1Name} ({moments.participant1Address})
                </p>
                <p className="text-sm">
                  <strong>Participant 2:</strong> {moments.participant2Name} ({moments.participant2Address})
                </p>
                <p className="text-sm">
                  <strong>Status:</strong> {moments.status}
                </p>
              </div>
            </CardContent>
            <CardFooter className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {moments.status === "Created" && (
                <>
                  <Button onClick={() => handleEditMoment(moments.id)} variant="outline" className="w-full moments-button-card">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button onClick={() => handleSignMoment(moments.id)} className="w-full moments-button-card">
                    <PenSquare className="mr-2 h-4 w-4" />
                    Sign
                  </Button>
                  <Button onClick={() => handlePreviewMoment(moments.id)} variant="outline" className="w-full moments-button-card">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                </>
              )}
              {moments.status === "Proposed" && (
                <>
                  <Button onClick={() => handleSignMoment(moments.id)} className="w-full moments-button-card">
                    <PenSquare className="mr-2 h-4 w-4" />
                    Sign
                  </Button>
                  <Button onClick={() => handlePreviewMoment(moments.id)} variant="outline" className="w-full moments-button-card">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                  <div className="hidden sm:block"></div>
                </>
              )}
              {moments.status === "Signed" && (
                <>
                  <Button onClick={() => handleViewMoment(moments)} className="w-full moments-button-card">
                    <Eye className="mr-2 h-4 w-4" />
                    View Moment
                  </Button>
                  <Button onClick={() => handleGenerateMoment(moments)} className="w-full moments-button-card">
                    <FileText className="mr-2 h-4 w-4" />
                    Generate NFT
                  </Button>
                  <Button onClick={() => handleShareMoment(moments)} variant="outline" className="w-full moments-button-card">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </>
              )}
              {moments.status === "Rejected" && (
                <>
                  <Button onClick={() => handlePreviewMoment(moments.id)} variant="outline" className="w-full moments-button-card">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                  <div className="hidden sm:block"></div>
                  <div className="hidden sm:block"></div>
                </>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Moment</DialogTitle>
            <DialogDescription>Share your moments certificate with others</DialogDescription>
          </DialogHeader>
          {selectedMoments && (
            <div className="grid gap-4 py-4">
              <div className="flex justify-center">
                <QRCodeSVG value={`${window.location.origin}/certificate/${selectedMoments.id}`} size={200} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button onClick={handleShareTwitter} variant="outline" className="w-full">
                  <Twitter className="mr-2 h-4 w-4" />
                  Share on Twitter
                </Button>
                <Button onClick={handleShareWarpcast} variant="outline" className="w-full">
                  Share on Warpcast
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  id="link"
                  value={`${window.location.origin}/certificate/${selectedMoments.id}`}
                  readOnly
                  className="flex-1"
                />
                <Button type="submit" size="sm" className="px-3" onClick={handleCopyLink}>
                  <span className="sr-only">Copy</span>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
          <DialogFooter className="sm:justify-start">
            <Button onClick={() => setIsShareDialogOpen(false)} className="w-full sm:w-auto">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    <Footer />
    </>
  )
}

