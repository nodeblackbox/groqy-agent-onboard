"use client"
import { useState, useEffect } from "react"
import { Calendar, Clock, Play, Pause, BarChart2, ChevronLeft, ChevronRight, User, Users } from "lucide-react"
import { useAgency } from "@/context/agency-context"

// Time entry type
interface TimeEntry {
  id: string
  userId: string
  date: string
  checkIn: string
  checkOut: string | null
  totalHours: number | null
  tasks: {
    taskId: string
    title: string
    timeSpent: number // in minutes
  }[]
  notes: string
}

// Sample time entries
const sampleTimeEntries: TimeEntry[] = [
  {
    id: "time-001",
    userId: "1", // Alex Chen
    date: "2025-04-16",
    checkIn: "09:00",
    checkOut: "17:30",
    totalHours: 8.5,
    tasks: [
      { taskId: "task-002", title: "Implement user authentication", timeSpent: 240 },
      { taskId: "task-003", title: "Write API documentation", timeSpent: 120 },
      { taskId: "task-004", title: "Fix navigation bug", timeSpent: 150 },
    ],
    notes: "Productive day, completed all assigned tasks.",
  },
  {
    id: "time-002",
    userId: "1", // Alex Chen
    date: "2025-04-15",
    checkIn: "08:45",
    checkOut: "16:30",
    totalHours: 7.75,
    tasks: [
      { taskId: "task-004", title: "Fix navigation bug", timeSpent: 330 },
      { taskId: "task-005", title: "Create database schema", timeSpent: 135 },
    ],
    notes: "Focused on bug fixes and database work.",
  },
  {
    id: "time-003",
    userId: "1", // Alex Chen
    date: "2025-04-14",
    checkIn: "09:15",
    checkOut: "17:45",
    totalHours: 8.5,
    tasks: [
      { taskId: "task-001", title: "Design homepage mockup", timeSpent: 270 },
      { taskId: "task-002", title: "Implement user authentication", timeSpent: 240 },
    ],
    notes: "Started work on the new authentication system.",
  },
  {
    id: "time-004",
    userId: "1", // Alex Chen
    date: "2025-04-13",
    checkIn: "09:00",
    checkOut: "18:00",
    totalHours: 9,
    tasks: [
      { taskId: "task-001", title: "Design homepage mockup", timeSpent: 360 },
      { taskId: "task-003", title: "Write API documentation", timeSpent: 180 },
    ],
    notes: "Spent most of the day on design work.",
  },
  {
    id: "time-005",
    userId: "1", // Alex Chen
    date: "2025-04-12",
    checkIn: "08:30",
    checkOut: "16:45",
    totalHours: 8.25,
    tasks: [
      { taskId: "task-005", title: "Create database schema", timeSpent: 300 },
      { taskId: "task-003", title: "Write API documentation", timeSpent: 195 },
    ],
    notes: "Focused on database design and documentation.",
  },
]

// Weekly summary type
interface WeeklySummary {
  totalHours: number
  averageHoursPerDay: number
  tasksWorkedOn: number
  mostTimeSpentTask: {
    taskId: string
    title: string
    timeSpent: number
  } | null
}

export default function TimetableView() {
  const { allTeamMembers } = useAgency()
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(sampleTimeEntries)
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [checkInTime, setCheckInTime] = useState<string | null>(null)
  const [elapsedTime, setElapsedTime] = useState<number>(0) // in seconds
  const [activeTab, setActiveTab] = useState<"daily" | "weekly" | "monthly">("daily")
  const [currentUser, setCurrentUser] = useState("1") // Alex Chen's ID
  const [isAdmin, setIsAdmin] = useState(true) // For demo purposes
  const [selectedUser, setSelectedUser] = useState<string | null>(null)

  // Update current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Update elapsed time when checked in
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    if (isCheckedIn && checkInTime) {
      const checkInDate = new Date()
      const [hours, minutes] = checkInTime.split(":").map(Number)
      checkInDate.setHours(hours, minutes, 0, 0)

      timer = setInterval(() => {
        const now = new Date()
        const diffInSeconds = Math.floor((now.getTime() - checkInDate.getTime()) / 1000)
        setElapsedTime(diffInSeconds)
      }, 1000)
    }

    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isCheckedIn, checkInTime])

  // Format time (HH:MM)
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  // Format date (YYYY-MM-DD)
  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  // Format elapsed time (HH:MM:SS)
  const formatElapsedTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`
  }

  // Handle check in
  const handleCheckIn = () => {
    const now = new Date()
    const timeString = formatTime(now)
    setCheckInTime(timeString)
    setIsCheckedIn(true)
    setElapsedTime(0)

    // Create a new time entry
    const newEntry: TimeEntry = {
      id: `time-${Date.now()}`,
      userId: currentUser,
      date: formatDate(now),
      checkIn: timeString,
      checkOut: null,
      totalHours: null,
      tasks: [],
      notes: "",
    }

    setTimeEntries([newEntry, ...timeEntries])
  }

  // Handle check out
  const handleCheckOut = () => {
    const now = new Date()
    const timeString = formatTime(now)

    // Update the latest time entry
    setTimeEntries((prev) => {
      const updated = [...prev]
      const latestEntry = updated[0]

      if (latestEntry && latestEntry.checkIn && !latestEntry.checkOut) {
        const checkInParts = latestEntry.checkIn.split(":").map(Number)
        const checkOutParts = timeString.split(":").map(Number)

        const checkInDate = new Date()
        checkInDate.setHours(checkInParts[0], checkInParts[1], 0, 0)

        const checkOutDate = new Date()
        checkOutDate.setHours(checkOutParts[0], checkOutParts[1], 0, 0)

        const diffInHours = (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60)

        latestEntry.checkOut = timeString
        latestEntry.totalHours = Number.parseFloat(diffInHours.toFixed(2))
      }

      return updated
    })

    setIsCheckedIn(false)
    setCheckInTime(null)
  }

  // Get time entries for selected date
  const getTimeEntriesForDate = (date: Date) => {
    const dateString = formatDate(date)
    return timeEntries.filter(
      (entry) =>
        entry.date === dateString && (selectedUser ? entry.userId === selectedUser : entry.userId === currentUser),
    )
  }

  // Get weekly summary
  const getWeeklySummary = (): WeeklySummary => {
    // Get start and end of week
    const startOfWeek = new Date(selectedDate)
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay())
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)

    // Filter entries for the week
    const weekEntries = timeEntries.filter((entry) => {
      const entryDate = new Date(entry.date)
      return (
        entryDate >= startOfWeek &&
        entryDate <= endOfWeek &&
        (selectedUser ? entry.userId === selectedUser : entry.userId === currentUser)
      )
    })

    // Calculate total hours
    const totalHours = weekEntries.reduce((sum, entry) => sum + (entry.totalHours || 0), 0)

    // Get unique tasks
    const uniqueTasks = new Set(weekEntries.flatMap((entry) => entry.tasks.map((task) => task.taskId)))

    // Calculate time spent on each task
    const taskTimeMap = new Map<string, { title: string; timeSpent: number }>()
    weekEntries.forEach((entry) => {
      entry.tasks.forEach((task) => {
        const existing = taskTimeMap.get(task.taskId)
        if (existing) {
          existing.timeSpent += task.timeSpent
        } else {
          taskTimeMap.set(task.taskId, { title: task.title, timeSpent: task.timeSpent })
        }
      })
    })

    // Find task with most time spent
    let mostTimeSpentTask: { taskId: string; title: string; timeSpent: number } | null = null
    let maxTime = 0

    taskTimeMap.forEach((value, key) => {
      if (value.timeSpent > maxTime) {
        maxTime = value.timeSpent
        mostTimeSpentTask = { taskId: key, title: value.title, timeSpent: value.timeSpent }
      }
    })

    return {
      totalHours,
      averageHoursPerDay: totalHours / 7,
      tasksWorkedOn: uniqueTasks.size,
      mostTimeSpentTask,
    }
  }

  // Format minutes to hours and minutes
  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  // Navigate to previous day/week/month
  const navigatePrevious = () => {
    const newDate = new Date(selectedDate)
    if (activeTab === "daily") {
      newDate.setDate(newDate.getDate() - 1)
    } else if (activeTab === "weekly") {
      newDate.setDate(newDate.getDate() - 7)
    } else {
      newDate.setMonth(newDate.getMonth() - 1)
    }
    setSelectedDate(newDate)
  }

  // Navigate to next day/week/month
  const navigateNext = () => {
    const newDate = new Date(selectedDate)
    if (activeTab === "daily") {
      newDate.setDate(newDate.getDate() + 1)
    } else if (activeTab === "weekly") {
      newDate.setDate(newDate.getDate() + 7)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setSelectedDate(newDate)
  }

  // Format date range for display
  const formatDateRange = () => {
    if (activeTab === "daily") {
      return selectedDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } else if (activeTab === "weekly") {
      const startOfWeek = new Date(selectedDate)
      startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay())
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)
      return `${startOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
    } else {
      return selectedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    }
  }

  // Get user by ID
  const getUserById = (userId: string) => {
    return allTeamMembers.find((member) => member.id.toString() === userId)
  }

  // Render daily view
  const renderDailyView = () => {
    const entries = getTimeEntriesForDate(selectedDate)
    const isToday = formatDate(selectedDate) === formatDate(new Date())

    return (
      <div className="space-y-6">
        {/* Check in/out card - only show for current user and today */}
        {isToday && !selectedUser && (
          <div className="border border-[#333] bg-black/60 rounded-md p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h3 className="text-xl font-bold mb-1">Time Tracking</h3>
                <p className="text-gray-400">
                  {isCheckedIn
                    ? `You checked in at ${checkInTime}. Time elapsed: ${formatElapsedTime(elapsedTime)}`
                    : "You haven't checked in yet today."}
                </p>
              </div>

              <div className="mt-4 md:mt-0">
                {isCheckedIn ? (
                  <button
                    onClick={handleCheckOut}
                    className="flex items-center space-x-2 px-6 py-3 bg-[#e91e63] hover:bg-[#d81b60] text-white rounded-md transition-colors"
                  >
                    <Pause size={18} />
                    <span>Check Out</span>
                  </button>
                ) : (
                  <button
                    onClick={handleCheckIn}
                    className="flex items-center space-x-2 px-6 py-3 bg-[#e91e63] hover:bg-[#d81b60] text-white rounded-md transition-colors"
                  >
                    <Play size={18} />
                    <span>Check In</span>
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-[#333] rounded-md p-4 bg-black/40">
                <div className="flex items-center mb-2">
                  <Clock size={16} className="text-[#e91e63] mr-2" />
                  <h4 className="font-bold">Current Time</h4>
                </div>
                <p className="text-2xl font-bold">{formatTime(currentDate)}</p>
              </div>

              <div className="border border-[#333] rounded-md p-4 bg-black/40">
                <div className="flex items-center mb-2">
                  <Calendar size={16} className="text-[#e91e63] mr-2" />
                  <h4 className="font-bold">Today's Date</h4>
                </div>
                <p className="text-2xl font-bold">
                  {currentDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>

              <div className="border border-[#333] rounded-md p-4 bg-black/40">
                <div className="flex items-center mb-2">
                  <BarChart2 size={16} className="text-[#e91e63] mr-2" />
                  <h4 className="font-bold">Weekly Hours</h4>
                </div>
                <p className="text-2xl font-bold">{getWeeklySummary().totalHours.toFixed(1)}h</p>
              </div>
            </div>
          </div>
        )}

        {/* Time entries for the day */}
        <div className="border border-[#333] bg-black/60 rounded-md p-6">
          <h3 className="text-xl font-bold mb-4">Time Entries</h3>

          {entries.length > 0 ? (
            <div className="space-y-4">
              {entries.map((entry) => (
                <div key={entry.id} className="border border-[#333] rounded-md p-4 bg-black/40">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                    <div>
                      <div className="flex items-center">
                        <Clock size={16} className="text-[#e91e63] mr-2" />
                        <h4 className="font-bold">
                          {entry.checkIn} - {entry.checkOut || "In Progress"}
                        </h4>
                      </div>
                      {entry.totalHours !== null && (
                        <p className="text-gray-400 mt-1">Total: {entry.totalHours.toFixed(2)} hours</p>
                      )}
                    </div>

                    {selectedUser && (
                      <div className="mt-2 md:mt-0 flex items-center">
                        <User size={16} className="text-gray-400 mr-2" />
                        <span>{getUserById(entry.userId)?.name || "Unknown User"}</span>
                      </div>
                    )}
                  </div>

                  {entry.tasks.length > 0 ? (
                    <div className="mb-4">
                      <h5 className="font-medium mb-2">Tasks Worked On:</h5>
                      <div className="space-y-2">
                        {entry.tasks.map((task) => (
                          <div
                            key={task.taskId}
                            className="flex justify-between items-center p-2 bg-black/20 rounded-md"
                          >
                            <span>{task.title}</span>
                            <span className="text-gray-400">{formatMinutes(task.timeSpent)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400 mb-4">No tasks recorded for this time entry.</p>
                  )}

                  {entry.notes && (
                    <div>
                      <h5 className="font-medium mb-1">Notes:</h5>
                      <p className="text-gray-300">{entry.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock size={48} className="text-gray-500 mx-auto mb-4" />
              <h4 className="text-xl font-bold mb-2">No Time Entries</h4>
              <p className="text-gray-400">
                {isToday && !selectedUser
                  ? "You haven't recorded any time entries today."
                  : selectedUser
                    ? `${getUserById(selectedUser)?.name || "This user"} has no time entries for this day.`
                    : "You have no time entries for this day."}
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Render weekly view
  const renderWeeklyView = () => {
    const summary = getWeeklySummary()

    // Get start and end of week
    const startOfWeek = new Date(selectedDate)
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay())

    // Generate array of days in the week
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      return day
    })

    return (
      <div className="space-y-6">
        {/* Weekly summary */}
        <div className="border border-[#333] bg-black/60 rounded-md p-6">
          <h3 className="text-xl font-bold mb-4">Weekly Summary</h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="border border-[#333] rounded-md p-4 bg-black/40">
              <h4 className="text-sm text-gray-400 mb-1">Total Hours</h4>
              <p className="text-2xl font-bold">{summary.totalHours.toFixed(1)}h</p>
            </div>

            <div className="border border-[#333] rounded-md p-4 bg-black/40">
              <h4 className="text-sm text-gray-400 mb-1">Daily Average</h4>
              <p className="text-2xl font-bold">{summary.averageHoursPerDay.toFixed(1)}h</p>
            </div>

            <div className="border border-[#333] rounded-md p-4 bg-black/40">
              <h4 className="text-sm text-gray-400 mb-1">Tasks Worked On</h4>
              <p className="text-2xl font-bold">{summary.tasksWorkedOn}</p>
            </div>

            <div className="border border-[#333] rounded-md p-4 bg-black/40">
              <h4 className="text-sm text-gray-400 mb-1">Most Time Spent On</h4>
              {summary.mostTimeSpentTask ? (
                <div>
                  <p className="font-bold truncate">{summary.mostTimeSpentTask.title}</p>
                  <p className="text-sm text-gray-400">{formatMinutes(summary.mostTimeSpentTask.timeSpent)}</p>
                </div>
              ) : (
                <p className="font-bold">N/A</p>
              )}
            </div>
          </div>

          {/* Daily breakdown */}
          <h4 className="font-bold mb-3">Daily Breakdown</h4>
          <div className="space-y-3">
            {weekDays.map((day) => {
              const entries = getTimeEntriesForDate(day)
              const totalHours = entries.reduce((sum, entry) => sum + (entry.totalHours || 0), 0)
              const isToday = formatDate(day) === formatDate(new Date())

              return (
                <div
                  key={formatDate(day)}
                  className={`flex justify-between items-center p-3 rounded-md ${
                    isToday ? "bg-[#e91e63]/10 border border-[#e91e63]/30" : "bg-black/40 border border-[#333]"
                  }`}
                >
                  <div className="flex items-center">
                    <Calendar size={16} className={`mr-2 ${isToday ? "text-[#e91e63]" : "text-gray-400"}`} />
                    <span className={isToday ? "font-bold" : ""}>
                      {day.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-4">{totalHours.toFixed(1)}h</span>
                    <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#e91e63] rounded-full"
                        style={{ width: `${Math.min(100, (totalHours / 10) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Render monthly view
  const renderMonthlyView = () => {
    // Get start and end of month
    const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
    const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0)

    // Filter entries for the month
    const monthEntries = timeEntries.filter((entry) => {
      const entryDate = new Date(entry.date)
      return (
        entryDate >= startOfMonth &&
        entryDate <= endOfMonth &&
        (selectedUser ? entry.userId === selectedUser : entry.userId === currentUser)
      )
    })

    // Calculate total hours for the month
    const totalHours = monthEntries.reduce((sum, entry) => sum + (entry.totalHours || 0), 0)

    // Calculate hours by week
    const weeklyHours: number[] = [0, 0, 0, 0, 0] // Up to 5 weeks in a month

    monthEntries.forEach((entry) => {
      const entryDate = new Date(entry.date)
      const weekOfMonth = Math.floor((entryDate.getDate() - 1) / 7)
      if (weekOfMonth < 5 && entry.totalHours) {
        weeklyHours[weekOfMonth] += entry.totalHours
      }
    })

    return (
      <div className="space-y-6">
        {/* Monthly summary */}
        <div className="border border-[#333] bg-black/60 rounded-md p-6">
          <h3 className="text-xl font-bold mb-4">Monthly Summary</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="border border-[#333] rounded-md p-4 bg-black/40">
              <h4 className="text-sm text-gray-400 mb-1">Total Hours</h4>
              <p className="text-2xl font-bold">{totalHours.toFixed(1)}h</p>
            </div>

            <div className="border border-[#333] rounded-md p-4 bg-black/40">
              <h4 className="text-sm text-gray-400 mb-1">Working Days</h4>
              <p className="text-2xl font-bold">{new Set(monthEntries.map((entry) => entry.date)).size}</p>
            </div>

            <div className="border border-[#333] rounded-md p-4 bg-black/40">
              <h4 className="text-sm text-gray-400 mb-1">Daily Average</h4>
              <p className="text-2xl font-bold">
                {(totalHours / Math.max(1, new Set(monthEntries.map((entry) => entry.date)).size)).toFixed(1)}h
              </p>
            </div>
          </div>

          {/* Weekly breakdown */}
          <h4 className="font-bold mb-3">Weekly Breakdown</h4>
          <div className="space-y-3">
            {weeklyHours.map((hours, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 bg-black/40 border border-[#333] rounded-md"
              >
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2 text-gray-400" />
                  <span>Week {index + 1}</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-4">{hours.toFixed(1)}h</span>
                  <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#e91e63] rounded-full"
                      style={{ width: `${Math.min(100, (hours / 40) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1">
        <h2 className="text-3xl font-bold uppercase">TIME</h2>
        <h2 className="text-3xl font-bold uppercase text-[#e91e63]">TRACKING</h2>
      </div>

      {/* User selector (admin only) */}
      {isAdmin && (
        <div className="border border-[#333] bg-black/60 rounded-md p-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <h3 className="font-bold mb-2 md:mb-0 flex items-center">
              <Users size={18} className="mr-2 text-[#e91e63]" />
              View Time Entries
            </h3>

            <div className="flex items-center">
              <select
                className="bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none"
                value={selectedUser || ""}
                onChange={(e) => setSelectedUser(e.target.value || null)}
              >
                <option value="">My Time Entries</option>
                {allTeamMembers.map((member) => (
                  <option key={member.id} value={member.id.toString()}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Date navigation and view tabs */}
      <div className="border border-[#333] bg-black/60 rounded-md p-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="flex items-center mb-4 md:mb-0">
            <button
              onClick={navigatePrevious}
              className="p-2 border border-[#333] rounded-md hover:border-[#e91e63] transition-colors mr-2"
            >
              <ChevronLeft size={18} />
            </button>
            <h3 className="font-bold text-lg mx-2">{formatDateRange()}</h3>
            <button
              onClick={navigateNext}
              className="p-2 border border-[#333] rounded-md hover:border-[#e91e63] transition-colors ml-2"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="flex">
            <button
              onClick={() => setActiveTab("daily")}
              className={`px-4 py-2 ${
                activeTab === "daily"
                  ? "bg-[#e91e63] text-white"
                  : "bg-black border border-[#333] text-gray-400 hover:border-[#e91e63]/30"
              } rounded-l-md transition-colors`}
            >
              Daily
            </button>
            <button
              onClick={() => setActiveTab("weekly")}
              className={`px-4 py-2 ${
                activeTab === "weekly"
                  ? "bg-[#e91e63] text-white"
                  : "bg-black border-t border-b border-[#333] text-gray-400 hover:border-[#e91e63]/30"
              } transition-colors`}
            >
              Weekly
            </button>
            <button
              onClick={() => setActiveTab("monthly")}
              className={`px-4 py-2 ${
                activeTab === "monthly"
                  ? "bg-[#e91e63] text-white"
                  : "bg-black border border-[#333] text-gray-400 hover:border-[#e91e63]/30"
              } rounded-r-md transition-colors`}
            >
              Monthly
            </button>
          </div>
        </div>
      </div>

      {/* View content */}
      {activeTab === "daily" && renderDailyView()}
      {activeTab === "weekly" && renderWeeklyView()}
      {activeTab === "monthly" && renderMonthlyView()}
    </div>
  )
}
