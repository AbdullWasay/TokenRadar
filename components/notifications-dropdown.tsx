"use client"

import { useEffect, useRef } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NotificationsDropdownProps {
  isOpen: boolean
  onClose: () => void
}

// Mock notifications data
const notifications = [
  {
    id: "1",
    title: "New Token Alert",
    message: "PEPE token has been added to the platform",
    time: "5 minutes ago",
    read: false,
  },
  {
    id: "2",
    title: "Price Alert",
    message: "DOGE has increased by 15% in the last hour",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    title: "System Update",
    message: "Platform maintenance scheduled for tomorrow",
    time: "3 hours ago",
    read: true,
  },
]

export default function NotificationsDropdown({ isOpen, onClose }: NotificationsDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-10 w-80 bg-white rounded-md shadow-lg border border-gray-200 z-50"
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-medium">Notifications</h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
          <X size={16} />
        </Button>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No notifications</div>
        ) : (
          <div>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b hover:bg-gray-50 ${notification.read ? "" : "bg-blue-50"}`}
              >
                <div className="flex items-start">
                  <div
                    className={`mt-0.5 mr-3 flex-shrink-0 w-2 h-2 rounded-full ${notification.read ? "bg-gray-300" : "bg-blue-500"}`}
                  ></div>
                  <div>
                    <h4 className="text-sm font-medium">{notification.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 border-t text-center">
        <Button variant="link" size="sm" className="text-indigo-700 h-auto p-0">
          Mark all as read
        </Button>
        <span className="px-2 text-gray-300">|</span>
        <Button variant="link" size="sm" className="text-indigo-700 h-auto p-0">
          View all
        </Button>
      </div>
    </div>
  )
}
