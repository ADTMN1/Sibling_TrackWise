"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useProgress } from "@/contexts/ProgressContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  BookOpen,
  Search,
  ChevronRight,
  Calculator,
  Atom,
  BookText,
  Globe,
  Star,
  Clock,
  Target,
  Award,
} from "lucide-react"

// Define custom keyframes for animations
const style = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.5s ease-out forwards;
  }
`

const subjects = [
  {
    id: "math",
    name: "Mathematics",
    description: "Algebra, Geometry, Calculus and more",
    icon: Calculator,
    gradient: "from-[#FF9A7A] via-[#FFB399] to-[#FFCCB8]",
    bgGradient: "from-[#F8FAFC] to-[#F1F5F9]",
    borderColor: "border-[#E2E8F0]",
    chapters: 12,
    topics: ["Algebra", "Geometry", "Statistics", "Calculus"],
  },
  {
    id: "english",
    name: "English",
    description: "Grammar, Literature, Writing skills",
    icon: BookText,
    gradient: "from-[#D2B48C] via-[#F3E5AB] to-[#FFF8E1]",
    bgGradient: "from-[#F9F6F1] to-[#EFE9DC]",
    
    chapters: 10,
    topics: ["Grammar", "Literature", "Writing", "Reading"],
  },
  {
    id: "science",
    name: "Science",
    description: "Physics, Chemistry, Biology fundamentals",
    icon: Atom,
    gradient: "from-[#FF9A7A] via-[#FFB399] to-[#FFCCB8]",
    bgGradient: "from-[#F1F5F9] to-[#E2E8F0]",
    borderColor: "border-[#E5E7EB]",
    chapters: 15,
    topics: ["Physics", "Chemistry", "Biology", "Earth Science"],
  },
  {
    id: "history",
    name: "History",
    description: "World history, civilizations, events",
    icon: Globe,
    gradient: "from-[#a7a2a9] via-[#c6b8ae] to-[#f1e9e5]",
    bgGradient: "from-[#f9f7f8] to-[#eee9ed]",
    chapters: 8,
    topics: ["Ancient History", "Modern History", "Geography", "Culture"],
  },
]

export default function SubjectsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { getSubjectProgress } = useProgress()

  const filteredSubjects = subjects.filter((subject) => {
    const matchesSearch =
      subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.topics.some((topic) => topic.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesSearch
  })

  return (
    <div className="p-6 space-y-8 bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] min-h-screen">
      <style>{style}</style>
      {/* Header */}
      <div className="space-y-4">
        <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#4B5563] via-[#F97316] to-[#FDBA74] bg-clip-text text-transparent">
  Subjects
</h1>
<p className="text-[#718096] mt-2">
  Choose a subject to start your learning journey
</p>

        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#718096] w-4 h-4" />
          <Input
            placeholder="Search subjects, topics, or descriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-[#E2E8F0] focus:ring-[#FF8A6B] focus:border-[#FF8A6B] rounded-xl shadow-sm"
            aria-label="Search subjects"
          />
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredSubjects.map((subject, index) => {
          const progress = getSubjectProgress(subject.id)
          const progressPercentage =
            subject.chapters > 0 ? Math.round((progress.completedChapters / subject.chapters) * 100) : 0

          return (
            <Card
              key={subject.id}
              className={`group relative bg-gradient-to-br ${subject.bgGradient} border ${subject.borderColor || 'border-[#E2E8F0]'} rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden animate-fadeIn`}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => router.push(`/child/subjects/${subject.id}`)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full bg-gradient-to-br ${subject.gradient} shadow-sm`}>
                      <subject.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-[#2D3748]">{subject.name}</CardTitle>
                      <CardDescription className="text-[#718096] mt-1 text-sm">{subject.description}</CardDescription>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-[#718096] group-hover:text-[#FF8A6B] transition-colors duration-200" />
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-[#4A5568]">Progress</span>
                    <span className="text-sm font-bold text-[#FF8A6B]">{progressPercentage}%</span>
                  </div>
                  <Progress
                    value={progressPercentage}
                    className="h-2 bg-[#E2E8F0] [&>div]:bg-gradient-to-r [&>div]:from-[#FF9A7A] [&>div]:via-[#FFB399] [&>div]:to-[#FFCCB8] [&>div]:transition-all [&>div]:duration-500"
                  />
                  <div className="flex justify-between text-xs text-[#718096]">
                    <span>
                      {progress.completedChapters} of {subject.chapters} chapters
                    </span>
                    <span>{subject.chapters - progress.completedChapters} remaining</span>
                  </div>
                </div>

                {/* Subject Info */}
                <div className="text-center pt-2 border-t border-[#E2E8F0]">
                  <div className="flex items-center justify-center mb-2">
                    <BookOpen className="h-5 w-5 text-[#718096]" />
                  </div>
                  <div className="text-sm font-bold text-[#2D3748]">{subject.chapters}</div>
                  <div className="text-xs text-[#718096]">Chapters</div>
                </div>

                {/* Topics */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-[#4A5568]">Key Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {subject.topics.map((topic, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs bg-[#F1F5F9] text-[#4A5568] hover:bg-[#E2E8F0] px-2 py-0.5 rounded-full transition-colors duration-200 border border-[#E2E8F0]"
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  className={`w-full bg-gradient-to-r ${subject.gradient} text-white font-medium py-2 rounded-lg hover:opacity-90 transition-all duration-200 shadow-sm hover:shadow-md`}
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/child/subjects/${subject.id}`)
                  }}
                >
                  {progressPercentage > 0 ? "Continue Learning" : "Start Learning"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredSubjects.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-[#F1F5F9] rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-[#718096]" />
          </div>
          <h3 className="text-lg font-semibold text-[#2D3748] mb-2">No subjects found</h3>
          <p className="text-[#718096] mb-4">Try adjusting your search terms</p>
          <Button
            variant="outline"
            className="border-[#E2E8F0] text-[#4A5568] hover:bg-[#F1F5F9] rounded-lg font-medium"
            onClick={() => setSearchQuery("")}
          >
            Clear Search
          </Button>
        </div>
      )}

      {/* Study Tips */}
      <Card className="relative bg-white border border-[#FFE5E0] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden animate-fadeIn">
        <div className="absolute inset-0 bg-[#FFF5F3] opacity-50" />
        <CardHeader className="relative pb-2">
          <CardTitle className="flex items-center gap-2 text-[#2D3748] text-lg font-bold">
            <Star className="h-5 w-5 text-[#FF8A6B]" />
            Study Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="relative grid gap-4 md:grid-cols-3">
          <div className="group flex items-start space-x-3 hover:bg-[#FFF5F3] p-2 rounded-lg transition-all duration-200">
            <div className="p-2 bg-gradient-to-br from-[#FF9A7A] to-[#FF8A6B] rounded-full shadow-sm">
              <Clock className="h-4 w-4 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-[#2D3748] text-sm">Set a Schedule</h4>
              <p className="text-xs text-[#718096]">Study consistently for better retention</p>
            </div>
          </div>
          <div className="group flex items-start space-x-3 hover:bg-[#FFF5F3] p-2 rounded-lg transition-all duration-200">
            <div className="p-2 bg-gradient-to-br from-[#FF9A7A] to-[#FF8A6B] rounded-full shadow-sm">
              <Target className="h-4 w-4 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-[#2D3748] text-sm">Set Goals</h4>
              <p className="text-xs text-[#718096]">Break down chapters into smaller tasks</p>
            </div>
          </div>
          <div className="group flex items-start space-x-3 hover:bg-[#FFF5F3] p-2 rounded-lg transition-all duration-200">
            <div className="p-2 bg-gradient-to-br from-[#FF9A7A] to-[#FF8A6B] rounded-full shadow-sm">
              <Award className="h-4 w-4 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-[#2D3748] text-sm">Track Progress</h4>
              <p className="text-xs text-[#718096]">Monitor your learning journey</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}