"use client"

import { ModeToggle } from "@/components/mode-toggle"
import NotificationsDropdown from "@/components/notifications-dropdown"
import SimpleWalletConnect from "@/components/simple-wallet-connect"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"
import { useSidebarContext } from "@/lib/sidebar-context"
import { Bell, Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function Header() {
  const { toggleSidebar } = useSidebarContext()
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [alertCount, setAlertCount] = useState(0)
  const isDashboard =
    pathname.includes("/(dashboard)") || pathname.startsWith("/dashboard") || pathname.startsWith("/token")

  useEffect(() => {
    // Fetch alert count
    const fetchAlertCount = async () => {
      try {
        const response = await fetch('/api/alerts?triggered=true&active=true')
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data) {
            setAlertCount(data.data.length)
          }
        }
      } catch (error) {
        console.error('Error fetching alert count:', error)
      }
    }

    if (isDashboard) {
      fetchAlertCount()
    }
  }, [isDashboard])

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Button variant="outline" size="icon" className="md:hidden" onClick={toggleSidebar}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex items-center gap-2 min-w-0">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg md:text-xl font-bold truncate">Token Radar</span>
        </Link>
      </div>
      <div className="flex-1"></div>
      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden sm:block">
          <SimpleWalletConnect />
        </div>
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full relative">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
              {alertCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                  {alertCount > 9 ? '9+' : alertCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <NotificationsDropdown />
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profileImage || "/placeholder.svg"} alt="User" />
                <AvatarFallback className="bg-gradient-to-br from-purple-400 to-purple-600 text-white font-bold">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user?.name || 'My Account'}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
