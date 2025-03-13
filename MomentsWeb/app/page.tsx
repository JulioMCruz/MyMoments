import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <section className="relative w-full">
          <div className="relative">
            <div className="relative w-full h-[70vh]">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover"
                poster="/assets/moments-poster.jpg"
                preload="auto"
              >
                <source 
                  src="/assets/moments.mp4" 
                  type="video/mp4" 
                />
                <Image
                  src="/assets/moments-poster.png"
                  alt="Moments video fallback"
                  fill
                  className="object-cover"
                  priority
                />
              </video>
            </div>

            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Welcome to <span className="text-purple-400">My Moments</span>
              </h1>
              <p className="text-xl md:text-2xl text-white max-w-2xl mb-8">
                Create an on-chain record of your eternal love and celebrate your commitment on the blockchain
              </p>
              <Link
                href="/dashboard"
                className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-8 rounded-full text-lg flex items-center transition-all"
              >
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-purple-50 p-6 rounded-lg text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Create a Moment</h3>
                <p className="text-gray-600">
                  Define your experience, add participants, and set parameters like location and time.
                </p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Verify Participation</h3>
                <p className="text-gray-600">
                  All participants verify their presence through multi-factor authentication.
                </p>
              </div>
              <div className="bg-purple-50 p-6 rounded-lg text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Mint Your NFT</h3>
                <p className="text-gray-600">
                  Receive a beautiful, customizable digital artifact as proof of your experience.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-6 bg-purple-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold mb-6">Your Life Ledger</h2>
                <p className="text-lg text-gray-700 mb-6">
                  Build a collection of verified experiences that tell the story of your life. From promises to
                  achievements, My Moments helps you commemorate what matters most.
                </p>
                <Link
                  href="/discover"
                  className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-6 rounded-full inline-flex items-center transition-all"
                >
                  Discover Moments <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
              <div className="md:w-1/2">
                <Image
                  src="/placeholder.svg?height=400&width=500"
                  alt="Collection of moments"
                  width={500}
                  height={400}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

