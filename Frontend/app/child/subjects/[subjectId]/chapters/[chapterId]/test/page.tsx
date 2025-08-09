"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProgress } from "@/contexts/ProgressContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trophy, AlertCircle, CheckCircle, X } from "lucide-react";

const testQuestions = [
  {
    question: "What is the fundamental principle discussed in this chapter?",
    options: [
      "Basic understanding of core concepts",
      "Advanced mathematical formulas",
      "Historical background information",
      "Future technological developments",
    ],
    correct: 0,
    explanation:
      "The chapter focuses on building fundamental understanding of core concepts as the foundation for advanced learning.",
  },
  {
    question: "Which approach is most effective for problem-solving?",
    options: [
      "Random trial and error",
      "Systematic step-by-step method",
      "Guessing based on intuition",
      "Copying from external sources",
    ],
    correct: 1,
    explanation:
      "A systematic step-by-step approach ensures thorough understanding and consistent results.",
  },
  {
    question: "What should you do when encountering difficult concepts?",
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
  {
    question: "How can you best retain the information learned?",
    options: [
      "Read once and move on",
      "Regular review and application",
      "Highlight everything important",
      "Take extensive notes only",
    ],
    correct: 1,
    explanation:
      "Regular review and practical application help transfer knowledge from short-term to long-term memory.",
  },
  {
    question: "What is the key to mastering this subject?",
    options: [
      "Speed over accuracy",
      "Consistent practice and understanding",
      "Memorizing all formulas",
      "Completing assignments quickly",
    ],
    correct: 1,
    explanation:
      "Consistent practice combined with deep understanding creates lasting mastery of the subject.",
  },
];

export default function ChapterTestPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params.subjectId as string;
  const chapterId = params.chapterId as string;

  const { getChapterProgress, updateChapterProgress } = useProgress();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [testStarted, setTestStarted] = useState(false);

  // Add state for test timer at the top of the component
  const [testTimeRemaining, setTestTimeRemaining] = useState(1800); // 30 minutes in seconds
  const [testTimerActive, setTestTimerActive] = useState(false);

  const chapterProgress = getChapterProgress(subjectId, chapterId);
  const isRetake = chapterProgress.testAttempts > 0;

  // Update handleStartTest function
  const handleStartTest = () => {
    setTestStarted(true);
    setTestTimerActive(true);
    updateChapterProgress(subjectId, chapterId, {
      testAttempts: chapterProgress.testAttempts + 1,
    });
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < testQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    testQuestions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct) {
        correct++;
      }
    });

    // First attempt: score out of 100
    if (chapterProgress.testAttempts === 0) {
      return Math.round((correct / testQuestions.length) * 100);
    }

    // Retakes: score out of 80
    return Math.round((correct / testQuestions.length) * 80);
  };

  const handleTestComplete = () => {
    const score = calculateScore();
    const passed = score >= 80;

    // For retakes, only update if the new score is better
    let finalScore = score;
    if (chapterProgress.testAttempts > 0 && chapterProgress.testScore) {
      finalScore = Math.max(score, chapterProgress.testScore);
    }

    updateChapterProgress(subjectId, chapterId, {
      testCompleted: passed,
      testScore: finalScore,
    });

    if (passed) {
      router.push(`/child/subjects/${subjectId}`);
    }
  };

  // Add timer effect after other useEffects
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (testTimerActive && testTimeRemaining > 0) {
      interval = setInterval(() => {
        setTestTimeRemaining((prev) => {
          if (prev <= 1) {
            setShowResults(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [testTimerActive, testTimeRemaining]);

  // Add timer display in the test interface
  const formatTestTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Button
          variant="ghost"
          onClick={() => router.push(`/child/subjects/${subjectId}`)}
          className="self-start mb-4"
        >
          ← Back to Chapters
        </Button>
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">
              Chapter {chapterId.split("-")[1]} Test
              {isRetake && (
                <Badge variant="secondary" className="ml-2">
                  Retake
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                {isRetake
                  ? `Previous score: ${chapterProgress.testScore}%. You need 80% to pass.`
                  : "Test your understanding of this chapter. You need 80% to pass and unlock the next chapter."}
              </p>

              {isRetake && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    This is attempt #{chapterProgress.testAttempts + 1}.
                    {chapterProgress.testAttempts > 0 &&
                      " Your score will be calculated out of 80%."}
                  </AlertDescription>
                </Alert>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">
                  Test Information
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• {testQuestions.length} questions</li>
                  <li>• 80% required to pass</li>
                  <li>• First attempt: scored out of 100%</li>
                  <li>• Retakes: scored out of 80%</li>
                  <li>• Review explanations after completion</li>
                </ul>
              </div>
            </div>

            <Button
              onClick={handleStartTest}
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {isRetake ? "Retake Test" : "Start Test"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const passed = score >= 80;
    const correctAnswers = selectedAnswers.filter(
      (answer, index) => answer === testQuestions[index].correct
    ).length;

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Results Header */}
          <Card>
            <CardHeader className="text-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  passed ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {passed ? (
                  <CheckCircle className="w-8 h-8 text-white" />
                ) : (
                  <X className="w-8 h-8 text-white" />
                )}
              </div>
              <CardTitle className="text-2xl">
                Test {passed ? "Passed!" : "Not Passed"}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {score}%
              </div>
              <p className="text-gray-600">
                You got {correctAnswers} out of {testQuestions.length} questions
                correct
              </p>

              {!passed && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-700">
                    You need 80% to pass. Please review the chapter and try
                    again.
                  </AlertDescription>
                </Alert>
              )}

              {passed && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-green-700">
                    Congratulations! You can now proceed to the next chapter.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Question Review */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Review Your Answers</h3>
            {testQuestions.map((question, index) => {
              const userAnswer = selectedAnswers[index];
              const isCorrect = userAnswer === question.correct;

              return (
                <Card
                  key={index}
                  className={`border-l-4 ${
                    isCorrect ? "border-l-green-500" : "border-l-red-500"
                  }`}
                >
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <X className="w-5 h-5 text-red-500" />
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
                                <Badge
                                  variant="secondary"
                                  className="bg-green-100 text-green-800"
                                >
                                  Correct
                                </Badge>
                              )}
                              {userAnswer === optionIndex &&
                                optionIndex !== question.correct && (
                                  <Badge
                                    variant="secondary"
                                    className="bg-red-100 text-red-800"
                                  >
                                    Your Answer
                                  </Badge>
                                )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <h5 className="font-semibold text-blue-800 mb-1">
                        Explanation:
                      </h5>
                      <p className="text-blue-700 text-sm">
                        {question.explanation}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            {passed ? (
              <Button
                onClick={() => router.push(`/child/subjects/${subjectId}`)}
                className="bg-green-600 hover:bg-green-700"
              >
                Continue to Next Chapter
              </Button>
            ) : (
              <>
                <Button
                  onClick={() =>
                    router.push(
                      `/child/subjects/${subjectId}/chapters/${chapterId}`
                    )
                  }
                  variant="outline"
                >
                  Review Chapter
                </Button>
                <Button
                  onClick={() => {
                    setTestStarted(false);
                    setCurrentQuestion(0);
                    setSelectedAnswers([]);
                    setShowResults(false);
                    setTestTimeRemaining(1800);
                    setTestTimerActive(false);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Retake Test
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Chapter Test</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  Question {currentQuestion + 1} of {testQuestions.length}
                </Badge>
                <Badge variant="outline" className="text-red-600">
                  Time: {formatTestTime(testTimeRemaining)}
                </Badge>
              </div>
            </div>
            <Progress
              value={((currentQuestion + 1) / testQuestions.length) * 100}
              className="h-2"
            />
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">
                {testQuestions[currentQuestion].question}
              </h3>
              <div className="space-y-3">
                {testQuestions[currentQuestion].options.map((option, index) => (
                  <Button
                    key={index}
                    variant={
                      selectedAnswers[currentQuestion] === index
                        ? "default"
                        : "outline"
                    }
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
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              <Button
                onClick={
                  currentQuestion === testQuestions.length - 1
                    ? handleTestComplete
                    : handleNext
                }
                disabled={selectedAnswers[currentQuestion] === undefined}
              >
                {currentQuestion === testQuestions.length - 1
                  ? "Finish Test"
                  : "Next"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
