"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useProgress } from "@/contexts/ProgressContext"
import { useTimer } from "@/contexts/TimerContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ChevronLeft, ChevronRight, BookOpen, Play, Pause, Search, Clock, CheckCircle } from "lucide-react"
import { Chatbot } from "@/components/child/Chatbot"

// Mock chapter content with search functionality
const generateChapterContent = (page: number) => {
  const contents = [
    {
      title: "Introduction to Fundamentals",
      content:
        "Welcome to this chapter! In this section, we'll explore fundamental concepts that will build the foundation for your understanding. These basic principles are essential for mastering more advanced topics later in the course.",
    },
    {
      title: "Core Principles",
      content:
        "Let's dive deeper into the core principles. Understanding these basics is crucial for mastering advanced topics. Each principle builds upon the previous one, creating a solid foundation of knowledge.",
    },
    {
      title: "Practical Applications",
      content:
        "Now we'll examine practical applications of what we've learned. These real-world examples will help solidify your knowledge and show you how these concepts are used in everyday situations.",
    },
    {
      title: "Important Formulas",
      content:
        "Here are some important formulas and methods you should remember. Practice these regularly to improve your skills. Mathematical formulas are tools that help us solve complex problems efficiently.",
    },
    {
      title: "Working Through Examples",
      content:
        "Let's work through some examples together. Follow along carefully and try to understand each step. Examples help bridge the gap between theory and practical application.",
    },
    {
      title: "Advanced Techniques",
      content:
        "This section covers advanced techniques. Don't worry if it seems challenging at first - practice makes perfect! Advanced concepts require patience and consistent practice to master.",
    },
    {
      title: "Problem-Solving Methods",
      content:
        "We'll now explore different approaches to problem-solving. Each method has its own advantages and is suitable for different types of problems. Learning multiple approaches gives you flexibility.",
    },
    {
      title: "Interactive Exercises",
      content:
        "Time for some interactive exercises! Try to solve these on your own before checking the answers. Active participation in learning significantly improves retention and understanding.",
    },
    {
      title: "Review and Consolidation",
      content:
        "Let's review what we've covered so far. Make sure you understand each concept before moving forward. Regular review helps transfer information from short-term to long-term memory.",
    },
    {
      title: "Memory Techniques",
      content:
        "Here are some tips and tricks that will help you remember these concepts more easily. Memory techniques, or mnemonics, can make learning more efficient and enjoyable.",
    },
    {
      title: "Advanced Applications",
      content:
        "We're making great progress! Let's continue with more advanced topics and applications. These build upon everything you've learned so far and prepare you for expert-level understanding.",
    },
    {
      title: "Key Terminology",
      content:
        "This section introduces new vocabulary and terminology. Take time to understand each term as they form the language of this subject. Proper terminology is essential for clear communication.",
    },
    {
      title: "Complex Problem Solving",
      content:
        "Let's practice with more complex examples. Don't hesitate to review previous sections if needed. Complex problems often require combining multiple concepts and techniques.",
    },
    {
      title: "Integration of Concepts",
      content:
        "We're approaching the end of this chapter. Let's consolidate everything we've learned and see how all concepts work together to form a complete understanding.",
    },
    {
      title: "Chapter Summary",
      content:
        "Excellent work! You've completed this chapter. This summary reviews all key points covered. You're now ready to take the chapter test to demonstrate your understanding.",
    },
    {
      title: "Preparation for Assessment",
      content:
        "Before taking the chapter test, review all the key concepts. Make sure you understand the relationships between different topics covered in this chapter.",
    },
    {
      title: "Final Review",
      content:
        "This is your final review before the assessment. Go through each major concept one more time. Confidence comes from thorough preparation and understanding.",
    },
    {
      title: "Test Preparation Tips",
      content:
        "Here are some tips for taking the chapter test: read each question carefully, manage your time well, and trust in your preparation. You've learned a lot in this chapter!",
    },
    {
      title: "Knowledge Check",
      content:
        "Before proceeding to the test, do a quick knowledge check. Can you explain the main concepts to yourself? Teaching concepts to yourself is a great way to verify understanding.",
    },
    {
      title: "Ready for Assessment",
      content:
        "You're now ready for the chapter test! Remember, you need 80% or above to unlock the next chapter. Take your time, think carefully, and apply what you've learned. Good luck!",
    },
  ]

  return contents[page - 1] || { title: "Chapter Content", content: "Chapter content goes here..." }
}

export default function ChapterPage() {
  const params = useParams()
  const router = useRouter()
  const subjectId = params.subjectId as string
  const chapterId = params.chapterId as string

  const { getChapterProgress, updateChapterProgress } = useProgress()
  const { startReadingTimer, pauseReadingTimer, isRunning } = useTimer()

  const [currentPage, setCurrentPage] = useState(1)
  const [showQuiz, setShowQuiz] = useState(false)
  const [pageStartTime, setPageStartTime] = useState(Date.now())
  const [canProceed, setCanProceed] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(5)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<{ page: number; title: string; content: string }[]>([])
  const [showSearch, setShowSearch] = useState(false)
  const [completedQuizzes, setCompletedQuizzes] = useState<{ [key: number]: boolean }>({})

  const chapterProgress = getChapterProgress(subjectId, chapterId)
  const totalPages = chapterProgress.totalPages
  const isRevisit = chapterProgress.completed

  const shouldShowQuiz =
    currentPage % 5 === 0 && currentPage < totalPages && !completedQuizzes[currentPage] && !isRevisit

  // Initialize chapter data on mount
  useEffect(() => {
    const progress = getChapterProgress(subjectId, chapterId)
    setCurrentPage(progress.currentPage)
    setCompletedQuizzes(progress.completedQuizzes || {})
  }, [subjectId, chapterId, getChapterProgress])

  // Handle timer based on quiz state
  useEffect(() => {
    if (!showQuiz && !shouldShowQuiz) {
      startReadingTimer()
    } else {
      pauseReadingTimer()
    }

    return () => {
      pauseReadingTimer()
    }
  }, [showQuiz, shouldShowQuiz, startReadingTimer, pauseReadingTimer])

  // Handle minimum read timer for each page
  useEffect(() => {
    setPageStartTime(Date.now())
    setCanProceed(isRevisit)
    setTimeRemaining(5)

    if (!isRevisit) {
      const startTime = Date.now()
      const timer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000)
        const remaining = Math.max(0, 5 - elapsed)
        setTimeRemaining(remaining)

        if (remaining === 0) {
          setCanProceed(true)
          clearInterval(timer)
        }
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [currentPage, isRevisit])

  // Update progress only when page advances (not on revisit)
  useEffect(() => {
    const currentProgress = getChapterProgress(subjectId, chapterId)
    if (!isRevisit && currentPage > currentProgress.currentPage) {
      updateChapterProgress(subjectId, chapterId, {
        currentPage: currentPage,
        timeSpent: currentProgress.timeSpent + 1,
      })
    }
  }, [currentPage, isRevisit, subjectId, chapterId, updateChapterProgress, getChapterProgress])

  // Search functionality
  const handleSearch = (term: string) => {
    setSearchTerm(term)
    if (term.length > 2) {
      const results = []
      for (let i = 1; i <= totalPages; i++) {
        const pageContent = generateChapterContent(i)
        if (
          pageContent.title.toLowerCase().includes(term.toLowerCase()) ||
          pageContent.content.toLowerCase().includes(term.toLowerCase())
        ) {
          results.push({ page: i, ...pageContent })
        }
      }
      setSearchResults(results)
    } else {
      setSearchResults([])
    }
  }

  const handleNextPage = () => {
    if (!canProceed && !isRevisit) {
      return // Cannot proceed until minimum time is met
    }

    // Check if we should show quiz every 5 pages (but not on the last page)
    if (currentPage % 5 === 0 && currentPage < totalPages && !completedQuizzes[currentPage] && !isRevisit) {
      setShowQuiz(true)
      return
    }

    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
    } else if (currentPage === totalPages) {
      // After completing all pages, go directly to test
      handleChapterComplete()
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  const handleQuizComplete = (score: number) => {
    const newCompletedQuizzes = { ...completedQuizzes, [currentPage]: true }
    setCompletedQuizzes(newCompletedQuizzes)

    // Only update score if not revisiting
    if (!isRevisit) {
      updateChapterProgress(subjectId, chapterId, {
        completedQuizzes: newCompletedQuizzes,
        quizScores: { ...chapterProgress.quizScores, [currentPage]: score },
      })
    }
    setShowQuiz(false)

    // Continue to next page after quiz
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const handleChapterComplete = () => {
    if (!isRevisit) {
      updateChapterProgress(subjectId, chapterId, {
        completed: true,
        currentPage: totalPages,
      })
    }
    router.push(`/child/subjects/${subjectId}/chapters/${chapterId}/test`)
  }

  const progressPercent = (currentPage / totalPages) * 100
  const currentContent = generateChapterContent(currentPage)

  if (showQuiz || shouldShowQuiz) {
    return (
      <QuizComponent
        onComplete={handleQuizComplete}
        isRevisit={isRevisit}
        pageNumber={currentPage}
        chapterId={chapterId}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push(`/child/subjects/${subjectId}`)}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to Chapters
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Chapter {chapterId.split("-")[1]}</h1>
                <p className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setShowSearch(!showSearch)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Search
              </Button>
              <Button onClick={isRunning ? pauseReadingTimer : startReadingTimer} variant="outline" size="sm">
                {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isRunning ? "Pause" : "Resume"}
              </Button>
              <Badge variant="secondary">
                <BookOpen className="w-4 h-4 mr-1" />
                {isRevisit ? "Reviewing" : "Reading"}
              </Badge>
            </div>
          </div>

          {/* Search Bar */}
          {showSearch && (
            <div className="mt-4 space-y-2">
              <Input
                placeholder="Search chapter content..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="max-w-md"
              />
              {searchResults.length > 0 && (
                <div className="bg-white border rounded-lg shadow-lg max-h-40 overflow-y-auto">
                  {searchResults.map((result) => (
                    <button
                      key={result.page}
                      onClick={() => {
                        setCurrentPage(result.page)
                        setShowSearch(false)
                        setSearchTerm("")
                        setSearchResults([])
                      }}
                      className="w-full text-left p-3 hover:bg-gray-50 border-b last:border-b-0"
                    >
                      <div className="font-medium text-sm">
                        Page {result.page}: {result.title}
                      </div>
                      <div className="text-xs text-gray-600 truncate">{result.content}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mt-4">
            <Progress value={progressPercent} className="h-2" />
          </div>

          {/* Quiz Progress Indicator */}
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
            <span>Quizzes completed:</span>
            {[5, 10, 15].map((quizPage) => (
              <div key={quizPage} className="flex items-center gap-1">
                <span>Page {quizPage}</span>
                {completedQuizzes[quizPage] ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <div className="w-4 h-4 border border-gray-300 rounded-full" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Card className="min-h-[500px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              {currentContent.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <div className="text-lg leading-relaxed text-gray-700 space-y-4">
              <p>{currentContent.content}</p>

              {/* Add some visual elements */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
                <h4 className="font-semibold text-blue-800 mb-2">Key Point</h4>
                <p className="text-blue-700">
                  Remember to take notes and practice the concepts as you learn them. This will help reinforce your
                  understanding and improve retention.
                </p>
              </div>

              {currentPage > 5 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">Practice Exercise</h4>
                  <p className="text-green-700">
                    Try to apply what you've learned in this section. Can you think of real-world examples where these
                    concepts might be useful?
                  </p>
                </div>
              )}

              {/* Quiz notification */}
              {currentPage % 5 === 4 && currentPage < totalPages - 1 && !completedQuizzes[currentPage + 1] && (
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertDescription className="text-yellow-800">
                    <strong>Quiz Coming Up!</strong> After the next page, you'll have a quiz to test your understanding
                    of the last 5 pages.
                  </AlertDescription>
                </Alert>
              )}

              {/* Minimum read timer warning */}
              {!canProceed && !isRevisit && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-yellow-600" />
                    <div>
                      <h4 className="font-semibold text-yellow-800">Please read carefully</h4>
                      <p className="text-yellow-700 text-sm">
                        You can proceed to the next page in {timeRemaining} seconds. Take your time to understand the
                        content.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-6">
          <Button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            variant="outline"
            className="flex items-center gap-2 bg-transparent"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <div className="text-sm text-gray-600 text-center">
            <div>
              Page {currentPage} of {totalPages}
            </div>
            {currentPage % 5 === 0 && currentPage < totalPages && !completedQuizzes[currentPage] && !isRevisit && (
              <div className="text-blue-600 font-medium">Quiz required before continuing</div>
            )}
          </div>

          {currentPage < totalPages ? (
            <Button
              onClick={handleNextPage}
              className="flex items-center gap-2"
              disabled={
                (!canProceed && !isRevisit) || (currentPage % 5 === 0 && !completedQuizzes[currentPage] && !isRevisit)
              }
            >
              Next
              <ChevronRight className="w-4 h-4" />
              {!canProceed && !isRevisit && (
                <Badge variant="secondary" className="ml-2">
                  {timeRemaining}s
                </Badge>
              )}
            </Button>
          ) : (
            <Button onClick={handleChapterComplete} className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
              {isRevisit ? "Take Test Again" : "Take Chapter Test"}
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Chatbot - only show during reading, not in quizzes */}
      <Chatbot />
    </div>
  )
}

// Quiz Component with updated logic
function QuizComponent({
  onComplete,
  isRevisit,
  pageNumber,
  chapterId,
}: {
  onComplete: (score: number) => void
  isRevisit: boolean
  pageNumber: number
  chapterId: string
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)

  const questions = [
    {
      question: `What is the main concept covered in pages ${pageNumber - 4} to ${pageNumber}?`,
      options: [
        "Basic fundamentals and core principles",
        "Advanced mathematical formulas",
        "Historical background information",
        "Future technological developments",
      ],
      correct: 0,
      explanation:
        "These pages focused on building fundamental understanding of core concepts as the foundation for advanced learning.",
    },
    {
      question: "Which approach is most effective for the problem-solving methods discussed?",
      options: [
        "Random trial and error",
        "Systematic step-by-step method",
        "Guessing based on intuition",
        "Copying from external sources",
      ],
      correct: 1,
      explanation: "A systematic step-by-step approach ensures thorough understanding and consistent results.",
    },
    {
      question: "What should you do when encountering the difficult concepts from this section?",
      options: [
        "Skip them entirely",
        "Review prerequisites and practice",
        "Memorize without understanding",
        "Ask for direct answers",
      ],
      correct: 1,
      explanation:
        "Reviewing prerequisites and practicing helps build the foundation needed to understand difficult concepts.",
    },
  ]

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      setShowResults(true)
    }
  }

  const calculateScore = () => {
    let correct = 0
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct) {
        correct++
      }
    })
    return Math.round((correct / questions.length) * 100)
  }

  if (showResults) {
    const score = calculateScore()
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Quiz Results - Page {pageNumber}</CardTitle>
            {isRevisit && <Badge variant="secondary">Practice Mode - Score Not Recorded</Badge>}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{score}%</div>
              <p className="text-gray-600">
                You got {selectedAnswers.filter((answer, index) => answer === questions[index].correct).length} out of{" "}
                {questions.length} questions correct
              </p>
              {isRevisit && (
                <p className="text-sm text-yellow-600 mt-2">This is practice mode. Your score will not be recorded.</p>
              )}
            </div>

            <div className="space-y-4">
              {questions.map((question, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <p className="font-medium mb-2">{question.question}</p>
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`p-2 rounded text-sm ${
                          optionIndex === question.correct
                            ? "bg-green-100 text-green-800 border border-green-300"
                            : selectedAnswers[index] === optionIndex
                              ? "bg-red-100 text-red-800 border border-red-300"
                              : "bg-gray-50"
                        }`}
                      >
                        {option}
                        {optionIndex === question.correct && " ✓ (Correct)"}
                        {selectedAnswers[index] === optionIndex &&
                          optionIndex !== question.correct &&
                          " ✗ (Your answer)"}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-700">
                    <strong>Explanation:</strong> {question.explanation}
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={() => onComplete(score)} className="w-full">
              Continue Reading
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Quiz - Page {pageNumber}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                Question {currentQuestion + 1} of {questions.length}
              </Badge>
              {isRevisit && <Badge variant="outline">Practice Mode</Badge>}
            </div>
          </div>
          <Progress value={((currentQuestion + 1) / questions.length) * 100} className="h-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="border-blue-200 bg-blue-50">
            <AlertDescription className="text-blue-800">
              This quiz covers the content from pages {pageNumber - 4} to {pageNumber}. Take your time and think
              carefully about each answer.
            </AlertDescription>
          </Alert>

          <div>
            <h3 className="text-lg font-medium mb-4">{questions[currentQuestion].question}</h3>
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
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
              {currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
