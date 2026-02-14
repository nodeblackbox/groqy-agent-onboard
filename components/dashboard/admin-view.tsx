"use client"
import { useState } from "react"
import {
  Users,
  FileText,
  Search,
  Plus,
  X,
  User,
  Filter,
  ChevronDown,
  BarChart2,
  Settings,
  Trash2,
  Edit,
  Bot,
} from "lucide-react"
import { useAgency } from "@/context/agency-context"

// Task type (simplified from TasksView)
interface Task {
  id: string
  title: string
  description: string
  status: "available" | "assigned" | "in_progress" | "completed"
  priority: "low" | "medium" | "high"
  dueDate: string
  assignedTo?: string
  assignedBy?: string
  category: string
  createdAt: string
  completedAt?: string
  timeSpent?: number // in minutes
}

// Sample tasks data (simplified)
const sampleTasks: Task[] = [
  {
    id: "task-001",
    title: "Design homepage mockup",
    description: "Create a mockup for the new homepage design based on the provided requirements.",
    status: "available",
    priority: "high",
    dueDate: "2025-04-25",
    category: "Design",
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
    createdAt: "2025-04-15T09:30:00Z",
    completedAt: "2025-04-20T14:35:00Z",
    timeSpent: 960,
  },
]

export default function AdminView() {
  const { allTeamMembers } = useAgency()
  const [tasks, setTasks] = useState<Task[]>(sampleTasks)
  const [activeTab, setActiveTab] = useState<"tasks" | "team" | "analytics">("tasks")
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterAssignee, setFilterAssignee] = useState<string>("all")
  const [showFilters, setShowFilters] = useState(false)
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    priority: "medium",
    category: "Development",
    dueDate: new Date().toISOString().split("T")[0],
  })

  // Get all unique categories
  const categories = Array.from(new Set(tasks.map((task) => task.category)))

  // Filter tasks based on search query and filters
  const filteredTasks = tasks.filter((task) => {
    // Filter by search query
    if (
      searchQuery &&
      !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !task.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Filter by status
    if (filterStatus !== "all" && task.status !== filterStatus) return false

    // Filter by assignee
    if (filterAssignee !== "all" && task.assignedTo !== filterAssignee) return false

    return true
  })

  // Handle task click
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setShowTaskModal(true)
  }

  // Handle task assignment
  const handleAssignTask = (taskId: string, userId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            status: "assigned",
            assignedTo: allTeamMembers.find((member) => member.id.toString() === userId)?.name || "",
            assignedBy: "Emma Wilson", // Current admin (hardcoded for demo)
          }
        }
        return task
      }),
    )

    // Close modal after assignment
    setShowTaskModal(false)
  }

  // Handle create task
  const handleCreateTask = () => {
    // Validate required fields
    if (!newTask.title || !newTask.description || !newTask.dueDate) {
      alert("Please fill in all required fields")
      return
    }

    // Create new task
    const task: Task = {
      id: `task-${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      status: "available",
      priority: (newTask.priority as "low" | "medium" | "high") || "medium",
      dueDate: newTask.dueDate,
      category: newTask.category || "Development",
      createdAt: new Date().toISOString(),
    }

    // Add to tasks
    setTasks([task, ...tasks])

    // Reset form and close modal
    setNewTask({
      title: "",
      description: "",
      priority: "medium",
      category: "Development",
      dueDate: new Date().toISOString().split("T")[0],
    })
    setShowCreateTaskModal(false)
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
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

  // Get status color
  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "available":
        return "bg-blue-500"
      case "assigned":
        return "bg-yellow-500"
      case "in_progress":
        return "bg-purple-500"
      case "completed":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  // Render tasks tab
  const renderTasksTab = () => {
    return (
      <div className="space-y-6">
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
            <span>CREATE TASK</span>
          </button>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-[#333] rounded-md bg-black/60">
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="available">Available</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Assignee</label>
              <select
                className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none"
                value={filterAssignee}
                onChange={(e) => setFilterAssignee(e.target.value)}
              >
                <option value="all">All Assignees</option>
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

        {/* Task list */}
        <div className="border border-[#333] bg-black/60 rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-black/40 border-b border-[#333]">
                  <th className="px-4 py-3 text-left">Task</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Assignee</th>
                  <th className="px-4 py-3 text-left">Due Date</th>
                  <th className="px-4 py-3 text-left">Priority</th>
                  <th className="px-4 py-3 text-left">Category</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <tr
                      key={task.id}
                      className="border-b border-[#333] hover:bg-black/40 cursor-pointer"
                      onClick={() => handleTaskClick(task)}
                    >
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-xs text-gray-400 truncate max-w-[200px]">{task.description}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(task.status)} mr-2`}></div>
                          <span className="capitalize">{task.status.replace("_", " ")}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{task.assignedTo || "Unassigned"}</td>
                      <td className="px-4 py-3">{formatDate(task.dueDate)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)} mr-2`}></div>
                          <span className="capitalize">{task.priority}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{task.category}</td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              // Edit task (would be implemented in a real app)
                              alert("Edit task functionality would be implemented here")
                            }}
                            className="p-1 text-gray-400 hover:text-white"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              // Delete task (would be implemented in a real app)
                              if (confirm("Are you sure you want to delete this task?")) {
                                setTasks(tasks.filter((t) => t.id !== task.id))
                              }
                            }}
                            className="p-1 text-gray-400 hover:text-[#e91e63]"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center">
                      <FileText size={48} className="text-gray-500 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">No tasks found</h3>
                      <p className="text-gray-400">Try adjusting your filters or create a new task.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  // Render team tab
  const renderTeamTab = () => {
    return (
      <div className="space-y-6">
        <div className="border border-[#333] bg-black/60 rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-black/40 border-b border-[#333]">
                  <th className="px-4 py-3 text-left">Team Member</th>
                  <th className="px-4 py-3 text-left">Role</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Tasks Assigned</th>
                  <th className="px-4 py-3 text-left">Tasks Completed</th>
                  <th className="px-4 py-3 text-left">Performance</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allTeamMembers.map((member) => {
                  const assignedTasks = tasks.filter((task) => task.assignedTo === member.name)
                  const completedTasks = assignedTasks.filter((task) => task.status === "completed")

                  return (
                    <tr key={member.id} className="border-b border-[#333] hover:bg-black/40">
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          {member.type === "HUMAN" ? (
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-[#333] flex-shrink-0 mr-3">
                              <img
                                src={member.avatar || "/placeholder.svg?height=32&width=32&query=person"}
                                alt={member.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-[#e91e63]/20 border border-[#e91e63] flex items-center justify-center mr-3">
                              <Bot size={16} className="text-[#e91e63]" />
                            </div>
                          )}
                          <span className="font-medium">{member.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{member.role}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              member.status === "ONLINE" ? "bg-green-500 animate-pulse" : "bg-gray-500"
                            } mr-2`}
                          ></div>
                          <span>{member.status}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{assignedTasks.length}</td>
                      <td className="px-4 py-3">{completedTasks.length}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden mr-2">
                            <div
                              className="h-full bg-[#e91e63] rounded-full"
                              style={{ width: `${member.performance}%` }}
                            ></div>
                          </div>
                          <span>{member.performance}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              // View member details (would be implemented in a real app)
                              alert(`View details for ${member.name}`)
                            }}
                            className="p-1 text-gray-400 hover:text-white"
                          >
                            <User size={16} />
                          </button>
                          <button
                            onClick={() => {
                              // Edit member settings (would be implemented in a real app)
                              alert(`Edit settings for ${member.name}`)
                            }}
                            className="p-1 text-gray-400 hover:text-white"
                          >
                            <Settings size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  // Render analytics tab
  const renderAnalyticsTab = () => {
    // Calculate task statistics
    const totalTasks = tasks.length
    const availableTasks = tasks.filter((task) => task.status === "available").length
    const assignedTasks = tasks.filter((task) => task.status === "assigned").length
    const inProgressTasks = tasks.filter((task) => task.status === "in_progress").length
    const completedTasks = tasks.filter((task) => task.status === "completed").length

    // Calculate completion rate
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

    // Calculate tasks by category
    const tasksByCategory = categories.map((category) => ({
      category,
      count: tasks.filter((task) => task.category === category).length,
    }))

    // Calculate tasks by assignee
    const tasksByAssignee = allTeamMembers.map((member) => ({
      name: member.name,
      assigned: tasks.filter((task) => task.assignedTo === member.name).length,
      completed: tasks.filter((task) => task.assignedTo === member.name && task.status === "completed").length,
    }))

    return (
      <div className="space-y-6">
        {/* Task statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border border-[#333] bg-black/60 rounded-md p-4">
            <h3 className="text-sm text-gray-400 mb-1">Total Tasks</h3>
            <p className="text-2xl font-bold">{totalTasks}</p>
            <div className="mt-2 flex items-center text-xs">
              <div className="flex-1 grid grid-cols-4 gap-1">
                <div className="h-1 bg-blue-500 rounded-full"></div>
                <div className="h-1 bg-yellow-500 rounded-full"></div>
                <div className="h-1 bg-purple-500 rounded-full"></div>
                <div className="h-1 bg-green-500 rounded-full"></div>
              </div>
              <span className="ml-2 text-gray-400">All statuses</span>
            </div>
          </div>

          <div className="border border-[#333] bg-black/60 rounded-md p-4">
            <h3 className="text-sm text-gray-400 mb-1">Completion Rate</h3>
            <p className="text-2xl font-bold">{completionRate.toFixed(1)}%</p>
            <div className="mt-2 flex items-center text-xs">
              <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${completionRate}%` }}></div>
              </div>
              <span className="ml-2 text-gray-400">
                {completedTasks} of {totalTasks}
              </span>
            </div>
          </div>

          <div className="border border-[#333] bg-black/60 rounded-md p-4">
            <h3 className="text-sm text-gray-400 mb-1">Tasks by Status</h3>
            <div className="flex items-center justify-between">
              <div className="space-y-2 w-full">
                <div className="flex justify-between items-center text-xs">
                  <span>Available</span>
                  <span>{availableTasks}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>Assigned</span>
                  <span>{assignedTasks}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>In Progress</span>
                  <span>{inProgressTasks}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>Completed</span>
                  <span>{completedTasks}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-[#333] bg-black/60 rounded-md p-4">
            <h3 className="text-sm text-gray-400 mb-1">Tasks by Priority</h3>
            <div className="space-y-2 mt-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>High</span>
                  <span>{tasks.filter((t) => t.priority === "high").length}</span>
                </div>
                <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#e91e63] rounded-full"
                    style={{ width: `${(tasks.filter((t) => t.priority === "high").length / totalTasks) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Medium</span>
                  <span>{tasks.filter((t) => t.priority === "medium").length}</span>
                </div>
                <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 rounded-full"
                    style={{ width: `${(tasks.filter((t) => t.priority === "medium").length / totalTasks) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Low</span>
                  <span>{tasks.filter((t) => t.priority === "low").length}</span>
                </div>
                <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${(tasks.filter((t) => t.priority === "low").length / totalTasks) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks by category */}
        <div className="border border-[#333] bg-black/60 rounded-md p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <BarChart2 className="mr-2 text-[#e91e63]" size={20} />
            Tasks by Category
          </h3>

          <div className="space-y-4">
            {tasksByCategory.map(({ category, count }) => (
              <div key={category}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{category}</span>
                  <span>{count}</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#e91e63] rounded-full"
                    style={{ width: `${(count / totalTasks) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team performance */}
        <div className="border border-[#333] bg-black/60 rounded-md p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <Users className="mr-2 text-[#e91e63]" size={20} />
            Team Performance
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#333]">
                  <th className="px-4 py-2 text-left">Team Member</th>
                  <th className="px-4 py-2 text-left">Tasks Assigned</th>
                  <th className="px-4 py-2 text-left">Tasks Completed</th>
                  <th className="px-4 py-2 text-left">Completion Rate</th>
                </tr>
              </thead>
              <tbody>
                {tasksByAssignee.map(({ name, assigned, completed }) => (
                  <tr key={name} className="border-b border-[#333]">
                    <td className="px-4 py-3">{name}</td>
                    <td className="px-4 py-3">{assigned}</td>
                    <td className="px-4 py-3">{completed}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden mr-2">
                          <div
                            className="h-full bg-[#e91e63] rounded-full"
                            style={{ width: `${assigned > 0 ? (completed / assigned) * 100 : 0}%` }}
                          ></div>
                        </div>
                        <span>{assigned > 0 ? ((completed / assigned) * 100).toFixed(0) : 0}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1">
        <h2 className="text-3xl font-bold uppercase">ADMIN</h2>
        <h2 className="text-3xl font-bold uppercase text-[#e91e63]">DASHBOARD</h2>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#333]">
        <div className="flex overflow-x-auto">
          <button
            className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
              activeTab === "tasks"
                ? "border-b-2 border-[#e91e63] text-white"
                : "text-gray-400 hover:text-white hover:border-b-2 hover:border-[#333]"
            }`}
            onClick={() => setActiveTab("tasks")}
          >
            Task Management
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
              activeTab === "team"
                ? "border-b-2 border-[#e91e63] text-white"
                : "text-gray-400 hover:text-white hover:border-b-2 hover:border-[#333]"
            }`}
            onClick={() => setActiveTab("team")}
          >
            Team Management
          </button>
          <button
            className={`px-6 py-3 font-medium text-sm whitespace-nowrap ${
              activeTab === "analytics"
                ? "border-b-2 border-[#e91e63] text-white"
                : "text-gray-400 hover:text-white hover:border-b-2 hover:border-[#333]"
            }`}
            onClick={() => setActiveTab("analytics")}
          >
            Analytics
          </button>
        </div>
      </div>

      {/* Tab content */}
      {activeTab === "tasks" && renderTasksTab()}
      {activeTab === "team" && renderTeamTab()}
      {activeTab === "analytics" && renderAnalyticsTab()}

      {/* Task detail modal */}
      {showTaskModal && selectedTask && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-black border border-[#333] rounded-md w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
                          <p className="font-medium">
                            {Math.floor(selectedTask.timeSpent / 60)}h {selectedTask.timeSpent % 60}m
                          </p>
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

                  {/* Assign task section */}
                  {selectedTask.status === "available" && (
                    <div className="border border-[#333] rounded-md p-4 bg-black/40">
                      <h3 className="font-bold mb-2">Assign Task</h3>
                      <p className="text-sm text-gray-400 mb-3">Select a team member to assign this task to:</p>

                      <div className="space-y-2">
                        {allTeamMembers.map((member) => (
                          <button
                            key={member.id}
                            onClick={() => handleAssignTask(selectedTask.id, member.id.toString())}
                            className="flex items-center w-full p-2 border border-[#333] rounded-md hover:border-[#e91e63] transition-colors"
                          >
                            {member.type === "HUMAN" ? (
                              <div className="w-6 h-6 rounded-full overflow-hidden bg-[#333] flex-shrink-0 mr-2">
                                <img
                                  src={member.avatar || "/placeholder.svg?height=24&width=24&query=person"}
                                  alt={member.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-[#e91e63]/20 border border-[#e91e63] flex items-center justify-center mr-2">
                                <Bot size={12} className="text-[#e91e63]" />
                              </div>
                            )}
                            <div className="flex-1 text-left">
                              <p className="font-medium text-sm">{member.name}</p>
                              <p className="text-xs text-gray-400">{member.role}</p>
                            </div>
                            <div className="flex items-center">
                              <div
                                className={`w-2 h-2 rounded-full ${member.status === "ONLINE" ? "bg-green-500" : "bg-gray-500"} mr-1`}
                              ></div>
                              <span className="text-xs">{member.status}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create task modal */}
      {showCreateTaskModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-black border border-[#333] rounded-md w-full max-w-2xl">
            <div className="p-6 border-b border-[#333] flex justify-between items-center">
              <h2 className="text-xl font-bold">Create New Task</h2>
              <button onClick={() => setShowCreateTaskModal(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title *</label>
                  <input
                    type="text"
                    className="w-full bg-black border border-[#333] rounded-md p-3 focus:border-[#e91e63] focus:outline-none"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Enter task title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description *</label>
                  <textarea
                    className="w-full h-32 bg-black border border-[#333] rounded-md p-3 focus:border-[#e91e63] focus:outline-none resize-none"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Enter task description"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Priority</label>
                    <select
                      className="w-full bg-black border border-[#333] rounded-md p-3 focus:border-[#e91e63] focus:outline-none"
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                      className="w-full bg-black border border-[#333] rounded-md p-3 focus:border-[#e91e63] focus:outline-none"
                      value={newTask.category}
                      onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Due Date *</label>
                  <input
                    type="date"
                    className="w-full bg-black border border-[#333] rounded-md p-3 focus:border-[#e91e63] focus:outline-none"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateTaskModal(false)}
                  className="px-4 py-2 border border-[#333] rounded-md hover:border-[#e91e63] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTask}
                  className="px-4 py-2 bg-[#e91e63] rounded-md hover:bg-[#d81b60] transition-colors"
                >
                  Create Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
