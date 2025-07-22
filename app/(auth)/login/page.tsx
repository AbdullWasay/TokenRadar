"use client"

import type React from "react"

import Footer from "@/components/footer"
import Navbar from "@/components/landing-navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/lib/auth-context"
import { Eye, EyeOff, Facebook, Github, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { FcGoogle } from "react-icons/fc"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export default function LoginPage() {
  const { login, user } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState<string>('')
  const router = useRouter()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear errors when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }

    // Clear login error when user types
    if (loginError) {
      setLoginError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    setLoginError('')

    try {
      // Validate form data
      loginSchema.parse(formData)

      // Call login function from auth context
      const result = await login(formData.email, formData.password)

      if (result.success) {
        // Get user data from auth context after successful login
        await new Promise(resolve => setTimeout(resolve, 100)) // Small delay to ensure auth context is updated

        // Check user subscription status from auth context
        const currentUser = user // This should be updated by the login function
        const isPremium = currentUser?.subscriptionStatus === 'premium'

        // Redirect based on subscription status
        router.push(isPremium ? "/dashboard" : "/all-tokens")
      } else {
        // Login failed - show simple error message
        setLoginError(result.message || "Invalid email or password. Please try again.")
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
        setLoginError("An error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex pt-4 pb-8">
      {/* Left side with gradient background and logo */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-900 via-purple-800 to-purple-600 relative p-8 items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-gradient-to-r from-indigo-900 to-purple-700 rounded-2xl p-8 mb-12 shadow-lg">
            <h1 className="text-5xl font-bold text-white mb-4">Token Radar</h1>
            <div className="w-32 h-32 mx-auto">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle cx="100" cy="100" r="80" fill="#6366F1" opacity="0.8" />
                <circle cx="100" cy="100" r="60" fill="#8B5CF6" opacity="0.8" />
                <circle cx="100" cy="100" r="40" fill="#D946EF" opacity="0.8" />
                <circle cx="100" cy="100" r="20" fill="#EC4899" opacity="0.8" />
              </svg>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-20 left-1/4 transform -translate-x-1/2">
            <div className="w-16 h-16 rounded-full border-2 border-white overflow-hidden flex items-center justify-center bg-indigo-600">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-white">
                <path
                  fill="currentColor"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z"
                />
              </svg>
            </div>
          </div>
          <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2">
            <div className="w-16 h-16 rounded-full border-2 border-white overflow-hidden flex items-center justify-center bg-purple-600">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-white">
                <path
                  fill="currentColor"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                />
              </svg>
            </div>
          </div>
          <div className="absolute bottom-20 right-1/4 transform translate-x-1/2">
            <div className="w-16 h-16 rounded-full border-2 border-white overflow-hidden flex items-center justify-center bg-pink-600">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-white">
                <path
                  fill="currentColor"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
                />
              </svg>
            </div>
          </div>

          {/* Connecting lines */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
            <path d="M200,500 Q300,450 400,500 Q500,550 600,500" stroke="#FF69B4" strokeWidth="3" fill="none" />
          </svg>
        </div>
      </div>

      {/* Right side with login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8 bg-white">
        <div className="w-full max-w-md mt-4">
          <h2 className="text-3xl font-bold text-center mb-8">Log in</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="text"
                  placeholder="Email or Mobile Number"
                  value={formData.email}
                  onChange={handleChange}
                  className={`h-12 ${errors.email ? "border-red-500" : ""}`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`h-12 pr-10 ${errors.password ? "border-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>
            </div>

            {/* Login Error Message */}
            {loginError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-600 text-sm font-medium">❌ {loginError}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>

            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-indigo-600 hover:underline">
                Forgot password
              </Link>
            </div>
          </form>

          <div className="mt-8">
            <div className="flex items-center justify-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="px-4 text-sm text-gray-500">or continue with</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4">
              <Button variant="outline" className="h-12">
                <FcGoogle className="h-5 w-5" />
              </Button>
              <Button variant="outline" className="h-12">
                <Facebook className="h-5 w-5 text-blue-600" />
              </Button>
              <Button variant="outline" className="h-12">
                <Github className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/signup" className="text-indigo-600 hover:underline font-medium">
                Join us
              </Link>
            </p>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  )
}
