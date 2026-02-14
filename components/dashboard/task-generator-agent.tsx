"use client"
import { useState, useEffect } from "react"
import { useAgency } from "@/context/agency-context"
import { Bot, X, RefreshCw, UserPlus, AlertCircle } from "lucide-react"

// Task categories and descriptions for random generation
const taskCategories = [
  "Design",
  "Development",
  "Documentation",
  "Bug Fix",
  "Database",
  "Performance",
  "Legal",
  "Marketing",
  "Research",
  "Testing",
]

const taskPriorities = ["low", "medium", "high"]

const taskTitlePrefixes = [
  "Create",
  "Design",
  "Implement",
  "Update",
  "Fix",
  "Optimize",
  "Review",
  "Test",
  "Document",
  "Research",
]

const taskTitleObjects = [
  "landing page",
  "user authentication",
  "database schema",
  "API endpoints",
  "navigation menu",
  "dashboard widgets",
  "user profile",
  "payment system",
  "notification system",
  "search functionality",
  "analytics dashboard",
  "mobile responsiveness",
  "error handling",
  "performance issues",
  "security vulnerabilities",
]

interface TaskGeneratorAgentProps {
  onClose: () => void
  onTaskCreated: (task: any) => void
}

export default function TaskGeneratorAgent({ onClose, onTaskCreated }: TaskGeneratorAgentProps) {
  const { allTeamMembers } = useAgency()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedTask, setGeneratedTask] = useState<any>(null)
  const [assignee, setAssignee] = useState<string>("")
  const [agentMessages, setAgentMessages] = useState<string[]>([
    "Initializing task generation protocol...",
    "Analyzing project requirements...",
  ])
  const [error, setError] = useState<string | null>(null)

  // Generate a random task
  const generateRandomTask = () => {
    setIsGenerating(true)
    setError(null)
    setGeneratedTask(null)

    // Clear previous messages and start with initial ones
    setAgentMessages(["Initializing task generation protocol...", "Analyzing project requirements..."])

    // Simulate API call with a delay
    const generateWithDelay = async () => {
      try {
        // Add more messages with delays to simulate thinking
        await new Promise((resolve) => setTimeout(resolve, 800))
        setAgentMessages((prev) => [...prev, "Identifying project priorities..."])

        await new Promise((resolve) => setTimeout(resolve, 1200))
        setAgentMessages((prev) => [...prev, "Scanning backlog for similar tasks..."])

        await new Promise((resolve) => setTimeout(resolve, 1000))
        setAgentMessages((prev) => [...prev, "Generating task parameters..."])

        // Generate random task data
        const category = taskCategories[Math.floor(Math.random() * taskCategories.length)]
        const priority = taskPriorities[Math.floor(Math.random() * taskPriorities.length)]
        const titlePrefix = taskTitlePrefixes[Math.floor(Math.random() * taskTitlePrefixes.length)]
        const titleObject = taskTitleObjects[Math.floor(Math.random() * taskTitleObjects.length)]
        const title = `${titlePrefix} ${titleObject}`

        // Generate a more detailed description based on the title
        const description = `This task involves ${titlePrefix.toLowerCase()}ing the ${titleObject} for our platform. 
        The work should follow our established design guidelines and coding standards. 
        Make sure to coordinate with the team for any dependencies and document your approach.`

        // Set due date to a random date between 3 and 14 days from now
        const daysToAdd = Math.floor(Math.random() * 12) + 3
        const dueDate = new Date()
        dueDate.setDate(dueDate.getDate() + daysToAdd)

        // Create the task object
        const task = {
          id: `task-${Date.now()}`,
          title,
          description,
          status: "available",
          priority,
          dueDate: dueDate.toISOString().split("T")[0],
          category,
          attachments: [],
          acceptedFileTypes: [".jpg", ".png", ".pdf", ".doc", ".docx", ".js", ".ts", ".jsx", ".tsx"],
          createdAt: new Date().toISOString(),
        }

        await new Promise((resolve) => setTimeout(resolve, 1500))
        setAgentMessages((prev) => [...prev, "Task generation complete!"])

        setGeneratedTask(task)
        setIsGenerating(false)
      } catch (err) {
        console.error("Error generating task:", err)
        setError("Task generation failed. Please try again.")
        setIsGenerating(false)
      }
    }

    generateWithDelay()
  }

  // Handle task creation
  const handleCreateTask = () => {
    if (!generatedTask) return

    // If assignee is selected, update the task
    const finalTask = assignee
      ? {
          ...generatedTask,
          status: "assigned",
          assignedTo: assignee,
          assignedBy: "AI Task Agent",
        }
      : generatedTask

    onTaskCreated(finalTask)
    onClose()
  }

  // Auto-generate a task when the component mounts
  useEffect(() => {
    generateRandomTask()
  }, [])

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-black border border-[#333] rounded-md w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-[#333] flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-[#e91e63]/20 border border-[#e91e63] flex items-center justify-center mr-3">
              <Bot size={16} className="text-[#e91e63]" />
            </div>
            <h2 className="text-xl font-bold">AI Task Generator</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 max-h-[calc(90vh-80px)] overflow-y-auto custom-scrollbar">
          {/* Agent terminal */}
          <div className="bg-black/60 border border-[#333] rounded-md p-4 mb-6 h-48 overflow-y-auto custom-scrollbar">
            <div className="font-mono text-sm">
              {agentMessages.map((message, index) => (
                <div key={index} className="mb-2">
                  <span className="text-[#e91e63]">AI&gt;</span> {message}
                </div>
              ))}
              {isGenerating && (
                <div className="inline-block">
                  <span className="text-[#e91e63]">AI&gt;</span> <span className="animate-pulse">_</span>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-[#e91e63]/10 border border-[#e91e63] rounded-md p-4 mb-6 flex items-start">
              <AlertCircle size={20} className="text-[#e91e63] mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Error</p>
                <p className="text-sm text-gray-300">{error}</p>
              </div>
            </div>
          )}

          {/* Generated task */}
          {generatedTask && (
            <div className="border border-[#333] rounded-md p-4 mb-6">
              <h3 className="font-bold text-lg mb-2">{generatedTask.title}</h3>
              <p className="text-gray-300 text-sm mb-4">{generatedTask.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-400">Category</p>
                  <p className="font-medium">{generatedTask.category}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Priority</p>
                  <p className="font-medium capitalize">{generatedTask.priority}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Due Date</p>
                  <p className="font-medium">{new Date(generatedTask.dueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Status</p>
                  <p className="font-medium">Available</p>
                </div>
              </div>

              {/* Assignee selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Assign to (optional)</label>
                <select
                  className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {allTeamMembers.map((member) => (
                    <option key={member.id} value={member.name}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-between">
            <button
              onClick={generateRandomTask}
              disabled={isGenerating}
              className="flex items-center px-4 py-2 bg-[#333] hover:bg-[#444] rounded-md transition-colors disabled:opacity-50"
            >
              <RefreshCw size={16} className={`mr-2 ${isGenerating ? "animate-spin" : ""}`} />
              <span>{isGenerating ? "Generating..." : "Generate New Task"}</span>
            </button>

            <div className="space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-[#333] rounded-md hover:border-[#e91e63] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                disabled={!generatedTask || isGenerating}
                className="px-4 py-2 bg-[#e91e63] rounded-md hover:bg-[#d81b60] transition-colors disabled:opacity-50 flex items-center"
              >
                <UserPlus size={16} className="mr-2" />
                <span>Create Task</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
