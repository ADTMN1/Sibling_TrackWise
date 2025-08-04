"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useProgress } from "@/contexts/ProgressContext"
import { useTimer } from "@/contexts/TimerContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen, Clock, Target, TrendingUp, Award, Calendar, ChevronRight, Play, BarChart3 } from "lucide-react"
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

export default function DashboardPage() {
  const { user } = useAuth()
  const { getSubjectProgress, getOverallProgress, getCompletedChapters } = useProgress()
  const { dailyTime, formatTime, startTimer } = useTimer()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

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

      const overallProgress = getOverallProgress()

      setStats({
        totalSubjects: subjects.length,
        completedChapters,
        totalChapters,
        averageScore: subjectsWithScores > 0 ? Math.round(totalScore / subjectsWithScores) : 0,
        studyStreak: 7, // Mock data
        totalStudyTime: dailyTime,
        weeklyProgress: overallProgress,
        upcomingTests: 3, // Mock data
      })
      setLoading(false)
    }

    calculateStats()
  }, [getSubjectProgress, getOverallProgress, dailyTime])

  const subjects = [
    {
      id: "math",
      name: "Mathematics",
      gradient: "from-violet-500 via-purple-500 to-indigo-600",
      bgGradient: "from-violet-50 to-purple-50",
      borderColor: "border-violet-200",
      icon: "📊",
    },
    {
      id: "science",
      name: "Science",
      gradient: "from-emerald-500 via-teal-500 to-cyan-600",
      bgGradient: "from-emerald-50 to-teal-50",
      borderColor: "border-emerald-200",
      icon: "🔬",
    },
    {
      id: "english",
      name: "English",
      gradient: "from-rose-500 via-pink-500 to-purple-600",
      bgGradient: "from-rose-50 to-pink-50",
      borderColor: "border-rose-200",
      icon: "📚",
    },
    {
      id: "history",
      name: "History",
      gradient: "from-amber-500 via-orange-500 to-red-600",
      bgGradient: "from-amber-50 to-orange-50",
      borderColor: "border-amber-200",
      icon: "🏛️",
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
      color: "text-violet-600",
      bgColor: "bg-violet-100",
    },
    {
      type: "started",
      subject: "Science",
      chapter: "Physics Laws",
      time: "4 hours ago",
      icon: Play,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      type: "achievement",
      title: "Study Streak",
      description: "7 days in a row!",
      time: "1 day ago",
      icon: Award,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
  ]

  const upcomingLessons = [
    {
      subject: "Mathematics",
      chapter: "Geometry Fundamentals",
      difficulty: "Medium",
      estimatedTime: "45 min",
      color: "bg-violet-500",
      textColor: "text-violet-700",
      bgColor: "bg-violet-50",
    },
    {
      subject: "Science",
      chapter: "Chemical Reactions",
      difficulty: "Hard",
      estimatedTime: "60 min",
      color: "bg-emerald-500",
      textColor: "text-emerald-700",
      bgColor: "bg-emerald-50",
    },
    {
      subject: "English",
      chapter: "Essay Writing",
      difficulty: "Easy",
      estimatedTime: "30 min",
      color: "bg-rose-500",
      textColor: "text-rose-700",
      bgColor: "bg-rose-50",
    },
  ]

  if (loading) {
    return (
      <div className="p-6 space-y-6 content-area">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8 content-area">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-slate-600 text-lg">Here's your learning progress and upcoming activities.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-violet-700">Study Time Today</CardTitle>
            <div className="p-2 bg-violet-100 rounded-lg">
              <Clock className="h-4 w-4 text-violet-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-violet-800">{formatTime(stats?.totalStudyTime || 0)}</div>
            <p className="text-xs text-violet-600 mt-1">
              <span className="text-emerald-600">+12%</span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-700">Chapters Completed</CardTitle>
            <div className="p-2 bg-emerald-100 rounded-lg">
              <BookOpen className="h-4 w-4 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-800">
              {stats?.completedChapters}/{stats?.totalChapters}
            </div>
            <p className="text-xs text-emerald-600 mt-1">
              {stats?.totalChapters ? Math.round((stats.completedChapters / stats.totalChapters) * 100) : 0}% complete
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-rose-700">Average Score</CardTitle>
            <div className="p-2 bg-rose-100 rounded-lg">
              <Target className="h-4 w-4 text-rose-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-800">{stats?.averageScore || 0}%</div>
            <p className="text-xs text-rose-600 mt-1">
              <span className="text-emerald-600">+5%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-700">Study Streak</CardTitle>
            <div className="p-2 bg-amber-100 rounded-lg">
              <Award className="h-4 w-4 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-800">{stats?.studyStreak || 0} days</div>
            <p className="text-xs text-amber-600 mt-1">Keep it up!</p>
          </CardContent>
        </Card>
      </div>

      {/* Subjects Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Your Subjects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {subjects.map((subject) => {
            const progress = getSubjectProgressPercent(subject.id)
            const completedChapters = getCompletedChapters(subject.id).length

            return (
              <Card
                key={subject.id}
                className={`bg-gradient-to-br ${subject.bgGradient} ${subject.borderColor} hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer`}
              >
                <CardHeader className="pb-3">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-r ${subject.gradient} flex items-center justify-center text-white text-xl mb-3 shadow-lg`}
                  >
                    {subject.icon}
                  </div>
                  <CardTitle className="text-lg text-slate-800">{subject.name}</CardTitle>
                  <CardDescription className="text-slate-600">
                    {completedChapters}/10 chapters completed
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Progress</span>
                      <span className="font-semibold text-slate-800">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-white/50 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r ${subject.gradient} transition-all duration-500`}
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <Link href={`/child/subjects/${subject.id}`}>
                    <Button
                      className={`w-full bg-gradient-to-r ${subject.gradient} hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-300`}
                    >
                      Continue Learning
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Recent Activity */}
        <Card className="bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-indigo-600" />
              </div>
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest learning activities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-4 rounded-xl bg-white/70 hover:bg-white transition-all duration-200 border border-slate-100"
              >
                <div className={`p-3 rounded-xl ${activity.bgColor}`}>
                  <activity.icon className={`h-5 w-5 ${activity.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  {activity.type === "completed" && (
                    <>
                      <p className="text-sm font-semibold text-slate-800">
                        Completed {activity.chapter} in {activity.subject}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="text-xs bg-emerald-100 text-emerald-700 border-emerald-200">
                          Score: {activity.score}%
                        </Badge>
                        <span className="text-xs text-slate-500">{activity.time}</span>
                      </div>
                    </>
                  )}
                  {activity.type === "started" && (
                    <>
                      <p className="text-sm font-semibold text-slate-800">
                        Started {activity.chapter} in {activity.subject}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                    </>
                  )}
                  {activity.type === "achievement" && (
                    <>
                      <p className="text-sm font-semibold text-slate-800">{activity.title}</p>
                      <p className="text-xs text-slate-600">{activity.description}</p>
                      <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Lessons */}
        <Card className="bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Calendar className="h-5 w-5 text-indigo-600" />
              </div>
              Upcoming Lessons
            </CardTitle>
            <CardDescription>Continue your learning journey</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingLessons.map((lesson, index) => (
              <div
                key={index}
                className={`flex items-center space-x-4 p-4 rounded-xl ${lesson.bgColor} hover:shadow-md transition-all duration-200 cursor-pointer border border-white/50`}
              >
                <div className={`w-4 h-4 rounded-full ${lesson.color} shadow-sm`}></div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${lesson.textColor} truncate`}>{lesson.chapter}</p>
                  <p className="text-xs text-slate-600">{lesson.subject}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      className={`text-xs ${
                        lesson.difficulty === "Easy"
                          ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                          : lesson.difficulty === "Medium"
                            ? "bg-amber-100 text-amber-700 border-amber-200"
                            : "bg-red-100 text-red-700 border-red-200"
                      }`}
                    >
                      {lesson.difficulty}
                    </Badge>
                    <span className="text-xs text-slate-500">{lesson.estimatedTime}</span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-slate-400" />
              </div>
            ))}
            <Button
              className="w-full mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={startTimer}
            >
              <Play className="mr-2 h-4 w-4" />
              Start Learning Session
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress */}
      <Card className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-indigo-200 hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <BarChart3 className="h-5 w-5 text-indigo-600" />
            </div>
            Weekly Progress Overview
          </CardTitle>
          <CardDescription>Your learning progress this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-700">Overall Progress</span>
                <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {stats?.weeklyProgress || 0}%
                </span>
              </div>
              <div className="w-full bg-white/70 rounded-full h-3">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500 shadow-sm"
                  style={{ width: `${stats?.weeklyProgress || 0}%` }}
                ></div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
              <div className="text-center p-4 bg-white/50 rounded-xl border border-white/70">
                <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  4
                </div>
                <div className="text-xs text-slate-600 font-medium">Subjects Active</div>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-xl border border-white/70">
                <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {stats?.completedChapters || 0}
                </div>
                <div className="text-xs text-slate-600 font-medium">Lessons Completed</div>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-xl border border-white/70">
                <div className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  3
                </div>
                <div className="text-xs text-slate-600 font-medium">Tests Passed</div>
              </div>
              <div className="text-center p-4 bg-white/50 rounded-xl border border-white/70">
                <div className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  7
                </div>
                <div className="text-xs text-slate-600 font-medium">Day Streak</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
