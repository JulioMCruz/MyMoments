"use client"

import { useAccount } from "wagmi"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/UserContext"
import { verifyUser } from "@/services/userService"
import { useState } from "react"

export default function Hero() {
    const { isConnected, address } = useAccount()
    const router = useRouter()
    const { setUser } = useUser()
    const [isLoading, setIsLoading] = useState(false)

    const validateAndGoToDashboard = async () => {
        if (!address) return
        
        try {
            setIsLoading(true)
            console.log("Verifying user with wallet:", address)
            
            // Verify user or create new user if not exists
            const userData = await verifyUser(address)
            
            // Store user data in context
            setUser(userData)
            
            console.log("User verified:", userData)
            
            // Navigate to dashboard
            router.push("/dashboard")
        } catch (error) {
            console.error("Error verifying user:", error)
            // Handle error (could add toast notification here)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className="relative w-full">
          <div className="relative">
            <div className="relative w-full h-[70vh]">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover"
                poster="/assets/moments-poster.png"
                preload="auto"
              >
                <source 
                  src="/assets/moments.mp4" 
                  type="video/mp4" 
                />
                <Image
                  src="/assets/moments-poster.png"
                  alt="Moments video fallback"
                  fill
                  className="object-cover"
                  priority
                />
              </video>
            </div>

            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Welcome to <span className="text-purple-400">My Moments</span>
              </h1>
              <p className="text-xl md:text-2xl text-white max-w-2xl mb-8">
                Create an on-chain record of your eternal love and celebrate your commitment on the blockchain
              </p>
              {isConnected && (
                <Button
                  className="py-6 bg-purple-500 hover:bg-purple-600 text-white font-semibold px-8 rounded-full text-lg flex items-center transition-all"
                  onClick={() => validateAndGoToDashboard()}
                  disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Get Started"} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              ) 
             }
            </div>
          </div>
        </section>
    )
}
