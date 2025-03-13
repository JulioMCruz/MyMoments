"use client"

import Link from "next/link"
import { Heart } from "lucide-react"
import MobileMenu from "@/components/mobile-menu"

import { WalletDefault } from '@coinbase/onchainkit/wallet';
import { WalletComponent } from "@/components/wallet-component";
import { useAccount } from "wagmi";

export default function Header() {

  const { isConnected } = useAccount()

  return (
    <header className="bg-purple-500 text-white py-4 px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        <div className="flex items-center">
          {/* Mobile Menu */}
          {isConnected && (
            <MobileMenu variant="main" />
          )}

          <Link href="/" className="flex items-center">
            <div className="hidden md:flex w-10 h-10 rounded-full border-2 border-white items-center justify-center mr-2">
              <Heart className="h-5 w-5" />
            </div>
            <span className="text-2xl font-bold">My Moments</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        {isConnected && (
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/dashboard" className="hover:underline">
            Dashboard
          </Link>
          <Link href="/discover" className="hover:underline">
            Discover
          </Link>
          <Link href="/collection" className="hover:underline">
            Collection
          </Link>
          <Link
            href="/create-moment"
            className="hover:underline"
          >
            Create Moment
          </Link>
          <Link href="/profile" className="hover:underline">
                  Profile
          </Link>
        </nav>
        )}

        <div className="">
          <WalletComponent />
        </div>

      </div>
    </header>
  )
}

