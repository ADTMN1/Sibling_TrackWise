"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProgress } from "@/contexts/ProgressContext";
import { useTimer } from "@/contexts/TimerContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ChevronLeft, ChevronRight, BookOpen, Play, Pause, Search, Clock, CheckCircle, RefreshCw } from "lucide-react";
import { Chatbot } from "@/components/child/Chatbot";

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
  ];

  return contents[page - 1] || { title: "Chapter Content", content: "Chapter content goes here..." };
};

export default function ChapterPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params.subjectId as string;
  const chapterId = params.chapterId as string;

  const { getChapterProgress, updateChapterProgress } = useProgress();
  const { startReadingTimer, pauseReadingTimer, isRunning, setQuizMode, formatTime, dailyTime } = useTimer();

  const [currentPage, setCurrentPage] = useState(1);
  const [showQuiz, setShowQuiz] = useState(false);
  const [pageStartTime, setPageStartTime] = useState(Date.now());
  const [canProceed, setCanProceed] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<{ page: number; title: string; content: string }[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [completedQuizzes, setCompletedQuizzes] = useState<{ [key: number]: boolean }>({});

  const chapterProgress = getChapterProgress(subjectId, chapterId);
  const totalPages = chapterProgress.totalPages;
  const isRevisit = chapterProgress.completed;

  const isQuizPage = currentPage % 5 === 0 && currentPage < totalPages;

  useEffect(() => {
    setQuizMode(showQuiz);
    if (!showQuiz) {
      startReadingTimer();
    }
    return () => {
      setQuizMode(false);
      pauseReadingTimer();
    };
  }, [showQuiz, setQuizMode, startReadingTimer, pauseReadingTimer]);

  useEffect(() => {
    const progress = getChapterProgress(subjectId, chapterId);
    setCurrentPage(progress.currentPage);
    setCompletedQuizzes(progress.completedQuizzes || {});
  }, [subjectId, chapterId, getChapterProgress]);

  useEffect(() => {
    setPageStartTime(Date.now());
    setCanProceed(isRevisit);
    setTimeRemaining(5);

    if (!isRevisit) {
      const startTime = Date.now();
      const timer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const remaining = Math.max(0, 5 - elapsed);
        setTimeRemaining(remaining);

        if (remaining === 0) {
          setCanProceed(true);
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [currentPage, isRevisit]);

  useEffect(() => {
    const currentProgress = getChapterProgress(subjectId, chapterId);
    if (!isRevisit && currentPage > currentProgress.currentPage) {
      updateChapterProgress(subjectId, chapterId, {
        currentPage: currentPage,
        timeSpent: currentProgress.timeSpent + 1,
      });
    }
  }, [currentPage, isRevisit, subjectId, chapterId, updateChapterProgress, getChapterProgress]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.length > 2) {
      const results = [];
      for (let i = 1; i <= totalPages; i++) {
        const pageContent = generateChapterContent(i);
        if (
          pageContent.title.toLowerCase().includes(term.toLowerCase()) ||
          pageContent.content.toLowerCase().includes(term.toLowerCase())
        ) {
          results.push({ page: i, ...pageContent });
        }
      }
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const handleNextPage = () => {
    if (!canProceed && !isRevisit) {
      return;
    }

    if (isQuizPage && !isRevisit && !completedQuizzes[currentPage]) {
      setShowQuiz(true);
      return;
    }

    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    } else if (currentPage === totalPages) {
      handleChapterComplete();
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleQuizComplete = (score: number) => {
    const newCompletedQuizzes = { ...completedQuizzes, [currentPage]: true };
    setCompletedQuizzes(newCompletedQuizzes);

    if (!isRevisit && !completedQuizzes[currentPage]) {
      updateChapterProgress(subjectId, chapterId, {
        completedQuizzes: newCompletedQuizzes,
        quizScores: { ...chapterProgress.quizScores, [currentPage]: score },
      });
    }
    setShowQuiz(false);

    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleChapterComplete = () => {
    if (!isRevisit) {
      updateChapterProgress(subjectId, chapterId, {
        completed: true,
        currentPage: totalPages,
      });
    }
    setQuizMode(false);
    router.push(`/child/subjects/${subjectId}/chapters/${chapterId}/test`);
  };

  const handleRetakeQuiz = () => {
    setShowQuiz(true);
  };

  const progressPercent = (currentPage / totalPages) * 100;
  const currentContent = generateChapterContent(currentPage);

  if (showQuiz) {
    return (
      <QuizComponent
        onComplete={handleQuizComplete}
        isRevisit={isRevisit || completedQuizzes[currentPage]}
        pageNumber={currentPage}
        chapterId={chapterId}
      />
    );
  }

  return (
    <div className="min-h-screen w-[90%] max-w-7xl mx-auto  rounded-2xl shadow-md p-6">
      <div className="w-full mb-6">
        {/* Header Row - Modified to move chapter to left */}
        <div className="flex items-center gap-4 mb-2">
          {/* Back Button */}
          <Button
            onClick={() => {
              setQuizMode(false);
              pauseReadingTimer();
              router.push(`/child/subjects/${subjectId}`);
            }}
            className={`flex items-center gap-2 bg-gradient-to-r from-[#FAF3E9] to-[#F0E6D6] hover:from-[#F5EDE0] hover:to-[#EBE2D2] text-gray-700 shadow-sm hover:shadow-md transition-all duration-300 rounded-lg px-4 py-2`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Chapters</span>
          </Button>

          {/* Chapter Indicator - Moved to left side after back button */}
          <div className="flex items-center gap-3">
            <div className="h-px w-8 bg-gradient-to-r from-orange-400 to-transparent"></div>
            <div className="bg-gradient-to-r from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-transparent bg-clip-text">
              <span className="text-2xl font-bold">Chapter {chapterId.split("-")[1]}</span>
            </div>
          </div>

          {/* Spacer to push right elements to the right */}
          <div className="flex-1"></div>
        </div>

        {/* Card Content - Shifted left as before */}
        <div className="p-4 pl-2 bg-gradient-to-tr from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-sm flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Left Section */}
          <div className="space-y-1 ml-1">
            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-300 dark:to-gray-100 text-transparent bg-clip-text">
              {currentContent.title}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Page {currentPage} of {totalPages} · Time spent: {formatTime(dailyTime)}
            </p>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3 flex-wrap justify-end">
            <Button
              onClick={() => setShowSearch(!showSearch)}
              className={`flex items-center gap-2 bg-gradient-to-r from-[#FAF3E9] to-[#F0E6D6] hover:from-[#F5EDE0] hover:to-[#EBE2D2] text-gray-700 shadow-sm hover:shadow-md transition-all duration-300 rounded-lg px-4 py-2`}
            >
              <Search className="w-4 h-4" />
              <span className="text-sm">Search</span>
            </Button>

            <Badge className="flex items-center gap-1 px-3 py-1 text-sm bg-gradient-to-r from-orange-100 to-orange-50 dark:from-orange-900 dark:to-orange-800 text-orange-800 dark:text-orange-100 rounded-md shadow-sm">
              <BookOpen className="w-4 h-4" />
              {isRevisit ? "Reviewing" : "Reading"}
            </Badge>
          </div>
        </div>
      </div>

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
                    setCurrentPage(result.page);
                    setShowSearch(false);
                    setSearchTerm("");
                    setSearchResults([]);
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

      <div className="w-full min-h-[500px] rounded-2xl shadow-md p-6 bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            {currentContent.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <div className="text-lg leading-relaxed text-gray-700 space-y-4">
            <p>{currentContent.content}</p>

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

            {currentPage % 5 === 4 && currentPage < totalPages - 1 && !completedQuizzes[currentPage + 1] && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertDescription className="text-yellow-800">
                  <strong>Quiz Coming Up!</strong> After the next page, you'll have a quiz to test your understanding
                  of the last 5 pages.
                </AlertDescription>
              </Alert>
            )}

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

            {isQuizPage && (
              <Button
                onClick={handleRetakeQuiz}
                className={`flex items-center gap-2 mt-4 bg-gradient-to-r from-[#FAF3E9] to-[#F0E6D6] hover:from-[#F5EDE0] hover:to-[#EBE2D2] text-gray-700 shadow-sm hover:shadow-md transition-all duration-300 rounded-lg px-4 py-2`}
              >
                <RefreshCw className="w-4 h-4" />
                {completedQuizzes[currentPage] ? "Retake Quiz" : "Take Quiz"}
              </Button>
            )}
          </div>
        </CardContent>
      </div>

      <div className="flex justify-between items-center mt-6">
        <Button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`flex items-center gap-2 ${
            currentPage === 1 
              ? 'bg-gradient-to-r from-[#FAF3E9] to-[#F5EDE0] text-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-[#FAF3E9] to-[#F0E6D6] text-gray-700 hover:from-[#F5EDE0] hover:to-[#EBE2D2]'
          } transition-all duration-300 rounded-lg px-4 py-2 shadow-sm hover:shadow-md`}
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Button>

        <div className="text-sm text-gray-600 text-center">
          <div>
            Page {currentPage} of {totalPages}
          </div>
          {isQuizPage && !isRevisit && !completedQuizzes[currentPage] && (
            <div className="text-orange-500 font-medium">Quiz required before continuing</div>
          )}
        </div>

        {currentPage < totalPages ? (
          <Button
            onClick={handleNextPage}
            className={`flex items-center gap-2 ${
              (!canProceed && !isRevisit) || (isQuizPage && !isRevisit && !completedQuizzes[currentPage])
                ? 'bg-gradient-to-r from-[#FAF3E9] to-[#F5EDE0] text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#FAF3E9] to-[#F0E6D6] text-gray-700 hover:from-[#F5EDE0] hover:to-[#EBE2D2] shadow-sm hover:shadow-md'
            } transition-all duration-300 rounded-lg px-4 py-2`}
            disabled={(!canProceed && !isRevisit) || (isQuizPage && !isRevisit && !completedQuizzes[currentPage])}
          >
            Next
            <ChevronRight className="w-4 h-4" />
            {!canProceed && !isRevisit && (
              <Badge className="ml-2 bg-gradient-to-r from-[#F0E6D6] to-[#E5DBCB] text-gray-700">
                {timeRemaining}s
              </Badge>
            )}
          </Button>
        ) : (
          <Button 
            onClick={handleChapterComplete} 
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md hover:shadow-lg transition-all duration-300 rounded-lg px-4 py-2"
          >
            {isRevisit ? "Take Test Again" : "Take Chapter Test"}
            <ChevronRight className="w-4 h-4" />
          </Button>
        )}
      </div>

      <Chatbot />
    </div>
  );
}

function QuizComponent({
  onComplete,
  isRevisit,
  pageNumber,
  chapterId,
}: {
  onComplete: (score: number) => void;
  isRevisit: boolean;
  pageNumber: number;
  chapterId: string;
}) {
  const { formatTime, dailyTime, setQuizMode } = useTimer();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

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
  ];

  useEffect(() => {
    setQuizMode(true);
    return () => {
      setQuizMode(false);
    };
  }, [setQuizMode]);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  if (showResults) {
    const score = calculateScore();
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#94A3B8] via-[#CBD5E1] to-[#E2E8F0] flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl bg-white">
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
              <p className="text-gray-600">Time spent today: {formatTime(dailyTime)}</p>
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
                        className={`p-3 rounded-lg transition-all duration-300 ${
                          optionIndex === question.correct
                            ? "bg-gradient-to-r from-green-100 to-green-50 border border-green-200 text-green-800 shadow-sm"
                            : selectedAnswers[index] === optionIndex
                            ? "bg-gradient-to-r from-red-100 to-red-50 border border-red-200 text-red-800 shadow-sm"
                            : "bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 hover:border-blue-200 hover:shadow-sm"
                        }`}
                      >
                        {option}
                        {optionIndex === question.correct && (
                          <span className="ml-2 text-green-600 text-sm font-medium">✓ Correct</span>
                        )}
                        {selectedAnswers[index] === optionIndex && optionIndex !== question.correct && (
                          <span className="ml-2 text-red-600 text-sm font-medium">✗ Your answer</span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg text-blue-700 border border-blue-200">
                    <strong>Explanation:</strong> {question.explanation}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 justify-center">
              <Button 
                onClick={() => onComplete(score)} 
                className="flex items-center gap-2 bg-gradient-to-r from-[#FAF3E9] to-[#F0E6D6] hover:from-[#F5EDE0] hover:to-[#EBE2D2] text-gray-700 shadow-sm hover:shadow-md transition-all duration-300 rounded-lg px-4 py-2"
              >
                Continue Reading
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button 
                onClick={handleRetake} 
                className="flex items-center gap-2 bg-gradient-to-r from-[#FAF3E9] to-[#F0E6D6] hover:from-[#F5EDE0] hover:to-[#EBE2D2] text-gray-700 shadow-sm hover:shadow-md transition-all duration-300 rounded-lg px-4 py-2"
              >
                <RefreshCw className="w-4 h-4" />
                Retake Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r  flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl bg-white">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Quiz - Page {pageNumber}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                Question {currentQuestion + 1} of {questions.length}
              </Badge>
              <Badge variant="outline" className="text-blue-600">
                Time spent today: {formatTime(dailyTime)}
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
                  className={`w-full text-left justify-start h-auto p-4 transition-all duration-300 ${
                    selectedAnswers[currentQuestion] === index
                      ? 'bg-gradient-to-r from-[#FAF3E9] to-[#F0E6D6] text-gray-700 shadow-lg'
                      : 'bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-800 border border-gray-200 hover:border-[#94A3B8] shadow-sm hover:shadow-md'
                  } rounded-lg`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              onClick={() => setCurrentQuestion((prev) => prev - 1)}
              disabled={currentQuestion === 0}
              className={`flex items-center gap-2 ${
                currentQuestion === 0
                  ? 'bg-gradient-to-r from-[#E2E8F0] to-[#D1D9E6] text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#FAF3E9] to-[#F0E6D6] text-gray-700 hover:from-[#F5EDE0] hover:to-[#EBE2D2]'
              } transition-all duration-300 rounded-lg px-4 py-2 shadow-sm hover:shadow-md`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button 
              onClick={handleNext} 
              disabled={selectedAnswers[currentQuestion] === undefined}
              className={`flex items-center gap-2 ${
                selectedAnswers[currentQuestion] === undefined
                  ? 'bg-gradient-to-r from-[#FAF3E9] to-[#F5EDE0] text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#FAF3E9] to-[#F0E6D6] text-gray-700 hover:from-[#F5EDE0] hover:to-[#EBE2D2]'
              } transition-all duration-300 rounded-lg px-4 py-2 shadow-sm hover:shadow-md`}
            >
              {currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next"}
              {currentQuestion < questions.length - 1 && <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}