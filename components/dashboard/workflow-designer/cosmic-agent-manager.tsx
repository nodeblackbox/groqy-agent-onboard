"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sparkles, Plus, XCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface CosmicAgentNodeProps {
  agent: any
  index: number
  moveAgent: (dragIndex: number, hoverIndex: number) => void
  removeAgent: (index: number) => void
  updateAgent: (index: number, updatedAgent: any) => void
}

const CosmicAgentNode: React.FC<CosmicAgentNodeProps> = ({ agent, index, removeAgent, updateAgent }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      className="bg-black/40 p-4 rounded-md shadow-md mb-4 border border-[#333] hover:border-[#e91e63]/30 transition-all duration-300"
      style={{
        boxShadow: "0 0 20px rgba(233, 30, 99, 0.1)",
      }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
        <button
          onClick={() => removeAgent(index)}
          className="text-gray-400 hover:text-white transition-colors duration-300"
          aria-label={`Remove ${agent.name}`}
        >
          <XCircle size={20} />
        </button>
      </div>
      <div className="space-y-2">
        <Input
          value={agent.systemPrompt}
          onChange={(e) => updateAgent(index, { ...agent, systemPrompt: e.target.value })}
          placeholder="System Prompt"
          className="bg-black border border-[#333] text-white placeholder-gray-500 focus:border-[#e91e63] focus:ring-[#e91e63]"
        />
        <Input
          value={agent.userPrompt}
          onChange={(e) => updateAgent(index, { ...agent, userPrompt: e.target.value })}
          placeholder="User Prompt"
          className="bg-black border border-[#333] text-white placeholder-gray-500 focus:border-[#e91e63] focus:ring-[#e91e63]"
        />
        <Input
          value={agent.structurePrompt}
          onChange={(e) => updateAgent(index, { ...agent, structurePrompt: e.target.value })}
          placeholder="Structure Prompt"
          className="bg-black border border-[#333] text-white placeholder-gray-500 focus:border-[#e91e63] focus:ring-[#e91e63]"
        />
      </div>
    </motion.div>
  )
}

interface CosmicAgentManagerProps {
  state: any
  dispatch: React.Dispatch<any>
}

export const CosmicAgentManager: React.FC<CosmicAgentManagerProps> = ({ state, dispatch }) => {
  const addCosmicAgent = () => {
    dispatch({ type: "ADD_AGENT" })
  }

  const removeCosmicAgent = (index: number) => {
    dispatch({ type: "REMOVE_AGENT", payload: index })
  }

  const moveCosmicAgent = (fromIndex: number, toIndex: number) => {
    dispatch({ type: "MOVE_AGENT", payload: { fromIndex, toIndex } })
  }

  const updateCosmicAgent = (index: number, updatedAgent: any) => {
    dispatch({ type: "UPDATE_AGENT", payload: { index, agent: updatedAgent } })
  }

  return (
    <Card
      className="border border-[#333] bg-black/60 shadow-md"
      style={{ boxShadow: "0 0 30px rgba(233, 30, 99, 0.1)" }}
    >
      <CardHeader>
        <CardTitle className="flex items-center text-[#e91e63]">
          <Sparkles className="mr-2 text-[#e91e63]" />
          Cosmic Agent Collective
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={addCosmicAgent} className="mb-4 bg-[#e91e63] hover:bg-[#d81b60] text-white">
          <Plus size={16} className="mr-2" />
          Add Cosmic Agent
        </Button>
        <ScrollArea className="h-[400px] pr-4">
          <AnimatePresence>
            {state.agents.map((agent: any, index: number) => (
              <CosmicAgentNode
                key={agent.id}
                agent={agent}
                index={index}
                moveAgent={moveCosmicAgent}
                removeAgent={removeCosmicAgent}
                updateAgent={updateCosmicAgent}
              />
            ))}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
