"use client"

import { useState } from "react"
import { Bot, Pause, Settings, Trash2, Volume2 } from "lucide-react"

// Sample agent data
const sampleAgents = [
  {
    id: "agent-1",
    name: "DataBot",
    type: "Data Analyst",
    voice: "Emma",
    description: "Specialized in data analysis and visualization",
    skills: ["Data Analysis", "Visualization", "Statistics"],
    status: "active",
    lastUsed: "2 hours ago",
  },
  {
    id: "agent-2",
    name: "WriterBot",
    type: "Content Creator",
    voice: "James",
    description: "Creates and edits written content for various purposes",
    skills: ["Content Writing", "Editing", "SEO"],
    status: "idle",
    lastUsed: "1 day ago",
  },
  {
    id: "agent-3",
    name: "ResearchAssistant",
    type: "Research Assistant",
    voice: "Sofia",
    description: "Gathers and analyzes information on specific topics",
    skills: ["Research", "Summarization", "Fact-checking"],
    status: "inactive",
    lastUsed: "1 week ago",
  },
]

export default function AgentList() {
  const [agents, setAgents] = useState(sampleAgents)
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  const handlePlayVoice = (agentId: string) => {
    if (currentlyPlaying === agentId) {
      setCurrentlyPlaying(null)
    } else {
      setCurrentlyPlaying(agentId)
      // In a real app, this would play the agent's voice
      setTimeout(() => setCurrentlyPlaying(null), 3000)
    }
  }

  const handleDeleteAgent = (agentId: string) => {
    setAgents(agents.filter((agent) => agent.id !== agentId))
    setShowDeleteConfirm(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "idle":
        return "bg-yellow-500"
      case "inactive":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your AI Agents</h2>

      {agents.length === 0 ? (
        <div className="border border-[#333] rounded-lg p-8 text-center">
          <Bot size={48} className="text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">No Agents Created</h3>
          <p className="text-gray-400 mb-4">You haven't created any AI agents yet.</p>
          <button className="bg-[#e91e63] hover:bg-[#d81b60] text-white px-6 py-2 rounded-md transition-colors">
            Create Your First Agent
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <div key={agent.id} className="border border-[#333] rounded-lg p-4 bg-black/60">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#e91e63]/20 border border-[#e91e63] flex items-center justify-center mr-3">
                    <Bot size={20} className="text-[#e91e63]" />
                  </div>
                  <div>
                    <h3 className="font-bold">{agent.name}</h3>
                    <p className="text-sm text-gray-400">{agent.type}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)} mr-2`}></div>
                  <span className="text-xs text-gray-400">{agent.status.toUpperCase()}</span>
                </div>
              </div>

              <p className="text-sm text-gray-300 mb-4 line-clamp-2">{agent.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {agent.skills.map((skill, index) => (
                  <span key={index} className="bg-[#333] text-xs px-2 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                <div>Voice: {agent.voice}</div>
                <div>Last used: {agent.lastUsed}</div>
              </div>

              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <button
                    className="p-2 rounded-full bg-[#333] hover:bg-[#444] transition-colors"
                    onClick={() => handlePlayVoice(agent.id)}
                    title="Preview voice"
                  >
                    {currentlyPlaying === agent.id ? <Pause size={16} /> : <Volume2 size={16} />}
                  </button>
                  <button
                    className="p-2 rounded-full bg-[#333] hover:bg-[#444] transition-colors"
                    title="Agent settings"
                  >
                    <Settings size={16} />
                  </button>
                </div>

                <div>
                  {showDeleteConfirm === agent.id ? (
                    <div className="flex items-center space-x-2">
                      <button
                        className="text-xs text-gray-400 hover:text-white"
                        onClick={() => setShowDeleteConfirm(null)}
                      >
                        Cancel
                      </button>
                      <button
                        className="text-xs text-[#e91e63] hover:text-[#d81b60]"
                        onClick={() => handleDeleteAgent(agent.id)}
                      >
                        Confirm
                      </button>
                    </div>
                  ) : (
                    <button
                      className="p-2 rounded-full bg-[#333] hover:bg-[#444] transition-colors text-gray-400 hover:text-[#e91e63]"
                      onClick={() => setShowDeleteConfirm(agent.id)}
                      title="Delete agent"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
