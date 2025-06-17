import AuthGuard from "@/components/auth-guard"
import Footer from "@/components/dashboard-footer"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import type React from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">{children}</main>
          <Footer />
        </div>
      </div>
    </AuthGuard>
  )
}
