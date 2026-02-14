"use client"
import { useState } from "react"
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
  X,
  AlertCircle,
  Bot,
  Zap,
  GitBranch,
  FileText,
  Database,
  User,
} from "lucide-react"
import { useAgency } from "@/context/agency-context"

// Weekly planner data
const weekDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
const timeSlots = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
]

// Scheduled tasks for the planner
const scheduledTasks = [
  {
    id: "SCH-001",
    title: "DATA ANALYSIS",
    agent: "DATA_PROCESSOR",
    day: "MON",
    startTime: "09:00",
    endTime: "11:00",
    priority: "HIGH",
    status: "CONFIRMED",
    description: "Analyze quarterly sales data and generate insights report",
  },
  {
    id: "SCH-002",
    title: "CONTENT CREATION",
    agent: "CONTENT_CREATOR",
    day: "MON",
    startTime: "14:00",
    endTime: "16:00",
    priority: "MEDIUM",
    status: "CONFIRMED",
    description: "Create blog posts for the company website",
  },
  {
    id: "SCH-003",
    title: "CUSTOMER SUPPORT",
    agent: "SUPPORT_BOT",
    day: "TUE",
    startTime: "10:00",
    endTime: "12:00",
    priority: "LOW",
    status: "CONFIRMED",
    description: "Handle customer inquiries and support tickets",
  },
  {
    id: "SCH-004",
    title: "WORKFLOW OPTIMIZATION",
    agent: "WORKFLOW_MANAGER",
    day: "WED",
    startTime: "13:00",
    endTime: "15:00",
    priority: "HIGH",
    status: "PENDING",
    description: "Optimize existing workflows for better performance",
  },
  {
    id: "SCH-005",
    title: "DATABASE MAINTENANCE",
    agent: "DATA_PROCESSOR",
    day: "THU",
    startTime: "16:00",
    endTime: "18:00",
    priority: "MEDIUM",
    status: "CONFIRMED",
    description: "Perform routine database maintenance and optimization",
  },
  {
    id: "SCH-006",
    title: "SOCIAL MEDIA POSTS",
    agent: "CONTENT_CREATOR",
    day: "FRI",
    startTime: "11:00",
    endTime: "13:00",
    priority: "MEDIUM",
    status: "CONFIRMED",
    description: "Create and schedule social media content for the week",
  },
  {
    id: "SCH-007",
    title: "SYSTEM BACKUP",
    agent: "DATA_PROCESSOR",
    day: "SAT",
    startTime: "08:00",
    endTime: "09:00",
    priority: "HIGH",
    status: "CONFIRMED",
    description: "Perform full system backup and verification",
  },
]

export default function WeeklyPlanner() {
  const { agentAvailability } = useAgency()
  const [selectedWeek, setSelectedWeek] = useState("CURRENT WEEK")
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [newTask, setNewTask] = useState({
    title: "",
    agent: "DATA_PROCESSOR",
    day: "MON",
    startTime: "09:00",
    endTime: "10:00",
    priority: "MEDIUM",
    description: "",
  })

  // Get time slot index
  const getTimeSlotIndex = (time) => {
    return timeSlots.findIndex((slot) => slot === time)
  }

  // Calculate task height based on duration
  const getTaskHeight = (startTime, endTime) => {
    const startIndex = getTimeSlotIndex(startTime)
    const endIndex = getTimeSlotIndex(endTime)
    return (endIndex - startIndex) * 60 // 60px per hour
  }

  // Get color based on agent
  const getAgentColor = (agent) => {
    switch (agent) {
      case "DATA_PROCESSOR":
        return "border-blue-500 bg-blue-500/20"
      case "CONTENT_CREATOR":
        return "border-green-500 bg-green-500/20"
      case "SUPPORT_BOT":
        return "border-yellow-500 bg-yellow-500/20"
      case "WORKFLOW_MANAGER":
        return "border-purple-500 bg-purple-500/20"
      default:
        return "border-gray-500 bg-gray-500/20"
    }
  }

  // Get icon based on agent
  const getAgentIcon = (agent) => {
    switch (agent) {
      case "DATA_PROCESSOR":
        return Database
      case "CONTENT_CREATOR":
        return FileText
      case "SUPPORT_BOT":
        return User
      case "WORKFLOW_MANAGER":
        return GitBranch
      default:
        return Bot
    }
  }

  // Handle task click
  const handleTaskClick = (task) => {
    setSelectedTask(task)
    setShowTaskModal(true)
  }

  // Handle new task
  const handleNewTask = () => {
    setSelectedTask(null)
    setShowTaskModal(true)
  }

  // Handle save task
  const handleSaveTask = () => {
    // In a real app, this would save to a database
    console.log("Saving task:", selectedTask ? selectedTask : newTask)
    setShowTaskModal(false)
  }

  // Handle week navigation
  const changeWeek = (direction) => {
    if (direction === "prev") {
      setSelectedWeek("PREVIOUS WEEK")
    } else if (direction === "next") {
      setSelectedWeek("NEXT WEEK")
    } else {
      setSelectedWeek("CURRENT WEEK")
    }
  }

  return (
    <div className="space-y-6">
      {/* Week selector */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col space-y-1">
          <h2 className="text-3xl font-bold uppercase">AGENT</h2>
          <h2 className="text-3xl font-bold uppercase text-[#e91e63]">SCHEDULER</h2>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => changeWeek("prev")}
            className="p-2 border border-[#333] rounded-md hover:border-[#e91e63] transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="relative">
            <button className="px-4 py-2 border border-[#333] rounded-md flex items-center space-x-2 hover:border-[#e91e63] transition-colors">
              <span>{selectedWeek}</span>
              <ChevronDown size={16} />
            </button>
          </div>
          <button
            onClick={() => changeWeek("next")}
            className="p-2 border border-[#333] rounded-md hover:border-[#e91e63] transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Agent availability */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(agentAvailability).map(([agent, status]) => (
          <div
            key={agent}
            className="border border-[#333] bg-black/60 rounded-md p-4 hover:border-[#e91e63]/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div
                  className={`w-2 h-2 rounded-full ${status.available ? "bg-green-500 animate-pulse" : "bg-yellow-500"} mr-2`}
                ></div>
                <h3 className="text-sm font-bold">{agent}</h3>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded ${status.available ? "bg-green-900/30 text-green-500" : "bg-yellow-900/30 text-yellow-500"}`}
              >
                {status.available ? "AVAILABLE" : "BUSY"}
              </span>
            </div>
            {!status.available && <p className="text-xs text-gray-400">NEXT AVAILABLE: {status.nextAvailable}</p>}
          </div>
        ))}
      </div>

      {/* Weekly schedule */}
      <div className="border border-[#333] bg-black/60 rounded-md p-6 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl uppercase font-bold flex items-center">
            <Calendar className="mr-2 text-[#e91e63]" size={20} />
            WEEKLY SCHEDULE
          </h3>
          <button
            onClick={handleNewTask}
            className="bg-[#e91e63] text-white px-4 py-2 rounded-full text-sm flex items-center"
          >
            <Plus size={16} className="mr-1" /> SCHEDULE TASK
          </button>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            {/* Day headers */}
            <div className="grid grid-cols-8 border-b border-[#333]">
              <div className="p-3 text-center text-xs text-gray-400">TIME</div>
              {weekDays.map((day) => (
                <div key={day} className="p-3 text-center font-bold">
                  {day}
                </div>
              ))}
            </div>

            {/* Time slots */}
            <div className="relative">
              {timeSlots.map((time, i) => (
                <div key={time} className="grid grid-cols-8 border-b border-[#333]">
                  <div className="p-3 text-center text-xs text-gray-400 border-r border-[#333]">{time}</div>
                  {weekDays.map((day) => (
                    <div key={`${day}-${time}`} className="h-[60px] border-r border-[#333] relative"></div>
                  ))}
                </div>
              ))}

              {/* Scheduled tasks */}
              {scheduledTasks.map((task) => {
                const dayIndex = weekDays.indexOf(task.day) + 1 // +1 because first column is time
                const startIndex = getTimeSlotIndex(task.startTime)
                const taskHeight = getTaskHeight(task.startTime, task.endTime)
                const AgentIcon = getAgentIcon(task.agent)

                return (
                  <div
                    key={task.id}
                    onClick={() => handleTaskClick(task)}
                    className={`absolute border-l-4 ${getAgentColor(task.agent)} hover:border-[#e91e63] p-2 rounded-r-md cursor-pointer transition-colors overflow-hidden`}
                    style={{
                      left: `calc(${dayIndex} * 12.5%)`,
                      top: `${startIndex * 60 + 37}px`, // 37px is to account for the header
                      width: "calc(12.5% - 8px)",
                      height: `${taskHeight}px`,
                    }}
                  >
                    <div className="flex items-start mb-1">
                      <div
                        className={`w-2 h-2 rounded-full mt-1 ${task.priority === "HIGH" ? "bg-[#e91e63]" : task.priority === "MEDIUM" ? "bg-yellow-500" : "bg-green-500"} mr-1`}
                      ></div>
                      <h4 className="text-xs font-bold truncate">{task.title}</h4>
                    </div>
                    <div className="flex items-center text-xs text-gray-400">
                      <AgentIcon size={10} className="mr-1" />
                      <span className="truncate">{task.agent}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {task.startTime} - {task.endTime}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-black border border-[#333] rounded-md w-full max-w-md p-6 relative animate-fadeIn">
            <button
              onClick={() => setShowTaskModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl uppercase font-bold mb-6 flex items-center">
              <Calendar className="mr-2 text-[#e91e63]" size={20} />
              {selectedTask ? "TASK DETAILS" : "SCHEDULE NEW TASK"}
            </h3>

            <div className="space-y-4">
              {/* Task Title */}
              <div>
                <label className="block text-xs text-gray-400 mb-1">TASK TITLE</label>
                <input
                  type="text"
                  className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none"
                  value={selectedTask ? selectedTask.title : newTask.title}
                  onChange={(e) =>
                    selectedTask
                      ? setSelectedTask({ ...selectedTask, title: e.target.value })
                      : setNewTask({ ...newTask, title: e.target.value })
                  }
                />
              </div>

              {/* Agent Selection */}
              <div>
                <label className="block text-xs text-gray-400 mb-1">ASSIGN AGENT</label>
                <select
                  className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none"
                  value={selectedTask ? selectedTask.agent : newTask.agent}
                  onChange={(e) =>
                    selectedTask
                      ? setSelectedTask({ ...selectedTask, agent: e.target.value })
                      : setNewTask({ ...newTask, agent: e.target.value })
                  }
                >
                  <option value="DATA_PROCESSOR">DATA_PROCESSOR</option>
                  <option value="CONTENT_CREATOR">CONTENT_CREATOR</option>
                  <option value="SUPPORT_BOT">SUPPORT_BOT</option>
                  <option value="WORKFLOW_MANAGER">WORKFLOW_MANAGER</option>
                </select>
              </div>

              {/* Day and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">DAY</label>
                  <select
                    className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none"
                    value={selectedTask ? selectedTask.day : newTask.day}
                    onChange={(e) =>
                      selectedTask
                        ? setSelectedTask({ ...selectedTask, day: e.target.value })
                        : setNewTask({ ...newTask, day: e.target.value })
                    }
                  >
                    {weekDays.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">PRIORITY</label>
                  <select
                    className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none"
                    value={selectedTask ? selectedTask.priority : newTask.priority}
                    onChange={(e) =>
                      selectedTask
                        ? setSelectedTask({ ...selectedTask, priority: e.target.value })
                        : setNewTask({ ...newTask, priority: e.target.value })
                    }
                  >
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              {/* Time Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">START TIME</label>
                  <select
                    className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none"
                    value={selectedTask ? selectedTask.startTime : newTask.startTime}
                    onChange={(e) =>
                      selectedTask
                        ? setSelectedTask({ ...selectedTask, startTime: e.target.value })
                        : setNewTask({ ...newTask, startTime: e.target.value })
                    }
                  >
                    {timeSlots.slice(0, -1).map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">END TIME</label>
                  <select
                    className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none"
                    value={selectedTask ? selectedTask.endTime : newTask.endTime}
                    onChange={(e) =>
                      selectedTask
                        ? setSelectedTask({ ...selectedTask, endTime: e.target.value })
                        : setNewTask({ ...newTask, endTime: e.target.value })
                    }
                  >
                    {timeSlots.slice(1).map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs text-gray-400 mb-1">DESCRIPTION</label>
                <textarea
                  className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none h-20"
                  value={selectedTask ? selectedTask.description : newTask.description}
                  onChange={(e) =>
                    selectedTask
                      ? setSelectedTask({ ...selectedTask, description: e.target.value })
                      : setNewTask({ ...newTask, description: e.target.value })
                  }
                ></textarea>
              </div>

              {/* Status (for existing tasks) */}
              {selectedTask && (
                <div>
                  <label className="block text-xs text-gray-400 mb-1">STATUS</label>
                  <select
                    className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none"
                    value={selectedTask.status}
                    onChange={(e) => setSelectedTask({ ...selectedTask, status: e.target.value })}
                  >
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="PENDING">PENDING</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              )}

              {/* Conflict Warning */}
              {selectedTask && selectedTask.status === "PENDING" && (
                <div className="flex items-start p-3 bg-yellow-900/20 border border-yellow-900 rounded-md">
                  <AlertCircle size={16} className="text-yellow-500 mr-2 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold text-yellow-500">SCHEDULING CONFLICT</p>
                    <p className="text-gray-400">
                      This agent is already scheduled during this time slot. Confirm to override existing task.
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 border border-[#333] rounded-md hover:border-[#e91e63] transition-colors"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleSaveTask}
                  className="px-4 py-2 bg-[#e91e63] rounded-md hover:bg-[#d81b60] transition-colors"
                >
                  {selectedTask ? "UPDATE TASK" : "SCHEDULE TASK"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Agent Task Load */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-[#333] bg-black/60 rounded-md p-6">
          <h3 className="text-xl uppercase font-bold mb-4 flex items-center">
            <Bot className="mr-2 text-[#e91e63]" size={20} />
            AGENT TASK LOAD
          </h3>
          <div className="space-y-6">
            {Object.keys(agentAvailability).map((agent) => {
              const taskCount = scheduledTasks.filter((task) => task.agent === agent).length
              const maxTasks =
                agent === "DATA_PROCESSOR" ? 10 : agent === "CONTENT_CREATOR" ? 8 : agent === "SUPPORT_BOT" ? 12 : 6
              const percentage = (taskCount / maxTasks) * 100

              return (
                <div key={agent}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{agent}</span>
                    <span>
                      {taskCount}/{maxTasks} TASKS
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${percentage > 80 ? "bg-[#e91e63]" : percentage > 50 ? "bg-yellow-500" : "bg-green-500"}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="border border-[#333] bg-black/60 rounded-md p-6">
          <h3 className="text-xl uppercase font-bold mb-4 flex items-center">
            <Zap className="mr-2 text-[#e91e63]" size={20} />
            QUICK ACTIONS
          </h3>
          <div className="grid grid-cols-1 gap-3">
            <button className="flex items-center justify-between p-3 border border-[#333] rounded-md hover:border-[#e91e63] transition-colors">
              <span className="flex items-center">
                <Calendar className="mr-2 text-[#e91e63]" size={16} />
                AUTO-SCHEDULE ALL PENDING TASKS
              </span>
              <ChevronRight size={16} />
            </button>
            <button className="flex items-center justify-between p-3 border border-[#333] rounded-md hover:border-[#e91e63] transition-colors">
              <span className="flex items-center">
                <Bot className="mr-2 text-[#e91e63]" size={16} />
                OPTIMIZE AGENT WORKLOAD
              </span>
              <ChevronRight size={16} />
            </button>
            <button className="flex items-center justify-between p-3 border border-[#333] rounded-md hover:border-[#e91e63] transition-colors">
              <span className="flex items-center">
                <GitBranch className="mr-2 text-[#e91e63]" size={16} />
                GENERATE WORKFLOW FROM SCHEDULE
              </span>
              <ChevronRight size={16} />
            </button>
            <button className="flex items-center justify-between p-3 border border-[#333] rounded-md hover:border-[#e91e63] transition-colors">
              <span className="flex items-center">
                <FileText className="mr-2 text-[#e91e63]" size={16} />
                EXPORT SCHEDULE
              </span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
