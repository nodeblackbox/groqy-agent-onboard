"use client"
import { useState } from "react"
import { Activity, Award, Bot, CheckCircle, Clipboard, Search, Star, Users, X } from "lucide-react"
import { useAgency } from "@/context/agency-context"
import type { TeamMember } from "@/context/agency-context"

export default function TeamManagement() {
  const { allTeamMembers } = useAgency()
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [showMemberModal, setShowMemberModal] = useState(false)
  const [filterType, setFilterType] = useState("ALL")
  const [searchQuery, setSearchQuery] = useState("")

  // Filter team members based on type and search query
  const filteredMembers = allTeamMembers
    .filter((member) => filterType === "ALL" || member.type === filterType)
    .filter(
      (member) =>
        searchQuery === "" ||
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase()),
    )

  const handleMemberClick = (member: TeamMember) => {
    setSelectedMember(member)
    setShowMemberModal(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1">
        <h2 className="text-3xl font-bold uppercase">HYBRID</h2>
        <h2 className="text-3xl font-bold uppercase text-[#e91e63]">TEAM</h2>
        <h2 className="text-3xl font-bold uppercase">MANAGEMENT</h2>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterType("ALL")}
            className={`px-4 py-2 rounded-md text-sm ${
              filterType === "ALL"
                ? "bg-[#e91e63] text-white"
                : "border border-[#333] text-gray-400 hover:border-[#e91e63]/30"
            }`}
          >
            ALL
          </button>
          <button
            onClick={() => setFilterType("HUMAN")}
            className={`px-4 py-2 rounded-md text-sm ${
              filterType === "HUMAN"
                ? "bg-[#e91e63] text-white"
                : "border border-[#333] text-gray-400 hover:border-[#e91e63]/30"
            }`}
          >
            HUMANS
          </button>
          <button
            onClick={() => setFilterType("AI")}
            className={`px-4 py-2 rounded-md text-sm ${
              filterType === "AI"
                ? "bg-[#e91e63] text-white"
                : "border border-[#333] text-gray-400 hover:border-[#e91e63]/30"
            }`}
          >
            AI AGENTS
          </button>
        </div>

        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Search team members..."
            className="pl-10 pr-4 py-2 bg-black border border-[#333] rounded-md focus:outline-none focus:border-[#e91e63] text-sm w-full md:w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            onClick={() => handleMemberClick(member)}
            className="border border-[#333] bg-black/60 rounded-md p-4 hover:border-[#e91e63]/30 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-start space-x-3">
              {member.type === "HUMAN" ? (
                <div className="w-10 h-10 rounded-full overflow-hidden bg-[#333] flex-shrink-0">
                  <img
                    src={member.avatar || "/placeholder.svg?height=40&width=40&query=person"}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#e91e63]/20 border border-[#e91e63] flex items-center justify-center flex-shrink-0">
                  <Bot size={20} className="text-[#e91e63]" />
                </div>
              )}

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm">{member.name}</h3>
                    <p className="text-xs text-gray-400">{member.role}</p>
                  </div>
                  <div className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        member.status === "ONLINE" ? "bg-green-500 animate-pulse" : "bg-gray-500"
                      } mr-1`}
                    ></div>
                    <span className="text-xs text-gray-400">{member.status}</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">TASKS COMPLETED</span>
                      <span>{member.tasksCompleted}</span>
                    </div>
                    <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#e91e63] rounded-full"
                        style={{ width: `${Math.min(100, (member.tasksCompleted / 200) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">PERFORMANCE</span>
                      <span>{member.performance}%</span>
                    </div>
                    <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${member.performance}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center text-xs">
                  <span className="text-gray-400">IN PROGRESS: {member.tasksInProgress}</span>
                  <span className="text-[#e91e63]">VIEW DETAILS</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Team Performance Overview */}
      <div className="border border-[#333] bg-black/60 rounded-md p-6">
        <h3 className="text-xl uppercase font-bold mb-4 flex items-center">
          <Activity className="mr-2 text-[#e91e63]" size={20} />
          TEAM PERFORMANCE
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-[#333] bg-black/40 rounded-md p-4">
            <h4 className="text-sm uppercase font-bold mb-3 flex items-center">
              <Award className="mr-2 text-[#e91e63]" size={16} />
              TOP PERFORMERS
            </h4>
            <div className="space-y-3">
              {allTeamMembers
                .sort((a, b) => b.performance - a.performance)
                .slice(0, 3)
                .map((member, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center">
                      {i === 0 && <Star size={14} className="text-yellow-500 mr-1" />}
                      <span className="text-sm">{member.name}</span>
                    </div>
                    <span className="text-sm font-bold">{member.performance}%</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="border border-[#333] bg-black/40 rounded-md p-4">
            <h4 className="text-sm uppercase font-bold mb-3 flex items-center">
              <CheckCircle className="mr-2 text-[#e91e63]" size={16} />
              TASK COMPLETION
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">HUMANS</span>
                <span className="text-sm font-bold">
                  {allTeamMembers.filter((m) => m.type === "HUMAN").reduce((sum, m) => sum + m.tasksCompleted, 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">AI AGENTS</span>
                <span className="text-sm font-bold">
                  {allTeamMembers.filter((m) => m.type === "AI").reduce((sum, m) => sum + m.tasksCompleted, 0)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#333]">
                <span className="text-sm">TOTAL</span>
                <span className="text-sm font-bold">
                  {allTeamMembers.reduce((sum, m) => sum + m.tasksCompleted, 0)}
                </span>
              </div>
            </div>
          </div>

          <div className="border border-[#333] bg-black/40 rounded-md p-4">
            <h4 className="text-sm uppercase font-bold mb-3 flex items-center">
              <Users className="mr-2 text-[#e91e63]" size={16} />
              TEAM COMPOSITION
            </h4>
            <div className="flex items-center justify-center h-[100px]">
              <div className="relative w-[100px] h-[100px]">
                <div
                  className="absolute inset-0 rounded-full border-8 border-[#e91e63]"
                  style={{
                    clipPath: `inset(0 ${
                      100 - (allTeamMembers.filter((m) => m.type === "HUMAN").length / allTeamMembers.length) * 100
                    }% 0 0)`,
                  }}
                ></div>
                <div
                  className="absolute inset-0 rounded-full border-8 border-blue-500"
                  style={{
                    clipPath: `inset(0 0 0 ${
                      (allTeamMembers.filter((m) => m.type === "HUMAN").length / allTeamMembers.length) * 100
                    }%)`,
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-xs text-gray-400">HUMAN / AI</span>
                  <span className="text-sm font-bold">
                    {allTeamMembers.filter((m) => m.type === "HUMAN").length} /{" "}
                    {allTeamMembers.filter((m) => m.type === "AI").length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Member Modal */}
      {showMemberModal && selectedMember && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-black border border-[#333] rounded-md w-full max-w-2xl p-6 relative animate-fadeIn">
            <button
              onClick={() => setShowMemberModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="flex items-start space-x-4 mb-6">
              {selectedMember.type === "HUMAN" ? (
                <div className="w-16 h-16 rounded-full overflow-hidden bg-[#333] flex-shrink-0">
                  <img
                    src={selectedMember.avatar || "/placeholder.svg?height=64&width=64&query=person"}
                    alt={selectedMember.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-[#e91e63]/20 border border-[#e91e63] flex items-center justify-center flex-shrink-0">
                  <Bot size={32} className="text-[#e91e63]" />
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold">{selectedMember.name}</h3>
                <p className="text-gray-400">{selectedMember.role}</p>
                <div className="flex items-center mt-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      selectedMember.status === "ONLINE" ? "bg-green-500 animate-pulse" : "bg-gray-500"
                    } mr-1`}
                  ></div>
                  <span className="text-sm text-gray-400">{selectedMember.status}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="text-sm uppercase font-bold mb-3 flex items-center">
                  <Activity className="mr-2 text-[#e91e63]" size={16} />
                  PERFORMANCE METRICS
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">TASKS COMPLETED</span>
                      <span>{selectedMember.tasksCompleted}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#e91e63] rounded-full"
                        style={{ width: `${Math.min(100, (selectedMember.tasksCompleted / 200) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">PERFORMANCE RATING</span>
                      <span>{selectedMember.performance}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${selectedMember.performance}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">TASKS IN PROGRESS</span>
                      <span>{selectedMember.tasksInProgress}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-500 rounded-full"
                        style={{ width: `${(selectedMember.tasksInProgress / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm uppercase font-bold mb-3 flex items-center">
                  <Clipboard className="mr-2 text-[#e91e63]" size={16} />
                  ACTIVE TASKS
                </h4>
                <div className="space-y-3 max-h-[150px] overflow-y-auto pr-2">
                  {Array.from({ length: selectedMember.tasksInProgress }).map((_, i) => (
                    <div key={i} className="border border-[#333] bg-black/40 rounded-md p-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="text-sm font-bold">Task #{i + 1}</h5>
                          <p className="text-xs text-gray-400">In progress</p>
                        </div>
                        <div className="flex items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-1"></div>
                          <span className="text-xs">MEDIUM</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {selectedMember.tasksInProgress === 0 && (
                    <div className="text-center text-gray-400 text-sm py-4">No active tasks</div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-[#333] pt-4 flex justify-between">
              <button className="px-4 py-2 border border-[#333] rounded-md hover:border-[#e91e63] transition-colors text-sm">
                VIEW FULL PROFILE
              </button>
              <button className="px-4 py-2 bg-[#e91e63] rounded-md hover:bg-[#d81b60] transition-colors text-sm">
                ASSIGN NEW TASK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
