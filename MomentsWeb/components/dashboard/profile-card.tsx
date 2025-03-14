"use client"

import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Share2, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

export default function ProfileCard() {
  const [isVerified, setIsVerified] = useState(false)
  const [showVerifyDialog, setShowVerifyDialog] = useState(false)

  const handleVerifyNow = () => {
    setShowVerifyDialog(true)
  }

  const handleCompleteVerification = () => {
    setShowVerifyDialog(false)
    setIsVerified(true)
  }

  return (
    <>
      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-pink-300 to-purple-500" />
        <div className="p-6 pt-0 relative">
          <div className="absolute right-6 top-2">
            <Button variant="ghost" size="icon" className="rounded-full bg-white/80">
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Share profile</span>
            </Button>
          </div>

          <div className="relative -mt-12 mb-4">
            <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-blue-500">
              <Image
                src="/placeholder.svg?height=96&width=96"
                alt="Profile"
                width={96}
                height={96}
                className="object-cover"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold">JulioMCruz.base.eth</h2>
              <div className="flex items-center gap-2">
                {isVerified ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">
                    Verified
                  </Badge>
                ) : (
                  <>
                    <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-200">
                      Not Verified
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs border-purple-200 text-purple-700 hover:bg-purple-50"
                      onClick={handleVerifyNow}
                    >
                      Verify Now
                    </Button>
                  </>
                )}
              </div>
            </div>

            <p className="text-sm text-gray-500">Joined March 2023</p>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold">6</p>
                <p className="text-sm text-gray-500">Active Moments</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-gray-500">NFTs Minted</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Verification Dialog */}
      <Dialog open={showVerifyDialog} onOpenChange={setShowVerifyDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verify Your Identity</DialogTitle>
            <DialogDescription>
              Scan this QR code with your wallet app to verify your identity on the blockchain.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative w-64 h-64 border border-gray-200 rounded-lg p-4 bg-white">
              <div className="absolute inset-0 flex items-center justify-center">
                <QrCode className="w-8 h-8 text-gray-300" />
              </div>
              <Image
                src="/placeholder.svg?height=240&width=240&text=Verification+QR"
                alt="Verification QR Code"
                width={240}
                height={240}
                className="mx-auto"
              />
            </div>
            <p className="mt-4 text-sm text-gray-500 text-center">
              This verification will link your wallet address to your profile and enable full platform functionality.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              className="w-full bg-purple-500 hover:bg-purple-600"
              onClick={handleCompleteVerification}
            >
              Complete Verification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

