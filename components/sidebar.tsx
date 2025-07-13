"use client"


import { PremiumIcon } from "@/components/premium-guard"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useAuth } from "@/lib/auth-context"
import { useSidebarContext } from "@/lib/sidebar-context"
import { cn } from "@/lib/utils"
import {
    Bell,
    Compass,
    LayoutDashboard,
    LineChart,
    Star,
    TrendingUp,
    User,
    Zap
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import PremiumPopup, { usePremiumPopup } from "@/components/premium-popup"

export default function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const { isOpen: isPremiumPopupOpen, feature, showPremiumPopup, closePremiumPopup } = usePremiumPopup()
  const { isOpen, collapsed, isMobile, toggleSidebar, setIsOpen, closeSidebar } = useSidebarContext()

  const isPremium = user?.subscriptionStatus === 'premium'

  const mainNavItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, premium: true },
    { name: "All Tokens", href: "/all-tokens", icon: Compass, premium: false }, // Free users can view tokens
    { name: "Bonded Tokens", href: "/bonded", icon: TrendingUp, premium: false }, // Show newly bonded tokens
    { name: "Watchlist", href: "/watchlist", icon: Star, premium: true },
    { name: "Overview", href: "/overview", icon: Zap, premium: true },
  ]

  const secondaryNavItems = [
    { name: "Alerts", href: "/alerts", icon: Bell, premium: true },
    { name: "Profile", href: "/profile", icon: User, premium: false }, // Profile accessible to all
  ]

  const handleNavClick = (item: { name: string; href: string; icon: any; premium?: boolean }) => {
    if (item.premium && !isPremium) {
      showPremiumPopup(item.name.toLowerCase())
    }
    // For premium users or non-premium features, navigation happens via Link component
  }

  const renderNavItem = (item: { name: string; href: string; icon: any; premium?: boolean }) => {
    const isActive = pathname === item.href
    const requiresPremium = item.premium && !isPremium

    const linkContent = (
      <div className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
        isActive
          ? "bg-indigo-600 text-white"
          : "text-gray-600 hover:bg-indigo-100 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white",
      )}
    >
      <item.icon size={20} />
      {!collapsed && (
        <div className="flex items-center justify-between w-full">
          <span>{item.name}</span>
          {item.premium && <PremiumIcon className="w-3 h-3" />}
        </div>
      )}
    </div>
    )

    return (
      <TooltipProvider key={item.name} delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            {requiresPremium ? (
              <div
                className="cursor-pointer"
                onClick={() => handleNavClick(item)}
              >
                {linkContent}
              </div>
            ) : (
              <Link href={item.href} onClick={closeSidebar}>
                {linkContent}
              </Link>
            )}
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right">
              <div className="flex items-center gap-2">
                <span>{item.name}</span>
                {item.premium && <PremiumIcon className="w-3 h-3" />}
              </div>
            </TooltipContent>
          )}
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
            <Link href="/dashboard" className="flex items-center gap-2" onClick={closeSidebar}>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600">
                <LineChart className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold text-indigo-600 dark:text-white">Token Radar</span>
            </Link>
          )}
          {collapsed && (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 mx-auto">
              <LineChart className="h-4 w-4 text-white" />
            </div>
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


      </aside>



      {/* Premium Popup */}
      <PremiumPopup
        isOpen={isPremiumPopupOpen}
        onClose={closePremiumPopup}
        feature={feature}
      />
    </>
  )
}
