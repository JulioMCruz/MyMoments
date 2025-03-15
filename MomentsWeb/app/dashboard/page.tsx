"use client"

import Header from "@/components/dashboard/header"
import ProfileCard from "@/components/dashboard/profile-card"
import MomentsList from "@/components/dashboard/moments-list"
import Footer from "@/components/footer"
import { useAccount } from "wagmi"
import { useUser } from "@/context/UserContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const { address } = useAccount()
  const { user, loading } = useUser()
  const router = useRouter()
  
  // Redirect to home if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      console.log("User not authenticated, redirecting to home")
      router.push("/")
    }
  }, [user, loading, router])

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg text-purple-600">Loading...</div>
      </div>
    )
  }
  
  // Don't render dashboard content if user not authenticated
  if (!user) return null
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="grid gap-8 grid-cols-1 md:grid-cols-[350px,1fr]">
          {/* Sidebar with Profile - Stacked on mobile, side by side on desktop */}
          <div>
            {address && <ProfileCard address={address} />}
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <MomentsList />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

