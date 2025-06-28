"use client"

import apiClient from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import type React from "react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Upload } from "lucide-react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { z } from "zod"

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onProfileUpdate?: (profile: { name: string; email: string; profileImage?: string }) => void
  profile: {
    name: string
    email: string
    image: string
  }
}

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
})

export default function EditProfileModal({ isOpen, onClose, onProfileUpdate, profile }: EditProfileModalProps) {
  const { user, checkAuth } = useAuth()
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [profileImage, setProfileImage] = useState<string>(profile.image || "")
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Update form data when profile changes
  useEffect(() => {
    setFormData({
      name: profile.name,
      email: profile.email,
    })
    setProfileImage(profile.image || "")
  }, [profile.name, profile.email, profile.image])

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setUploadingImage(true)

      // Upload to Cloudinary via API
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload image')
      }

      const data = await response.json()
      setProfileImage(data.url)

      toast({
        title: "Success!",
        description: "Profile image updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      })
    } finally {
      setUploadingImage(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    try {
      // Validate form data
      profileSchema.parse(formData)

      // Call update profile API with image
      const response = await apiClient.updateProfile({
        ...formData,
        profileImage: profileImage
      })

      if (response.success) {
        // Update auth context with new user data
        await checkAuth()

        // Call profile update callback
        if (onProfileUpdate) {
          onProfileUpdate({
            name: formData.name,
            email: formData.email,
            profileImage: profileImage
          })
        }

        // Success
        toast({
          title: "Profile updated successfully",
          description: "Your profile information has been updated.",
        })

        onClose()
      } else {
        toast({
          variant: "destructive",
          title: "Failed to update profile",
          description: response.message || "There was an error updating your profile. Please try again.",
        })
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(newErrors)
      } else {
        toast({
          variant: "destructive",
          title: "Failed to update profile",
          description: error.message || "There was an error updating your profile. Please try again.",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>Update your profile information.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-yellow-400 overflow-hidden">
                  {profileImage ? (
                    <Image
                      src={profileImage}
                      alt="Profile"
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">
                        {profile.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                </div>
                <Button
                  size="sm"
                  className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0 bg-indigo-700"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  type="button"
                >
                  {uploadingImage ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Upload size={16} />
                  )}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-indigo-700">
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
