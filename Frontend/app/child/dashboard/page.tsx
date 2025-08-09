"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen, Clock, Target, TrendingUp, Award, Calendar, ChevronRight, Play, BarChart3 } from 'lucide-react'
import Link from "next/link"

interface DashboardStats {
  totalSubjects: number
  completedChapters: number
  totalChapters: number
  averageScore: number
  studyStreak: number
  totalStudyTime: number
  weeklyProgress: number
  upcomingTests: number
}

// Mock user data
const mockUser = {
  name: "Alex"
}

// Mock progress data
const mockSubjectProgress = {
  math: { totalChapters: 10, completedChapters: 7, averageScore: 85 },
  science: { totalChapters: 10, completedChapters: 5, averageScore: 92 },
  english: { totalChapters: 10, completedChapters: 8, averageScore: 78 },
  history: { totalChapters: 10, completedChapters: 6, averageScore: 88 }
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  // Mock functions
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getSubjectProgress = (subjectId: string) => {
    return mockSubjectProgress[subjectId as keyof typeof mockSubjectProgress] || { totalChapters: 10, completedChapters: 0, averageScore: 0 }
  }

  const getCompletedChapters = (subjectId: string) => {
    const progress = getSubjectProgress(subjectId)
    return Array.from({ length: progress.completedChapters }, (_, i) => `Chapter ${i + 1}`)
  }

  useEffect(() => {
    const calculateStats = () => {
      const subjects = ["math", "science", "english", "history"]
      let totalChapters = 0
      let completedChapters = 0
      let totalScore = 0
      let subjectsWithScores = 0

      subjects.forEach((subjectId) => {
        const progress = getSubjectProgress(subjectId)
        totalChapters += progress.totalChapters
        completedChapters += progress.completedChapters
        if (progress.averageScore > 0) {
          totalScore += progress.averageScore
          subjectsWithScores++
        }
      })

      const overallProgress = completedChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0

      setStats({
        totalSubjects: subjects.length,
        completedChapters,
        totalChapters,
        averageScore: subjectsWithScores > 0 ? Math.round(totalScore / subjectsWithScores) : 0,
        studyStreak: 7,
        totalStudyTime: 7245, // 2 hours, 45 seconds in seconds
        weeklyProgress: overallProgress,
        upcomingTests: 3,
      })
      setLoading(false)
    }

    // Simulate loading delay
    setTimeout(calculateStats, 1000)
  }, [])

  const subjects = [
    {
      id: "math",
      name: "Mathematics",
      icon: "📊",
      gradient: "from-[#B5EEDC] via-[#A2E7C9] to-[#89E1B8]",
      bgGradient: "bg-[#D3F8EC]",
    },
    {
      id: "science",
      name: "Science",
      icon: "🔬",
      gradient: "from-[#7DD3FC] via-[#38BDF8] to-[#0EA5E9]",
      bgGradient: "from-[#E0F2FE] to-[#F0F9FF]",
      borderColor: "border-[#BAE6FD]",
    },
    {
      id: "english",
      name: "English",
      icon: "📚",
      gradient: "from-[#D2B48C] via-[#F3E5AB] to-[#FFF8E1]",
      bgGradient: "from-[#FDF7EE] to-[#F6EFE2]",
      borderColor: "border-[#E7D9C5]",
    },
    {
      id: "history",
      name: "History",
      icon: "🏛️",
      gradient: "from-[#a7a2a9] via-[#c6b8ae] to-[#f1e9e5]",
      bgGradient: "from-[#F9F7F8] to-[#EFE9ED]",
      borderColor: "border-[#DDD6D9]",
    },
  ]

  const getSubjectProgressPercent = (subjectId: string) => {
    const progress = getSubjectProgress(subjectId)
    return progress.totalChapters > 0 ? Math.round((progress.completedChapters / progress.totalChapters) * 100) : 0
  }

  const recentActivities = [
    {
      type: "completed",
      subject: "Mathematics",
      chapter: "Algebra Basics",
      score: 95,
      time: "2 hours ago",
      icon: BookOpen,
      color: "text-[#FF8A6B]",
      bgColor: "bg-[#FFF5F3]",
    },
    {
      type: "started",
      subject: "Science",
      chapter: "Physics Laws",
      time: "4 hours ago",
      icon: Play,
      color: "text-[#FF8A6B]",
      bgColor: "bg-[#FFF5F3]",
    },
    {
      type: "achievement",
      title: "Study Streak",
      description: "7 days in a row!",
      time: "1 day ago",
      icon: Award,
      color: "text-[#FF8A6B]",
      bgColor: "bg-[#FFF5F3]",
    },
  ]

  const upcomingLessons = [
    {
      subject: "Mathematics",
      chapter: "Geometry Fundamentals",
      difficulty: "Medium",
      estimatedTime: "45 min",
      color: "bg-[#FF8A6B]",
      textColor: "text-[#2D3748]",
      bgColor: "bg-[#FEFEFE]",
    },
    {
      subject: "Science",
      chapter: "Chemical Reactions",
      difficulty: "Hard",
      estimatedTime: "60 min",
      color: "bg-[#FF8A6B]",
      textColor: "text-[#2D3748]",
      bgColor: "bg-[#FEFEFE]",
    },
    {
      subject: "English",
      chapter: "Essay Writing",
      difficulty: "Easy",
      estimatedTime: "30 min",
      color: "bg-[#FF8A6B]",
      textColor: "text-[#2D3748]",
      bgColor: "bg-[#FEFEFE]",
    },
  ]

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-6 md:space-y-8 content-area bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9]">
        <div className="space-y-3">
          <Skeleton className="h-10 w-64 md:w-80 bg-[#E5E7EB] rounded-xl" />
          <Skeleton className="h-6 w-full max-w-md bg-[#E5E7EB] rounded-xl" />
        </div>
        <div className="grid gap-4 md:gap-6 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 md:h-40 bg-[#E5E7EB] rounded-2xl shadow-lg" />
          ))}
        </div>
        <div className="grid gap-4 md:gap-8 grid-cols-1 md:grid-cols-2">
          <Skeleton className="h-64 md:h-96 bg-[#E5E7EB] rounded-2xl shadow-lg" />
          <Skeleton className="h-64 md:h-96 bg-[#E5E7EB] rounded-2xl shadow-lg" />
        </div>
        <Skeleton className="h-64 md:h-80 bg-[#E5E7EB] rounded-2xl shadow-lg" />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8 content-area bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9]">
      {/* Header */}
      <div className="space-y-2 md:space-y-3">
        <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-[#4B5563] via-[#F97316] to-[#FDBA74] bg-clip-text text-transparent">
          Welcome back, {mockUser.name}!
        </h1>
        <p className="text-[#718096] text-base md:text-lg">
          Here's your learning progress and upcoming activities.
        </p>
      </div>

      {/* Stats Cards - Adjusted for mobile */}
      <div className="grid gap-3 md:gap-6 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
        {/* Chapters Completed */}
        <Card className="bg-[#E8FDEF] text-[#1E293B] rounded-xl md:rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 md:pb-3">
            <CardTitle className="text-sm md:text-base font-semibold text-[#5A3E2B]">Chapters</CardTitle>
            <div className="p-2 md:p-3 bg-[#FF9A7A]/15 rounded-lg md:rounded-xl">
              <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-[#FF9A7A]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-4xl font-bold mb-1 text-[#5A3E2B]">{stats?.completedChapters}/{stats?.totalChapters}</div>
            <p className="text-xs md:text-sm text-[#7E6653]">{stats?.totalChapters ? Math.round((stats.completedChapters / stats.totalChapters) * 100) : 0}% complete</p>
          </CardContent>
        </Card>

        {/* Study Time Today */}
        <Card className="bg-gradient-to-br from-[#E0F2FE] to-[#F0F9FF] text-[#1E293B] rounded-xl md:rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-[#BAE6FD]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 md:pb-3">
            <CardTitle className="text-sm md:text-base font-semibold text-[#334155]">Study Time</CardTitle>
            <div className="p-2 md:p-3 bg-[#38BDF8]/15 rounded-lg md:rounded-xl">
              <Clock className="h-5 w-5 md:h-6 md:w-6 text-[#38BDF8]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-4xl font-bold mb-1 text-[#0F172A]">{formatTime(stats?.totalStudyTime || 0)}</div>
            <p className="text-xs md:text-sm text-[#475569]"><span className="text-[#38BDF8] font-semibold">+12%</span> from yesterday</p>
          </CardContent>
        </Card>

        {/* Average Score */}
        <Card className="bg-[#FEFBD9] text-[#1E293B] rounded-xl md:rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-[#E7D9C5]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 md:pb-3">
            <CardTitle className="text-sm md:text-base font-semibold text-[#6B5B3E]">Avg Score</CardTitle>
            <div className="p-2 md:p-3 bg-[#D2B48C]/15 rounded-lg md:rounded-xl">
              <Target className="h-5 w-5 md:h-6 md:w-6 text-[#D2B48C]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-4xl font-bold mb-1 text-[#6B5B3E]">{stats?.averageScore || 0}%</div>
            <p className="text-xs md:text-sm text-[#8C7B58]"><span className="text-[#D2B48C] font-semibold">+5%</span> from last week</p>
          </CardContent>
        </Card>

        {/* Study Streak */}
        <Card className="bg-[#F4F0F2] text-[#1E293B] rounded-xl md:rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-[#DDD6D9]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 md:pb-3">
            <CardTitle className="text-sm md:text-base font-semibold text-[#7B727B]">Streak</CardTitle>
            <div className="p-2 md:p-3 bg-[#a7a2a9]/15 rounded-lg md:rounded-xl">
              <Award className="h-5 w-5 md:h-6 md:w-6 text-[#a7a2a9]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl md:text-4xl font-bold mb-1 text-[#7B727B]">{stats?.studyStreak || 0} days</div>
            <p className="text-xs md:text-sm text-[#9E959E]">Keep it up!</p>
          </CardContent>
        </Card>
      </div>

      {/* Subjects Grid */}
      <div className="space-y-4 md:space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1F2937]">Your Subjects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {subjects.map((subject) => {
            const progress = getSubjectProgressPercent(subject.id)
            const completedChapters = getCompletedChapters(subject.id).length
            return (
              <Card
                key={subject.id}
                className={`bg-gradient-to-br ${subject.bgGradient} ${subject.borderColor} rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer`}
              >
                <CardHeader className="pb-3 md:pb-4">
                  <div className={`w-12 h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-gradient-to-br ${subject.gradient} flex items-center justify-center text-white text-xl md:text-2xl mb-3 md:mb-4 shadow-md`}>
                    {subject.icon}
                  </div>
                  <CardTitle className="text-lg md:text-xl text-[#1F2937] font-bold">{subject.name}</CardTitle>
                  <CardDescription className="text-[#64748B] text-sm md:text-base">{completedChapters}/10 chapters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 md:space-y-5">
                  <div className="space-y-2 md:space-y-3">
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="text-[#64748B] font-medium">Progress</span>
                      <span className="font-semibold text-[#1F2937]">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-[#E2E8F0] rounded-full h-2 md:h-3">
                      <div
                        className={`h-2 md:h-3 rounded-full transition-all duration-500 shadow-sm bg-gradient-to-r ${subject.gradient}`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <Link href={`/child/subjects/${subject.id}`}>
                    <Button className={`w-full text-white font-semibold py-2 md:py-3 rounded-lg md:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] bg-gradient-to-r ${subject.gradient} hover:opacity-90 text-sm md:text-base`}>
                      Continue
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:gap-8 grid-cols-1 md:grid-cols-2">
        {/* Recent Activity */}
        <Card className="bg-[#FEFEFE] border-[#E2E8F0] rounded-xl md:rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 md:gap-3 text-xl md:text-2xl font-bold text-[#1F2937]">
              <div className="p-2 md:p-3 bg-[#F1F5F9] rounded-lg md:rounded-xl">
                <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-[#FF8A6B]" />
              </div>
              Recent Activity
            </CardTitle>
            <CardDescription className="text-[#64748B] text-sm md:text-base">Your latest learning activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-5">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 md:space-x-4 p-3 md:p-4 rounded-lg md:rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-all duration-200 border border-[#E2E8F0] shadow-sm">
                <div className="p-2 md:p-3 rounded-lg md:rounded-xl bg-[#FFF5F3]">
                  <activity.icon className="h-5 w-5 md:h-6 md:w-6 text-[#FF8A6B]" />
                </div>
                <div className="flex-1 min-w-0">
                  {activity.type === "completed" && (
                    <>
                      <p className="text-sm md:text-base font-semibold text-[#1F2937]">
                        Completed {activity.chapter} in {activity.subject}
                      </p>
                      <div className="flex items-center gap-2 md:gap-3 mt-1 md:mt-2">
                        <Badge className="text-xs bg-[#FFF5F3] text-[#FF8A6B] border-[#FFE5E0] font-medium px-2 py-0.5 md:px-2.5 md:py-1 rounded-md">
                          Score: {activity.score}%
                        </Badge>
                        <span className="text-xs text-[#64748B]">{activity.time}</span>
                      </div>
                    </>
                  )}
                  {activity.type === "started" && (
                    <>
                      <p className="text-sm md:text-base font-semibold text-[#1F2937]">
                        Started {activity.chapter} in {activity.subject}
                      </p>
                      <p className="text-xs text-[#64748B] mt-1">{activity.time}</p>
                    </>
                  )}
                  {activity.type === "achievement" && (
                    <>
                      <p className="text-sm md:text-base font-semibold text-[#1F2937]">{activity.title}</p>
                      <p className="text-xs md:text-sm text-[#64748B]">{activity.description}</p>
                      <p className="text-xs text-[#64748B] mt-1">{activity.time}</p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Lessons */}
        <Card className="bg-[#FEFEFE] border-[#E2E8F0] rounded-xl md:rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 md:gap-3 text-xl md:text-2xl font-bold text-[#1F2937]">
              <div className="p-2 md:p-3 bg-[#F1F5F9] rounded-lg md:rounded-xl">
                <Calendar className="h-5 w-5 md:h-6 md:w-6 text-[#FF8A6B]" />
              </div>
              Upcoming Lessons
            </CardTitle>
            <CardDescription className="text-[#64748B] text-sm md:text-base">Continue your learning journey</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-5">
            {upcomingLessons.map((lesson, index) => (
              <div key={index} className="flex items-center space-x-3 md:space-x-4 p-3 md:p-4 rounded-lg md:rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-all duration-200 cursor-pointer border border-[#E2E8F0] shadow-sm">
                <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#FF8A6B] shadow-sm"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm md:text-base font-semibold text-[#1F2937] truncate">{lesson.chapter}</p>
                  <p className="text-xs md:text-sm text-[#64748B]">{lesson.subject}</p>
                  <div className="flex items-center gap-2 md:gap-3 mt-1 md:mt-2">
                    <Badge className="text-xs bg-[#FFF5F3] text-[#FF8A6B] border-[#FFE5E0] font-medium px-2 py-0.5 md:px-2.5 md:py-1 rounded-md">{lesson.difficulty}</Badge>
                    <span className="text-xs text-[#64748B]">{lesson.estimatedTime}</span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 md:h-6 md:w-6 text-[#FF8A6B]" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress */}
      <Card className="bg-white border-[#E5E7EB] rounded-xl md:rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 md:gap-3 text-xl md:text-2xl font-bold text-[#2D3748]">
            <div className="p-2 md:p-3 bg-[#F7FAFC] rounded-lg md:rounded-xl">
              <BarChart3 className="h-5 w-5 md:h-6 md:w-6 text-[#FF8A6B]" />
            </div>
            Weekly Progress
          </CardTitle>
          <CardDescription className="text-[#718096] text-sm md:text-base">Your learning progress this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 md:space-y-8">
            <div className="space-y-2 md:space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm md:text-base font-medium text-[#718096]">Overall Progress</span>
                <span className="text-xl md:text-2xl font-bold text-[#2D3748]">{stats?.weeklyProgress || 0}%</span>
              </div>
              <div className="w-full bg-[#E5E7EB] rounded-full h-3 md:h-4">
                <div
                  className="h-3 md:h-4 rounded-full bg-gradient-to-r from-[#FF9A7A] via-[#FFB399] to-[#FFCCB8] transition-all duration-500 shadow-sm"
                  style={{ width: `${stats?.weeklyProgress || 0}%` }}
                ></div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
              <div className="text-center p-3 md:p-5 bg-[#F7FAFC] rounded-lg md:rounded-xl border border-[#E5E7EB] shadow-sm">
                <div className="text-xl md:text-3xl font-bold text-[#2D3748]">4</div>
                <div className="text-xs md:text-sm text-[#718096] font-medium">Subjects</div>
              </div>
              <div className="text-center p-3 md:p-5 bg-[#F7FAFC] rounded-lg md:rounded-xl border border-[#E5E7EB] shadow-sm">
                <div className="text-xl md:text-3xl font-bold text-[#2D3748]">{stats?.completedChapters || 0}</div>
                <div className="text-xs md:text-sm text-[#718096] font-medium">Lessons</div>
              </div>
              <div className="text-center p-3 md:p-5 bg-[#F7FAFC] rounded-lg md:rounded-xl border border-[#E5E7EB] shadow-sm">
                <div className="text-xl md:text-3xl font-bold text-[#2D3748]">3</div>
                <div className="text-xs md:text-sm text-[#718096] font-medium">Tests</div>
              </div>
              <div className="text-center p-3 md:p-5 bg-[#F7FAFC] rounded-lg md:rounded-xl border border-[#E5E7EB] shadow-sm">
                <div className="text-xl md:text-3xl font-bold text-[#2D3748]">7</div>
                <div className="text-xs md:text-sm text-[#718096] font-medium">Day Streak</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}