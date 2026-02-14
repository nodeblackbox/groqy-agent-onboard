"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Play } from "lucide-react"

interface AIConfigProps {
  onExecute: (apiKey: string) => void
  onApiKeyChange: (apiKey: string) => void
  apiKey: string
}

export function AIConfig({ onExecute, onApiKeyChange, apiKey }: AIConfigProps) {
  return (
    <Card className="border border-[#333] bg-black/60 p-4 mb-4">
      <h2 className="text-xl uppercase font-bold mb-4 text-[#e91e63]">AI Configuration</h2>
      <div className="flex items-center space-x-2">
        <Input
          type="password"
          placeholder="Enter your Groq API Key"
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          className="bg-black border border-[#333] flex-grow"
        />
        <Button
          onClick={() => onExecute(apiKey)}
          disabled={!apiKey}
          className="bg-[#e91e63] hover:bg-[#d81b60] flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          Execute Workflow
        </Button>
      </div>
    </Card>
  )
}
