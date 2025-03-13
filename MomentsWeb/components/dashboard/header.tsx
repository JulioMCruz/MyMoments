import Link from "next/link"
import { Heart } from "lucide-react"
import MobileMenu from "@/components/mobile-menu"

export default function Header() {
  return (
    <header className="bg-purple-500 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">


        <div className="flex items-center">
          {/* Mobile Menu */}
          <MobileMenu variant="dashboard" />

          <Link href="/" className="flex items-center">
            <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center mr-2">
              <Heart className="h-5 w-5" />
            </div>
            <span className="text-2xl font-bold">My Moments</span>
          </Link>
        </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center">
            <div className="bg-purple-600/50 rounded-full p-1">
              <div className="flex space-x-1">
                <Link href="/dashboard" className="px-6 py-2 text-sm rounded-full hover:bg-white/10 transition-colors">
                  Dashboard
                </Link>
                <Link
                  href="/create-moment"
                  className="px-6 py-2 text-sm rounded-full hover:bg-white/10 transition-colors"
                >
                  Create
                </Link>
                <Link href="/discover" className="px-6 py-2 text-sm rounded-full hover:bg-white/10 transition-colors">
                  Discover
                </Link>
                <Link href="/collection" className="px-6 py-2 text-sm rounded-full hover:bg-white/10 transition-colors">
                  Collection
                </Link>
                <Link href="/profile" className="px-6 py-2 text-sm rounded-full hover:bg-white/10 transition-colors">
                  Profile
                </Link>
              </div>
            </div>
          </nav>

        </div>
      </div>
    </header>
  )
}

