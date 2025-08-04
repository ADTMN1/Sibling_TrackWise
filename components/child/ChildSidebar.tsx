"use client"

import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Home, BookOpen, FileText, Target, User, MessageCircle, BarChart3, Settings, ChevronRight } from "lucide-react"

const navigation = [
  {
    name: "Dashboard",
    href: "/child/dashboard",
    icon: Home,
    current: false,
  },
  {
    name: "Subjects",
    href: "/child/subjects",
    icon: BookOpen,
    current: false,
  },
  {
    name: "Mixed Questions",
    href: "/child/mixed-questions",
    icon: FileText,
    current: false,
    badge: "New",
  },
  {
    name: "Practice Exams",
    href: "/child/practice-exams",
    icon: Target,
    current: false,
  },
  {
    name: "Profile",
    href: "/child/profile",
    icon: User,
    current: false,
  },
]

const quickActions = [
  {
    name: "AI Tutor",
    icon: MessageCircle,
    description: "Get instant help",
    color: "bg-indigo-500",
  },
  {
    name: "Progress",
    icon: BarChart3,
    description: "View your stats",
    color: "bg-emerald-500",
  },
  {
    name: "Settings",
    icon: Settings,
    description: "Customize app",
    color: "bg-slate-500",
  },
]

export function ChildSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-slate-200 sidebar-gradient">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 gradient-text">EduPlatform</h1>
            <p className="text-xs text-slate-500">Learning Made Easy</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-4 py-6">
        {/* Navigation */}
        <nav className="space-y-2">
          <div className="px-2 mb-4">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Navigation</h2>
          </div>
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Button
                key={item.name}
                variant="ghost"
                className={cn(
                  "w-full justify-start h-10 px-3 text-left font-medium transition-all duration-200",
                  isActive
                    ? "nav-active text-white shadow-md"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
                )}
                onClick={() => router.push(item.href)}
              >
                <item.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                <span className="flex-1 truncate">{item.name}</span>
                {item.badge && (
                  <Badge className="ml-2 text-xs bg-indigo-100 text-indigo-700 border-indigo-200">{item.badge}</Badge>
                )}
                {isActive && <ChevronRight className="ml-2 h-4 w-4 flex-shrink-0" />}
              </Button>
            )
          })}
        </nav>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="px-2 mb-4">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Quick Actions</h2>
          </div>
          <div className="space-y-3">
            {quickActions.map((action) => (
              <div
                key={action.name}
                className="modern-card p-3 cursor-pointer hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", action.color)}>
                    <action.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{action.name}</p>
                    <p className="text-xs text-slate-500 truncate">{action.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Study Stats */}
        <div className="mt-8">
          <div className="px-2 mb-4">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Today's Progress</h2>
          </div>
          <div className="modern-card p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Lessons Completed</span>
                <span className="text-sm font-semibold text-indigo-600">3/5</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="progress-bar h-2 rounded-full" style={{ width: "60%" }}></div>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>Keep going!</span>
                <span>60% complete</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200">
        <div className="text-center">
          <p className="text-xs text-slate-400">© 2024 EduPlatform</p>
          <p className="text-xs text-slate-400">Version 2.1.0</p>
        </div>
      </div>
    </div>
  )
}
