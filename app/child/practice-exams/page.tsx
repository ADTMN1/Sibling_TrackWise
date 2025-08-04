"use client"

import { Progress } from "@/components/ui/progress"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Target, BookOpen, Trophy, Clock, ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

const subjects = [
  { id: "math", name: "Mathematics", color: "from-blue-500 to-blue-600", icon: "📊" },
  { id: "science", name: "Science", color: "from-green-500 to-green-600", icon: "🔬" },
  { id: "english", name: "English", color: "from-purple-500 to-purple-600", icon: "📚" },
  { id: "history", name: "History", color: "from-orange-500 to-orange-600", icon: "🏛️" },
]

const practiceExams = [
  { id: "basic", title: "Basic Level", questions: 10, timeLimit: "20 min" },
  { id: "intermediate", title: "Intermediate Level", questions: 15, timeLimit: "30 min" },
  { id: "advanced", title: "Advanced Level", questions: 20, timeLimit: "40 min" },
]

export default function PracticeExamsPage() {
  const router = useRouter()
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [selectedExam, setSelectedExam] = useState<string | null>(null)

  if (selectedSubject && selectedExam) {
    return (
      <PracticeExamComponent
        subjectId={selectedSubject}
        examId={selectedExam}
        onBack={() => {
          setSelectedExam(null)
          setSelectedSubject(null)
        }}
      />
    )
  }

  if (selectedSubject) {
    const subject = subjects.find((s) => s.id === selectedSubject)!

    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setSelectedSubject(null)}>
            ← Back to Subjects
          </Button>
          <div className={`bg-gradient-to-r ${subject.color} rounded-2xl p-6 text-white flex-1`}>
            <div className="flex items-center gap-4">
              <div className="text-4xl">{subject.icon}</div>
              <div>
                <h1 className="text-3xl font-bold">{subject.name} Practice Exams</h1>
                <p className="text-white/80">Choose your difficulty level</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {practiceExams.map((exam) => (
            <Card key={exam.id} className="chapter-card hover:scale-105 transition-transform">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  {exam.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BookOpen className="w-4 h-4" />
                    <span>{exam.questions} questions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{exam.timeLimit}</span>
                  </div>
                </div>
                <Button onClick={() => setSelectedExam(exam.id)} className="w-full">
                  Start Practice Exam
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.push("/child/dashboard")} className="flex items-center gap-2 mb-4">
        <ChevronLeft className="w-4 h-4" />
        Back to Dashboard
      </Button>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Practice Exams</h1>
        <p className="text-blue-100">Practice with exam-style questions for each subject</p>
      </div>

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            How Practice Exams Work
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Always Available</h4>
              <p className="text-blue-700">Practice exams are always accessible for all subjects</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">First Score Counts</h4>
              <p className="text-green-700">Only your first attempt score is recorded</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Unlimited Retakes</h4>
              <p className="text-purple-700">Practice as many times as you want</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {subjects.map((subject) => (
          <Card key={subject.id} className="chapter-card hover:scale-105 transition-transform">
            <CardHeader className="pb-3">
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-r ${subject.color} flex items-center justify-center text-white text-xl mb-3`}
              >
                {subject.icon}
              </div>
              <CardTitle className="text-lg">{subject.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-gray-600">Practice exams available at all difficulty levels</div>
              <Button
                onClick={() => setSelectedSubject(subject.id)}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                Start Practice
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Practice Exam Component
function PracticeExamComponent({
  subjectId,
  examId,
  onBack,
}: {
  subjectId: string
  examId: string
  onBack: () => void
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [testStarted, setTestStarted] = useState(false)
  const [firstAttempt, setFirstAttempt] = useState(true)

  // Mock practice questions
  const practiceQuestions = [
    {
      question: "Sample practice question for this subject?",
      options: ["Option A", "Option B", "Option C", "Option D"],
      correct: 1,
      explanation: "This is the explanation for the correct answer.",
    },
    {
      question: "Another practice question to test understanding?",
      options: ["Choice 1", "Choice 2", "Choice 3", "Choice 4"],
      correct: 2,
      explanation: "Detailed explanation of why this answer is correct.",
    },
    {
      question: "Third practice question for comprehensive testing?",
      options: ["Answer A", "Answer B", "Answer C", "Answer D"],
      correct: 0,
      explanation: "Complete explanation with reasoning and context.",
    },
  ]

  const subject = subjects.find((s) => s.id === subjectId)!
  const exam = practiceExams.find((e) => e.id === examId)!

  const handleStartTest = () => {
    setTestStarted(true)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < practiceQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      setShowResults(true)
      if (firstAttempt) {
        // Record the score (in real app, this would be saved)
        setFirstAttempt(false)
      }
    }
  }

  const calculateScore = () => {
    let correct = 0
    practiceQuestions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct) {
        correct++
      }
    })
    return Math.round((correct / practiceQuestions.length) * 100)
  }

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <Button variant="ghost" onClick={onBack} className="self-start mb-4">
              ← Back to Practice Exams
            </Button>
            <div
              className={`w-16 h-16 bg-gradient-to-br ${subject.color} rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl`}
            >
              {subject.icon}
            </div>
            <CardTitle className="text-2xl">
              {subject.name} - {exam.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                Practice exam for {subject.name} at {exam.title.toLowerCase()} level
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Exam Information</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• {exam.questions} questions</li>
                  <li>• Time limit: {exam.timeLimit}</li>
                  <li>
                    •{" "}
                    {firstAttempt ? "First attempt - score will be recorded" : "Practice attempt - score not recorded"}
                  </li>
                  <li>• Review explanations after completion</li>
                </ul>
              </div>
            </div>

            <Button
              onClick={handleStartTest}
              className={`w-full h-12 bg-gradient-to-r ${subject.color} hover:opacity-90`}
            >
              {firstAttempt ? "Start Exam (Recorded)" : "Start Practice"}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showResults) {
    const score = calculateScore()
    const correctAnswers = selectedAnswers.filter((answer, index) => answer === practiceQuestions[index].correct).length

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            ← Back to Practice Exams
          </Button>

          {/* Results Header */}
          <Card>
            <CardHeader className="text-center">
              <div
                className={`w-16 h-16 bg-gradient-to-br ${subject.color} rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl`}
              >
                {subject.icon}
              </div>
              <CardTitle className="text-2xl">Practice Exam Complete!</CardTitle>
              {!firstAttempt && <Badge variant="secondary">Practice Attempt</Badge>}
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-4xl font-bold text-blue-600 mb-2">{score}%</div>
              <p className="text-gray-600">
                You got {correctAnswers} out of {practiceQuestions.length} questions correct
              </p>
            </CardContent>
          </Card>

          {/* Question Review */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Review Your Answers</h3>
            {practiceQuestions.map((question, index) => {
              const userAnswer = selectedAnswers[index]
              const isCorrect = userAnswer === question.correct

              return (
                <Card key={index} className={`border-l-4 ${isCorrect ? "border-l-green-500" : "border-l-red-500"}`}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {isCorrect ? (
                        <Trophy className="w-5 h-5 text-green-500" />
                      ) : (
                        <Target className="w-5 h-5 text-red-500" />
                      )}
                      Question {index + 1}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="font-medium">{question.question}</p>

                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`p-3 rounded-lg border ${
                            optionIndex === question.correct
                              ? "bg-green-50 border-green-300 text-green-800"
                              : userAnswer === optionIndex
                                ? "bg-red-50 border-red-300 text-red-800"
                                : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{option}</span>
                            <div className="flex gap-2">
                              {optionIndex === question.correct && (
                                <Badge variant="secondary" className="bg-green-100 text-green-800">
                                  Correct
                                </Badge>
                              )}
                              {userAnswer === optionIndex && optionIndex !== question.correct && (
                                <Badge variant="secondary" className="bg-red-100 text-red-800">
                                  Your Answer
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <h5 className="font-semibold text-blue-800 mb-1">Explanation:</h5>
                      <p className="text-blue-700 text-sm">{question.explanation}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => {
                setTestStarted(false)
                setCurrentQuestion(0)
                setSelectedAnswers([])
                setShowResults(false)
              }}
              variant="outline"
            >
              Practice Again
            </Button>
            <Button onClick={onBack}>Back to Practice Exams</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>
                  {subject.name} - {exam.title}
                </CardTitle>
                {!firstAttempt && (
                  <Badge variant="secondary" className="mt-2">
                    Practice Mode
                  </Badge>
                )}
              </div>
              <Badge variant="secondary">
                Question {currentQuestion + 1} of {practiceQuestions.length}
              </Badge>
            </div>
            <Progress value={((currentQuestion + 1) / practiceQuestions.length) * 100} className="h-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">{practiceQuestions[currentQuestion].question}</h3>
              <div className="space-y-3">
                {practiceQuestions[currentQuestion].options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswers[currentQuestion] === index ? "default" : "outline"}
                    className="w-full text-left justify-start h-auto p-4"
                    onClick={() => handleAnswerSelect(index)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion((prev) => prev - 1)}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              <Button onClick={handleNext} disabled={selectedAnswers[currentQuestion] === undefined}>
                {currentQuestion === practiceQuestions.length - 1 ? "Finish Exam" : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
