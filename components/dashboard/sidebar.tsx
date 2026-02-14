"use client"
import { useState } from "react"
import { useAgency } from "@/context/agency-context"
import {
  LayoutDashboard,
  Users,
  Kanban,
  GitBranch,
  Calendar,
  BarChart2,
  Settings,
  ChevronRight,
  ChevronDown,
  X,
  Clock,
  Bot,
  FileText,
} from "lucide-react"

interface SidebarProps {
  activeView: string
  setActiveView: (view: string) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  isMobile: boolean
  isAdmin: boolean
}

export default function Sidebar({
  activeView,
  setActiveView,
  sidebarOpen,
  setSidebarOpen,
  isMobile,
  isAdmin,
}: SidebarProps) {
  const { currentAgency } = useAgency()
  const [expandedSection, setExpandedSection] = useState<string | null>("main")

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null)
    } else {
      setExpandedSection(section)
    }
  }

  const handleViewChange = (view: string) => {
    setActiveView(view)
    if (isMobile) {
      setSidebarOpen(false)
    }
  }

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-black border-r border-[#333] transition-all duration-300 z-30 ${
        sidebarOpen ? "w-64" : "w-0"
      } overflow-hidden`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-[#333] flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-[#e91e63] rounded-md flex items-center justify-center text-white font-bold mr-3">
              {currentAgency.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-sm font-bold">{currentAgency.name}</h2>
              <p className="text-xs text-gray-400">Command Center</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-400 hover:text-white md:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          {/* Main Navigation */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection("main")}
              className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-400 hover:text-white"
            >
              <span>Main Navigation</span>
              {expandedSection === "main" ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            {expandedSection === "main" && (
              <div className="mt-2 space-y-1">
                <button
                  onClick={() => handleViewChange("dashboard")}
                  className={`flex items-center w-full px-4 py-2 text-sm ${
                    activeView === "dashboard" ? "text-[#e91e63] bg-[#e91e63]/10" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <LayoutDashboard size={16} className="mr-3" />
                  Command Center
                </button>

                <button
                  onClick={() => handleViewChange("team")}
                  className={`flex items-center w-full px-4 py-2 text-sm ${
                    activeView === "team" ? "text-[#e91e63] bg-[#e91e63]/10" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Users size={16} className="mr-3" />
                  Team Management
                </button>

                <button
                  onClick={() => handleViewChange("kanban")}
                  className={`flex items-center w-full px-4 py-2 text-sm ${
                    activeView === "kanban" ? "text-[#e91e63] bg-[#e91e63]/10" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Kanban size={16} className="mr-3" />
                  Kanban Board
                </button>

                <button
                  onClick={() => handleViewChange("workflows")}
                  className={`flex items-center w-full px-4 py-2 text-sm ${
                    activeView === "workflows" ? "text-[#e91e63] bg-[#e91e63]/10" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <GitBranch size={16} className="mr-3" />
                  Workflows
                </button>

                <button
                  onClick={() => handleViewChange("planner")}
                  className={`flex items-center w-full px-4 py-2 text-sm ${
                    activeView === "planner" ? "text-[#e91e63] bg-[#e91e63]/10" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Calendar size={16} className="mr-3" />
                  Weekly Planner
                </button>

                <button
                  onClick={() => handleViewChange("analytics")}
                  className={`flex items-center w-full px-4 py-2 text-sm ${
                    activeView === "analytics" ? "text-[#e91e63] bg-[#e91e63]/10" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <BarChart2 size={16} className="mr-3" />
                  Analytics
                </button>
              </div>
            )}
          </div>

          {/* Task Management */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection("tasks")}
              className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-400 hover:text-white"
            >
              <span>Task Management</span>
              {expandedSection === "tasks" ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            {expandedSection === "tasks" && (
              <div className="mt-2 space-y-1">
                <button
                  onClick={() => handleViewChange("tasks")}
                  className={`flex items-center w-full px-4 py-2 text-sm ${
                    activeView === "tasks" ? "text-[#e91e63] bg-[#e91e63]/10" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <FileText size={16} className="mr-3" />
                  Tasks
                </button>

                <button
                  onClick={() => handleViewChange("timetable")}
                  className={`flex items-center w-full px-4 py-2 text-sm ${
                    activeView === "timetable" ? "text-[#e91e63] bg-[#e91e63]/10" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Clock size={16} className="mr-3" />
                  Timetable
                </button>

                <button
                  onClick={() => handleViewChange("agents")}
                  className={`flex items-center w-full px-4 py-2 text-sm ${
                    activeView === "agents" ? "text-[#e91e63] bg-[#e91e63]/10" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Bot size={16} className="mr-3" />
                  Agent System
                </button>

                <button
                  onClick={() => handleViewChange("workflow-designer")}
                  className={`flex items-center w-full px-4 py-2 text-sm ${
                    activeView === "workflow-designer"
                      ? "text-[#e91e63] bg-[#e91e63]/10"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <GitBranch size={16} className="mr-3" />
                  Workflow Designer
                </button>
              </div>
            )}
          </div>

          {/* Admin Section - Only visible to admins */}
          {isAdmin && (
            <div className="mb-6">
              <button
                onClick={() => toggleSection("admin")}
                className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-400 hover:text-white"
              >
                <span>Administration</span>
                {expandedSection === "admin" ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>

              {expandedSection === "admin" && (
                <div className="mt-2 space-y-1">
                  <button
                    onClick={() => handleViewChange("admin")}
                    className={`flex items-center w-full px-4 py-2 text-sm ${
                      activeView === "admin" ? "text-[#e91e63] bg-[#e91e63]/10" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Settings size={16} className="mr-3" />
                    Settings
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#333]">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-[#333] mr-3"></div>
            <div>
              <p className="text-sm font-medium">Alex Chen</p>
              <p className="text-xs text-gray-400">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
