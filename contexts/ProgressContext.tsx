"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface ChapterProgress {
  id: string
  completed: boolean
  currentPage: number
  totalPages: number
  completedQuizzes: { [pageNumber: number]: boolean }
  quizScores: { [pageNumber: number]: number }
  testCompleted: boolean
  testScore?: number
  testAttempts: number
  timeSpent: number
  lastAccessed: Date
}

interface SubjectProgress {
  [chapterId: string]: ChapterProgress
}

interface Progress {
  [subjectId: string]: SubjectProgress
}

interface SubjectStats {
  totalChapters: number
  completedChapters: number
  averageScore: number
  totalTimeSpent: number
}

interface ProgressContextType {
  progress: Progress
  updateChapterProgress: (subjectId: string, chapterId: string, updates: Partial<ChapterProgress>) => void
  getChapterProgress: (subjectId: string, chapterId: string) => ChapterProgress
  isChapterUnlocked: (subjectId: string, chapterId: string) => boolean
  getCompletedChapters: (subjectId: string) => string[]
  getSubjectProgress: (subjectId: string) => SubjectStats
  getOverallProgress: () => number
  resetProgress: () => void
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<Progress>({})

  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem("progress")
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress))
      }
    } catch (error) {
      console.error("Error loading progress data:", error)
      setProgress({})
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem("progress", JSON.stringify(progress))
    } catch (error) {
      console.error("Error saving progress data:", error)
    }
  }, [progress])

  const updateChapterProgress = (subjectId: string, chapterId: string, updates: Partial<ChapterProgress>) => {
    try {
      setProgress((prev) => {
        const currentChapter = getChapterProgress(subjectId, chapterId)
        return {
          ...prev,
          [subjectId]: {
            ...prev[subjectId],
            [chapterId]: {
              ...currentChapter,
              ...updates,
              lastAccessed: new Date(),
            },
          },
        }
      })
    } catch (error) {
      console.error("Error updating chapter progress:", error)
    }
  }

  const getChapterProgress = (subjectId: string, chapterId: string): ChapterProgress => {
    try {
      const subjectProgress = progress[subjectId]
      const chapterProgress = subjectProgress?.[chapterId]

      return (
        chapterProgress || {
          id: chapterId,
          completed: false,
          currentPage: 1,
          totalPages: 20,
          completedQuizzes: {},
          quizScores: {},
          testCompleted: false,
          testAttempts: 0,
          timeSpent: 0,
          lastAccessed: new Date(),
        }
      )
    } catch (error) {
      console.error("Error getting chapter progress:", error)
      return {
        id: chapterId,
        completed: false,
        currentPage: 1,
        totalPages: 20,
        completedQuizzes: {},
        quizScores: {},
        testCompleted: false,
        testAttempts: 0,
        timeSpent: 0,
        lastAccessed: new Date(),
      }
    }
  }

  const isChapterUnlocked = (subjectId: string, chapterId: string): boolean => {
    const chapterNum = Number.parseInt(chapterId.replace("chapter-", ""))

    // First chapter is always unlocked
    if (chapterNum === 1) return true

    // For chapters 6-10 (semester 2), check if first semester is complete
    if (chapterNum >= 6) {
      const semester1Complete = [1, 2, 3, 4, 5].every((num) => {
        const prevChapterId = `chapter-${num}`
        const prevChapter = getChapterProgress(subjectId, prevChapterId)
        return prevChapter.completed && prevChapter.testCompleted && (prevChapter.testScore || 0) >= 80
      })

      if (!semester1Complete) return false
    }

    // Check if previous chapter is completed with passing test score
    const prevChapterId = `chapter-${chapterNum - 1}`
    const prevChapter = getChapterProgress(subjectId, prevChapterId)
    return prevChapter.completed && prevChapter.testCompleted && (prevChapter.testScore || 0) >= 80
  }

  const getCompletedChapters = (subjectId: string): string[] => {
    const subjectProgress = progress[subjectId] || {}
    return Object.keys(subjectProgress).filter((chapterId) => subjectProgress[chapterId].completed)
  }

  const getSubjectProgress = (subjectId: string): SubjectStats => {
    try {
      const subjectProgress = progress[subjectId] || {}
      const chapters = Object.values(subjectProgress)

      // Assuming 10 chapters per subject as default
      const totalChapters = 10
      const completedChapters = chapters.filter((chapter) => chapter.completed).length

      // Calculate average score from completed tests
      const completedTests = chapters.filter((chapter) => chapter.testCompleted && chapter.testScore)
      const averageScore =
        completedTests.length > 0
          ? Math.round(
              completedTests.reduce((sum, chapter) => sum + (chapter.testScore || 0), 0) / completedTests.length,
            )
          : 0

      // Calculate total time spent
      const totalTimeSpent = chapters.reduce((sum, chapter) => sum + chapter.timeSpent, 0)

      return {
        totalChapters,
        completedChapters,
        averageScore,
        totalTimeSpent,
      }
    } catch (error) {
      console.error("Error getting subject progress:", error)
      return {
        totalChapters: 10,
        completedChapters: 0,
        averageScore: 0,
        totalTimeSpent: 0,
      }
    }
  }

  const getOverallProgress = (): number => {
    try {
      const subjects = ["math", "science", "english", "history"]
      let totalChapters = 0
      let completedChapters = 0

      subjects.forEach((subjectId) => {
        const subjectStats = getSubjectProgress(subjectId)
        totalChapters += subjectStats.totalChapters
        completedChapters += subjectStats.completedChapters
      })

      return totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0
    } catch (error) {
      console.error("Error getting overall progress:", error)
      return 0
    }
  }

  const resetProgress = () => {
    setProgress({})
    try {
      localStorage.removeItem("progress")
    } catch (error) {
      console.error("Error resetting progress:", error)
    }
  }

  return (
    <ProgressContext.Provider
      value={{
        progress,
        updateChapterProgress,
        getChapterProgress,
        isChapterUnlocked,
        getCompletedChapters,
        getSubjectProgress,
        getOverallProgress,
        resetProgress,
      }}
    >
      {children}
    </ProgressContext.Provider>
  )
}

export const useProgress = () => {
  const context = useContext(ProgressContext)
  if (context === undefined) {
    throw new Error("useProgress must be used within a ProgressProvider")
  }
  return context
}
