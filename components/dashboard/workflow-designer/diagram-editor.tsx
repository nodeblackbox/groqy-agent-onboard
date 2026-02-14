"use client"

import type React from "react"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Play, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"

interface DiagramEditorProps {
  diagramCode: string
  setDiagramCode: (code: string) => void
  zoom: number
  error: string
  handleZoomIn: () => void
  handleZoomOut: () => void
  handleResetZoom: () => void
  renderDiagram: () => Promise<void>
  isFocused: boolean
  setIsFocused: (focused: boolean) => void
  selectedNodes: string[]
  setSelectedNodes: (nodes: string[]) => void
  notes: Record<string, { nodeInfo: { id: string; label: string } }>
  diagramRef: React.RefObject<HTMLDivElement>
}

export function DiagramEditor({
  diagramCode,
  setDiagramCode,
  zoom,
  error,
  handleZoomIn,
  handleZoomOut,
  handleResetZoom,
  renderDiagram,
  isFocused,
  setIsFocused,
  selectedNodes,
  setSelectedNodes,
  notes,
  diagramRef,
}: DiagramEditorProps) {
  useEffect(() => {
    renderDiagram()
  }, [renderDiagram])

  return (
    <Card className="border border-[#333] bg-black/60 flex-1 flex flex-col p-4 shadow-md mb-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl uppercase font-bold text-[#e91e63]">Mermaid Diagram Editor</h2>
        <div className="flex space-x-2">
          <Button onClick={handleZoomIn} size="sm" className="bg-[#333] hover:bg-[#444]" aria-label="Zoom In">
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button onClick={handleZoomOut} size="sm" className="bg-[#333] hover:bg-[#444]" aria-label="Zoom Out">
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button onClick={handleResetZoom} size="sm" className="bg-[#333] hover:bg-[#444]" aria-label="Reset Zoom">
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            onClick={renderDiagram}
            className="bg-[#e91e63] hover:bg-[#d81b60] flex items-center gap-2"
            variant="default"
            aria-label="Render Diagram"
          >
            <Play className="w-4 h-4" />
            Render
          </Button>
        </div>
      </div>

      <div className="flex items-center mb-4">
        <label className="mr-2 text-xs text-gray-400">View:</label>
        <select
          className="bg-black border border-[#333] rounded-md p-1 text-sm"
          value={isFocused ? "focused" : "all"}
          onChange={(e) => {
            if (e.target.value === "focused") {
              setIsFocused(true)
            } else {
              setIsFocused(false)
              setSelectedNodes([])
            }
          }}
          aria-label="View Mode"
        >
          <option value="all">All Nodes</option>
          <option value="focused">Focused Nodes</option>
        </select>
      </div>

      {isFocused && (
        <div className="flex items-center mb-4">
          <label className="mr-2 text-xs text-gray-400">Select Nodes:</label>
          <select
            multiple
            className="bg-black border border-[#333] rounded-md p-1 text-sm w-full"
            value={selectedNodes}
            onChange={(e) => {
              const options = e.target.options
              const selected: string[] = []
              for (let i = 0; i < options.length; i++) {
                if (options[i].selected) {
                  selected.push(options[i].value)
                }
              }
              setSelectedNodes(selected)
            }}
            aria-label="Select Nodes"
          >
            {Object.values(notes).map((note) => (
              <option key={note.nodeInfo.id} value={note.nodeInfo.id}>
                {note.nodeInfo.label} ({note.nodeInfo.id})
              </option>
            ))}
          </select>
        </div>
      )}

      <Textarea
        value={diagramCode}
        onChange={(e) => setDiagramCode(e.target.value)}
        className="bg-black border border-[#333] font-mono text-sm mb-4 min-h-32"
        placeholder="Enter your Mermaid diagram code here..."
        aria-label="Mermaid Diagram Code"
      />

      {error && <div className="text-red-500 mb-4 p-2 bg-red-900 bg-opacity-50 rounded-md">{error}</div>}

      <Card className="border border-[#333] bg-black/40 flex-1 p-4 overflow-auto shadow-inner">
        <div
          ref={diagramRef}
          className="mermaid flex justify-center items-center min-h-64"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: "top left",
            transition: "transform 0.3s ease-in-out",
          }}
        />
      </Card>
    </Card>
  )
}
