"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Calendar, User, ArrowLeft, Plus, Trash2, DollarSign, Gift } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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

export default function MomentPublishPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isPrivate, setIsPrivate] = useState(false)
  const [pricingType, setPricingType] = useState("free")
  const [price, setPrice] = useState("0.05")
  const [allowedWallets, setAllowedWallets] = useState<string[]>([""])
  const [showMintDialog, setShowMintDialog] = useState(false)
  const [isMinting, setIsMinting] = useState(false)
  const [publishSuccess, setPublishSuccess] = useState(false)

  // Mock moment data - in a real app, this would be fetched based on the ID
  const momentData = {
    id: params.id,
    title: "Carol & Dave's Commitment",
    description:
      "A beautiful ceremony celebrating Carol and Dave's commitment to each other. This special moment took place at Sunset Beach with close friends and family in attendance. The couple exchanged personalized vows and commemorated their love with this blockchain-verified moment.",
    date: "2023-08-15",
    imageUrl: "/placeholder.svg?height=300&width=500",
    status: "Completed",
    participants: [
      { name: "Carol", wallet: "0xabcd...ef01", status: "Signed" },
      { name: "Dave", wallet: "0xef01...2345", status: "Signed" },
    ],
  }

  const handleBack = () => {
    router.push("/dashboard")
  }

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
  }

  const handlePublish = async () => {
    setIsMinting(true)
    // Simulate publishing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsMinting(false)
    setPublishSuccess(true)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          {!publishSuccess ? (
            <Card>
              <CardContent className="p-4 sm:p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div>
                    <h1 className="text-2xl font-bold">{momentData.title}</h1>
                    <div className="flex items-center text-gray-500 mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      <p>{momentData.date}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-500 text-white self-start">{momentData.status}</Badge>
                </div>

                <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={momentData.imageUrl || "/placeholder.svg"}
                    alt="Moment image"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 500px"
                  />
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h2 className="font-medium text-lg mb-2">Description</h2>
                  <p className="text-gray-700 leading-relaxed">{momentData.description}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <h2 className="font-medium text-lg">Participants</h2>

                  <div className="space-y-3">
                    {momentData.participants.map((participant, index) => (
                      <div key={index} className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                            <User className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium">{participant.name}</p>
                            <p className="text-sm text-gray-500">{participant.wallet}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                          {participant.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

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

                <div className="pt-4 space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      className="flex-1 bg-purple-500 hover:bg-purple-600"
                      onClick={handlePublish}
                      disabled={isMinting}
                    >
                      {isMinting ? "Publishing..." : "Publish Moment"}
                    </Button>

                    <Button variant="outline" className="flex-1" onClick={() => setShowMintDialog(true)}>
                      <Gift className="mr-2 h-4 w-4" /> Mint for Participants
                    </Button>
                  </div>

                  <Button variant="ghost" className="w-full" onClick={handleBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
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
                <p className="text-gray-600 mb-6">
                  Your moment has been published and is now{" "}
                  {isPrivate ? "available to selected wallets" : "publicly available"} for minting.
                </p>
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
          )}
        </div>
      </main>

      {/* Mint for Participants Dialog */}
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
              {momentData.participants.map((participant, index) => (
                <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                  <User className="h-4 w-4 mr-2 text-purple-500" />
                  <span>{participant.name}</span>
                  <span className="text-sm text-gray-500 ml-2 truncate">({participant.wallet})</span>
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

      <Footer />
    </div>
  )
}

