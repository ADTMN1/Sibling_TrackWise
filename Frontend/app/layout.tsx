import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/AuthContext"
import { ProgressProvider } from "@/contexts/ProgressContext"
import { TimerProvider } from "@/contexts/TimerContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "EduPlatform - Smart Learning Experience",
  description:
    "AI-powered educational platform with smart timers, interactive quizzes, and personalized learning paths",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ProgressProvider>
            <TimerProvider>{children}</TimerProvider>
          </ProgressProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
