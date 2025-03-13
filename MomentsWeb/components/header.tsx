import Link from "next/link"
import { Heart } from "lucide-react"
import MobileMenu from "@/components/mobile-menu"

export default function Header() {
  return (
    <header className="bg-purple-500 text-white py-4 px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        <div className="flex items-center">
          {/* Mobile Menu */}
          <MobileMenu variant="main" />

          <Link href="/" className="flex items-center">
            <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center mr-2">
              <Heart className="h-5 w-5" />
            </div>
            <span className="text-2xl font-bold">My Moments</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
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
            className="bg-white text-purple-500 px-4 py-2 rounded-full font-medium hover:bg-purple-100 transition-colors"
          >
            Create Moment
          </Link>
        </nav>

      </div>
    </header>
  )
}

