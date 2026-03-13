'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import api from '@/lib/api'

export interface User {
  id: string
  name: string
  company: string
  unique_key: string
  is_demo_user: boolean
  created_at: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isDemo: boolean
  login: (token: string, user: User) => void
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isDemo = user?.is_demo_user ?? false

  const login = useCallback((t: string, u: User) => {
    setToken(t)
    setUser(u)
    localStorage.setItem('relay_token', t)
    localStorage.setItem('relay_user', JSON.stringify(u))
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('relay_token')
    localStorage.removeItem('relay_user')
    window.location.href = '/'
  }, [])

  const refreshUser = useCallback(async () => {
    try {
      const res = await api.get('/users/me')
      setUser(res.data)
      localStorage.setItem('relay_user', JSON.stringify(res.data))
    } catch {
      // silent fail
    }
  }, [])

  useEffect(() => {
    const storedToken = localStorage.getItem('relay_token')
    const storedUser = localStorage.getItem('relay_user')

    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem('relay_token')
        localStorage.removeItem('relay_user')
      }
    }
    setIsLoading(false)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, isLoading, isDemo, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
