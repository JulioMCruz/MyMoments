"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Share2, QrCode, RefreshCw, Plus } from "lucide-react"
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
import { getUserVerificationStatus, verifyUser, getUserByWalletAddress } from "@/services/user"
import { useUser } from "@/context/UserContext"

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
  const { user, setUser } = useUser();
  const [isVerified, setIsVerified] = useState(false)
  const [showVerifyDialog, setShowVerifyDialog] = useState(false)
  const [copied, setCopied] = useState(false)
  const [selfApp, setSelfApp] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [userId, setUserId] = useState<string>("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Set isClient to true once component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch user information from database
  useEffect(() => {
    async function fetchUserInfo() {
      if (!address) return;
      
      try {
        const userInfo = await getUserByWalletAddress(address);
        setUserId(userInfo.id); // Set the user ID from the database
        setIsVerified(userInfo.isVerified); // Set verification status
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user information:", error);
        // Generate a fallback ID if needed
        const fallbackId = uuidv4();
        setUserId(fallbackId);
        setIsLoading(false);
      }
    }
    
    fetchUserInfo();
  }, [address]);

  // Initialize selfApp only on client and after userId is set
  useEffect(() => {
    if (isClient && SelfAppBuilder && userId) {
      try {
        console.log("Initializing Self with userId:", userId);
        const app = new SelfAppBuilder({
          appName: "My Moments",
          scope: process.env.NEXT_PUBLIC_SELF_SCOPE, 
          endpoint: process.env.NEXT_PUBLIC_SELF_ENDPOINT,
          logoBase64: logo,
          userId, // Use the user ID from the database
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
  }, [isClient, userId]);

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

  const handleCompleteVerification = async () => {
    setShowVerifyDialog(false)
    
    // Call API to update verification status in the database
    if (address) {
      try {
        // First, try to verify the user
        const result = await verifyUser(address)
        
        if (result.success) {
          // Fetch the latest user data from the database to get the current verification status
          const userInfo = await getUserByWalletAddress(address)
          
          // Update component state
          setIsVerified(userInfo.isVerified)
          
          // Update global UserContext so other components can access updated status
          if (user && userInfo.isVerified !== user.isVerified) {
            setUser({
              ...user,
              isVerified: userInfo.isVerified
            })
          }
          
          toast({
            title: "Verification process completed",
            description: userInfo.isVerified 
              ? "Your account has been verified."
              : "Verification is being processed. Please check again shortly.",
          })
        } else {
          toast({
            variant: "destructive",
            title: "Verification failed",
            description: result.message || "Failed to verify your account.",
          })
        }
      } catch (error) {
        console.error("Error during verification:", error)
        
        // Even if verification API call fails, try to fetch the latest status
        try {
          const userInfo = await getUserByWalletAddress(address)
          
          // Update component state
          setIsVerified(userInfo.isVerified)
          
          // Update global UserContext
          if (user && userInfo.isVerified !== user.isVerified) {
            setUser({
              ...user,
              isVerified: userInfo.isVerified
            })
          }
        } catch (fetchError) {
          console.error("Error fetching user status:", fetchError)
          // Fallback to showing a generic error
          toast({
            variant: "destructive",
            title: "Verification error",
            description: "An error occurred. Please try again later."
          })
        }
      }
    }
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

  // Function to manually refresh verification status
  const refreshVerificationStatus = async () => {
    if (!address) return
    
    setIsRefreshing(true)
    try {
      const userInfo = await getUserByWalletAddress(address)
      
      // Update component state
      setIsVerified(userInfo.isVerified)
      
      // Update global UserContext
      if (user && userInfo.isVerified !== user.isVerified) {
        setUser({
          ...user,
          isVerified: userInfo.isVerified
        })
      }
      
      toast({
        title: "Status refreshed",
        description: userInfo.isVerified 
          ? "Your account is verified."
          : "Your account is not yet verified.",
      })
    } catch (error) {
      console.error("Error refreshing verification status:", error)
      toast({
        variant: "destructive",
        title: "Refresh failed",
        description: "Could not refresh verification status.",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  // Create Moment Card Component integrated directly with ProfileCard
  const CreateMomentCard = () => {
    const isDisabled = !isVerified
    
    return (
      <div className="mt-6">
        {isDisabled ? (
          <Card className="bg-pink-50">
            <div className="p-6 flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gray-400 flex items-center justify-center flex-shrink-0">
                <Plus className="h-8 w-8 text-white opacity-50" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-700">Create New Moment</h3>
                <p className="text-gray-600">In order to create a moment, you need to be verified</p>
              </div>
            </div>
          </Card>
        ) : (
          <Link href="/create-moment">
            <Card className="bg-pink-50 hover:bg-pink-100/80 transition-colors">
              <div className="p-6 flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-pink-400 flex items-center justify-center flex-shrink-0">
                  <Plus className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Create New Moment</h3>
                  <p className="text-gray-600">Capture and verify your special experiences</p>
                </div>
              </div>
            </Card>
          </Link>
        )}
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">
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
                <Identity hasCopyAddressOnClick className="h-12 w-72 bg-white text-black rounded-lg p-2">
                  <Name  address={`${address}` as `0x${string}`}/>
                  <Address address={`${address}` as `0x${string}`}/>
                </Identity>
                <div className="flex items-center gap-2">
                  {isLoading ? (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                      Checking status...
                    </Badge>
                  ) : isVerified ? (
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
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    disabled={isRefreshing}
                    onClick={refreshVerificationStatus}
                    title="Refresh verification status"
                  >
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span className="sr-only">Refresh verification status</span>
                  </Button>
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
        
        {/* Integrated Create Moment Card - shares state with ProfileCard */}
        <CreateMomentCard />
      </div>

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
                    onSuccess={async () => {
                      console.log('Verification successful via QR code');
                      
                      // Wait a short time for the verification process to complete on the backend
                      setTimeout(async () => {
                        if (address) {
                          try {
                            // Fetch the latest user data from the database
                            const userInfo = await getUserByWalletAddress(address);
                            setIsVerified(userInfo.isVerified);
                            
                            if (userInfo.isVerified) {
                              setShowVerifyDialog(false);
                              toast({
                                title: "Verification successful",
                                description: "Your account has been verified.",
                              });
                            } else {
                              toast({
                                title: "Verification in progress",
                                description: "Your verification is being processed. Please check again shortly.",
                              });
                            }
                          } catch (error) {
                            console.error("Error checking verification status:", error);
                          }
                        }
                      }, 3000); // Give it 3 seconds to process
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
              Complete Verification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

