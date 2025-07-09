"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'

interface SidebarContextType {
  isOpen: boolean
  collapsed: boolean
  isMobile: boolean
  toggleSidebar: () => void
  setIsOpen: (open: boolean) => void
  setCollapsed: (collapsed: boolean) => void
  closeSidebar: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      if (mobile) {
        setCollapsed(true)
        setIsOpen(false)
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

  const closeSidebar = () => {
    if (isMobile) {
      setIsOpen(false)
    }
  }

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        collapsed,
        isMobile,
        toggleSidebar,
        setIsOpen,
        setCollapsed,
        closeSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebarContext() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebarContext must be used within a SidebarProvider')
  }
  return context
}
