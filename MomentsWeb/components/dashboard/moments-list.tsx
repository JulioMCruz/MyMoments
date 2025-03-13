import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mountain, Timer, Users, Gift, Award, Heart, Star } from "lucide-react"

// Updated mock data with different statuses
const recentMoments = [
  {
    id: 1,
    title: "Wedding Vows",
    participants: "With Sarah",
    date: "June 15",
    color: "bg-green-100",
    icon: Heart,
    status: "Completed",
    statusColor: "bg-green-500",
    progress: "2/2 signed",
  },
  {
    id: 2,
    title: "Bahamas Trip",
    participants: "With 5 Friends",
    date: "Last Week",
    color: "bg-blue-100",
    icon: Mountain,
    status: "Pending",
    statusColor: "bg-amber-500",
    progress: "3/6 signed",
  },
  {
    id: 3,
    title: "Running Challenge",
    participants: "With Ryan",
    date: "9 days remaining",
    color: "bg-purple-100",
    icon: Timer,
    status: "Created",
    statusColor: "bg-purple-500",
    progress: "0/2 signed",
  },
  {
    id: 4,
    title: "Birthday Celebration",
    participants: "With Family",
    date: "March 12",
    color: "bg-pink-100",
    icon: Gift,
    status: "Completed",
    statusColor: "bg-green-500",
    progress: "5/5 signed",
  },
  {
    id: 5,
    title: "Team Achievement",
    participants: "With Work Team",
    date: "Last Month",
    color: "bg-yellow-100",
    icon: Award,
    status: "Pending",
    statusColor: "bg-amber-500",
    progress: "4/8 signed",
  },
  {
    id: 6,
    title: "New Year's Resolutions",
    participants: "Personal",
    date: "January 1",
    color: "bg-indigo-100",
    icon: Star,
    status: "Created",
    statusColor: "bg-purple-500",
    progress: "0/1 signed",
  },
]

export default function MomentsList() {
  // Helper function to get status-specific styles
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Completed":
        return {
          bgColor: "bg-green-500",
          textColor: "text-green-700",
          lightBgColor: "bg-green-50",
          borderColor: "border-green-200",
        }
      case "Pending":
        return {
          bgColor: "bg-amber-500",
          textColor: "text-amber-700",
          lightBgColor: "bg-amber-50",
          borderColor: "border-amber-200",
        }
      case "Created":
        return {
          bgColor: "bg-purple-500",
          textColor: "text-purple-700",
          lightBgColor: "bg-purple-50",
          borderColor: "border-purple-200",
        }
      default:
        return {
          bgColor: "bg-gray-500",
          textColor: "text-gray-700",
          lightBgColor: "bg-gray-50",
          borderColor: "border-gray-200",
        }
    }
  }

  // Function to get the correct link based on moment status
  const getMomentLink = (moment: any) => {
    return moment.status === "Completed" ? `/moment-publish/${moment.id}` : `/moment/${moment.id}`
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-2xl font-bold">My Moments</h2>
        <div className="flex items-center space-x-2 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-purple-500 mr-1"></div>
            <span>Created</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-amber-500 mr-1"></div>
            <span>Pending</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
            <span>Completed</span>
          </div>
        </div>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        <Card className="bg-purple-50 border-purple-200">
          <div className="p-4 flex items-center">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-purple-600">Created</p>
              <p className="text-2xl font-bold">2</p>
            </div>
          </div>
        </Card>

        <Card className="bg-amber-50 border-amber-200">
          <div className="p-4 flex items-center">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
              <Timer className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-amber-600">Pending</p>
              <p className="text-2xl font-bold">2</p>
            </div>
          </div>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <div className="p-4 flex items-center">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <Award className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-green-600">Completed</p>
              <p className="text-2xl font-bold">2</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {recentMoments.map((moment) => {
          const styles = getStatusStyles(moment.status)
          const link = getMomentLink(moment)

          return (
            <Link key={moment.id} href={link}>
              <Card className={`h-full hover:shadow-md transition-all border-l-4 ${styles.borderColor}`}>
                <div
                  className={`aspect-video ${moment.color} rounded-t-lg relative p-4 flex items-center justify-center`}
                >
                  <moment.icon className="h-12 w-12 text-white/80" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{moment.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {moment.participants} • {moment.date}
                  </p>
                  <div className="flex justify-between items-center">
                    <Badge className={`${styles.bgColor} text-white hover:${styles.bgColor}`}>{moment.status}</Badge>
                    <span className={`text-sm ${styles.textColor} font-medium`}>{moment.progress}</span>
                  </div>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

