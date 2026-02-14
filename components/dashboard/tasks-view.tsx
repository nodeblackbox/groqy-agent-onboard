"use client"
import { useState, useRef, useEffect } from "react"
import type React from "react"

import {
  Clock,
  FileText,
  Upload,
  CheckCircle,
  ChevronDown,
  Filter,
  Search,
  Plus,
  X,
  Calendar,
  ImageIcon,
  Code,
  File,
  Archive,
  ExternalLink,
  Users,
} from "lucide-react"
import { useAgency } from "@/context/agency-context"

// Task status types
type TaskStatus = "available" | "assigned" | "in_progress" | "completed"

// Task type
interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: "low" | "medium" | "high"
  dueDate: string
  assignedTo?: string
  assignedBy?: string
  category: string
  attachments: Attachment[]
  acceptedFileTypes?: string[]
  createdAt: string
  completedAt?: string
  timeSpent?: number // in minutes
}

// Attachment type
interface Attachment {
  id: string
  name: string
  type: "image" | "document" | "code" | "archive" | "other"
  url: string
  uploadedBy: string
  uploadedAt: string
}

// Sample tasks data
const sampleTasks: Task[] = [
  {
    id: "task-001",
    title: "Design homepage mockup",
    description: "Create a mockup for the new homepage design based on the provided requirements.",
    status: "available",
    priority: "high",
    dueDate: "2025-04-25",
    category: "Design",
    attachments: [],
    acceptedFileTypes: [".jpg", ".png", ".psd", ".ai", ".fig"],
    createdAt: "2025-04-16T10:30:00Z",
  },
  {
    id: "task-002",
    title: "Implement user authentication",
    description: "Implement user authentication using OAuth2 and JWT tokens.",
    status: "assigned",
    assignedTo: "Alex Chen",
    assignedBy: "Emma Wilson",
    priority: "high",
    dueDate: "2025-04-28",
    category: "Development",
    attachments: [],
    acceptedFileTypes: [".js", ".ts", ".jsx", ".tsx", ".zip"],
    createdAt: "2025-04-16T11:45:00Z",
  },
  {
    id: "task-003",
    title: "Write API documentation",
    description: "Create comprehensive documentation for the new API endpoints.",
    status: "in_progress",
    assignedTo: "Alex Chen",
    assignedBy: "Emma Wilson",
    priority: "medium",
    dueDate: "2025-04-26",
    category: "Documentation",
    attachments: [
      {
        id: "att-001",
        name: "api-endpoints.md",
        type: "document",
        url: "#",
        uploadedBy: "Alex Chen",
        uploadedAt: "2025-04-17T09:15:00Z",
      },
    ],
    acceptedFileTypes: [".md", ".doc", ".docx", ".pdf"],
    createdAt: "2025-04-16T14:20:00Z",
    timeSpent: 120,
  },
  {
    id: "task-004",
    title: "Fix navigation bug",
    description: "Fix the navigation bug that occurs when clicking on the dropdown menu on mobile devices.",
    status: "completed",
    assignedTo: "Alex Chen",
    assignedBy: "Emma Wilson",
    priority: "high",
    dueDate: "2025-04-18",
    category: "Bug Fix",
    attachments: [
      {
        id: "att-002",
        name: "bug-fix.zip",
        type: "archive",
        url: "#",
        uploadedBy: "Alex Chen",
        uploadedAt: "2025-04-18T16:45:00Z",
      },
      {
        id: "att-003",
        name: "screenshot.png",
        type: "image",
        url: "#",
        uploadedBy: "Alex Chen",
        uploadedAt: "2025-04-18T16:40:00Z",
      },
    ],
    acceptedFileTypes: [".js", ".ts", ".jsx", ".tsx", ".zip", ".png", ".jpg"],
    createdAt: "2025-04-16T09:10:00Z",
    completedAt: "2025-04-18T16:50:00Z",
    timeSpent: 480,
  },
  {
    id: "task-005",
    title: "Create database schema",
    description: "Design and create the database schema for the new user management system.",
    status: "available",
    priority: "medium",
    dueDate: "2025-04-30",
    category: "Database",
    attachments: [],
    acceptedFileTypes: [".sql", ".json", ".yaml", ".pdf"],
    createdAt: "2025-04-17T13:25:00Z",
  },
  {
    id: "task-006",
    title: "Optimize image loading",
    description: "Optimize the image loading process to improve page load times.",
    status: "assigned",
    assignedTo: "Sarah Johnson",
    assignedBy: "Emma Wilson",
    priority: "low",
    dueDate: "2025-05-02",
    category: "Performance",
    attachments: [],
    acceptedFileTypes: [".js", ".ts", ".jsx", ".tsx", ".zip"],
    createdAt: "2025-04-17T15:40:00Z",
  },
  {
    id: "task-007",
    title: "Update privacy policy",
    description: "Update the privacy policy to comply with the latest regulations.",
    status: "in_progress",
    assignedTo: "Sarah Johnson",
    assignedBy: "Emma Wilson",
    priority: "medium",
    dueDate: "2025-04-29",
    category: "Legal",
    attachments: [
      {
        id: "att-004",
        name: "privacy-policy-draft.docx",
        type: "document",
        url: "#",
        uploadedBy: "Sarah Johnson",
        uploadedAt: "2025-04-18T11:20:00Z",
      },
    ],
    acceptedFileTypes: [".doc", ".docx", ".pdf"],
    createdAt: "2025-04-17T10:15:00Z",
    timeSpent: 90,
  },
  {
    id: "task-008",
    title: "Create marketing assets",
    description: "Create marketing assets for the new product launch.",
    status: "completed",
    assignedTo: "Sarah Johnson",
    assignedBy: "Emma Wilson",
    priority: "high",
    dueDate: "2025-04-20",
    category: "Marketing",
    attachments: [
      {
        id: "att-005",
        name: "marketing-assets.zip",
        type: "archive",
        url: "#",
        uploadedBy: "Sarah Johnson",
        uploadedAt: "2025-04-20T14:30:00Z",
      },
    ],
    acceptedFileTypes: [".jpg", ".png", ".psd", ".ai", ".zip"],
    createdAt: "2025-04-15T09:30:00Z",
    completedAt: "2025-04-20T14:35:00Z",
    timeSpent: 960,
  },
]

export default function TasksView() {
  const { allTeamMembers } = useAgency()
  const [tasks, setTasks] = useState<Task[]>(sampleTasks)
  const [activeTab, setActiveTab] = useState<TaskStatus>("available")
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPriority, setFilterPriority] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterAssignee, setFilterAssignee] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // New state for dropdown visibility
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false)

  // Get all unique categories
  const categories = Array.from(new Set(tasks.map((task) => task.category)))

  // Get all unique assignees
  const assignees = Array.from(
    new Set(tasks.filter((task) => task.assignedTo).map((task) => task.assignedTo)),
  ) as string[]

  // Filter tasks based on active tab, search query, and filters
  const filteredTasks = tasks.filter((task) => {
    // Filter by tab (status)
    if (task.status !== activeTab) return false

    // Filter by search query
    if (
      searchQuery &&
      !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !task.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Filter by priority
    if (filterPriority !== "all" && task.priority !== filterPriority) return false

    // Filter by category
    if (filterCategory !== "all" && task.category !== filterCategory) return false

    // Filter by assignee
    if (filterAssignee !== "all" && task.assignedTo !== filterAssignee) return false

    return true
  })

  // Handle task click
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setShowTaskModal(true)
  }

  // Handle task status change
  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          const updatedTask = { ...task, status: newStatus }

          // If moving to completed, add completedAt
          if (newStatus === "completed" && !updatedTask.completedAt) {
            updatedTask.completedAt = new Date().toISOString()
          }

          // If moving to in_progress and not already assigned, assign to current user
          if (newStatus === "in_progress" && task.status === "available") {
            updatedTask.assignedTo = "Alex Chen" // Current user (hardcoded for demo)
            updatedTask.assignedBy = "Alex Chen"
          }

          return updatedTask
        }
        return task
      }),
    )

    // Close modal after status change
    setShowTaskModal(false)
  }

  // Add this function after the handleStatusChange function
  // This will be called from the parent component when a task is created
  const addTask = (newTask: Task) => {
    setTasks((prevTasks) => [newTask, ...prevTasks])
  }

  // Expose the addTask function to the parent component
  useEffect(() => {
    if (typeof window !== "undefined") {
      // @ts-ignore - This is a hack to expose the function to the parent
      window.addTaskToTasksView = addTask
    }

    return () => {
      if (typeof window !== "undefined") {
        // @ts-ignore
        delete window.addTaskToTasksView
      }
    }
  }, [])

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || !selectedTask) return

    // Create new attachments
    const newAttachments: Attachment[] = Array.from(files).map((file) => {
      // Determine file type
      let type: Attachment["type"] = "other"
      if (file.type.startsWith("image/")) type = "image"
      else if (file.type.includes("document") || file.name.endsWith(".pdf") || file.name.endsWith(".doc"))
        type = "document"
      else if (
        file.name.endsWith(".js") ||
        file.name.endsWith(".ts") ||
        file.name.endsWith(".jsx") ||
        file.name.endsWith(".tsx")
      )
        type = "code"
      else if (file.name.endsWith(".zip") || file.name.endsWith(".rar")) type = "archive"

      return {
        id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type,
        url: URL.createObjectURL(file), // In a real app, this would be a server URL
        uploadedBy: "Alex Chen", // Current user (hardcoded for demo)
        uploadedAt: new Date().toISOString(),
      }
    })

    // Update task with new attachments
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === selectedTask.id) {
          return {
            ...task,
            attachments: [...task.attachments, ...newAttachments],
          }
        }
        return task
      }),
    )

    // Update selected task
    setSelectedTask((prev) => {
      if (!prev) return null
      return {
        ...prev,
        attachments: [...prev.attachments, ...newAttachments],
      }
    })

    // Close upload modal
    setShowUploadModal(false)
  }

  // Get file icon based on type
  const getFileIcon = (type: Attachment["type"]) => {
    switch (type) {
      case "image":
        return <ImageIcon size={16} />
      case "document":
        return <FileText size={16} />
      case "code":
        return <Code size={16} />
      case "archive":
        return <Archive size={16} />
      default:
        return <File size={16} />
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  // Format time spent
  const formatTimeSpent = (minutes?: number) => {
    if (!minutes) return "N/A"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  // Get priority color
  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-[#e91e63]"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  // Close all dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest(".priority-dropdown") && !target.closest(".priority-button")) {
        setShowPriorityDropdown(false)
      }
      if (!target.closest(".category-dropdown") && !target.closest(".category-button")) {
        setShowCategoryDropdown(false)
      }
      if (!target.closest(".assignee-dropdown") && !target.closest(".assignee-button")) {
        setShowAssigneeDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1">
        <h2 className="text-3xl font-bold uppercase">TASK</h2>
        <h2 className="text-3xl font-bold uppercase text-[#e91e63]">MANAGEMENT</h2>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-1 px-4 py-2 border border-[#333] rounded-md hover:border-[#e91e63] transition-colors text-sm"
          >
            <Filter size={14} />
            <span>FILTERS</span>
            <ChevronDown size={14} className={`ml-1 transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </button>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              placeholder="Search tasks..."
              className="pl-10 pr-4 py-2 bg-black border border-[#333] rounded-md focus:outline-none focus:border-[#e91e63] text-sm w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={() => setShowCreateTaskModal(true)}
          className="bg-[#e91e63] text-white px-4 py-2 rounded-md text-sm flex items-center space-x-1"
        >
          <Plus size={16} />
          <span>NEW TASK</span>
        </button>
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-[#333] rounded-md bg-black/60">
          <div className="relative">
            <label className="block text-sm font-medium mb-2">Priority</label>
            <button
              className="priority-button w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none flex justify-between items-center"
              onClick={() => {
                setShowPriorityDropdown(!showPriorityDropdown)
                setShowCategoryDropdown(false)
                setShowAssigneeDropdown(false)
              }}
            >
              <span>
                {filterPriority === "all"
                  ? "All Priorities"
                  : filterPriority === "high"
                    ? "High"
                    : filterPriority === "medium"
                      ? "Medium"
                      : "Low"}
              </span>
              <ChevronDown size={16} className={`transition-transform ${showPriorityDropdown ? "rotate-180" : ""}`} />
            </button>

            {showPriorityDropdown && (
              <div className="priority-dropdown absolute z-10 mt-1 w-full bg-black border border-[#333] rounded-md shadow-lg">
                <button
                  className={`block w-full text-left px-4 py-2 hover:bg-[#222] ${filterPriority === "all" ? "bg-[#222] text-[#e91e63]" : ""}`}
                  onClick={() => {
                    setFilterPriority("all")
                    setShowPriorityDropdown(false)
                  }}
                >
                  All Priorities
                </button>
                <button
                  className={`block w-full text-left px-4 py-2 hover:bg-[#222] ${filterPriority === "high" ? "bg-[#222] text-[#e91e63]" : ""}`}
                  onClick={() => {
                    setFilterPriority("high")
                    setShowPriorityDropdown(false)
                  }}
                >
                  High
                </button>
                <button
                  className={`block w-full text-left px-4 py-2 hover:bg-[#222] ${filterPriority === "medium" ? "bg-[#222] text-[#e91e63]" : ""}`}
                  onClick={() => {
                    setFilterPriority("medium")
                    setShowPriorityDropdown(false)
                  }}
                >
                  Medium
                </button>
                <button
                  className={`block w-full text-left px-4 py-2 hover:bg-[#222] ${filterPriority === "low" ? "bg-[#222] text-[#e91e63]" : ""}`}
                  onClick={() => {
                    setFilterPriority("low")
                    setShowPriorityDropdown(false)
                  }}
                >
                  Low
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium mb-2">Category</label>
            <button
              className="category-button w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none flex justify-between items-center"
              onClick={() => {
                setShowCategoryDropdown(!showCategoryDropdown)
                setShowPriorityDropdown(false)
                setShowAssigneeDropdown(false)
              }}
            >
              <span>{filterCategory === "all" ? "All Categories" : filterCategory}</span>
              <ChevronDown size={16} className={`transition-transform ${showCategoryDropdown ? "rotate-180" : ""}`} />
            </button>

            {showCategoryDropdown && (
              <div className="category-dropdown absolute z-10 mt-1 w-full bg-black border border-[#333] rounded-md shadow-lg max-h-60 overflow-y-auto">
                <button
                  className={`block w-full text-left px-4 py-2 hover:bg-[#222] ${filterCategory === "all" ? "bg-[#222] text-[#e91e63]" : ""}`}
                  onClick={() => {
                    setFilterCategory("all")
                    setShowCategoryDropdown(false)
                  }}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`block w-full text-left px-4 py-2 hover:bg-[#222] ${filterCategory === category ? "bg-[#222] text-[#e91e63]" : ""}`}
                    onClick={() => {
                      setFilterCategory(category)
                      setShowCategoryDropdown(false)
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium mb-2">Assignee</label>
            <button
              className="assignee-button w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none flex justify-between items-center"
              onClick={() => {
                setShowAssigneeDropdown(!showAssigneeDropdown)
                setShowPriorityDropdown(false)
                setShowCategoryDropdown(false)
              }}
            >
              <span className="flex items-center">
                {filterAssignee === "all" ? (
                  <>
                    <Users size={14} className="mr-2" />
                    All Assignees
                  </>
                ) : (
                  filterAssignee
                )}
              </span>
              <ChevronDown size={16} className={`transition-transform ${showAssigneeDropdown ? "rotate-180" : ""}`} />
            </button>

            {showAssigneeDropdown && (
              <div className="assignee-dropdown absolute z-10 mt-1 w-full bg-black border border-[#333] rounded-md shadow-lg max-h-60 overflow-y-auto">
                <button
                  className={`block w-full text-left px-4 py-2 hover:bg-[#222] ${filterAssignee === "all" ? "bg-[#222] text-[#e91e63]" : ""}`}
                  onClick={() => {
                    setFilterAssignee("all")
                    setShowAssigneeDropdown(false)
                  }}
                >
                  <div className="flex items-center">
                    <Users size={14} className="mr-2" />
                    All Assignees
                  </div>
                </button>
                {assignees.map((assignee) => (
                  <button
                    key={assignee}
                    className={`block w-full text-left px-4 py-2 hover:bg-[#222] ${filterAssignee === assignee ? "bg-[#222] text-[#e91e63]" : ""}`}
                    onClick={() => {
                      setFilterAssignee(assignee)
                      setShowAssigneeDropdown(false)
                    }}
                  >
                    {assignee}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Task tabs */}
      <div className="border-b border-[#333]">
        <div className="flex overflow-x-auto">
          {(["available", "assigned", "in_progress", "completed"] as TaskStatus[]).map((status) => (
            <button
              key={status}
              className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
                activeTab === status
                  ? "border-b-2 border-[#e91e63] text-white"
                  : "text-gray-400 hover:text-white hover:border-b-2 hover:border-[#333]"
              }`}
              onClick={() => setActiveTab(status)}
            >
              {status === "available"
                ? "Available Tasks"
                : status === "assigned"
                  ? "Assigned to Me"
                  : status === "in_progress"
                    ? "In Progress"
                    : "Completed"}
              <span className="ml-2 bg-[#333] px-2 py-0.5 rounded-full text-xs">
                {tasks.filter((t) => t.status === status).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Task list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="border border-[#333] bg-black/60 rounded-md p-4 hover:border-[#e91e63]/30 transition-all duration-300 cursor-pointer"
              onClick={() => handleTaskClick(task)}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg">{task.title}</h3>
                <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
              </div>

              <p className="text-sm text-gray-400 mb-4 line-clamp-2">{task.description}</p>

              <div className="flex justify-between items-center text-xs text-gray-400 mb-3">
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  <span>Due: {formatDate(task.dueDate)}</span>
                </div>
                <span className="bg-[#333] px-2 py-1 rounded-full">{task.category}</span>
              </div>

              {task.assignedTo && (
                <div className="flex justify-between items-center text-xs text-gray-400 mb-3">
                  <span>Assigned to: {task.assignedTo}</span>
                  {task.timeSpent && <span>Time spent: {formatTimeSpent(task.timeSpent)}</span>}
                </div>
              )}

              {task.attachments.length > 0 && (
                <div className="flex items-center text-xs text-gray-400">
                  <FileText size={14} className="mr-1" />
                  <span>{task.attachments.length} attachment(s)</span>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full border border-[#333] bg-black/60 rounded-md p-8 text-center">
            <div className="mb-4 flex justify-center">
              {activeTab === "available" ? (
                <FileText size={48} className="text-gray-500" />
              ) : activeTab === "assigned" ? (
                <Clock size={48} className="text-gray-500" />
              ) : activeTab === "in_progress" ? (
                <Clock size={48} className="text-gray-500" />
              ) : (
                <CheckCircle size={48} className="text-gray-500" />
              )}
            </div>
            <h3 className="text-xl font-bold mb-2">No tasks found</h3>
            <p className="text-gray-400">
              {activeTab === "available"
                ? "There are no available tasks at the moment."
                : activeTab === "assigned"
                  ? "You don't have any assigned tasks."
                  : activeTab === "in_progress"
                    ? "You don't have any tasks in progress."
                    : "You don't have any completed tasks."}
            </p>
          </div>
        )}
      </div>

      {/* Task detail modal */}
      {showTaskModal && selectedTask && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-black border border-[#333] rounded-md w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="p-6 border-b border-[#333] flex justify-between items-center sticky top-0 bg-black z-10">
              <div className="flex items-center">
                <h2 className="text-xl font-bold">{selectedTask.title}</h2>
                <div className={`ml-3 w-3 h-3 rounded-full ${getPriorityColor(selectedTask.priority)}`}></div>
              </div>
              <button onClick={() => setShowTaskModal(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-2">
                  <h3 className="font-bold mb-2">Description</h3>
                  <p className="text-gray-300 mb-6">{selectedTask.description}</p>

                  <h3 className="font-bold mb-2">Attachments</h3>
                  {selectedTask.attachments.length > 0 ? (
                    <div className="space-y-2 mb-6">
                      {selectedTask.attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="flex items-center p-3 border border-[#333] rounded-md bg-black/40"
                        >
                          <div className="mr-3">{getFileIcon(attachment.type)}</div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{attachment.name}</p>
                            <p className="text-xs text-gray-400">
                              Uploaded by {attachment.uploadedBy} on {formatDate(attachment.uploadedAt)}
                            </p>
                          </div>
                          <a
                            href={attachment.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 p-2 text-gray-400 hover:text-white"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink size={16} />
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 mb-6">No attachments</p>
                  )}

                  {/* Upload button - only show for assigned or in_progress tasks */}
                  {(selectedTask.status === "assigned" || selectedTask.status === "in_progress") && (
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-[#333] hover:bg-[#444] rounded-md transition-colors mb-6"
                    >
                      <Upload size={16} />
                      <span>Upload Attachment</span>
                    </button>
                  )}

                  {/* Activity log - simplified for demo */}
                  <h3 className="font-bold mb-2">Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-[#333] flex-shrink-0"></div>
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium">{selectedTask.assignedBy || "System"}</span>
                          <span className="text-xs text-gray-400 ml-2">{formatDate(selectedTask.createdAt)}</span>
                        </div>
                        <p className="text-sm text-gray-300">Created this task</p>
                      </div>
                    </div>

                    {selectedTask.assignedTo && (
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-[#333] flex-shrink-0"></div>
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium">{selectedTask.assignedBy}</span>
                            <span className="text-xs text-gray-400 ml-2">{formatDate(selectedTask.createdAt)}</span>
                          </div>
                          <p className="text-sm text-gray-300">Assigned this task to {selectedTask.assignedTo}</p>
                        </div>
                      </div>
                    )}

                    {selectedTask.completedAt && (
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-[#333] flex-shrink-0"></div>
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium">{selectedTask.assignedTo}</span>
                            <span className="text-xs text-gray-400 ml-2">{formatDate(selectedTask.completedAt)}</span>
                          </div>
                          <p className="text-sm text-gray-300">Marked this task as completed</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="border border-[#333] rounded-md p-4 bg-black/40 mb-6">
                    <h3 className="font-bold mb-4">Details</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-400">Status</p>
                        <p className="font-medium capitalize">{selectedTask.status.replace("_", " ")}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Priority</p>
                        <p className="font-medium capitalize">{selectedTask.priority}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Category</p>
                        <p className="font-medium">{selectedTask.category}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Due Date</p>
                        <p className="font-medium">{formatDate(selectedTask.dueDate)}</p>
                      </div>
                      {selectedTask.assignedTo && (
                        <div>
                          <p className="text-xs text-gray-400">Assigned To</p>
                          <p className="font-medium">{selectedTask.assignedTo}</p>
                        </div>
                      )}
                      {selectedTask.timeSpent && (
                        <div>
                          <p className="text-xs text-gray-400">Time Spent</p>
                          <p className="font-medium">{formatTimeSpent(selectedTask.timeSpent)}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-gray-400">Created At</p>
                        <p className="font-medium">{formatDate(selectedTask.createdAt)}</p>
                      </div>
                      {selectedTask.completedAt && (
                        <div>
                          <p className="text-xs text-gray-400">Completed At</p>
                          <p className="font-medium">{formatDate(selectedTask.completedAt)}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Accepted file types */}
                  {selectedTask.acceptedFileTypes && selectedTask.acceptedFileTypes.length > 0 && (
                    <div className="border border-[#333] rounded-md p-4 bg-black/40 mb-6">
                      <h3 className="font-bold mb-2">Accepted File Types</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedTask.acceptedFileTypes.map((type) => (
                          <span key={type} className="bg-[#333] text-xs px-2 py-1 rounded-full">
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="space-y-3">
                    {selectedTask.status === "available" && (
                      <button
                        onClick={() => handleStatusChange(selectedTask.id, "assigned")}
                        className="w-full py-2 bg-[#e91e63] hover:bg-[#d81b60] text-white rounded-md transition-colors"
                      >
                        Assign to Me
                      </button>
                    )}

                    {selectedTask.status === "assigned" && (
                      <button
                        onClick={() => handleStatusChange(selectedTask.id, "in_progress")}
                        className="w-full py-2 bg-[#e91e63] hover:bg-[#d81b60] text-white rounded-md transition-colors"
                      >
                        Start Working
                      </button>
                    )}

                    {selectedTask.status === "in_progress" && (
                      <button
                        onClick={() => handleStatusChange(selectedTask.id, "completed")}
                        className="w-full py-2 bg-[#e91e63] hover:bg-[#d81b60] text-white rounded-md transition-colors"
                      >
                        Mark as Completed
                      </button>
                    )}

                    {selectedTask.status === "completed" && (
                      <button
                        onClick={() => handleStatusChange(selectedTask.id, "in_progress")}
                        className="w-full py-2 bg-[#333] hover:bg-[#444] text-white rounded-md transition-colors"
                      >
                        Reopen Task
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload modal */}
      {showUploadModal && selectedTask && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-black border border-[#333] rounded-md w-full max-w-md">
            <div className="p-6 border-b border-[#333] flex justify-between items-center">
              <h2 className="text-xl font-bold">Upload Attachment</h2>
              <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="border border-dashed border-[#333] rounded-lg p-8 text-center mb-6">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  multiple
                  className="hidden"
                  accept={selectedTask.acceptedFileTypes?.join(",")}
                />

                <div className="mb-4 flex justify-center">
                  <Upload size={48} className="text-gray-500" />
                </div>
                <p className="text-gray-400 mb-4">Drag and drop files here, or click to browse</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-[#333] hover:bg-[#444] text-white px-4 py-2 rounded-md transition-colors"
                >
                  Select Files
                </button>
              </div>

              {selectedTask.acceptedFileTypes && selectedTask.acceptedFileTypes.length > 0 && (
                <div>
                  <p className="text-sm text-gray-400 mb-2">Accepted file types:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTask.acceptedFileTypes.map((type) => (
                      <span key={type} className="bg-[#333] text-xs px-2 py-1 rounded-full">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {showCreateTaskModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-black border border-[#333] rounded-md w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="p-6 border-b border-[#333] flex justify-between items-center sticky top-0 bg-black z-10">
              <h2 className="text-xl font-bold">Create New Task</h2>
              <button onClick={() => setShowCreateTaskModal(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <form className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none"
                    placeholder="Enter task title"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none"
                    placeholder="Enter task description"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium mb-2">
                      Priority
                    </label>
                    <select
                      id="priority"
                      className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium mb-2">
                      Category
                    </label>
                    <select
                      id="category"
                      className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      id="dueDate"
                      className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="assignee" className="block text-sm font-medium mb-2">
                      Assign To
                    </label>
                    <select
                      id="assignee"
                      className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none"
                    >
                      <option value="">Unassigned</option>
                      {assignees.map((assignee) => (
                        <option key={assignee} value={assignee}>
                          {assignee}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Accepted File Types</label>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center">
                      <input type="checkbox" id="jpg" className="mr-2" />
                      <label htmlFor="jpg">.jpg</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="png" className="mr-2" />
                      <label htmlFor="png">.png</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="pdf" className="mr-2" />
                      <label htmlFor="pdf">.pdf</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="doc" className="mr-2" />
                      <label htmlFor="doc">.doc</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="zip" className="mr-2" />
                      <label htmlFor="zip">.zip</label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateTaskModal(false)}
                    className="px-4 py-2 border border-[#333] rounded-md hover:bg-[#222] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      // In a real app, this would create a new task
                      const newTask: Task = {
                        id: `task-${Date.now()}`,
                        title: "New Task",
                        description: "This is a new task created by the user.",
                        status: "available",
                        priority: "medium",
                        dueDate: new Date().toISOString().split("T")[0],
                        category: "Other",
                        attachments: [],
                        acceptedFileTypes: [".jpg", ".png", ".pdf"],
                        createdAt: new Date().toISOString(),
                      }
                      addTask(newTask)
                      setShowCreateTaskModal(false)
                    }}
                    className="px-4 py-2 bg-[#e91e63] hover:bg-[#d81b60] text-white rounded-md transition-colors"
                  >
                    Create Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
