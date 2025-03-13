"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { PenLine, Calendar, User, ArrowLeft } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function MomentPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  const handleBack = () => {
    router.push("/dashboard")
  }

  // Mock moment data - in a real app, this would be fetched based on the ID
  const momentData = {
    id: params.id,
    title: "Carol & Dave's Commitment",
    description:
      "A beautiful ceremony celebrating Carol and Dave's commitment to each other. This special moment took place at Sunset Beach with close friends and family in attendance. The couple exchanged personalized vows and commemorated their love with this blockchain-verified moment.",
    date: "2023-08-15",
    imageUrl: "/placeholder.svg?height=300&width=500",
    status: "Pending",
    participants: [
      { name: "Carol", wallet: "0xabcd...ef01", status: "Signed" },
      { name: "Dave", wallet: "0xef01...2345", status: "Pending" },
    ],
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-4 sm:p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <div>
                  <h1 className="text-2xl font-bold">{momentData.title}</h1>
                  <div className="flex items-center text-gray-500 mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    <p>{momentData.date}</p>
                  </div>
                </div>
                <Badge className="bg-amber-500 text-white self-start">{momentData.status}</Badge>
              </div>

              <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={momentData.imageUrl || "/placeholder.svg"}
                  alt="Moment image"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 500px"
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h2 className="font-medium text-lg mb-2">Description</h2>
                <p className="text-gray-700 leading-relaxed">{momentData.description}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <h2 className="font-medium text-lg">Participants</h2>

                <div className="space-y-3">
                  {momentData.participants.map((participant, index) => (
                    <div key={index} className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                          <User className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">{participant.name}</p>
                          <p className="text-sm text-gray-500">{participant.wallet}</p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          participant.status === "Signed"
                            ? "bg-green-50 text-green-600 border-green-200"
                            : "bg-amber-50 text-amber-600 border-amber-200"
                        }
                      >
                        {participant.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <Button className="w-full bg-purple-500 hover:bg-purple-600">
                  <PenLine className="mr-2 h-4 w-4" /> Sign
                </Button>

                <Button variant="outline" className="w-full" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}

