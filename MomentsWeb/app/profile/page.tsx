import Image from "next/image"
import Link from "next/link"
import { Copy, Share2 } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-pink-300 to-purple-500"></div>
            <CardContent className="pt-0 relative">
              <div className="flex justify-end absolute right-4 top-4">
                <Button variant="ghost" size="icon" className="bg-white rounded-full">
                  <Share2 className="h-4 w-4" />
                  <span className="sr-only">Share profile</span>
                </Button>
              </div>

              <div className="relative -mt-16 mb-4">
                <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-blue-500">
                  <Image
                    src="/placeholder.svg?height=128&width=128"
                    alt="Profile avatar"
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold">JulioMCruz.base.eth</h1>
                  <span className="ml-2 px-2 py-1 bg-gray-100 text-xs font-medium rounded">Verified</span>
                </div>

                <p className="text-gray-500">Joined March 2023</p>

                <div className="flex space-x-8">
                  <div>
                    <span className="text-2xl font-bold">6</span>
                    <p className="text-gray-500">Active Moments</p>
                  </div>
                  <div>
                    <span className="text-2xl font-bold">12</span>
                    <p className="text-gray-500">Completed</p>
                  </div>
                  <div>
                    <span className="text-2xl font-bold">3</span>
                    <p className="text-gray-500">NFTs Minted</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h2 className="font-medium mb-2">Wallet Address</h2>
                  <div className="flex items-center justify-between bg-gray-50 p-4 rounded">
                    <p className="font-mono text-sm truncate">0xc2564e...e8228f</p>
                    <Button variant="ghost" size="icon">
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copy address</span>
                    </Button>
                  </div>

                  <div className="flex justify-center my-6">
                    <Image
                      src="/placeholder.svg?height=200&width=200"
                      alt="QR Code"
                      width={200}
                      height={200}
                      className="border"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold">My Moments</h2>
            <Link
              href="/create-moment"
              className="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-6 rounded-full inline-flex items-center transition-all"
            >
              + Moment
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {[1, 2, 3, 4].map((item) => (
              <Link href={`/moment/${item}`} key={item}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-1">Trip to Paris</h3>
                    <p className="text-gray-500 text-sm mb-3">2023-10-15</p>
                    <div className="bg-gray-100 h-40 rounded flex items-center justify-center mb-3">
                      <span className="text-gray-400">Moment Image</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-purple-600 font-medium">
                        {item % 2 === 0 ? "Completed" : "Pending"}
                      </span>
                      <span className="text-sm text-gray-500">2 participants</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

