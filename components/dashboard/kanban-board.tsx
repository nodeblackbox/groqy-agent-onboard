"use client"
import { useState, type DragEvent } from "react"
import {
  CheckCircle,
  Clipboard,
  Clock,
  Eye,
  FileText,
  Filter,
  Loader,
  MessageSquare,
  Paperclip,
  Plus,
  Search,
  Shield,
  Upload,
  X,
} from "lucide-react"
import { useAgency } from "@/context/agency-context"

// Kanban board data
const initialKanbanData = {
  backlog: [
    {
      id: "task-1",
      title: "Implement User Authentication",
      description: "Add OAuth2 authentication to the platform",
      priority: "HIGH",
      assignee: "Alex Chen",
      dueDate: "2025-04-20",
      tags: ["SECURITY", "BACKEND"],
      comments: 3,
      attachments: 1,
      createdBy: "Emma Wilson",
      createdAt: "2025-04-10",
    },
    {
      id: "task-2",
      title: "Design Landing Page",
      description: "Create wireframes and mockups for the new landing page",
      priority: "MEDIUM",
      assignee: "Sarah Johnson",
      dueDate: "2025-04-22",
      tags: ["DESIGN", "FRONTEND"],
      comments: 5,
      attachments: 2,
      createdBy: "Emma Wilson",
      createdAt: "2025-04-11",
    },
    {
      id: "task-3",
      title: "Analyze User Behavior Data",
      description: "Process and analyze user interaction data from the last quarter",
      priority: "LOW",
      assignee: "DATA_PROCESSOR",
      dueDate: "2025-04-25",
      tags: ["ANALYTICS", "DATA"],
      comments: 1,
      attachments: 0,
      createdBy: "Emma Wilson",
      createdAt: "2025-04-12",
    },
  ],
  inProgress: [
    {
      id: "task-4",
      title: "Optimize Database Queries",
      description: "Improve performance of slow-running database queries",
      priority: "HIGH",
      assignee: "Alex Chen",
      dueDate: "2025-04-18",
      tags: ["BACKEND", "PERFORMANCE"],
      comments: 2,
      attachments: 0,
      createdBy: "Emma Wilson",
      createdAt: "2025-04-09",
    },
    {
      id: "task-5",
      title: "Generate Blog Content",
      description: "Create 5 blog posts about new product features",
      priority: "MEDIUM",
      assignee: "CONTENT_CREATOR",
      dueDate: "2025-04-19",
      tags: ["CONTENT", "MARKETING"],
      comments: 4,
      attachments: 3,
      createdBy: "Emma Wilson",
      createdAt: "2025-04-10",
    },
  ],
  review: [
    {
      id: "task-6",
      title: "Fix Navigation Bug",
      description: "Address issue with dropdown menu not working on mobile devices",
      priority: "HIGH",
      assignee: "Alex Chen",
      dueDate: "2025-04-16",
      tags: ["FRONTEND", "BUG"],
      comments: 6,
      attachments: 2,
      createdBy: "Emma Wilson",
      createdAt: "2025-04-08",
      submittedAt: "2025-04-15",
      submissionNotes: "Fixed the issue by updating the event listeners. Added tests to prevent regression.",
      submissionFiles: ["fix-navigation.zip", "test-results.pdf"],
      qaStatus: "TESTING",
      qaAssignee: "Michael Torres",
    },
  ],
  qa: [
    {
      id: "task-7",
      title: "Test Payment Integration",
      description: "Verify that the new payment gateway integration works correctly",
      priority: "HIGH",
      assignee: "Michael Torres",
      dueDate: "2025-04-17",
      tags: ["TESTING", "PAYMENTS"],
      comments: 8,
      attachments: 3,
      createdBy: "Emma Wilson",
      createdAt: "2025-04-09",
      submittedAt: "2025-04-14",
      submissionNotes: "Implemented the Stripe integration. All test cases are passing.",
      submissionFiles: ["payment-integration.zip", "test-results.pdf"],
      qaStatus: "TESTING",
      qaAssignee: "Michael Torres",
    },
  ],
  done: [
    {
      id: "task-8",
      title: "Update Privacy Policy",
      description: "Update the privacy policy to comply with new regulations",
      priority: "MEDIUM",
      assignee: "CONTENT_CREATOR",
      dueDate: "2025-04-15",
      tags: ["LEGAL", "CONTENT"],
      comments: 4,
      attachments: 1,
      createdBy: "Emma Wilson",
      createdAt: "2025-04-07",
      submittedAt: "2025-04-13",
      submissionNotes: "Updated the policy with all required changes. Legal team has approved.",
      submissionFiles: ["privacy-policy.docx", "legal-approval.pdf"],
      qaStatus: "APPROVED",
      qaAssignee: "Michael Torres",
      completedAt: "2025-04-15",
    },
    {
      id: "task-9",
      title: "Create Onboarding Tutorial",
      description: "Design and implement an interactive onboarding tutorial for new users",
      priority: "HIGH",
      assignee: "Sarah Johnson",
      dueDate: "2025-04-14",
      tags: ["UX", "FRONTEND"],
      comments: 7,
      attachments: 4,
      createdBy: "Emma Wilson",
      createdAt: "2025-04-05",
      submittedAt: "2025-04-12",
      submissionNotes: "Completed the tutorial with 5 interactive steps. User testing showed positive results.",
      submissionFiles: ["onboarding-tutorial.zip", "user-testing-results.pdf"],
      qaStatus: "APPROVED",
      qaAssignee: "Michael Torres",
      completedAt: "2025-04-14",
    },
  ],
}

export default function KanbanBoard() {
  const { allTeamMembers } = useAgency()
  const [kanbanData, setKanbanData] = useState(initialKanbanData)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [draggedTask, setDraggedTask] = useState(null)
  const [dragOverColumn, setDragOverColumn] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterPriority, setFilterPriority] = useState("ALL")
  const [filterAssignee, setFilterAssignee] = useState("ALL")

  // Filter tasks based on search query, priority, and assignee
  const filteredKanbanData = Object.fromEntries(
    Object.entries(kanbanData).map(([column, tasks]) => [
      column,
      tasks.filter((task) => {
        const matchesSearch =
          searchQuery === "" ||
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

        const matchesPriority = filterPriority === "ALL" || task.priority === filterPriority
        const matchesAssignee = filterAssignee === "ALL" || task.assignee === filterAssignee

        return matchesSearch && matchesPriority && matchesAssignee
      }),
    ]),
  )

  // Handle drag start
  const handleDragStart = (e: DragEvent<HTMLDivElement>, task, column) => {
    setDraggedTask({ task, fromColumn: column })
  }

  // Handle drag over
  const handleDragOver = (e: DragEvent<HTMLDivElement>, column) => {
    e.preventDefault()
    setDragOverColumn(column)
  }

  // Handle drop
  const handleDrop = (e: DragEvent<HTMLDivElement>, column) => {
    e.preventDefault()

    if (!draggedTask) return

    // Remove from original column
    const updatedData = { ...kanbanData }
    updatedData[draggedTask.fromColumn] = updatedData[draggedTask.fromColumn].filter(
      (task) => task.id !== draggedTask.task.id,
    )

    // Add to new column
    updatedData[column] = [...updatedData[column], draggedTask.task]

    setKanbanData(updatedData)
    setDraggedTask(null)
    setDragOverColumn(null)
  }

  // Handle task click
  const handleTaskClick = (task) => {
    setSelectedTask(task)
    setShowTaskModal(true)
  }

  // Handle submit task
  const handleSubmitTask = (task) => {
    setSelectedTask(task)
    setShowSubmitModal(true)
    setShowTaskModal(false)
  }

  // Handle new task
  const handleNewTask = () => {
    setSelectedTask(null)
    setShowTaskModal(true)
  }

  // Get column title
  const getColumnTitle = (column) => {
    switch (column) {
      case "backlog":
        return "BACKLOG"
      case "inProgress":
        return "IN PROGRESS"
      case "review":
        return "REVIEW"
      case "qa":
        return "QA"
      case "done":
        return "DONE"
      default:
        return column.toUpperCase()
    }
  }

  // Get column icon
  const getColumnIcon = (column) => {
    switch (column) {
      case "backlog":
        return Clipboard
      case "inProgress":
        return Loader
      case "review":
        return Eye
      case "qa":
        return Shield
      case "done":
        return CheckCircle
      default:
        return FileText
    }
  }

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH":
        return "bg-[#e91e63]"
      case "MEDIUM":
        return "bg-yellow-500"
      case "LOW":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1">
        <h2 className="text-3xl font-bold uppercase">TASK</h2>
        <h2 className="text-3xl font-bold uppercase text-[#e91e63]">MANAGEMENT</h2>
        <h2 className="text-3xl font-bold uppercase">SYSTEM</h2>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <button className="flex items-center space-x-1 px-4 py-2 border border-[#333] rounded-md hover:border-[#e91e63] transition-colors text-sm">
              <Filter size={14} />
              <span>PRIORITY: {filterPriority}</span>
            </button>
            <div className="absolute top-full left-0 mt-1 bg-black border border-[#333] rounded-md shadow-lg z-10 w-full">
              <button
                className="w-full text-left px-3 py-2 hover:bg-[#333]/30 text-sm"
                onClick={() => setFilterPriority("ALL")}
              >
                ALL
              </button>
              <button
                className="w-full text-left px-3 py-2 hover:bg-[#333]/30 text-sm"
                onClick={() => setFilterPriority("HIGH")}
              >
                HIGH
              </button>
              <button
                className="w-full text-left px-3 py-2 hover:bg-[#333]/30 text-sm"
                onClick={() => setFilterPriority("MEDIUM")}
              >
                MEDIUM
              </button>
              <button
                className="w-full text-left px-3 py-2 hover:bg-[#333]/30 text-sm"
                onClick={() => setFilterPriority("LOW")}
              >
                LOW
              </button>
            </div>
          </div>

          <div className="relative">
            <button className="flex items-center space-x-1 px-4 py-2 border border-[#333] rounded-md hover:border-[#e91e63] transition-colors text-sm">
              <Filter size={14} />
              <span>ASSIGNEE</span>
            </button>
            <div className="absolute top-full left-0 mt-1 bg-black border border-[#333] rounded-md shadow-lg z-10 w-48 max-h-48 overflow-y-auto">
              <button
                className="w-full text-left px-3 py-2 hover:bg-[#333]/30 text-sm"
                onClick={() => setFilterAssignee("ALL")}
              >
                ALL
              </button>
              {allTeamMembers.map((member) => (
                <button
                  key={member.id}
                  className="w-full text-left px-3 py-2 hover:bg-[#333]/30 text-sm"
                  onClick={() => setFilterAssignee(member.name)}
                >
                  {member.name}
                </button>
              ))}
            </div>
          </div>

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
          onClick={handleNewTask}
          className="bg-[#e91e63] text-white px-4 py-2 rounded-md text-sm flex items-center space-x-1"
        >
          <Plus size={16} />
          <span>NEW TASK</span>
        </button>
      </div>

      <div className="flex overflow-x-auto pb-4 space-x-4">
        {Object.keys(filteredKanbanData).map((column) => {
          const ColumnIcon = getColumnIcon(column)

          return (
            <div
              key={column}
              className={`flex-shrink-0 w-80 flex flex-col h-[calc(100vh-300px)] min-h-[500px] border ${dragOverColumn === column ? "border-[#e91e63]" : "border-[#333]"} rounded-md bg-black/60`}
              onDragOver={(e) => handleDragOver(e, column)}
              onDrop={(e) => handleDrop(e, column)}
            >
              <div className="p-3 border-b border-[#333] flex items-center justify-between">
                <div className="flex items-center">
                  <ColumnIcon size={16} className="text-[#e91e63] mr-2" />
                  <h3 className="font-bold text-sm">{getColumnTitle(column)}</h3>
                </div>
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#333] text-xs">
                  {filteredKanbanData[column].length}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {filteredKanbanData[column].map((task) => (
                  <div
                    key={task.id}
                    className="border border-[#333] bg-black/40 rounded-md p-3 hover:border-[#e91e63]/30 transition-all duration-300 cursor-pointer"
                    onClick={() => handleTaskClick(task)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task, column)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-sm">{task.title}</h4>
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                    </div>

                    <p className="text-xs text-gray-400 mb-3 line-clamp-2">{task.description}</p>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <MessageSquare size={12} className="text-gray-400 mr-1" />
                          <span className="text-gray-400">{task.comments}</span>
                        </div>

                        <div className="flex items-center">
                          <Paperclip size={12} className="text-gray-400 mr-1" />
                          <span className="text-gray-400">{task.attachments}</span>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Clock size={12} className="text-gray-400 mr-1" />
                        <span className="text-gray-400">{task.dueDate}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-[#333] flex items-center justify-between">
                      <div className="text-xs text-gray-400">
                        Assigned to: <span className="text-white">{task.assignee}</span>
                      </div>

                      {column === "inProgress" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSubmitTask(task)
                          }}
                          className="text-xs text-[#e91e63] hover:underline"
                        >
                          SUBMIT
                        </button>
                      )}

                      {column === "qa" && task.qaStatus && (
                        <div className="flex items-center">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${task.qaStatus === "APPROVED" ? "bg-green-500" : "bg-yellow-500"} mr-1`}
                          ></div>
                          <span className="text-xs">{task.qaStatus}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {filteredKanbanData[column].length === 0 && (
                  <div className="h-full flex items-center justify-center border border-dashed border-[#333] rounded-md">
                    <p className="text-gray-500 text-sm">Drop tasks here</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-black border border-[#333] rounded-md w-full max-w-2xl p-6 relative animate-fadeIn">
            <button
              onClick={() => setShowTaskModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl uppercase font-bold mb-6 flex items-center">
              <FileText className="mr-2 text-[#e91e63]" size={20} />
              {selectedTask ? "TASK DETAILS" : "CREATE NEW TASK"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4 md:col-span-2">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">TITLE</label>
                  <input
                    type="text"
                    className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none"
                    defaultValue={selectedTask?.title || ""}
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">DESCRIPTION</label>
                  <textarea
                    className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none h-20"
                    defaultValue={selectedTask?.description || ""}
                  ></textarea>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">ASSIGNEE</label>
                <select
                  className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none"
                  defaultValue={selectedTask?.assignee || ""}
                >
                  {allTeamMembers.map((member) => (
                    <option key={member.id} value={member.name}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">PRIORITY</label>
                <select
                  className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none"
                  defaultValue={selectedTask?.priority || "MEDIUM"}
                >
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="LOW">LOW</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">DUE DATE</label>
                <input
                  type="date"
                  className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none"
                  defaultValue={selectedTask?.dueDate || ""}
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">TAGS</label>
                <input
                  type="text"
                  className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none"
                  defaultValue={selectedTask?.tags?.join(", ") || ""}
                  placeholder="Separate with commas"
                />
              </div>
            </div>

            {selectedTask && (
              <div className="border-t border-[#333] pt-4 mb-6">
                <h4 className="text-sm uppercase font-bold mb-3">ACTIVITY</h4>
                <div className="space-y-3 max-h-[150px] overflow-y-auto pr-2">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-[#333] flex-shrink-0"></div>
                    <div>
                      <div className="flex items-center">
                        <span className="text-sm font-bold">Emma Wilson</span>
                        <span className="text-xs text-gray-400 ml-2">2 days ago</span>
                      </div>
                      <p className="text-sm text-gray-300">
                        Created this task and assigned it to {selectedTask.assignee}
                      </p>
                    </div>
                  </div>

                  {selectedTask.comments > 0 && (
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-[#333] flex-shrink-0"></div>
                      <div>
                        <div className="flex items-center">
                          <span className="text-sm font-bold">{selectedTask.assignee}</span>
                          <span className="text-xs text-gray-400 ml-2">1 day ago</span>
                        </div>
                        <p className="text-sm text-gray-300">
                          Added a comment: "Working on this now, should be done by tomorrow."
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowTaskModal(false)}
                className="px-4 py-2 border border-[#333] rounded-md hover:border-[#e91e63] transition-colors text-sm"
              >
                CANCEL
              </button>

              {selectedTask && selectedTask.id.includes("task-") && (
                <button
                  onClick={() => handleSubmitTask(selectedTask)}
                  className="px-4 py-2 border border-[#e91e63] text-[#e91e63] rounded-md hover:bg-[#e91e63] hover:text-white transition-colors text-sm"
                >
                  SUBMIT FOR REVIEW
                </button>
              )}

              <button className="px-4 py-2 bg-[#e91e63] rounded-md hover:bg-[#d81b60] transition-colors text-sm">
                {selectedTask ? "UPDATE TASK" : "CREATE TASK"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Task Modal */}
      {showSubmitModal && selectedTask && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-black border border-[#333] rounded-md w-full max-w-2xl p-6 relative animate-fadeIn">
            <button
              onClick={() => setShowSubmitModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl uppercase font-bold mb-6 flex items-center">
              <Upload className="mr-2 text-[#e91e63]" size={20} />
              SUBMIT TASK FOR REVIEW
            </h3>

            <div className="mb-6">
              <div className="border border-[#333] rounded-md p-4 mb-4">
                <h4 className="text-sm font-bold mb-1">{selectedTask.title}</h4>
                <p className="text-xs text-gray-400">{selectedTask.description}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">SUBMISSION NOTES</label>
                  <textarea
                    className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none h-20"
                    placeholder="Describe what you've done and any notes for the reviewer..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">UPLOAD FILES</label>
                  <div className="border border-dashed border-[#333] rounded-md p-8 text-center">
                    <Upload size={24} className="text-gray-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-400 mb-2">Drag and drop files here or click to browse</p>
                    <button className="px-4 py-1 border border-[#333] rounded-md text-xs hover:border-[#e91e63] transition-colors">
                      BROWSE FILES
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 border border-[#333] rounded-md hover:border-[#e91e63] transition-colors text-sm"
              >
                CANCEL
              </button>
              <button className="px-4 py-2 bg-[#e91e63] rounded-md hover:bg-[#d81b60] transition-colors text-sm">
                SUBMIT FOR REVIEW
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
