import { User } from "@/context/UserContext"

interface ApiResponse {
  id: string
  walletAddress: string
  isVerified: boolean
  error?: string
}

/**
 * Register a user by wallet address or fetch existing user
 * This is used when a user clicks "Get Started" on the landing page
 * It never verifies users automatically
 */
export async function verifyUser(walletAddress: string): Promise<User> {
  try {
    const response = await fetch("/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ walletAddress }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to register user")
    }

    const data = await response.json()
    
    if (data.error) {
      throw new Error(data.error)
    }

    return {
      id: data.user.id,
      walletAddress: data.user.walletAddress,
      isVerified: data.user.isVerified,
    }
  } catch (error) {
    console.error("Error registering user:", error)
    throw new Error("Failed to register user. Please try again.")
  }
} 