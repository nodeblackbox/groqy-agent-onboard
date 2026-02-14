"use client"

import { useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"

interface ConsoleProps {
  logs: string[]
  error: string
}

export function Console({ logs, error }: ConsoleProps) {
  const consoleRef = useRef<HTMLDivElement>(null)

  const copyToClipboard = () => {
    if (consoleRef.current) {
      const text = consoleRef.current.innerText
      navigator.clipboard.writeText(text).then(
        () => {
          alert("Console output copied to clipboard!")
        },
        (err) => {
          console.error("Could not copy text: ", err)
        },
      )
    }
  }

  return (
    <Card className="border border-[#333] bg-black/60 w-full p-4 text-gray-300 text-sm overflow-y-auto h-64 relative">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-[#e91e63]">Console</h3>
        <Button
          onClick={copyToClipboard}
          variant="outline"
          size="sm"
          className="border border-[#333] hover:border-[#e91e63]"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy Output
        </Button>
      </div>
      <div ref={consoleRef} className="space-y-1 font-mono">
        {logs.map((log, index) => (
          <div key={index} className="whitespace-pre-wrap break-words">
            {log}
          </div>
        ))}
        {error && <div className="text-red-400 mt-2">Error: {error}</div>}
      </div>
    </Card>
  )
}
