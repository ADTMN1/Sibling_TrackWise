"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  username: string
  grade: string
  name: string
  avatar?: string
  email?: string
  password?: string
  role?: string
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  updateProfile: (data: Partial<User>) => void
  updatePassword: (currentPassword: string, newPassword: string) => Promise<boolean>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user data
const mockUsers = [
  {
    id: "1",
    username: "student1",
    password: "pass123",
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
  {
    id: "3",
    username: "student3",
    password: "pass789",
    grade: "7",
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "child",
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user")
      if (savedUser) {
        const userData = JSON.parse(savedUser)
        if (userData && userData.id) {
          setUser(userData)
          setIsAuthenticated(true)
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error)
      try {
        localStorage.removeItem("user")
      } catch (e) {
        console.error("Error removing corrupted user data:", e)
      }
    }
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const foundUser = mockUsers.find((u) => u.username === username && u.password === password)
      if (foundUser) {
        const userData = {
          id: foundUser.id,
          username: foundUser.username,
          grade: foundUser.grade,
          name: foundUser.name,
          email: foundUser.email,
          password: foundUser.password,
          role: foundUser.role,
        }
        setUser(userData)
        setIsAuthenticated(true)
        try {
          localStorage.setItem("user", JSON.stringify(userData))
        } catch (error) {
          console.error("Error saving user data:", error)
        }
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    try {
      localStorage.removeItem("user")
      localStorage.removeItem("progress")
      localStorage.removeItem("timer")
    } catch (error) {
      console.error("Error clearing user data:", error)
    }
  }

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      try {
        const updatedUser = { ...user, ...data }
        setUser(updatedUser)
        localStorage.setItem("user", JSON.stringify(updatedUser))
      } catch (error) {
        console.error("Error updating user data:", error)
      }
    }
  }

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (user && user.password === currentPassword) {
      try {
        const updatedUser = { ...user, password: newPassword }
        setUser(updatedUser)
        localStorage.setItem("user", JSON.stringify(updatedUser))
        return true
      } catch (error) {
        console.error("Error updating password:", error)
        return false
      }
    }
    return false
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, updatePassword, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
