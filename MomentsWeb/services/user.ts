/**
 * User-related API service functions
 */

/**
 * Fetches the verification status of a user by wallet address
 * 
 * @param walletAddress - The wallet address to check
 * @returns Promise with the verification status
 */
export async function getUserVerificationStatus(walletAddress: string): Promise<{ isVerified: boolean }> {
  try {
    const response = await fetch(`/api/users/verification?walletAddress=${walletAddress}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to fetch verification status')
    }

    return response.json()
  } catch (error) {
    console.error('Error fetching user verification status:', error)
    // Return default unverified status on error
    return { isVerified: false }
  }
}

/**
 * Fetches complete user information by wallet address
 * 
 * @param walletAddress - The wallet address to check
 * @returns Promise with the complete user information
 */
export async function getUserByWalletAddress(walletAddress: string): Promise<{ id: string; walletAddress: string; isVerified: boolean }> {
  try {
    const response = await fetch(`/api/users/info?walletAddress=${walletAddress}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to fetch user information')
    }

    return response.json()
  } catch (error) {
    console.error('Error fetching user information:', error)
    throw error
  }
}

/**
 * Marks a user as verified in the database
 * 
 * @param walletAddress - The wallet address of the user to verify
 * @returns Promise with the updated user data
 */
export async function verifyUser(walletAddress: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/users/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ walletAddress }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to verify user')
    }

    const data = await response.json()
    return { 
      success: true, 
      message: data.message || 'User verified successfully' 
    }
  } catch (error) {
    console.error('Error verifying user:', error)
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to verify user' 
    }
  }
} 