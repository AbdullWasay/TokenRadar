"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart2,
  Bell,
  ChevronLeft,
  ChevronRight,
  Compass,
  LayoutDashboard,
  LineChart,
  Plus,
  Settings,
  Star,
  User,
  Wallet,
  Zap,
  MessageSquare,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import AddTokenModal from "@/components/add-token-modal"

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth < 1024) {
        setCollapsed(true)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  const toggleSidebar = () => {
    if (isMobile) {
      setIsOpen(!isOpen)
    } else {
      setCollapsed(!collapsed)
    }
  }

  const mainNavItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "All Tokens", href: "/all-tokens", icon: Compass },
    { name: "Watchlist", href: "/watchlist", icon: Star },
    { name: "Trending", href: "/trending", icon: Zap },
    { name: "Analytics", href: "/analytics", icon: BarChart2 },
  ]

  const secondaryNavItems = [
    { name: "Portfolio", href: "/portfolio", icon: Wallet },
    { name: "Alerts", href: "/alerts", icon: Bell },
    { name: "Support", href: "/support", icon: MessageSquare },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  const renderNavItem = (item: { name: string; href: string; icon: any }) => {
    const isActive = pathname === item.href

    return (
      <TooltipProvider key={item.name} delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white",
              )}
            >
              <item.icon size={20} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          </TooltipTrigger>
          {collapsed && <TooltipContent side="right">{item.name}</TooltipContent>}
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-gray-200 bg-white transition-all duration-300 dark:border-gray-800 dark:bg-gray-900 lg:relative",
          collapsed ? "w-[70px]" : "w-[240px]",
          isMobile && (isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"),
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 py-4">
          {!collapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600">
                <LineChart className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold text-indigo-600 dark:text-white">Rader</span>
            </Link>
          )}
          {collapsed && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 mx-auto">
              <LineChart className="h-4 w-4 text-white" />
            </div>
          )}
          {!isMobile && (
            <Button variant="ghost" size="icon" className="ml-auto h-8 w-8" onClick={toggleSidebar}>
              {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-auto py-4">
          <nav className="grid gap-1 px-2">
            {mainNavItems.map(renderNavItem)}

            {!collapsed && (
              <div className="my-4 border-t border-gray-200 pt-4 dark:border-gray-800">
                <h3 className="mb-2 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400">ACCOUNT</h3>
              </div>
            )}
            {collapsed && <div className="my-4 border-t border-gray-200 dark:border-gray-800" />}

            {secondaryNavItems.map(renderNavItem)}
          </nav>
        </div>

        <div className="border-t border-gray-200 p-4 dark:border-gray-800">
          {collapsed ? (
            <Button className="w-full h-10 bg-indigo-600 hover:bg-indigo-700" onClick={() => setIsAddModalOpen(true)}>
              <Plus size={18} />
            </Button>
          ) : (
            <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={() => setIsAddModalOpen(true)}>
              <Plus size={16} className="mr-2" /> Add Token
            </Button>
          )}
        </div>
      </aside>

      {/* Mobile toggle button */}
      {isMobile && (
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 z-50 h-10 w-10 rounded-full border border-gray-200 bg-white shadow-lg lg:hidden"
          onClick={toggleSidebar}
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </Button>
      )}

      <AddTokenModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </>
  )
}
