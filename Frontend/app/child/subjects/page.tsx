"use client";

import { useState, useEffect, JSX } from "react";
import { useRouter } from "next/navigation";
import { useProgress } from "@/contexts/ProgressContext";
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
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Search,
  Clock,
  Target,
  ChevronRight,
  Calculator,
  Atom,
  BookText,
  Globe,
  Star,
  Award,
} from "lucide-react";

import { FaBook, FaFlask, FaCalculator, FaCode, FaGlobe } from "react-icons/fa";

const subjectIcons: Record<string, JSX.Element> = {
  Mathematics: <FaCalculator />,
  Science: <FaFlask />,
  English: <FaBook />,
  Geography: <FaGlobe />,
  Programming: <FaCode />,
};

import { LucideIcon } from "lucide-react";
interface Subject {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  gradient: string;
  chapters: number;
  difficulty: string;
  estimatedTime: string;
  topics: string[];
}

//   {
//     id: "math",
//     name: "Mathematics",
//     description: "Algebra, Geometry, Calculus and more",
//     icon: Calculator,
//     color: "bg-indigo-500",
//     gradient: "from-indigo-500 to-purple-600",
//     chapters: 12,
//     difficulty: "Medium",
//     estimatedTime: "8 weeks",
//     topics: ["Algebra", "Geometry", "Statistics", "Calculus"],
//   },
//   {
//     id: "science",
//     name: "Science",
//     description: "Physics, Chemistry, Biology fundamentals",
//     icon: Atom,
//     color: "bg-emerald-500",
//     gradient: "from-emerald-500 to-teal-600",
//     chapters: 15,
//     difficulty: "Hard",
//     estimatedTime: "10 weeks",
//     topics: ["Physics", "Chemistry", "Biology", "Earth Science"],
//   },
//   {
//     id: "english",
//     name: "English",
//     description: "Grammar, Literature, Writing skills",
//     icon: BookText,
//     color: "bg-purple-500",
//     gradient: "from-purple-500 to-pink-600",
//     chapters: 10,
//     difficulty: "Easy",
//     estimatedTime: "6 weeks",
//     topics: ["Grammar", "Literature", "Writing", "Reading"],
//   },
//   {
//     id: "history",
//     name: "History",
//     description: "World history, civilizations, events",
//     icon: Globe,
//     color: "bg-amber-500",
//     gradient: "from-amber-500 to-orange-600",
//     chapters: 8,
//     difficulty: "Medium",
//     estimatedTime: "7 weeks",
//     topics: ["Ancient History", "Modern History", "Geography", "Culture"],
//   },
// ];

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    null
  );
  const router = useRouter();
  const { getSubjectProgress } = useProgress();

  useEffect(() => {
    fetch("http://localhost:5000/api/subjects/")
      .then((res) => res.json())
      .then((data) => {
        const subjectMap = {
          Mathematics: {
            gradient: "from-indigo-500 to-purple-600",
            icon: Calculator,
          },
          Science: {
            gradient: "from-emerald-500 to-teal-600",
            icon: Atom,
          },
          English: {
            gradient: "from-purple-500 to-pink-600",
            icon: BookText,
          },
          History: {
            gradient: "from-amber-500 to-orange-600",
            icon: Globe,
          },
          Programming: {
            gradient: "from-blue-500 to-cyan-500",
            icon: FaCode,
          },
          Geography: {
            gradient: "from-green-500 to-blue-600",
            icon: FaGlobe,
          },
        };

        const enrichedSubjects = data.map((subject: any) => {
          const mapping =
            subjectMap[subject.name as keyof typeof subjectMap] || {};
          return {
            ...subject,
            id: subject._id,
            gradient: mapping.gradient,
            icon: mapping.icon || FaBook,
            chapters: Array.isArray(subject.chapters)
              ? subject.chapters.length
              : subject.chapters || 0,
            difficulty: subject.difficulty || "Medium",
            estimatedTime: subject.estimatedTime || "6 weeks",
            topics:
              Array.isArray(subject.topics) && subject.topics.length > 0
                ? subject.topics
                : ["General"],
          };
        });

        setSubjects(enrichedSubjects);
      })
      .catch((err) => console.error(err));
  }, []);

  const filteredSubjects = subjects.filter((subject) => {
    const matchesSearch =
      subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.topics.some((topic) =>
        topic.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesDifficulty =
      !selectedDifficulty || subject.difficulty === selectedDifficulty;

    return matchesSearch && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Medium":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Hard":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="p-6 space-y-6 content-area">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 gradient-text">
            Subjects
          </h1>
          <p className="text-slate-600 mt-2">
            Choose a subject to start your learning journey
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search subjects, topics, or descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 form-input"
            />
          </div>
          <div className="flex gap-2">
            {["Easy", "Medium", "Hard"].map((difficulty) => (
              <Button
                key={difficulty}
                variant={
                  selectedDifficulty === difficulty ? "default" : "outline"
                }
                size="sm"
                onClick={() =>
                  setSelectedDifficulty(
                    selectedDifficulty === difficulty ? null : difficulty
                  )
                }
                className={
                  selectedDifficulty === difficulty
                    ? "btn-gradient text-white"
                    : ""
                }
              >
                {difficulty}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {filteredSubjects.map((subject) => {
          const progress = getSubjectProgress(subject.id);
          const progressPercentage =
            subject.chapters > 0
              ? Math.round(
                  (progress.completedChapters / subject.chapters) * 100
                )
              : 0;

          return (
            <Card
              key={subject.id}
              className="subject-card cursor-pointer"
              onClick={() => router.push(`/child/subjects/${subject.id}`)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${subject.gradient}`}
                    >
                      <subject.icon className="h-6 w-6 text-white" />
                    </div>

                    <div>
                      <CardTitle className="text-xl text-slate-800">
                        {subject.name}
                      </CardTitle>
                      <CardDescription className="text-slate-600 mt-1">
                        {subject.description}
                      </CardDescription>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400" />
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700">
                      Progress
                    </span>
                    <span className="text-sm font-semibold text-indigo-600">
                      {progressPercentage}%
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>
                      {progress.completedChapters} of {subject.chapters}{" "}
                      chapters
                    </span>
                    <span>
                      {subject.chapters - progress.completedChapters} remaining
                    </span>
                  </div>
                </div>

                {/* Subject Info */}
                <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-100">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <BookOpen className="h-4 w-4 text-slate-500" />
                    </div>
                    <div className="text-sm font-semibold text-slate-800">
                      {subject.chapters}
                    </div>
                    <div className="text-xs text-slate-500">Chapters</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Clock className="h-4 w-4 text-slate-500" />
                    </div>
                    <div className="text-sm font-semibold text-slate-800">
                      {subject.estimatedTime}
                    </div>
                    <div className="text-xs text-slate-500">Duration</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Target className="h-4 w-4 text-slate-500" />
                    </div>
                    <Badge
                      className={`text-xs ${getDifficultyColor(
                        subject.difficulty
                      )}`}
                    >
                      {subject.difficulty}
                    </Badge>
                  </div>
                </div>

                {/* Topics */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-slate-700">
                    Key Topics
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {subject.topics?.map((topic, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs bg-slate-100 text-slate-600"
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  className="w-full btn-gradient text-white mt-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/child/subjects/${subject.id}`);
                  }}
                >
                  {progressPercentage > 0
                    ? "Continue Learning"
                    : "Start Learning"}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredSubjects.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            No subjects found
          </h3>
          <p className="text-slate-600 mb-4">
            Try adjusting your search terms or difficulty filters
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setSelectedDifficulty(null);
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Study Tips */}
      <Card className="modern-card bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-800">
            <Star className="h-5 w-5 text-indigo-600" />
            Study Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Clock className="h-4 w-4 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-medium text-slate-800">Set a Schedule</h4>
                <p className="text-sm text-slate-600">
                  Study consistently for better retention
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Target className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-medium text-slate-800">Set Goals</h4>
                <p className="text-sm text-slate-600">
                  Break down chapters into smaller tasks
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Award className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-slate-800">Track Progress</h4>
                <p className="text-sm text-slate-600">
                  Monitor your learning journey
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
