import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import FeaturedMoments from "@/components/featured-moments"
import Hero from "@/components/hero"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <Hero />
        <div id="latest-moments">
          <FeaturedMoments />
        </div>

        <section className="py-16 px-6 bg-white" id="how-it-works">
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
                  src="/assets/moments-poster.png"
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

