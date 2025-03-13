"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

interface MintModalProps {
  isOpen: boolean
  onClose: () => void
  moment: {
    id: number
    title: string
    description: string
    creator: string
    date: Date
    participants: number
    imageUrl: string
    tags: string
    price: string
  } | null
  onMint: () => void
  isMinting: boolean
}

export default function MintModal({ isOpen, onClose, moment, onMint, isMinting }: MintModalProps) {
  if (!moment) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{moment.title}</DialogTitle>
          <DialogDescription>
            Created by {moment.creator} on {moment.date.toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 grid md:grid-cols-2 gap-6">
          <div className="aspect-square relative rounded-lg overflow-hidden">
            <Image src={moment.imageUrl || "/placeholder.svg"} alt={moment.title} fill className="object-cover" />
          </div>
          <div className="flex flex-col">
            <div className="flex-1">
              <h3 className="font-medium text-lg mb-2">Description</h3>
              <p className="text-gray-600 mb-4">{moment.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Participants:</span>
                  <span className="font-medium">{moment.participants}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Category:</span>
                  <span className="font-medium">{moment.tags}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Minting Price:</span>
                  <span className="font-medium">{moment.price} ETH</span>
                </div>
              </div>
            </div>

            <Button className="w-full bg-purple-500 hover:bg-purple-600 mt-auto" onClick={onMint} disabled={isMinting}>
              {isMinting ? "Minting..." : "Mint this Moment"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

