"use client"

import { useRouter } from 'next/navigation'
import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import apiClient from './api'
import type { User } from './types'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string, confirmPassword: string, acceptTerms: boolean) => Promise<boolean>
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

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiClient.login({ email, password })
      if (response.success && response.user) {
        setUser(response.user)
        return true
      }
      return false
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  }

  const signup = async (
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
    acceptTerms: boolean
  ): Promise<boolean> => {
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
        return true
      }
      return false
    } catch (error) {
      console.error('Signup failed:', error)
      return false
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


