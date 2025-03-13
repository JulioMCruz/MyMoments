"use client"

import { useState } from "react"

interface WalletState {
  address: string | null
  ensName: string | null
  isConnected: boolean
  isConnecting: boolean
  error: Error | null
}

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    ensName: null,
    isConnected: false,
    isConnecting: false,
    error: null,
  })

  // Mock wallet connection
  const connectWallet = async () => {
    try {
      setWalletState((prev) => ({ ...prev, isConnecting: true, error: null }))

      // Simulate connection delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock successful connection
      setWalletState({
        address: "0x1234...5678",
        ensName: "user.eth",
        isConnected: true,
        isConnecting: false,
        error: null,
      })
    } catch (error) {
      setWalletState((prev) => ({
        ...prev,
        isConnecting: false,
        error: error instanceof Error ? error : new Error("Failed to connect wallet"),
      }))
    }
  }

  const disconnectWallet = () => {
    setWalletState({
      address: null,
      ensName: null,
      isConnected: false,
      isConnecting: false,
      error: null,
    })
  }

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
  }
}

