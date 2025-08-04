"use client"

import { useParams, useRouter } from "next/navigation"
import { useProgress } from "@/contexts/ProgressContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Lock, CheckCircle, BookOpen, Clock, Trophy, ChevronLeft } from "lucide-react"
import Link from "next/link"

const subjects = {
  math: { name: "Mathematics", color: "from-blue-500 to-blue-600", icon: "📊" },
  science: { name: "Science", color: "from-green-500 to-green-600", icon: "🔬" },
  english: { name: "English", color: "from-purple-500 to-purple-600", icon: "📚" },
  history: { name: "History", color: "from-orange-500 to-orange-600", icon: "🏛️" },
}

const chapters = [
  { id: "chapter-1", title: "Introduction to Basics", semester: 1 },
  { id: "chapter-2", title: "Fundamental Concepts", semester: 1 },
  { id: "chapter-3", title: "Advanced Topics", semester: 1 },
  { id: "chapter-4", title: "Practical Applications", semester: 1 },
  { id: "chapter-5", title: "Problem Solving", semester: 1 },
  { id: "chapter-6", title: "Complex Theories", semester: 2 },
  { id: "chapter-7", title: "Real World Examples", semester: 2 },
  { id: "chapter-8", title: "Advanced Techniques", semester: 2 },
  { id: "chapter-9", title: "Expert Level", semester: 2 },
  { id: "chapter-10", title: "Mastery Assessment", semester: 2 },
]

export default function SubjectPage() {
  const router = useRouter()
  const params = useParams()
  const subjectId = params.subjectId as string
  const { getChapterProgress, isChapterUnlocked } = useProgress()

  const subject = subjects[subjectId as keyof typeof subjects]

  if (!subject) {
    return <div>Subject not found</div>
  }

  const semester1Chapters = chapters.filter((ch) => ch.semester === 1)
  const semester2Chapters = chapters.filter((ch) => ch.semester === 2)

  const semester1Completed = semester1Chapters.every((ch) => getChapterProgress(subjectId, ch.id).completed)

  const getChapterStatus = (chapterId: string) => {
    const progress = getChapterProgress(subjectId, chapterId)
    const unlocked = isChapterUnlocked(subjectId, chapterId)

    if (progress.completed) return "completed"
    if (unlocked) return "unlocked"
    return "locked"
  }

  const ChapterCard = ({ chapter }: { chapter: (typeof chapters)[0] }) => {
    const status = getChapterStatus(chapter.id)
    const progress = getChapterProgress(subjectId, chapter.id)
    const progressPercent = (progress.currentPage / progress.totalPages) * 100

    // Check if this is a semester 2 chapter and semester 1 is not complete
    const isSemester2Locked = chapter.semester === 2 && !semester1Completed

    return (
      <Card
        className={`chapter-card ${status === "locked" || isSemester2Locked ? "locked-chapter" : ""} ${status === "completed" ? "completed-chapter" : ""}`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              {status === "completed" && <CheckCircle className="w-5 h-5 text-green-500" />}
              {(status === "locked" || isSemester2Locked) && <Lock className="w-5 h-5 text-gray-400" />}
              {chapter.title}
            </CardTitle>
            <div className="flex flex-col items-end gap-1">
              <Badge
                variant={
                  status === "completed"
                    ? "default"
                    : status === "unlocked" && !isSemester2Locked
                      ? "secondary"
                      : "outline"
                }
              >
                {status === "completed"
                  ? "Completed"
                  : status === "unlocked" && !isSemester2Locked
                    ? "Available"
                    : "Locked"}
              </Badge>
              {progress.testScore && (
                <Badge variant="outline" className="text-xs">
                  Test: {progress.testScore}%
                </Badge>
              )}
            </div>
          </div>
          <CardDescription>
            Chapter {chapter.id.split("-")[1]} • Semester {chapter.semester}
            {isSemester2Locked && " • Complete Semester 1 first"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status !== "locked" && !isSemester2Locked && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>
          )}

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{progress.totalPages} pages</span>
            </div>
            {progress.timeSpent > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{Math.round(progress.timeSpent / 60)}min</span>
              </div>
            )}
            {progress.testScore && (
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4" />
                <span>{progress.testScore}%</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {status !== "locked" && !isSemester2Locked && (
              <Link href={`/child/subjects/${subjectId}/chapters/${chapter.id}`} className="flex-1">
                <Button className="w-full" variant={status === "completed" ? "outline" : "default"}>
                  {status === "completed" ? "Review" : progress.currentPage > 1 ? "Continue" : "Start"}
                </Button>
              </Link>
            )}
            {status === "completed" && (
              <Link href={`/child/subjects/${subjectId}/chapters/${chapter.id}/test`}>
                <Button variant="outline" size="sm">
                  {progress.testScore && progress.testScore >= 80 ? "Review Test" : "Retake Test"}
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.push("/child/dashboard")} className="flex items-center gap-2 mb-4">
        <ChevronLeft className="w-4 h-4" />
        Back to Dashboard
      </Button>

      {/* Subject Header */}
      <div className={`bg-gradient-to-r ${subject.color} rounded-2xl p-6 text-white`}>
        <div className="flex items-center gap-4">
          <div className="text-4xl">{subject.icon}</div>
          <div>
            <h1 className="text-3xl font-bold">{subject.name}</h1>
            <p className="text-white/80">Master the fundamentals and advanced concepts</p>
          </div>
        </div>
      </div>

      {/* Semester 1 */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Semester 1</h2>
          {semester1Completed && (
            <Badge className="bg-green-500">
              <CheckCircle className="w-4 h-4 mr-1" />
              Completed
            </Badge>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {semester1Chapters.map((chapter) => (
            <ChapterCard key={chapter.id} chapter={chapter} />
          ))}
        </div>
      </div>

      {/* Semester 2 */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">Semester 2</h2>
          {!semester1Completed && (
            <Badge variant="outline">
              <Lock className="w-4 h-4 mr-1" />
              Complete Semester 1 to unlock
            </Badge>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {semester2Chapters.map((chapter) => (
            <ChapterCard key={chapter.id} chapter={chapter} />
          ))}
        </div>
      </div>

      {/* Mixed Questions Link */}
      {semester1Completed && (
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-yellow-800">Mixed Questions Available!</h3>
                <p className="text-yellow-700">Test your knowledge across multiple chapters</p>
              </div>
              <Link href="/child/mixed-questions">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">Start Mixed Questions</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
