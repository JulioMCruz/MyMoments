"use client"

import { useState, useMemo, useEffect } from "react"
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Check, Copy } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { logo } from "@/app/content/momentsAppLogo"

import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance, 
} from '@coinbase/onchainkit/identity';

// Don't import QR code components on server
let SelfQRcodeWrapper: any = null;
let SelfAppBuilder: any = null;
let uuidv4: () => string = () => "";

// Only load these modules on the client side
if (typeof window !== 'undefined') {
  // Dynamic imports
  import('@selfxyz/qrcode')
    .then((module) => {
      SelfQRcodeWrapper = module.default;
      SelfAppBuilder = module.SelfAppBuilder;
    })
    .catch(err => console.error("Error loading QR code module:", err));
  
  import('uuid')
    .then((module) => {
      uuidv4 = module.v4;
    })
    .catch(err => console.error("Error loading uuid module:", err));
}

interface ProfileCardProps {
  address: `0x${string}` | undefined
}

export default function ProfileCard({ address }: ProfileCardProps) {
  const [isVerified, setIsVerified] = useState(false)
  const [showVerifyDialog, setShowVerifyDialog] = useState(false)
  const [copied, setCopied] = useState(false)
  const [selfApp, setSelfApp] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true once component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize selfApp only on client
  useEffect(() => {
    if (isClient && SelfAppBuilder) {
      try {
        const userId = uuidv4();
        const app = new SelfAppBuilder({
          appName: "My Moments",
          scope: process.env.NEXT_PUBLIC_SELF_SCOPE, 
          endpoint: process.env.NEXT_PUBLIC_SELF_ENDPOINT,
          logoBase64: logo,
          userId,
          disclosures: {
            name: true,
            passport_number: true,
          },
        }).build();
        
        setSelfApp(app);
      } catch (error) {
        console.error("Error creating SelfAppBuilder:", error);
      }
    }
  }, [isClient]);
  
  if (!address) {
    return (
      <div className="p-4 border rounded-lg bg-red-50">
        <p className="text-red-600">Error: No wallet address found. Please connect your wallet.</p>
      </div>
    )
  }

  const handleVerifyNow = () => {
    setShowVerifyDialog(true)
  }

  const handleCompleteVerification = () => {
    setShowVerifyDialog(false)
    setIsVerified(true)
  }

  // Format wallet address for display
  const displayAddress = useMemo(() => {
    if (!address) return ""
    return `${address.substring(0, 8)}...${address.substring(address.length - 6)}`
  }, [address])

  const copyToClipboard = () => {
    if (!address || typeof navigator === 'undefined') return
    navigator.clipboard.writeText(address)
    setCopied(true)
    toast({
      title: "Address copied!",
      description: "Wallet address copied to clipboard",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-pink-300 to-purple-500" />
        <div className="p-6 pt-0 relative">
          <div className="absolute right-6 top-2">
            {/* <Button variant="ghost" size="icon" className="rounded-full bg-white/80">
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Share profile</span>
            </Button> */}
          </div>

          <div className="relative -mt-12 mb-0">
            <Identity hasCopyAddressOnClick className="h-28 w-28 rounded-full">
                <Avatar className="h-28 w-28 -ml-[16px] -mt-[5px]" address={`${address}` as `0x${string}`} />
            </Identity>

          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Identity hasCopyAddressOnClick className="h-12 w-48 bg-white text-black rounded-lg p-2">
                <Name  address={`${address}` as `0x${string}`}/>
                <Address address={`${address}` as `0x${string}`}/>
              </Identity>
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

          <div className="pt-4 border-t border-b mx-8">
          <p className="text-sm font-medium mb-2">Wallet Address</p>
          <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
            <code className="text-sm font-mono">{displayAddress}</code>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={copyToClipboard} className="h-8 w-8">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span className="sr-only">Copy address</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{copied ? "Copied!" : "Copy address"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          </div>

          <div className="flex flex-col items-center justify-center py-6">
            <div className="relative w-64 h-64 border border-gray-200 rounded-lg p-4 bg-white">
              <div className="absolute inset-0 flex items-center justify-center">
                {isClient && selfApp && SelfQRcodeWrapper ? (
                  <SelfQRcodeWrapper
                    selfApp={selfApp}
                    onSuccess={() => {
                      console.log('Verification successful');
                      // Perform actions after successful verification
                    }}
                    darkMode={false}
                    size={200}
                  />
                ) : (
                  <div className="w-48 h-48 bg-gray-100 animate-pulse rounded-lg"></div>
                )}
              </div>
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
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

