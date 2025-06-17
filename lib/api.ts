import type { AuthResponse, LoginRequest, SignupRequest } from './types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

class ApiClient {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}/api${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    // Add auth token if available
    const token = this.getToken()
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      // For authentication endpoints, return the response even if not ok
      // This allows us to handle error messages properly in the UI
      if (!response.ok && (endpoint === '/auth/login' || endpoint === '/auth/signup')) {
        return {
          success: false,
          message: data.message || `HTTP error! status: ${response.status}`,
          ...data
        }
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('API request failed:', error)

      // For authentication endpoints, return a structured error response
      if (endpoint === '/auth/login' || endpoint === '/auth/signup') {
        return {
          success: false,
          message: error instanceof Error ? error.message : 'Network error occurred'
        }
      }

      throw error
    }
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('auth_token')
  }

  private setToken(token: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem('auth_token', token)
  }

  private removeToken(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem('auth_token')
  }

  // Authentication methods
  async signup(data: SignupRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    if (response.success && response.token) {
      this.setToken(response.token)
    }

    return response
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    if (response.success && response.token) {
      this.setToken(response.token)
    }

    return response
  }

  async getCurrentUser(): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/me', {
      method: 'GET',
    })
  }

  async updateProfile(data: { name: string; email: string }): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  logout(): void {
    this.removeToken()
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

// Create a singleton instance
const apiClient = new ApiClient()

export default apiClient
