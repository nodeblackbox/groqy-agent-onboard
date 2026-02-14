"use client"
import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Calendar, Filter, Download } from "lucide-react"

// Sample data for charts
const weeklyData = [
  { name: "MON", tasks: 12, bugs: 5, workflows: 3 },
  { name: "TUE", tasks: 19, bugs: 3, workflows: 5 },
  { name: "WED", tasks: 15, bugs: 8, workflows: 2 },
  { name: "THU", tasks: 22, bugs: 4, workflows: 7 },
  { name: "FRI", tasks: 18, bugs: 6, workflows: 4 },
  { name: "SAT", tasks: 8, bugs: 2, workflows: 1 },
  { name: "SUN", tasks: 5, bugs: 1, workflows: 0 },
]

const monthlyData = [
  { name: "JAN", value: 65 },
  { name: "FEB", value: 59 },
  { name: "MAR", value: 80 },
  { name: "APR", value: 81 },
  { name: "MAY", value: 56 },
  { name: "JUN", value: 55 },
  { name: "JUL", value: 40 },
  { name: "AUG", value: 70 },
  { name: "SEP", value: 90 },
  { name: "OCT", value: 75 },
  { name: "NOV", value: 60 },
  { name: "DEC", value: 85 },
]

const performanceData = [
  { name: "Team A", value: 85 },
  { name: "Team B", value: 72 },
  { name: "Team C", value: 93 },
  { name: "Team D", value: 68 },
  { name: "Team E", value: 79 },
]

export default function AnalyticsView() {
  const [timeframe, setTimeframe] = useState("weekly")

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Performance Analytics</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setTimeframe("weekly")}
            className={`px-3 py-1.5 text-xs rounded-md border ${
              timeframe === "weekly" ? "border-[#e91e63] text-[#e91e63]" : "border-[#333] text-gray-400"
            }`}
          >
            WEEKLY
          </button>
          <button
            onClick={() => setTimeframe("monthly")}
            className={`px-3 py-1.5 text-xs rounded-md border ${
              timeframe === "monthly" ? "border-[#e91e63] text-[#e91e63]" : "border-[#333] text-gray-400"
            }`}
          >
            MONTHLY
          </button>
          <button
            onClick={() => setTimeframe("quarterly")}
            className={`px-3 py-1.5 text-xs rounded-md border ${
              timeframe === "quarterly" ? "border-[#e91e63] text-[#e91e63]" : "border-[#333] text-gray-400"
            }`}
          >
            QUARTERLY
          </button>
          <button className="px-3 py-1.5 text-xs rounded-md border border-[#333] text-gray-400 flex items-center gap-1">
            <Filter size={12} />
            FILTER
          </button>
          <button className="px-3 py-1.5 text-xs rounded-md border border-[#333] text-gray-400 flex items-center gap-1">
            <Download size={12} />
            EXPORT
          </button>
        </div>
      </div>

      {/* Date range selector */}
      <div className="flex items-center justify-between p-3 bg-[#111] rounded-md border border-[#333]">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-[#e91e63]" />
          <span className="text-sm">Oct 15, 2023 - Oct 21, 2023</span>
        </div>
        <button className="text-xs text-[#e91e63]">CHANGE</button>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "TASKS COMPLETED", value: 87, change: "+12%", color: "#e91e63" },
          { label: "BUGS RESOLVED", value: 42, change: "+5%", color: "#00bcd4" },
          { label: "WORKFLOWS DEPLOYED", value: 23, change: "-3%", color: "#ff9800" },
          { label: "TEAM EFFICIENCY", value: "78%", change: "+8%", color: "#4caf50" },
        ].map((stat, index) => (
          <div key={index} className="p-4 bg-[#111] rounded-md border border-[#333] flex flex-col">
            <span className="text-xs text-gray-400 mb-1">{stat.label}</span>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold">{stat.value}</span>
              <span className={`text-xs ${stat.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
                {stat.change}
              </span>
            </div>
            <div className="mt-2 h-1 bg-[#222] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: `${Math.random() * 40 + 60}%`, backgroundColor: stat.color }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <div className="p-4 bg-[#111] rounded-md border border-[#333]">
          <h3 className="text-lg font-bold mb-4">Activity Overview</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#222", borderColor: "#444" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Bar dataKey="tasks" stackId="a" fill="#e91e63" />
                <Bar dataKey="bugs" stackId="a" fill="#00bcd4" />
                <Bar dataKey="workflows" stackId="a" fill="#ff9800" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Trend */}
        <div className="p-4 bg-[#111] rounded-md border border-[#333]">
          <h3 className="text-lg font-bold mb-4">Performance Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#222", borderColor: "#444" }}
                  itemStyle={{ color: "#fff" }}
                />
                <Line type="monotone" dataKey="value" stroke="#e91e63" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Team Performance */}
      <div className="p-4 bg-[#111] rounded-md border border-[#333]">
        <h3 className="text-lg font-bold mb-4">Team Performance</h3>
        <div className="space-y-4">
          {performanceData.map((team) => (
            <div key={team.name} className="flex flex-col">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">{team.name}</span>
                <span className="text-sm font-bold">{team.value}%</span>
              </div>
              <div className="h-2 bg-[#222] rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-[#e91e63]" style={{ width: `${team.value}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
