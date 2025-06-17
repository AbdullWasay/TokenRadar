"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { z } from "zod"

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Validate email
      forgotPasswordSchema.parse({ email })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Success
      setIsSuccess(true)
      toast({
        title: "Reset link sent",
        description: "Please check your email for password reset instructions.",
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors[0].message)
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to send reset link. Please try again.",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side with gradient background and logo */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-900 via-purple-800 to-purple-600 relative p-8 items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-gradient-to-r from-indigo-900 to-purple-700 rounded-2xl p-8 mb-12 shadow-lg">
            <h1 className="text-5xl font-bold text-white mb-4">Token Radar</h1>
            <div className="w-32 h-32 mx-auto">
              <Image
                src="/placeholder.svg?height=128&width=128"
                alt="Token Radar Logo"
                width={128}
                height={128}
                className="mx-auto"
              />
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-20 left-1/4 transform -translate-x-1/2">
            <div className="w-16 h-16 rounded-full border-2 border-white overflow-hidden">
              <Image src="/placeholder.svg?height=64&width=64" alt="Decorative" width={64} height={64} />
            </div>
          </div>
          <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2">
            <div className="w-16 h-16 rounded-full border-2 border-white overflow-hidden">
              <Image src="/placeholder.svg?height=64&width=64" alt="Decorative" width={64} height={64} />
            </div>
          </div>
          <div className="absolute bottom-20 right-1/4 transform translate-x-1/2">
            <div className="w-16 h-16 rounded-full border-2 border-white overflow-hidden">
              <Image src="/placeholder.svg?height=64&width=64" alt="Decorative" width={64} height={64} />
            </div>
          </div>

          {/* Connecting lines */}
          <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
            <path d="M200,500 Q300,450 400,500 Q500,550 600,500" stroke="#FF69B4" strokeWidth="3" fill="none" />
          </svg>
        </div>
      </div>

      {/* Right side with forgot password form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-4">Forgot Password</h2>
          <p className="text-center text-gray-600 mb-8">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {isSuccess ? (
            <div className="text-center space-y-6">
              <div className="bg-green-50 text-green-700 p-4 rounded-lg">
                <p>Reset link sent! Please check your email.</p>
              </div>
              <Link href="/login">
                <Button className="w-full h-12 bg-gradient-to-r from-indigo-800 to-purple-700 hover:from-indigo-700 hover:to-purple-600">
                  Return to Login
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError("")
                    }}
                    className={`h-12 ${error ? "border-red-500" : ""}`}
                  />
                  {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-indigo-800 to-purple-700 hover:from-indigo-700 hover:to-purple-600"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>

              <div className="text-center">
                <Link href="/login" className="text-sm text-purple-700 hover:underline">
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
