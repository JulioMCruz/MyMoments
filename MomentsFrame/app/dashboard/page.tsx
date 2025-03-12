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


interface Marriage {
  id: string
  title: string
  spouse1Name: string
  spouse1Address: string
  spouse2Name: string
  spouse2Address: string
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
  const [marriages, setMarriages] = useState<Marriage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMarriage, setSelectedMarriage] = useState<Marriage | null>(null)
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
    const fetchMarriages = async () => {
      try {
        // TODO: Replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API delay
        const mockMarriages: Marriage[] = [
          {
            id: "1",
            title: "Alice & Bob's Union",
            spouse1Name: "Alice",
            spouse1Address: "0x1234...5678",
            spouse2Name: "Bob",
            spouse2Address: "0x5678...9abc",
            date: "2023-07-01",
            status: "Signed",
            imageUrl: "/placeholder.png?height=200&width=300",
          },
          {
            id: "2",
            title: "Carol & Dave's Commitment",
            spouse1Name: "Carol",
            spouse1Address: "0xabcd...ef01",
            spouse2Name: "Dave",
            spouse2Address: "0xef01...2345",
            date: "2023-08-15",
            status: "Proposed",
            imageUrl: "/placeholder.png?height=200&width=300",
          },
          {
            id: "3",
            title: "Eve & Frank's Partnership",
            spouse1Name: "Eve",
            spouse1Address: "0x2345...6789",
            spouse2Name: "Frank",
            spouse2Address: "0x6789...abcd",
            date: "2023-09-30",
            status: "Signed",
            imageUrl: "/placeholder.png?height=200&width=300",
          },
          {
            id: "4",
            title: "Grace & Henry's Proposal",
            spouse1Name: "Grace",
            spouse1Address: "0xcdef...0123",
            spouse2Name: "Henry",
            spouse2Address: "0x0123...4567",
            date: "2023-10-15",
            status: "Created",
            imageUrl: "/placeholder.png?height=200&width=300",
          },
          {
            id: "5",
            title: "Ivy & Jack's Proposal",
            spouse1Name: "Ivy",
            spouse1Address: "0x7890...abcd",
            spouse2Name: "Jack",
            spouse2Address: "0xefgh...5678",
            date: "2023-11-01",
            status: "Rejected",
            imageUrl: "/placeholder.png?height=200&width=300",
          },
        ]
        setMarriages(mockMarriages)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred while fetching marriages")
      } finally {
        setIsLoading(false)
      }
    }

    fetchMarriages()
  }, [])

  const handleCreateProposal = () => {
    router.push("/propose")
  }

  const handleViewCertificate = (marriage: Marriage) => {
    router.push(`/certificate/${marriage.id}`)
  }

  const handleGenerateCertificate = (marriage: Marriage) => {
    router.push(`/generate-nft/${marriage.id}`)
  }

  const handleShareCertificate = (marriage: Marriage) => {
    setSelectedMarriage(marriage)
    setIsShareDialogOpen(true)
  }

  const handleEditProposal = (id: string) => {
    router.push(`/edit/${id}`)
  }

  const handlePreviewProposal = (id: string) => {
    router.push(`/preview/${id}`)
  }

  const handleSignProposal = (id: string) => {
    router.push(`/sign-proposal/${id}`)
  }

  const handleCopyLink = () => {
    if (selectedMarriage) {
      const link = `${window.location.origin}/certificate/${selectedMarriage.id}`
      navigator.clipboard.writeText(link)
      toast({
        title: "Link Copied",
        description: "Certificate link has been copied to clipboard.",
      })
    }
  }

  const handleShareTwitter = () => {
    if (selectedMarriage) {
      const text = `Check out our blockchain marriage certificate: ${selectedMarriage.title}`
      const url = `${window.location.origin}/certificate/${selectedMarriage.id}`
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
      window.open(twitterUrl, "_blank")
    }
  }

  const handleShareWarpcast = () => {
    if (selectedMarriage) {
      const text = `Check out our blockchain marriage certificate: ${selectedMarriage.title}`
      const url = `${window.location.origin}/certificate/${selectedMarriage.id}`
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
    return <div className="text-center mt-8">Loading marriages...</div>
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
        <h2 className="text-xl sm:text-2xl font-semibold">Your Moments</h2>
        <Button onClick={handleCreateProposal} className="moments-button">+ Moment</Button>
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-1 lg:grid-cols-2">
        {marriages.map((marriage) => (
          <Card key={marriage.id} className="w-full">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">{marriage.title}</CardTitle>
              <CardDescription>{marriage.date}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-1/3">
                <Image
                  src={marriage.imageUrl || "/placeholder.png"}
                  alt={marriage.title}
                  width={300}
                  height={200}
                  className="rounded-lg object-cover w-full h-auto"
                />
              </div>
              <div className="w-full sm:w-2/3">
                <p className="text-sm">
                  <strong>Spouse 1:</strong> {marriage.spouse1Name} ({marriage.spouse1Address})
                </p>
                <p className="text-sm">
                  <strong>Spouse 2:</strong> {marriage.spouse2Name} ({marriage.spouse2Address})
                </p>
                <p className="text-sm">
                  <strong>Status:</strong> {marriage.status}
                </p>
              </div>
            </CardContent>
            <CardFooter className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {marriage.status === "Created" && (
                <>
                  <Button onClick={() => handleEditProposal(marriage.id)} variant="outline" className="w-full">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button onClick={() => handleSignProposal(marriage.id)} className="w-full">
                    <PenSquare className="mr-2 h-4 w-4" />
                    Sign
                  </Button>
                  <Button onClick={() => handlePreviewProposal(marriage.id)} variant="outline" className="w-full">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                </>
              )}
              {marriage.status === "Proposed" && (
                <>
                  <Button onClick={() => handleSignProposal(marriage.id)} className="w-full">
                    <PenSquare className="mr-2 h-4 w-4" />
                    Sign
                  </Button>
                  <Button onClick={() => handlePreviewProposal(marriage.id)} variant="outline" className="w-full">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                  <div className="hidden sm:block"></div>
                </>
              )}
              {marriage.status === "Signed" && (
                <>
                  <Button onClick={() => handleViewCertificate(marriage)} className="w-full">
                    <Eye className="mr-2 h-4 w-4" />
                    View Certificate
                  </Button>
                  <Button onClick={() => handleGenerateCertificate(marriage)} className="w-full">
                    <FileText className="mr-2 h-4 w-4" />
                    Generate NFT
                  </Button>
                  <Button onClick={() => handleShareCertificate(marriage)} variant="outline" className="w-full">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </>
              )}
              {marriage.status === "Rejected" && (
                <>
                  <Button onClick={() => handlePreviewProposal(marriage.id)} variant="outline" className="w-full">
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
            <DialogTitle>Share Certificate</DialogTitle>
            <DialogDescription>Share your marriage certificate with others</DialogDescription>
          </DialogHeader>
          {selectedMarriage && (
            <div className="grid gap-4 py-4">
              <div className="flex justify-center">
                <QRCodeSVG value={`${window.location.origin}/certificate/${selectedMarriage.id}`} size={200} />
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
                  value={`${window.location.origin}/certificate/${selectedMarriage.id}`}
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

