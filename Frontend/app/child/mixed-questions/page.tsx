"use client"

import { useState } from "react"
import { useProgress } from "@/contexts/ProgressContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trophy, Lock, CheckCircle, Star, X, ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

const subjects = [
  { id: "math", name: "Mathematics", color: "from-blue-500 to-blue-600" },
  { id: "science", name: "Science", color: "from-green-500 to-green-600" },
  { id: "english", name: "English", color: "from-purple-500 to-purple-600" },
  { id: "history", name: "History", color: "from-orange-500 to-orange-600" },
]

export default function MixedQuestionsPage() {
  const router = useRouter()
  const { getCompletedChapters } = useProgress()
  const [selectedTest, setSelectedTest] = useState<string | null>(null)

  // Check completion status for each semester
  const getSemesterStatus = (semester: number) => {
    const requiredChapters = semester === 1 ? 5 : 10 // First 5 chapters for semester 1, all 10 for semester 2

    return subjects.every((subject) => {
      const completed = getCompletedChapters(subject.id).length
      return completed >= requiredChapters
    })
  }

  const semester1Complete = getSemesterStatus(1)
  const semester2Complete = getSemesterStatus(2)

  const mixedTests = [
    {
      id: "semester-1-mixed",
      title: "Semester 1 Mixed Questions",
      description: "Questions from all subjects - Chapters 1-5",
      unlocked: semester1Complete,
      semester: 1,
      questions: 20,
      timeLimit: "45 minutes",
    },
    {
      id: "semester-2-mixed",
      title: "Semester 2 Mixed Questions",
      description: "Questions from all subjects - Chapters 6-10",
      unlocked: semester2Complete,
      semester: 2,
      questions: 25,
      timeLimit: "60 minutes",
    },
    {
      id: "final-mixed",
      title: "Final Mixed Assessment",
      description: "Comprehensive test covering all chapters",
      unlocked: semester2Complete,
      semester: 3,
      questions: 40,
      timeLimit: "90 minutes",
    },
  ]

  const MixedTestCard = ({ test }: { test: (typeof mixedTests)[0] }) => {
    return (
      <Card className={`${test.unlocked ? "chapter-card hover:scale-105" : "locked-chapter"} transition-transform`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {test.unlocked ? (
                <Trophy className="w-5 h-5 text-yellow-500" />
              ) : (
                <Lock className="w-5 h-5 text-gray-400" />
              )}
              {test.title}
            </CardTitle>
            <Badge variant={test.unlocked ? "default" : "secondary"}>{test.unlocked ? "Available" : "Locked"}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">{test.description}</p>

          <div className="flex gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              <span>{test.questions} questions</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              <span>{test.timeLimit}</span>
            </div>
          </div>

          {test.unlocked ? (
            <Button
              onClick={() => setSelectedTest(test.id)}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
            >
              Start Mixed Test
            </Button>
          ) : (
            <div className="space-y-2">
              <Alert>
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  Complete {test.semester === 1 ? "first 5 chapters" : "all chapters"} in all subjects to unlock
                </AlertDescription>
              </Alert>
              <div className="text-xs text-gray-500">
                Progress:{" "}
                {subjects
                  .map((subject) => {
                    const completed = getCompletedChapters(subject.id).length
                    const required = test.semester === 1 ? 5 : 10
                    return `${subject.name}: ${completed}/${required}`
                  })
                  .join(", ")}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  if (selectedTest) {
    return <MixedTestComponent testId={selectedTest} onBack={() => setSelectedTest(null)} />
  }

  return (
    <div className="p-6 space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.push("/child/dashboard")} className="flex items-center gap-2 mb-4">
        <ChevronLeft className="w-4 h-4" />
        Back to Dashboard
      </Button>
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Mixed Questions</h1>
        <p className="text-yellow-100">Test your knowledge across multiple subjects and chapters</p>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Semester 1 Status</h4>
              <div className="flex items-center gap-2">
                {semester1Complete ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Lock className="w-5 h-5 text-gray-400" />
                )}
                <span className={semester1Complete ? "text-green-700" : "text-gray-600"}>
                  {semester1Complete
                    ? "Complete - Mixed questions unlocked!"
                    : "Complete first 5 chapters in all subjects"}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Semester 2 Status</h4>
              <div className="flex items-center gap-2">
                {semester2Complete ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Lock className="w-5 h-5 text-gray-400" />
                )}
                <span className={semester2Complete ? "text-green-700" : "text-gray-600"}>
                  {semester2Complete
                    ? "Complete - All mixed questions unlocked!"
                    : "Complete all 10 chapters in all subjects"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mixed Tests */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mixedTests.map((test) => (
          <MixedTestCard key={test.id} test={test} />
        ))}
      </div>

      {/* Subject Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Subject Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {subjects.map((subject) => {
              const completed = getCompletedChapters(subject.id).length
              return (
                <div key={subject.id} className="text-center p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">{subject.name}</h4>
                  <div className="text-2xl font-bold text-blue-600 mb-1">{completed}/10</div>
                  <p className="text-sm text-gray-600">chapters completed</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Mixed Test Component
function MixedTestComponent({ testId, onBack }: { testId: string; onBack: () => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [testStarted, setTestStarted] = useState(false)

  // Mock mixed questions from different subjects
  const mixedQuestions = [
    {
      subject: "Mathematics",
      question: "What is 15% of 200?",
      options: ["25", "30", "35", "40"],
      correct: 1,
      explanation: "15% of 200 = (15/100) × 200 = 30",
    },
    {
      subject: "Science",
      question: "What is the chemical symbol for water?",
      options: ["H2O", "CO2", "NaCl", "O2"],
      correct: 0,
      explanation: "Water is composed of two hydrogen atoms and one oxygen atom, hence H2O.",
    },
    {
      subject: "English",
      question: "Which word is a synonym for 'happy'?",
      options: ["Sad", "Joyful", "Angry", "Tired"],
      correct: 1,
      explanation: "Joyful means feeling or expressing great happiness, making it a synonym for happy.",
    },
    {
      subject: "History",
      question: "In which year did World War II end?",
      options: ["1944", "1945", "1946", "1947"],
      correct: 1,
      explanation: "World War II ended in 1945 with the surrender of Japan in September.",
    },
    {
      subject: "Mathematics",
      question: "What is the area of a rectangle with length 8 and width 5?",
      options: ["13", "26", "40", "45"],
      correct: 2,
      explanation: "Area of rectangle = length × width = 8 × 5 = 40 square units",
    },
  ]

  const handleStartTest = () => {
    setTestStarted(true)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < mixedQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      setShowResults(true)
    }
  }

  const calculateScore = () => {
    let correct = 0
    mixedQuestions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct) {
        correct++
      }
    })
    return Math.round((correct / mixedQuestions.length) * 100)
  }

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <Button variant="ghost" onClick={onBack} className="self-start mb-4">
              ← Back to Mixed Questions
            </Button>
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Mixed Questions Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-gray-600">This test contains questions from multiple subjects and chapters.</p>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Test Information</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• {mixedQuestions.length} questions from different subjects</li>
                  <li>• Questions cover multiple chapters</li>
                  <li>• Results recorded on first attempt only</li>
                  <li>• Review explanations after completion</li>
                </ul>
              </div>
            </div>

            <Button
              onClick={handleStartTest}
              className="w-full h-12 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700"
            >
              Start Mixed Test
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showResults) {
    const score = calculateScore()
    const correctAnswers = selectedAnswers.filter((answer, index) => answer === mixedQuestions[index].correct).length

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            ← Back to Mixed Questions
          </Button>

          {/* Results Header */}
          <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Test Complete!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-4xl font-bold text-yellow-600 mb-2">{score}%</div>
              <p className="text-gray-600">
                You got {correctAnswers} out of {mixedQuestions.length} questions correct
              </p>
            </CardContent>
          </Card>

          {/* Question Review */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Review Your Answers</h3>
            {mixedQuestions.map((question, index) => {
              const userAnswer = selectedAnswers[index]
              const isCorrect = userAnswer === question.correct

              return (
                <Card key={index} className={`border-l-4 ${isCorrect ? "border-l-green-500" : "border-l-red-500"}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <X className="w-5 h-5 text-red-500" />
                        )}
                        Question {index + 1}
                      </CardTitle>
                      <Badge variant="outline">{question.subject}</Badge>
                    </div>
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
                <CardTitle>Mixed Questions Test</CardTitle>
                <Badge variant="outline" className="mt-2">
                  {mixedQuestions[currentQuestion].subject}
                </Badge>
              </div>
              <Badge variant="secondary">
                Question {currentQuestion + 1} of {mixedQuestions.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">{mixedQuestions[currentQuestion].question}</h3>
              <div className="space-y-3">
                {mixedQuestions[currentQuestion].options.map((option, index) => (
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
                {currentQuestion === mixedQuestions.length - 1 ? "Finish Test" : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
