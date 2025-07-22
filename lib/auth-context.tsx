"use client"

import { useRouter } from 'next/navigation'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import apiClient from './api'
import type { User } from './types'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  signup: (name: string, email: string, password: string, confirmPassword: string, acceptTerms: boolean) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  checkAuth: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      if (apiClient.isAuthenticated()) {
        const response = await apiClient.getCurrentUser()
        if (response.success && response.user) {
          setUser(response.user)
        } else {
          // Token is invalid, remove it
          apiClient.logout()
          setUser(null)
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      apiClient.logout()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await apiClient.login({ email, password })
      if (response.success && response.user) {
        setUser(response.user)
        return { success: true }
      }
      return { success: false, message: response.message || 'Invalid email or password' }
    } catch (error) {
      console.error('Login failed:', error)
      return { success: false, message: error instanceof Error ? error.message : 'Network error occurred' }
    }
  }

  const signup = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
    acceptTerms: boolean
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await apiClient.signup({
        name,
        email,
        password,
        confirmPassword,
        acceptTerms
      })
      if (response.success && response.user) {
        setUser(response.user)
        return { success: true }
      }
      return { success: false, message: response.message || 'Signup failed' }
    } catch (error) {
      console.error('Signup failed:', error)
      return { success: false, message: error instanceof Error ? error.message : 'Network error occurred' }
    }
  }

  const logout = () => {
    apiClient.logout()
    setUser(null)
    router.push('/login')
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    logout,
    checkAuth,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}


