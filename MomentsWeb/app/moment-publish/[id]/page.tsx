"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Calendar, User, ArrowLeft, CheckCircle, Share2, Clock, Users, Maximize2, X, Trophy, Plus, Trash2, DollarSign, Gift } from "lucide-react"
import Header from "@/components/dashboard/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useUser } from "@/context/UserContext"
import { Skeleton } from "@/components/ui/skeleton"
import { useAccount } from "wagmi"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

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
  publishInfo?: any // Make this optional since it doesn't exist yet
}

// Define the publishing settings interface
interface PublishSettings {
  isPublished: boolean
  isPrivate: boolean
  allowedWallets: string[]
  pricingType: string
  price: string
}

export default function MomentPublishPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const { user } = useUser()
  const { address } = useAccount()
  const { toast } = useToast()
  
  const [moment, setMoment] = useState<Moment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isImageFullscreen, setIsImageFullscreen] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  
  // Publishing options state
  const [isPrivate, setIsPrivate] = useState(false)
  const [pricingType, setPricingType] = useState("free")
  const [price, setPrice] = useState("0.05")
  const [allowedWallets, setAllowedWallets] = useState<string[]>([""])
  const [showMintDialog, setShowMintDialog] = useState(false)
  const [isMinting, setIsMinting] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [publishSuccess, setPublishSuccess] = useState(false)

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
      
      // Ensure the moment is completed
      if (data.status.toLowerCase() !== "completed") {
        throw new Error("This moment is not yet completed")
      }
      
      setMoment(data)
      
      // Load existing publish settings if available
      if (data.publishSettings) {
        setIsPrivate(data.publishSettings.isPrivate)
        if (data.publishSettings.allowedWallets && data.publishSettings.allowedWallets.length > 0) {
          setAllowedWallets(data.publishSettings.allowedWallets)
        }
        setPricingType(data.publishSettings.pricingType || "free")
        setPrice(data.publishSettings.price || "0.05")
        if (data.publishSettings.isPublished) {
          // If already published, show the success view
          setPublishSuccess(true)
        }
      }
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

  const handleShare = async () => {
    setIsSharing(true)
    try {
      const shareUrl = `${window.location.origin}/moment-publish/${id}`;
      if (navigator.share) {
        await navigator.share({
          title: moment?.title || "Completed Moment",
          text: moment?.description || "Check out this completed moment!",
          url: shareUrl
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copied!",
          description: "The link has been copied to your clipboard.",
          duration: 3000
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
    } finally {
      setIsSharing(false);
    }
  }
  
  // Publishing functionality
  const addWalletField = () => {
    setAllowedWallets([...allowedWallets, ""])
  }

  const updateWallet = (index: number, value: string) => {
    const updated = [...allowedWallets]
    updated[index] = value
    setAllowedWallets(updated)
  }

  const removeWallet = (index: number) => {
    if (allowedWallets.length > 1) {
      const updated = [...allowedWallets]
      updated.splice(index, 1)
      setAllowedWallets(updated)
    }
  }

  const handleMintForParticipants = async () => {
    setIsMinting(true)
    // Simulate minting delay
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsMinting(false)
    setShowMintDialog(false)
    setPublishSuccess(true)
    
    toast({
      title: "Minted for participants",
      description: "NFTs have been minted for all participants",
      duration: 3000
    })
  }

  const handlePublish = async () => {
    if (!moment) return
    
    setIsPublishing(true)
    
    try {
      // Filter out empty wallet addresses
      const filteredWallets = allowedWallets.filter(wallet => wallet.trim() !== "")
      
      // Create the publish settings object
      const publishSettings = {
        isPublished: true,
        isPrivate,
        allowedWallets: isPrivate ? filteredWallets : [],
        pricingType,
        price: pricingType === "paid" ? price : "0"
      }
      
      // Call the API to store publish settings
      const response = await fetch(`/api/moments/${id}/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(publishSettings)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to publish moment")
      }
      
      // Show success message
      toast({
        title: "Moment published successfully",
        description: `Your moment has been published and is now ${isPrivate ? "available to selected wallets" : "publicly available"} for minting.`,
        duration: 3000
      })
      
      setPublishSuccess(true)
    } catch (error) {
      console.error("Error publishing moment:", error)
      toast({
        title: "Error publishing moment",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
        duration: 5000
      })
    } finally {
      setIsPublishing(false)
    }
  }

  // Get status-specific styles
  const getStatusStyles = (status: string) => {
    return {
      bgColor: "bg-green-500",
      textColor: "text-green-700",
      lightBgColor: "bg-green-50",
      borderColor: "border-green-200",
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
  if (!moment && !publishSuccess) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-8 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Moment Not Found</h1>
            <p className="mb-6">The moment you're looking for doesn't exist or may not be completed yet.</p>
            <Button onClick={handleBack}>Back to Dashboard</Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Show success state if published
  if (publishSuccess) {
    const visibilityMessage = isPrivate 
      ? allowedWallets.filter(w => w.trim() !== "").length > 0
        ? `This moment is private and can only be viewed by ${allowedWallets.filter(w => w.trim() !== "").length} specific wallet address(es).`
        : "This moment is private but no wallet addresses have been added to the access list."
      : "This moment is publicly available for anyone to view.";
    
    const pricingMessage = pricingType === "free"
      ? "It is free to mint."
      : `It costs ${price} ETH to mint.`;
    
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-8 px-4">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Moment Published Successfully!</h2>
                <div className="text-gray-600 mb-6 space-y-2">
                  <p>{visibilityMessage}</p>
                  <p>{pricingMessage}</p>
                </div>
                
                {isPrivate && allowedWallets.filter(w => w.trim() !== "").length > 0 && (
                  <div className="mb-6 mt-4">
                    <h3 className="font-medium mb-2 text-left">Allowed Wallet Addresses:</h3>
                    <div className="bg-gray-50 p-3 rounded-md max-h-32 overflow-y-auto text-left">
                      <ul className="space-y-1">
                        {allowedWallets.filter(w => w.trim() !== "").map((wallet, index) => (
                          <li key={index} className="text-sm font-mono break-all">
                            {wallet}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col space-y-3">
                  <Button className="bg-purple-500 hover:bg-purple-600" onClick={() => router.push("/collection")}>
                    View in My Collection
                  </Button>
                  <Button variant="outline" onClick={() => router.push("/dashboard")}>
                    Back to Dashboard
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

  // We have moment data, render the moment
  const styles = getStatusStyles(moment!.status)
  const formattedDate = new Date(moment!.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  
  // Calculate creator status
  const isUserCreator = user?.id === moment!.creator.id
  const totalParticipants = moment!.participants.length + 1 // +1 for creator
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardContent className="p-4 sm:p-6 space-y-6">
              {/* Completed banner */}
              <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-center">
                <Trophy className="h-5 w-5 text-green-600 mr-2" />
                <p className="text-green-700 font-medium">This moment has been completed and signed by all participants!</p>
              </div>
              
              {/* Header with title, date and status */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <div>
                  <h1 className="text-2xl font-bold">{moment!.title}</h1>
                  <div className="flex items-center text-gray-500 mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    <p>{formattedDate}</p>
                  </div>
                </div>
                <Badge className="bg-green-500 text-white self-start">
                  Completed
                </Badge>
              </div>

              {/* Moment Image */}
              <div 
                className="relative w-full h-[300px] bg-gray-100 rounded-lg overflow-hidden cursor-pointer group"
                onClick={moment!.imageUrl ? toggleImageFullscreen : undefined}
              >
                {moment!.imageUrl ? (
                  <>
                    <Image
                      src={moment!.imageUrl}
                      alt={moment!.title}
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
              {isImageFullscreen && moment!.imageUrl && (
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
                      src={moment!.imageUrl}
                      alt={moment!.title}
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
                  <CheckCircle className={`h-5 w-5 mr-2 ${styles.textColor}`} />
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium">All Signatures Complete</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h2 className="font-medium text-lg mb-2">Description</h2>
                <p className="text-gray-700 leading-relaxed">{moment!.description}</p>
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
                        <p className="text-sm text-gray-500">{moment!.creator.walletAddress}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500 text-white">Creator</Badge>
                  </div>

                  {/* Participants - all signed */}
                  {moment!.participants.map((participant) => {
                    const isCurrentUser = user?.id === participant.user.id
                    const isCurrentWallet = address && participant.user.walletAddress.toLowerCase() === address.toLowerCase()
                    
                    return (
                      <div key={participant.id} className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="flex items-center">
                              <p className="font-medium">Participant</p>
                              {(isCurrentUser || isCurrentWallet) && (
                                <Badge variant="outline" className="ml-2 text-xs">You</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">{participant.user.walletAddress}</p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-600 border-green-200"
                        >
                          Signed
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* IPFS Hash - Only displayed if available */}
              {moment!.ipfsHash && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h2 className="font-medium text-lg mb-2">Blockchain Record</h2>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-gray-500">IPFS Hash:</p>
                    <code className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
                      {moment!.ipfsHash}
                    </code>
                  </div>
                </div>
              )}

              {/* Publishing Options */}
              <div className="border-t pt-6">
                <h2 className="text-xl font-bold mb-4">Publishing Options</h2>

                <Tabs defaultValue="visibility" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="visibility">Visibility</TabsTrigger>
                    <TabsTrigger value="pricing">Pricing</TabsTrigger>
                  </TabsList>

                  <TabsContent value="visibility" className="space-y-4 mt-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <h3 className="text-lg font-medium">Private Moment</h3>
                        <p className="text-sm text-gray-500">
                          {isPrivate
                            ? "Only specified wallets can view and mint this moment"
                            : "Anyone can view and mint this moment"}
                        </p>
                      </div>
                      <Switch
                        checked={isPrivate}
                        onCheckedChange={setIsPrivate}
                        className="data-[state=checked]:bg-purple-500"
                      />
                    </div>

                    {isPrivate && (
                      <div className="space-y-3 mt-4 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-medium">Allowed Wallet Addresses</h3>
                        <p className="text-sm text-gray-500 mb-2">
                          Only these addresses will be able to view and mint this moment
                        </p>

                        {allowedWallets.map((wallet, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              placeholder="0x... or name.eth"
                              value={wallet}
                              onChange={(e) => updateWallet(index, e.target.value)}
                              className="flex-1"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => removeWallet(index)}
                              disabled={allowedWallets.length === 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}

                        <Button
                          type="button"
                          variant="outline"
                          onClick={addWalletField}
                          className="w-full flex items-center justify-center mt-2"
                        >
                          <Plus className="h-4 w-4 mr-2" /> Add Wallet
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="pricing" className="space-y-4 mt-4">
                    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                      <h3 className="font-medium">Minting Price</h3>

                      <RadioGroup value={pricingType} onValueChange={setPricingType}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="free" id="free" />
                          <Label htmlFor="free" className="flex items-center">
                            <Gift className="h-4 w-4 mr-2 text-green-500" />
                            Free to mint
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="paid" id="paid" />
                          <Label htmlFor="paid" className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-2 text-amber-500" />
                            Paid mint
                          </Label>
                        </div>
                      </RadioGroup>

                      {pricingType === "paid" && (
                        <div className="mt-4">
                          <Label htmlFor="price">Price in ETH</Label>
                          <div className="flex items-center mt-1">
                            <Input
                              id="price"
                              type="number"
                              step="0.001"
                              min="0"
                              value={price}
                              onChange={(e) => setPrice(e.target.value)}
                              className="w-32"
                            />
                            <span className="ml-2">ETH</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Actions */}
              <div className="pt-4 space-y-3">
                {/* Publishing button */}
                <Button
                  className="w-full bg-purple-500 hover:bg-purple-600 flex items-center justify-center"
                  onClick={handlePublish}
                  disabled={isPublishing}
                >
                  {isPublishing ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      Publishing...
                    </>
                  ) : (
                    "Publish Moment"
                  )}
                </Button>

                {/* Back button */}
                <Button variant="ghost" className="w-full" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Mint for Participants Dialog - hidden for now */}
      {false && (
        <Dialog open={showMintDialog} onOpenChange={setShowMintDialog}>
          <DialogContent className="p-4 sm:p-6 max-w-md sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Mint for Participants</DialogTitle>
              <DialogDescription>
                This will mint the moment as an NFT for all participants at no cost to them.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <h3 className="font-medium mb-2">Participants who will receive the NFT:</h3>
              <div className="space-y-2">
                {moment?.participants.map((participant) => (
                  <div key={participant.id} className="flex items-center p-2 bg-gray-50 rounded">
                    <User className="h-4 w-4 mr-2 text-purple-500" />
                    <span>Participant</span>
                    <span className="text-sm text-gray-500 ml-2 truncate">({participant.user.walletAddress})</span>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setShowMintDialog(false)}>
                Cancel
              </Button>
              <Button
                className="bg-purple-500 hover:bg-purple-600"
                onClick={handleMintForParticipants}
                disabled={isMinting}
              >
                {isMinting ? "Minting..." : "Mint for All Participants"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Footer />
    </div>
  )
}

