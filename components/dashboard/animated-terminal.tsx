"use client"
import { useEffect, useState, useRef } from "react"

const terminalLines = [
  "> INITIALIZING AGENT NETWORK...",
  "> CONNECTING TO CENTRAL NODE...",
  "> ESTABLISHING SECURE CHANNELS...",
  "> LOADING AGENT PROTOCOLS...",
  "> SYSTEM READY",
  "> AGENT_001: MONITORING DATA STREAMS",
  "> AGENT_002: ANALYZING PATTERNS",
  "> AGENT_003: PROCESSING REQUESTS",
  "> AGENT_004: MANAGING WORKFLOWS",
]

export default function AnimatedTerminal() {
  const [visibleLines, setVisibleLines] = useState<string[]>([])
  const [currentLine, setCurrentLine] = useState(0)
  const [typing, setTyping] = useState(true)
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (currentLine >= terminalLines.length) {
      setTyping(false)
      return
    }

    const timer = setTimeout(() => {
      setVisibleLines((prev) => [...prev, terminalLines[currentLine]])
      setCurrentLine((prev) => prev + 1)

      // Scroll to bottom
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight
      }
    }, 800)

    return () => clearTimeout(timer)
  }, [currentLine])

  return (
    <div
      ref={terminalRef}
      className="bg-black border border-[#333] rounded-md p-3 h-[200px] md:h-[300px] overflow-y-auto font-mono text-xs md:text-sm"
    >
      {visibleLines.map((line, index) => (
        <div key={index} className="mb-2 text-green-500">
          {line}
        </div>
      ))}
      {typing && (
        <div className="text-green-500">
          <span className="animate-blink">▋</span>
        </div>
      )}
    </div>
  )
}
