"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { BookOpen, User, Lock, ArrowRight, Star } from "lucide-react"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const success = await login(username, password)
      if (success) {
        router.push("/child/dashboard")
      } else {
        setError("Invalid username or password")
      }
    } catch (err) {
      setError("An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async (demoUsername: string, demoPassword: string) => {
    setIsLoading(true)
    setError("")

    try {
      const success = await login(demoUsername, demoPassword)
      if (success) {
        router.push("/child/dashboard")
      } else {
        setError("Demo login failed")
      }
    } catch (err) {
      setError("An error occurred during demo login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EduPlatform
              </span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Welcome Back to Your Learning Journey</h1>
            <p className="text-xl text-gray-600">
              Continue your personalized education experience with AI-powered learning, smart timers, and interactive
              content.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-gray-700">Smart study timers track your progress</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-gray-700">Interactive quizzes every 5 pages</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-gray-700">AI chatbot for instant help</span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Forms */}
        <div className="space-y-6">
          {/* Main Login Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
              <CardDescription>Enter your credentials to access your learning dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Demo Accounts */}
          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-lg">Try Demo Accounts</CardTitle>
              <CardDescription>Quick access to pre-configured student accounts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => handleDemoLogin("student1", "pass123")}
                disabled={isLoading}
                variant="outline"
                className="w-full justify-between bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-200"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm font-bold">JD</span>
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-blue-800">John Doe</div>
                    <div className="text-xs text-blue-600">Grade 5 • student1/pass123</div>
                  </div>
                </div>
                <Badge className="bg-blue-200 text-blue-800">Beginner</Badge>
              </Button>

              <Button
                onClick={() => handleDemoLogin("student2", "pass456")}
                disabled={isLoading}
                variant="outline"
                className="w-full justify-between bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200 hover:from-purple-100 hover:to-purple-200"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm font-bold">JS</span>
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-purple-800">Jane Smith</div>
                    <div className="text-xs text-purple-600">Grade 6 • student2/pass456</div>
                  </div>
                </div>
                <Badge className="bg-purple-200 text-purple-800">Intermediate</Badge>
              </Button>

              <Button
                onClick={() => handleDemoLogin("student3", "pass789")}
                disabled={isLoading}
                variant="outline"
                className="w-full justify-between bg-gradient-to-r from-green-50 to-green-100 border-green-200 hover:from-green-100 hover:to-green-200"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white text-sm font-bold">MJ</span>
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-green-800">Mike Johnson</div>
                    <div className="text-xs text-green-600">Grade 7 • student3/pass789</div>
                  </div>
                </div>
                <Badge className="bg-green-200 text-green-800">Advanced</Badge>
              </Button>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button variant="ghost" onClick={() => router.push("/")} className="text-gray-600 hover:text-gray-800">
              ← Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
