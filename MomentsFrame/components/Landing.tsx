import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Heart } from "lucide-react"
import { Footer } from "@/components/Footer"

export default function Home() {
  return (
    <>
      <main className="flex flex-col p-4">
  
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 relative">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/assets/moments.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gray-900/60" />
        <div className="w-full max-w-5xl mt-8 relative z-10">
          <div className="text-center">
            {/* <Heart className="mx-auto h-20 w-20 text-pink-600 animate-pulse" /> */}
            <h1 className="mt-6 text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
              Welcome to <span className="text-pink-600">Moments</span>
            </h1>
            <p className="mt-6 text-xl text-gray-100 sm:text-2xl max-w-3xl mx-auto">
              Create an on-chain record of your eternal love and celebrate your commitment on the blockchain
            </p>
            <div className="mt-10">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="moments-button"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
    </main>
        <Footer />
</>
  )
}

