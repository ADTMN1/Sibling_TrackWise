"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useRef } from "react"

interface TimerContextType {
  currentSessionTime: number
  dailyTime: number
  isRunning: boolean
  startTimer: () => void
  pauseTimer: () => void
  resetDailyTimer: () => void
  formatTime: (seconds: number) => string
  isTimerActive: boolean
  setTimerActive: (active: boolean) => void
  startReadingTimer: () => void
  pauseReadingTimer: () => void
  isReadingMode: boolean
  setReadingMode: (reading: boolean) => void
}

const TimerContext = createContext<TimerContextType | undefined>(undefined)

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [currentSessionTime, setCurrentSessionTime] = useState(0)
  const [dailyTime, setDailyTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [isReadingMode, setIsReadingMode] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Load saved timer data
  useEffect(() => {
    try {
      const savedTimer = localStorage.getItem("timer")
      if (savedTimer) {
        const timerData = JSON.parse(savedTimer)
        const today = new Date().toDateString()
        if (timerData.date === today) {
          setDailyTime(timerData.dailyTime || 0)
        } else {
          setDailyTime(0)
        }
      }
    } catch (error) {
      console.error("Error loading timer data:", error)
      setDailyTime(0)
    }
  }, [])

  // Timer interval management
  useEffect(() => {
    if (isRunning && isTimerActive) {
      intervalRef.current = setInterval(() => {
        setCurrentSessionTime((prev) => prev + 1)
        setDailyTime((prev) => {
          const newDailyTime = prev + 1
          try {
            localStorage.setItem(
              "timer",
              JSON.stringify({
                date: new Date().toDateString(),
                dailyTime: newDailyTime,
              }),
            )
          } catch (error) {
            console.error("Error saving timer data:", error)
          }
          return newDailyTime
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isRunning, isTimerActive])

  // Auto-pause when leaving the page and auto-resume when returning
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isTimerActive) {
        // Page is hidden (user switched tabs or minimized), pause timer
        setIsRunning(false)
      } else if (!document.hidden && isTimerActive) {
        // Page is visible again, resume timer automatically
        setIsRunning(true)
      }
    }

    const handleBeforeUnload = () => {
      // Pause timer when leaving the page
      if (isRunning) {
        setIsRunning(false)
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [isTimerActive])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const startTimer = () => {
    setIsTimerActive(true)
    setIsRunning(true)
  }

  const pauseTimer = () => {
    setIsTimerActive(false)
    setIsRunning(false)
  }

  const startReadingTimer = () => {
    setIsReadingMode(true)
    setIsTimerActive(true)
    setIsRunning(true)
  }

  const pauseReadingTimer = () => {
    setIsReadingMode(false)
    setIsTimerActive(false)
    setIsRunning(false)
  }

  const resetDailyTimer = () => {
    setDailyTime(0)
    setCurrentSessionTime(0)
    try {
      localStorage.removeItem("timer")
    } catch (error) {
      console.error("Error removing timer data:", error)
    }
  }

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const setTimerActive = (active: boolean) => {
    setIsTimerActive(active)
    if (active) {
      setIsRunning(true)
    } else {
      setIsRunning(false)
    }
  }

  const setReadingMode = (reading: boolean) => {
    setIsReadingMode(reading)
    if (reading) {
      setIsTimerActive(true)
      setIsRunning(true)
    } else {
      setIsTimerActive(false)
      setIsRunning(false)
    }
  }

  return (
    <TimerContext.Provider
      value={{
        currentSessionTime,
        dailyTime,
        isRunning,
        startTimer,
        pauseTimer,
        resetDailyTimer,
        formatTime,
        isTimerActive,
        setTimerActive,
        startReadingTimer,
        pauseReadingTimer,
        isReadingMode,
        setReadingMode,
      }}
    >
      {children}
    </TimerContext.Provider>
  )
}

export const useTimer = () => {
  const context = useContext(TimerContext)
  if (context === undefined) {
    throw new Error("useTimer must be used within a TimerProvider")
  }
  return context
}
