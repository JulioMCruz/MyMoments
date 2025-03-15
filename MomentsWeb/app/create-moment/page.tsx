"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Camera, Plus } from "lucide-react"
import dynamic from "next/dynamic"
import Header from "@/components/dashboard/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

// Dynamically import ConfettiExplosion with SSR disabled
const ConfettiExplosion = dynamic(() => import("react-confetti-explosion"), {
  ssr: false,
  loading: () => null
})

export default function CreateMomentPage() {
  const router = useRouter()
  const [participantWallets, setParticipantWallets] = useState<string[]>([""])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const addParticipant = () => {
    setParticipantWallets([...participantWallets, ""])
  }

  const updateParticipantWallet = (index: number, value: string) => {
    const updatedWallets = [...participantWallets]
    updatedWallets[index] = value
    setParticipantWallets(updatedWallets)
  }

  const handleCancel = () => {
    router.push("/dashboard")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setShowSuccess(true)
  }

  const handleBackToDashboard = () => {
    router.push("/dashboard")
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Create Moment</h1>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="creator-wallet">Creator's Wallet Address or ENS</Label>
              <Input id="creator-wallet" placeholder="0x1234...5678" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="moment-title">Moment Title</Label>
              <Input id="moment-title" placeholder="Our Special Day" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="moment-description">Moment Description</Label>
              <Textarea id="moment-description" placeholder="A few words about our love..." rows={4} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nft-image">Upload Image for NFT</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Input id="nft-image" type="file" className="hidden" />
                <Label
                  htmlFor="nft-image"
                  className="cursor-pointer text-gray-500 hover:text-gray-700 flex flex-col items-center"
                >
                  <Camera className="h-8 w-8 mb-2" />
                  <span>Choose File</span>
                  <span className="text-sm">No file chosen</span>
                </Label>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Participants</h2>
              </div>

              {participantWallets.map((wallet, index) => (
                <div key={index} className="space-y-2">
                  <Label htmlFor={`participant-${index + 1}-wallet`}>
                    Participant {index + 1} Wallet Address or ENS
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id={`participant-${index + 1}-wallet`}
                      placeholder="0x... or name.eth"
                      value={wallet}
                      onChange={(e) => updateParticipantWallet(index, e.target.value)}
                      className="flex-1"
                      required
                    />
                    <Button variant="outline" size="icon" type="button">
                      <Camera className="h-4 w-4" />
                      <span className="sr-only">Scan QR code</span>
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addParticipant}
                className="w-full flex items-center justify-center"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Participant
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-purple-500 hover:bg-purple-600" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Moment"}
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />

      {/* Success Dialog - Cannot be closed except via the Back button */}
      <Dialog
        open={showSuccess}
        onOpenChange={() => {}} // Empty function to prevent closing
      >
        <DialogContent className="sm:max-w-md p-4 sm:p-6" onPointerDownOutside={(e) => e.preventDefault()}>
          <div className="absolute top-0 left-0 right-0 flex justify-center">
            {showSuccess && <ConfettiExplosion width={1600} height={1200} duration={3000} particleCount={100} />}
          </div>
          <DialogHeader>
            <DialogTitle className="text-center text-xl sm:text-2xl">Congratulations!</DialogTitle>
            <DialogDescription className="text-center text-base sm:text-lg">
              Your moment was created! Let the participants know they need to sign.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-6">
            <Button className="bg-purple-500 hover:bg-purple-600 px-8 py-2" onClick={handleBackToDashboard}>
              Back to Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

