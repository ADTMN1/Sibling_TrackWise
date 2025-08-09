"use client";

import { useParams, useRouter } from "next/navigation";
import { useProgress } from "@/contexts/ProgressContext";
import { useEffect, useState } from "react";
import { Calculator, Globe, Code } from "lucide-react";
import { FaFlask, FaBook } from "react-icons/fa";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Mathematics: Calculator,
  Science: FaFlask,
  English: FaBook,
  Geography: Globe,
  Programming: Code,
};

import {
  Lock,
  CheckCircle,
  BookOpen,
  Clock,
  Trophy,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";

export default function SubjectPage() {
  const router = useRouter();
  const params = useParams();
  const subjectId = params.subjectId as string;
  const { getChapterProgress, isChapterUnlocked } = useProgress();

  const [subject, setSubject] = useState<null | {
    _id: string;
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }>(null);

  const [chapters, setChapters] = useState<
    Array<{
      _id: string;
      title: string;
      semester: number;
      totalPages: number;
    }>
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubject() {
      try {
        const res = await fetch(
          `http://localhost:5000/api/subjects/${subjectId}`
        );
        if (!res.ok) throw new Error("Failed to fetch subject");
        const data = await res.json();
        const IconComponent = iconMap[data.name] || FaBook;

        setSubject({
          _id: data._id,
          name: data.name,
          icon: IconComponent,
          color: "from-blue-500 to-blue-600",
        });
      } catch (err: any) {
        setError(err.message || "Error loading subject");
      }
    }
    fetchSubject();
  }, [subjectId]);

  useEffect(() => {
    async function fetchChapters() {
      try {
        const res = await fetch(
          `http://localhost:5000/api/chapters/subject/${subjectId}`
        );
        if (!res.ok) throw new Error("Failed to fetch chapters");
        const data = await res.json();
        setChapters(data);
      } catch (err: any) {
        setError(err.message || "Error loading chapters");
      } finally {
        setLoading(false);
      }
    }
    fetchChapters();
  }, [subjectId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!subject) return <div>Subject not found</div>;

  const semester1Chapters = chapters.filter((ch) => ch.semester === 1);
  const semester2Chapters = chapters.filter((ch) => ch.semester === 2);

  const semester1Completed = semester1Chapters.every(
    (ch) => getChapterProgress(subjectId, ch._id).completed
  );

  const getChapterStatus = (chapterId: string) => {
    const firstSemester1Chapter = chapters.find((ch) => ch.semester === 1);
    if (firstSemester1Chapter && firstSemester1Chapter._id === chapterId) {
      return "unlocked";
    }

    const progress = getChapterProgress(subjectId, chapterId);
    const unlocked = isChapterUnlocked(subjectId, chapterId);

    if (progress.completed) return "completed";
    if (unlocked) return "unlocked";
    return "locked";
  };

  const ChapterCard = ({
    chapter,
    chapterNumber,
  }: {
    chapter: (typeof chapters)[0];
    chapterNumber: number;
  }) => {
    const status = getChapterStatus(chapter._id);
    const progress = getChapterProgress(subjectId, chapter._id);
    const progressPercent = (progress.currentPage / progress.totalPages) * 100;

    const isSemester2Locked = chapter.semester === 2 && !semester1Completed;

    return (
      <Card
        className={`chapter-card ${
          status === "locked" || isSemester2Locked ? "locked-chapter" : ""
        } ${status === "completed" ? "completed-chapter" : ""}`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              {status === "completed" && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              {(status === "locked" || isSemester2Locked) && (
                <Lock className="w-5 h-5 text-gray-400" />
              )}
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
            Chapter {chapterNumber} • Semester {chapter.semester}
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
              <Link
                href={`/child/subjects/${subjectId}/chapters/${chapter._id}`}
                className="flex-1"
              >
                <Button
                  className="w-full"
                  variant={status === "completed" ? "outline" : "default"}
                >
                  {status === "completed"
                    ? "Review"
                    : progress.currentPage > 1
                    ? "Continue"
                    : "Start"}
                </Button>
              </Link>
            )}
            {status === "completed" && (
              <Link
                href={`/child/subjects/${subjectId}/chapters/${chapter._id}/test`}
              >
                <Button variant="outline" size="sm">
                  {progress.testScore && progress.testScore >= 80
                    ? "Review Test"
                    : "Retake Test"}
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.push("/child/dashboard")}
        className="flex items-center gap-2 mb-4"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Dashboard
      </Button>

      <div
        className={`bg-gradient-to-r ${subject.color} rounded-2xl p-6 text-white`}
      >
        <div className="flex items-center gap-4">
          <div className="text-4xl">
            <subject.icon className="w-10 h-10" />
          </div>

          <div>
            <h1 className="text-3xl font-bold">{subject.name}</h1>
            <p className="text-white/80">
              Master the fundamentals and advanced concepts
            </p>
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
          {semester1Chapters.map((chapter, index) => (
            <ChapterCard
              key={chapter._id}
              chapter={chapter}
              chapterNumber={index + 1}
            />
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
          {semester2Chapters.map((chapter, index) => (
            <ChapterCard
              key={chapter._id}
              chapter={chapter}
              chapterNumber={index + 1}
            />
          ))}
        </div>
      </div>

      {/* Mixed Questions Link */}
      {semester1Completed && (
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-yellow-800">
                  Mixed Questions Available!
                </h3>
                <p className="text-yellow-700">
                  Test your knowledge across multiple chapters
                </p>
              </div>
              <Link href="/child/mixed-questions">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
                  Start Mixed Questions
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
