import Header from "@/components/header"
import ProfileCard from "@/components/dashboard/profile-card"
import MomentsList from "@/components/dashboard/moments-list"
import CreateMomentCard from "@/components/dashboard/create-moment-card"
import Footer from "@/components/footer"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="grid gap-8 grid-cols-1 md:grid-cols-[350px,1fr]">
          {/* Sidebar with Profile - Stacked on mobile, side by side on desktop */}
          <div className="space-y-6">
            <ProfileCard />
            <CreateMomentCard />
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <MomentsList />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

