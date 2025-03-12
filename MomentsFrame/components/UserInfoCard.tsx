"use client"

import type React from "react"

// import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QRCodeSVG } from "qrcode.react"
import { Copy, Check, Edit, Save, Camera, Share2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { useEffect, useCallback, useState } from 'react';
import sdk, { type FrameContext } from '@farcaster/frame-sdk';
import { useAccount } from 'wagmi';
import { toast } from "./ui/use-toast"

export function UserInfoCard() {
  const [isEditing, setIsEditing] = useState(false)
  // const [editedUser, setEditedUser] = useState(user)
  const [copied, setCopied] = useState(false)
  const [isWalletVisible, setIsWalletVisible] = useState(false)

  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [context, setContext] = useState<FrameContext>();

  const { address, isConnected } = useAccount();

  useEffect(() => {
    const load = async () => {
      setContext(await sdk.context);
      sdk.actions.ready();
    };
    if (sdk && !isSDKLoaded) {
      setIsSDKLoaded(true);
      load();
    }
  }, [isSDKLoaded]);

  if (!isSDKLoaded) {
    return <div>Loading...</div>;
  }

  const joinDate = "March 2023";
  const followers = 128;
  const following = 56;

  // Format wallet address for display (first 6 and last 4 characters)
  const walletAddress = address || "";
  const displayAddress = `${walletAddress.substring(0, 8)}...${walletAddress.substring(walletAddress.length - 6)}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address || "")
    setCopied(true)
    toast({
      title: "Address copied!",
      description: "Wallet address copied to clipboard",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const shareProfile = async () => {
    try {
      // Check if Web Share API is supported and we're in a secure context
      if (navigator.share && window.isSecureContext) {
        await navigator.share({
          title: context?.user.displayName || "Profile",
          text: `Check out ${context?.user.displayName || "this"}'s profile`,
          url: window.location.href,
        })
      } else {
        // Fallback to clipboard copy
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Share link copied!",
          description: "Profile link copied to clipboard",
        })
      }
    } catch (error) {
      // Handle any errors (user cancellation, API not available, etc.)
      console.warn("Sharing failed:", error)
      // Fallback to clipboard copy if sharing fails
      try {
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Share link copied!",
          description: "Profile link copied to clipboard",
        })
      } catch (clipboardError) {
        toast({
          title: "Sharing failed",
          description: "Unable to share or copy link",
          variant: "destructive",
        })
      }
    }
  }

  const toggleWalletSection = () => {
    setIsWalletVisible(!isWalletVisible)
  }

  return (
    <Card className="w-full mb-3 bg-gradient-to-r from-pink-300 to-purple-500">

      <div className="h-2 bg-gradient-to-r from-pink-300 to-purple-500"></div>

      <CardContent className="p-6 bg-white">
        
        <div className="flex justify-between items-start -mt-12 mb-4">
          <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
            <AvatarImage src={context?.user.pfpUrl || "/placeholder.png"} alt={context?.user.displayName || ""} />
            <AvatarFallback className="bg-primary text-2xl">{context?.user.displayName?.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="flex gap-2 mt-14">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant={isWalletVisible ? "secondary" : "outline"} size="icon" onClick={toggleWalletSection}>
                    <Share2 className={`h-4 w-4 ${isWalletVisible ? "text-primary" : ""}`} />
                    <span className="sr-only">Toggle wallet info</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isWalletVisible ? "Hide wallet info" : "Show wallet info"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

          </div>

        </div>    

        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              {context?.user.displayName}
              <Badge variant="outline" className="ml-2 text-xs font-normal">
                Verified
              </Badge>
            </h2>
            <p className="text-muted-foreground text-sm">Joined {joinDate}</p>
          </div>

          <div className="flex gap-4 text-sm">
            <div>
              <span className="font-bold">6</span>
              <span className="text-muted-foreground ml-1">Active Moments</span>
            </div>
            <div>
              <span className="font-bold">12</span>
              <span className="text-muted-foreground ml-1">Completed</span>
            </div>
            <div>
              <span className="font-bold">3</span>
              <span className="text-muted-foreground ml-1">NFTs Minted</span>
            </div>
          </div>

          {isWalletVisible && (
            <div className="pt-4 border-t">
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

              <div className="relative bg-white p-2 rounded-lg">
                <div className="flex-shrink-0 flex flex-col items-center w-full md:w-auto">
                  <QRCodeSVG value={address || ""} size={120} />
                </div>
              </div>
            </div>
          )}

        </div>

      </CardContent>
    </Card>
  )
}

