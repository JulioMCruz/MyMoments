import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-purple-500 text-white py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-6">
          <p className="text-sm">© 2025 Moments. All rights reserved.</p>
        </div>
        <div className="flex justify-center space-x-8">
          <Link href="#" aria-label="Facebook">
            <Facebook className="h-6 w-6 hover:text-purple-200 transition-colors" />
          </Link>
          <Link href="#" aria-label="Twitter">
            <Twitter className="h-6 w-6 hover:text-purple-200 transition-colors" />
          </Link>
          <Link href="#" aria-label="Instagram">
            <Instagram className="h-6 w-6 hover:text-purple-200 transition-colors" />
          </Link>
          <Link href="#" aria-label="LinkedIn">
            <Linkedin className="h-6 w-6 hover:text-purple-200 transition-colors" />
          </Link>
          <Link href="#" aria-label="GitHub">
            <Github className="h-6 w-6 hover:text-purple-200 transition-colors" />
          </Link>
        </div>
      </div>
    </footer>
  )
}

