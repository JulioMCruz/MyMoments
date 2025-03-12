import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full py-6 px-4 sm:px-6 header-footer-gradient text-white shadow-md mt-auto bg-gradient-to-r from-[#6d63fe] to-purple-500">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="mb-4 sm:mb-0">
          <p className="text-sm">&copy; 2025 Moments. All rights reserved.</p>
        </div>
        <div className="flex space-x-4">
          <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <Facebook className="h-5 w-5 hover:text-white transition-colors" />
          </Link>
          <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <Twitter className="h-5 w-5 hover:text-white transition-colors" />
          </Link>
          <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <Instagram className="h-5 w-5 hover:text-white transition-colors" />
          </Link>
          <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <Linkedin className="h-5 w-5 hover:text-white transition-colors" />
          </Link>
          <Link href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <Github className="h-5 w-5 hover:text-white transition-colors" />
          </Link>
        </div>
      </div>
    </footer>
  )
}

