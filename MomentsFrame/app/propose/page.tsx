"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Camera } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { QRCodeScannerDialog } from "@/components/QRCodeScannerDialog"

export default function MomentMoment() {
  const [creatorAddress, setCreatorAddress] = useState("")
  const [participant1Name, setParticipant1Name] = useState("")
  const [participant1Address, setParticipant1Address] = useState("")
  const [participant2Name, setParticipant2Name] = useState("")
  const [participant2Address, setParticipant2Address] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [proposalId, setMomentId] = useState<string | null>(null)
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false)
  const [activeParticipant, setActiveParticipant] = useState<"participant1" | "participant2" | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // TODO: Replace this with actual wallet connection logic
    const simulateWalletConnection = async () => {
      // This is a placeholder. In a real app, you'd get this from the user's connected wallet
      setCreatorAddress("0x1234...5678")
    }
    simulateWalletConnection()
  }, [])

  const handlePropose = async () => {
    // TODO: Implement smart contract interaction for proposal
    console.log("Creating proposal with participants:", participant1Name, participant1Address, participant2Name, participant2Address)

    // Simulate creating a proposal and getting an ID
    const simulatedMomentId = Math.random().toString(36).substring(2, 15)
    setMomentId(simulatedMomentId)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBack = () => {
    router.push("/dashboard")
  }

  const handleSignMoment = () => {
    if (proposalId) {
      router.push(`/accept/${proposalId}`)
    }
  }

  const handleScanQRCode = (participant: "participant1" | "participant2") => {
    setActiveParticipant(participant)
    setIsQRScannerOpen(true)
  }

  const handleQRCodeScanned = (result: string) => {
    if (activeParticipant === "participant1") {
      setParticipant1Address(result)
    } else if (activeParticipant === "participant2") {
      setParticipant2Address(result)
    }
    setIsQRScannerOpen(false)
    setActiveParticipant(null)
    toast({
      title: "QR Code Scanned",
      description: `Wallet address for ${activeParticipant === "participant1" ? "Participant 1" : "Participant 2"} has been updated.`,
    })
  }

  const acceptanceUrl = proposalId ? `${window.location.origin}/accept/${proposalId}` : null

  return (
    <div className="w-full max-w-6xl mx-auto mt-4 sm:mt-6 px-4">
      <Breadcrumb className="mb-4 sm:mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Create Moment</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Create Moment</h1>
      <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
        {/* Form Column */}
        <div className="w-full md:w-1/2 space-y-4">
          <div>
            <Label htmlFor="creatorAddress">Creator&apos;s Wallet Address or ENS</Label>
            <Input id="creatorAddress" value={creatorAddress} readOnly className="bg-gray-100 text-gray-600" />
          </div>
          <div>
            <Label htmlFor="participant1Name">Participant 1 Name</Label>
            <Input
              id="participant1Name"
              value={participant1Name}
              onChange={(e) => setParticipant1Name(e.target.value)}
              placeholder="Enter name"
            />
          </div>
          <div>
            <Label htmlFor="participant1Address">Participant 1 Wallet Address or ENS</Label>
            <div className="flex space-x-2">
              <Input
                id="participant1Address"
                value={participant1Address}
                onChange={(e) => setParticipant1Address(e.target.value)}
                placeholder="0x... or name.eth"
              />
              <Button onClick={() => handleScanQRCode("participant1")} variant="outline" className="px-3">
                <Camera className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div>
            <Label htmlFor="participant2Name">Participant 2 Name</Label>
            <Input
              id="participant2Name"
              value={participant2Name}
              onChange={(e) => setParticipant2Name(e.target.value)}
              placeholder="Enter name"
            />
          </div>
          <div>
            <Label htmlFor="participant2Address">Participant 2 Wallet Address or ENS</Label>
            <div className="flex space-x-2">
              <Input
                id="participant2Address"
                value={participant2Address}
                onChange={(e) => setParticipant2Address(e.target.value)}
                placeholder="0x... or name.eth"
              />
              <Button onClick={() => handleScanQRCode("participant2")} variant="outline" className="px-3">
                <Camera className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div>
            <Label htmlFor="title">Moment Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Our Special Day" />
          </div>
          <div>
            <Label htmlFor="description">Moment Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A few words about our love..."
              className="min-h-[100px]"
            />
          </div>
          <div>
            <Label htmlFor="image">Upload Image for NFT</Label>
            <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} />
            {imagePreview && (
              <div className="mt-2">
                <Image
                  src={imagePreview || "/placeholder.png"}
                  alt="Uploaded preview"
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            {!proposalId ? (
              <>
                <Button onClick={handleBack} variant="outline" className="w-full moments-button-card-outline">
                  Cancel
                </Button>
                <Button onClick={handlePropose} className="w-full moments-button-card">
                  Create Moment
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleBack} variant="outline" className="w-full moments-button-card-outline">
                  Back
                </Button>
                <Button onClick={handleSignMoment} className="w-full moments-button-card">
                  Sign Moment
                </Button>
              </>
            )}
          </div>
        </div>

        {/* QR Code Column */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-gray-200 pt-6 md:pt-0 md:pl-8">
          {proposalId && acceptanceUrl ? (
            <>
              <h2 className="text-xl sm:text-2xl font-bold mb-4">Moment Created</h2>
              <div className="p-4 bg-white border border-gray-200 rounded-lg">
                <QRCodeSVG value={acceptanceUrl} size={200} />
              </div>
              <p className="mt-4 text-sm text-gray-600 text-center">
                Scan this QR code to view and accept the proposal.
              </p>
            </>
          ) : (
            <div className="text-center">
              <p className="text-lg sm:text-xl font-semibold mb-4">QR Code</p>
              <p className="text-gray-600">Create proposal to generate QR code</p>
            </div>
          )}
        </div>
      </div>

      <QRCodeScannerDialog
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onScan={handleQRCodeScanned}
      />
    </div>
  )
}

