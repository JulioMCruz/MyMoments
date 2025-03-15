"use client"

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'

interface UseMomentAccessProps {
  momentId: string
}

interface UseMomentAccessResult {
  hasAccess: boolean
  isLoading: boolean
  error: string | null
}

export function useMomentAccess({ momentId }: UseMomentAccessProps): UseMomentAccessResult {
  const { address } = useAccount()
  const [hasAccess, setHasAccess] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAccess = async () => {
      if (!momentId || !address) {
        setIsLoading(false)
        setHasAccess(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch(`/api/moments/${momentId}/access`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ walletAddress: address }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to check access')
        }

        const data = await response.json()
        setHasAccess(data.hasAccess)
      } catch (err) {
        console.error('Error checking moment access:', err)
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
        setHasAccess(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAccess()
  }, [momentId, address])

  return { hasAccess, isLoading, error }
} 