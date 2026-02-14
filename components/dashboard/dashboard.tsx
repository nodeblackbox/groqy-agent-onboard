"use client"
import { useState, useEffect } from "react"
import { useAgency } from "@/context/agency-context"
import Sidebar from "@/components/dashboard/sidebar"
import Header from "@/components/dashboard/header"
import CommandCenter from "@/components/dashboard/command-center"
import TeamManagement from "@/components/dashboard/team-management"
import KanbanBoard from "@/components/dashboard/kanban-board"
import WorkflowsView from "@/components/dashboard/workflows-view"
import WeeklyPlanner from "@/components/dashboard/weekly-planner"
import AnalyticsView from "@/components/dashboard/analytics-view"
import TasksView from "@/components/dashboard/tasks-view"
import TimetableView from "@/components/dashboard/timetable-view"
import AdminView from "@/components/dashboard/admin-view"
import Onboarding from "@/components/dashboard/onboarding"
import AgentCreationFlow from "@/components/dashboard/agent-creation-flow"
import AgentSystem from "@/components/dashboard/agent-system"
import TaskGeneratorAgent from "@/components/dashboard/task-generator-agent"
// Add import for the new WorkflowDesigner component
import WorkflowDesigner from "@/components/dashboard/workflow-designer"
import { Menu, Plus, Bot } from "lucide-react"

export default function Dashboard() {
  const [activeView, setActiveView] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [showAgentCreation, setShowAgentCreation] = useState(false)
  const { currentAgency } = useAgency()
  const [isAdmin, setIsAdmin] = useState(true) // For demo purposes
  // Add state for showing the task generator
  const [showTaskGenerator, setShowTaskGenerator] = useState(false)

  // Check if mobile on mount and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      }
    }

    // Initial check
    checkIfMobile()

    // Add event listener
    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Check if user has completed onboarding
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem("onboardingCompleted")
    if (hasCompletedOnboarding === "true") {
      setShowOnboarding(false)
    }
  }, [])

  const completeOnboarding = () => {
    localStorage.setItem("onboardingCompleted", "true")
    setShowOnboarding(false)
  }

  const handleAgentCreationComplete = (agentData) => {
    // In a real app, you would save the agent data to your backend
    console.log("Agent created:", agentData)

    // Close the agent creation flow
    setShowAgentCreation(false)

    // Show a success notification (would be implemented in a real app)
    alert(`Agent "${agentData.name}" has been created successfully!`)
  }

  // Add this function to handle task creation
  const handleTaskCreated = (task) => {
    // In a real app, you would update your task state or call an API
    console.log("Task created:", task)

    // If the current view is not tasks, switch to it
    if (activeView !== "tasks") {
      setActiveView("tasks")
    }

    // Add the task to the TasksView component
    // This is a hack to communicate between components without proper state management
    setTimeout(() => {
      // @ts-ignore
      if (window.addTaskToTasksView) {
        // @ts-ignore
        window.addTaskToTasksView(task)

        // Show a success notification
        alert(`Task "${task.title}" has been created successfully!`)
      }
    }, 100)
  }

  if (showOnboarding) {
    return <Onboarding onComplete={completeOnboarding} />
  }

  return (
    <div className="bg-black text-white min-h-screen font-mono relative overflow-hidden flex">
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      {/* Large watermark text */}
      <div className="absolute right-0 top-0 bottom-0 text-[20vw] font-bold text-white/[0.02] pointer-events-none flex items-center">
        {currentAgency.name.split(" ")[0].toUpperCase()}
      </div>

      {/* Mobile overlay - closes sidebar when clicking outside */}
      {sidebarOpen && isMobile && (
        <div className="fixed inset-0 bg-black/50 z-20" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Persistent mobile menu button */}
      {isMobile && !sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 bg-black/80 p-2 rounded-md border border-[#333]"
          aria-label="Open menu"
        >
          <Menu size={20} className="text-[#e91e63]" />
        </button>
      )}

      {/* Sidebar */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isMobile={isMobile}
        isAdmin={isAdmin}
      />

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 w-full ${sidebarOpen && !isMobile ? "md:ml-64" : "ml-0"}`}>
        {/* Content wrapper */}
        <div className="relative z-10 w-full h-full">
          {/* Header */}
          <Header activeView={activeView} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          {/* Create Agent Button */}
          <div className="fixed bottom-6 right-6 z-20 flex space-x-3">
            <button
              onClick={() => setShowTaskGenerator(true)}
              className="bg-[#333] hover:bg-[#444] text-white p-4 rounded-full shadow-lg flex items-center justify-center transition-colors"
              aria-label="Generate tasks"
            >
              <Bot size={24} className="text-[#e91e63]" />
            </button>
            <button
              onClick={() => setShowAgentCreation(true)}
              className="bg-[#e91e63] hover:bg-[#d81b60] text-white p-4 rounded-full shadow-lg flex items-center justify-center transition-colors"
              aria-label="Create new agent"
            >
              <Plus size={24} />
            </button>
          </div>

          {/* Main Content */}
          <main className="py-4 px-4 md:px-6 max-w-full overflow-x-hidden">
            {activeView === "dashboard" && <CommandCenter />}
            {activeView === "team" && <TeamManagement />}
            {activeView === "kanban" && <KanbanBoard />}
            {activeView === "workflows" && <WorkflowsView />}
            {activeView === "planner" && <WeeklyPlanner />}
            {activeView === "analytics" && <AnalyticsView />}
            {activeView === "tasks" && <TasksView />}
            {activeView === "timetable" && <TimetableView />}
            {activeView === "admin" && <AdminView />}
            {activeView === "agents" && <AgentSystem />}
            {/* Add the new workflow designer view */}
            {activeView === "workflow-designer" && <WorkflowDesigner />}
          </main>
        </div>
      </div>

      {/* Agent Creation Flow */}
      {showAgentCreation && (
        <AgentCreationFlow onComplete={handleAgentCreationComplete} onCancel={() => setShowAgentCreation(false)} />
      )}

      {/* Task Generator Agent */}
      {showTaskGenerator && (
        <TaskGeneratorAgent onClose={() => setShowTaskGenerator(false)} onTaskCreated={handleTaskCreated} />
      )}

      {/* CSS for animations and styling */}
      <style jsx global>{`
        /* Glitch text effect */
        .glitch-text {
          position: relative;
          display: inline-block;
        }
        
        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          clip: rect(0, 0, 0, 0);
        }
        
        .glitch-text::before {
          left: 2px;
          text-shadow: -1px 0 #e91e63;
          animation: glitch-anim 2s infinite linear alternate-reverse;
        }
        
        .glitch-text::after {
          left: -2px;
          text-shadow: 1px 0 #e91e63;
          animation: glitch-anim2 3s infinite linear alternate-reverse;
        }
        
        @keyframes glitch-anim {
          0% {
            clip: rect(24px, 550px, 90px, 0);
          }
          20% {
            clip: rect(42px, 550px, 73px, 0);
          }
          40% {
            clip: rect(17px, 550px, 54px, 0);
          }
          60% {
            clip: rect(62px, 550px, 78px, 0);
          }
          80% {
            clip: rect(15px, 550px, 34px, 0);
          }
          100% {
            clip: rect(32px, 550px, 26px, 0);
          }
        }
        
        @keyframes glitch-anim2 {
          0% {
            clip: rect(32px, 550px, 26px, 0);
          }
          20% {
            clip: rect(15px, 550px, 34px, 0);
          }
          40% {
            clip: rect(62px, 550px, 78px, 0);
          }
          60% {
            clip: rect(17px, 550px, 54px, 0);
          }
          80% {
            clip: rect(42px, 550px, 73px, 0);
          }
          100% {
            clip: rect(24px, 550px, 90px, 0);
          }
        }
        
        /* Terminal typing animation */
        .typing-animation {
          overflow: hidden;
          border-right: 2px solid #e91e63;
          white-space: nowrap;
          animation: typing 3s steps(40, end), blink-caret 0.75s step-end infinite;
        }
        
        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }
        
        @keyframes blink-caret {
          from, to { border-color: transparent }
          50% { border-color: #e91e63 }
        }
        
        /* Blinking cursor */
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
        
        @keyframes blink {
          from, to { opacity: 1 }
          50% { opacity: 0 }
        }
        
        /* Progress animation */
        .progress-animation {
          animation: progress 3s infinite;
          width: 0%;
        }
        
        @keyframes progress {
          0% { width: 0% }
          50% { width: 70% }
          100% { width: 0% }
        }
        
        /* Data flow animation */
        .data-flow-animation {
          animation: dataFlow 2s infinite;
          height: 0%;
        }
        
        @keyframes dataFlow {
          0% { height: 0% }
          100% { height: 100% }
        }

        /* Fade In Animation */
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        /* Slide In Animation */
        .animate-slideIn {
          animation: slideIn 0.5s ease-out forwards;
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        /* Pulse Animation */
        .animate-pulse-custom {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        /* Card Flip Animation */
        .card-flip {
          perspective: 1000px;
        }
        
        .card-flip-inner {
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }
        
        .card-flip.flipped .card-flip-inner {
          transform: rotateY(180deg);
        }
        
        .card-flip-front, .card-flip-back {
          backface-visibility: hidden;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        
        .card-flip-back {
          transform: rotateY(180deg);
        }
        
        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #111;
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #e91e63;
        }
        
        /* For Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #333 #111;
        }
        
        /* For Edge and IE */
        .custom-scrollbar {
          -ms-overflow-style: none;
        }
      `}</style>
    </div>
  )
}
