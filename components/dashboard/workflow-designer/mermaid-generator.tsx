"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"

interface MermaidGeneratorProps {
  onGenerate: (diagramCode: string) => void
  apiKey: string
}

export function MermaidGenerator({ onGenerate, apiKey }: MermaidGeneratorProps) {
  const [input, setInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateDiagram = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are an AI assistant that generates Mermaid diagram code based on user descriptions. Always return valid Mermaid syntax.",
            },
            { role: "user", content: `Generate a Mermaid diagram based on the following description: ${input}` },
          ],
          model: "llama3-groq-70b-8192-tool-use-preview",
          temperature: 0.7,
          max_tokens: 1024,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error("Unexpected API response format")
      }

      const generatedCode = data.choices[0].message.content.trim()

      // Basic validation: check if the generated code starts with a valid Mermaid diagram type
      if (
        !/^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|gantt|pie|journey)/i.test(generatedCode)
      ) {
        throw new Error("Generated code does not appear to be valid Mermaid syntax")
      }

      onGenerate(generatedCode)
    } catch (error) {
      console.error("Error generating diagram:", error)
      setError(error.message)
      alert(`Failed to generate diagram: ${error.message}`)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="border border-[#333] bg-black/60 p-4 mb-4">
      <h2 className="text-xl uppercase font-bold mb-4 text-[#e91e63]">Mermaid Diagram Generator</h2>
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Describe the workflow or diagram you want to create..."
        className="bg-black border border-[#333] mb-4"
        rows={4}
      />
      <Button
        onClick={generateDiagram}
        disabled={!input || isGenerating || !apiKey}
        className="bg-[#e91e63] hover:bg-[#d81b60]"
      >
        {isGenerating ? "Generating..." : "Generate Diagram"}
      </Button>
      {error && <div className="mt-4 text-red-500">Error: {error}</div>}
      {!apiKey && (
        <div className="mt-4 text-yellow-500">Please enter your Groq API key in the AI Configuration section</div>
      )}
    </Card>
  )
}
