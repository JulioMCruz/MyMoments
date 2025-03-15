"use client"

import { useState, useRef, ChangeEvent, FormEvent } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Camera, Plus, Trash2 } from "lucide-react"
import dynamic from "next/dynamic"
import Header from "@/components/dashboard/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { useAccount } from "wagmi"
import { uploadToPinata } from "@/lib/pinata"

// Dynamically import ConfettiExplosion with SSR disabled
const ConfettiExplosion = dynamic(() => import("react-confetti-explosion"), {
  ssr: false,
  loading: () => null
})

interface FormData {
  title: string
  description: string
  participantWallets: string[]
}

export default function CreateMomentPage() {
  const router = useRouter()
  const { address: connectedWalletAddress, isConnected } = useAccount()
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    participantWallets: [""]
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formErrors, setFormErrors] = useState<{
    title?: string
    description?: string
    image?: string
    participantWallets?: string[]
  }>({})

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        setFormErrors(prev => ({
          ...prev,
          image: "Please select an image file"
        }))
        return
      }
      
      // Check file size (15MB limit)
      if (file.size > 15 * 1024 * 1024) {
        setFormErrors(prev => ({
          ...prev,
          image: "Image size must be less than 15MB"
        }))
        return
      }
      
      setImageFile(file)
      setFormErrors(prev => ({ ...prev, image: undefined }))
      
      // Generate preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const addParticipant = () => {
    setFormData(prev => ({
      ...prev,
      participantWallets: [...prev.participantWallets, ""]
    }))
  }

  const updateParticipantWallet = (index: number, value: string) => {
    const updatedWallets = [...formData.participantWallets]
    updatedWallets[index] = value
    setFormData(prev => ({
      ...prev,
      participantWallets: updatedWallets
    }))
    
    // Clear errors for this particular wallet
    if (formErrors.participantWallets) {
      const updatedErrors = [...formErrors.participantWallets]
      updatedErrors[index] = ''
      setFormErrors(prev => ({
        ...prev,
        participantWallets: updatedErrors
      }))
    }
  }

  const removeParticipant = (index: number) => {
    // Don't remove if it's the only participant
    if (formData.participantWallets.length === 1) return
    
    setFormData(prev => ({
      ...prev,
      participantWallets: prev.participantWallets.filter((_, i) => i !== index)
    }))
  }

  const handleCancel = () => {
    router.push("/dashboard")
  }

  const validateForm = (): boolean => {
    const errors: {
      title?: string
      description?: string
      image?: string
      participantWallets?: string[]
    } = {}
    
    // Validate title
    if (!formData.title.trim()) {
      errors.title = "Title is required"
    }
    
    // Validate description
    if (!formData.description.trim()) {
      errors.description = "Description is required"
    }
    
    // Validate image
    if (!imageFile) {
      errors.image = "Image is required"
    }
    
    // Validate participant wallets
    const walletErrors = formData.participantWallets.map(wallet => 
      !wallet.trim() ? "Wallet address is required" : ""
    )
    
    // Only set wallet errors if at least one error exists
    if (walletErrors.some(error => error)) {
      errors.participantWallets = walletErrors
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!validateForm()) {
      toast({
        title: "Form Error",
        description: "Please fix the errors before submitting",
        variant: "destructive"
      })
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // 1. Upload image to IPFS via Pinata
      if (!imageFile) {
        throw new Error("No image file selected")
      }
      
      const { ipfsHash, imageUrl } = await uploadToPinata(imageFile)
      
      // 2. Create moment record in database
      const response = await fetch('/api/moments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          imageUrl,
          ipfsHash,
          creatorWalletAddress: connectedWalletAddress,
          participantWallets: formData.participantWallets.filter(address => address.trim() !== '')
        })
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create moment")
      }
      
      // Success
      setShowSuccess(true)
    } catch (error) {
      console.error("Error creating moment:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create moment",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
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
              <Label htmlFor="creator-wallet">Creator's Wallet Address</Label>
              <Input 
                id="creator-wallet" 
                value={connectedWalletAddress || ""}
                disabled
                className="opacity-70"
              />
              {!isConnected && (
                <p className="text-sm text-red-500">Please connect your wallet</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="moment-title">Moment Title</Label>
              <Input 
                id="moment-title" 
                placeholder="Our Special Day" 
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required 
              />
              {formErrors.title && (
                <p className="text-sm text-red-500">{formErrors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="moment-description">Moment Description</Label>
              <Textarea 
                id="moment-description" 
                placeholder="A few words about our love..." 
                rows={4} 
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                required 
              />
              {formErrors.description && (
                <p className="text-sm text-red-500">{formErrors.description}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nft-image">Upload Image for NFT</Label>
              <div className={`border-2 border-dashed rounded-lg p-6 text-center ${imagePreview ? 'border-green-500' : formErrors.image ? 'border-red-500' : ''}`}>
                <Input 
                  id="nft-image" 
                  type="file" 
                  className="hidden" 
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageChange}
                />
                
                {imagePreview ? (
                  <div className="relative mx-auto w-full max-w-xs">
                    <Image 
                      src={imagePreview} 
                      alt="Moment preview" 
                      width={300} 
                      height={300}
                      className="mx-auto object-cover rounded-lg"
                      style={{ maxHeight: '200px', width: 'auto' }} 
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={clearImage}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Label
                    htmlFor="nft-image"
                    className="cursor-pointer text-gray-500 hover:text-gray-700 flex flex-col items-center"
                  >
                    <Camera className="h-8 w-8 mb-2" />
                    <span>Choose File</span>
                    <span className="text-sm">No file chosen</span>
                  </Label>
                )}
                
                {formErrors.image && (
                  <p className="text-sm text-red-500 mt-2">{formErrors.image}</p>
                )}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Participants</h2>
              </div>

              {formData.participantWallets.map((wallet, index) => (
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
                      className={`flex-1 ${formErrors.participantWallets?.[index] ? 'border-red-500' : ''}`}
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeParticipant(index)}
                      disabled={formData.participantWallets.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {formErrors.participantWallets?.[index] && (
                    <p className="text-sm text-red-500">{formErrors.participantWallets[index]}</p>
                  )}
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
              <Button 
                type="submit" 
                className="flex-1 bg-purple-500 hover:bg-purple-600" 
                disabled={isSubmitting || !isConnected}
              >
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

