"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  username: string
  grade: string
  name: string
  email?: string
  role?: string
    avatar?: string;

}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  updateProfile: (data: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// ⚠️ Replace this mockUsers with real backend API calls
const mockUsers = [
  {
    id: "1",
    username: "student1",
    password: "pass123", // only for mock validation, NEVER store password in state/localStorage
    grade: "5",
    name: "John Doe",
    email: "john@example.com",
    role: "child",
  },
  {
    id: "2",
    username: "student2",
    password: "pass456",
    grade: "6",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "child",
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        if (parsedUser && parsedUser.id) {
          setUser(parsedUser)
          setIsAuthenticated(true)
        }
      }
    } catch (error) {
      console.error("Error loading user from storage:", error)
      localStorage.removeItem("user")
    } finally {
      setLoading(false)
    }
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    // In real app, call backend API here
    const foundUser = mockUsers.find(
      (u) => u.username === username && u.password === password
    )
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      setIsAuthenticated(true)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("user")
  }

  const updateProfile = (data: Partial<User>) => {
    if (!user) return
    const updatedUser = { ...user, ...data }
    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
