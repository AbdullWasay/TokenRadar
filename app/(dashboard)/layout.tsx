import AuthGuard from "@/components/auth-guard"
import Footer from "@/components/dashboard-footer"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import { SidebarProvider } from "@/lib/sidebar-context"
import type React from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
          <Sidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <Header />
            <main className="flex-1 p-3 md:p-6 overflow-x-hidden">{children}</main>
            <Footer />
          </div>
        </div>
      </SidebarProvider>
    </AuthGuard>
  )
}
