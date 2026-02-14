"use client"

import { useState, useEffect, useCallback } from "react"
import { parseDiagramCode, type ParsedDiagram } from "../utils/parse-diagram-code"

interface Note {
  content: string
  nodeInfo: {
    id: string
    label: string
    action?: string[]
    subgraph?: string
  }
  aiContent?: string
}

export function useDiagramState(initialDiagramCode: string) {
  const [diagramCode, setDiagramCode] = useState(initialDiagramCode)
  const [notes, setNotes] = useState<Record<string, Note>>({})
  const [error, setError] = useState("")
  const [zoom, setZoom] = useState(1)
  const [logs, setLogs] = useState<string[]>([])
  const [actions, setActions] = useState<{ action: string; source: string; target: string }[]>([])
  const [isFocused, setIsFocused] = useState(false)
  const [selectedNodes, setSelectedNodes] = useState<string[]>([])
  const [parsedDiagram, setParsedDiagram] = useState<ParsedDiagram | null>(null)
  const [isExecuting, setIsExecuting] = useState(false)

  const logMessage = useCallback((message: string) => {
    setLogs((prevLogs) => [...prevLogs, `[${new Date().toLocaleTimeString()}] ${message}`])
  }, [])

  const handleNodeClick = useCallback(
    (nodeId: string, nodeLabel: string) => {
      logMessage(`Node clicked: ${nodeId} - ${nodeLabel}`)

      setNotes((prevNotes) => {
        if (!prevNotes[nodeId]) {
          return {
            ...prevNotes,
            [nodeId]: {
              content: "",
              nodeInfo: {
                id: nodeId,
                label: nodeLabel,
              },
            },
          }
        }
        return prevNotes
      })
    },
    [logMessage],
  )

  const handleNoteChange = useCallback(
    (nodeId: string, newNote: string) => {
      setNotes((prevNotes) => ({
        ...prevNotes,
        [nodeId]: {
          ...prevNotes[nodeId],
          content: newNote,
        },
      }))
      logMessage(`Note updated for node: ${nodeId}`)
    },
    [logMessage],
  )

  const handleDeleteNote = useCallback(
    (nodeId: string) => {
      setNotes((prevNotes) => {
        const newNotes = { ...prevNotes }
        delete newNotes[nodeId]
        logMessage(`Deleted note for node: ${nodeId}`)
        return newNotes
      })
    },
    [logMessage],
  )

  const handleZoomIn = useCallback(() => {
    setZoom((prevZoom) => {
      const newZoom = Math.min(prevZoom * 1.2, 3)
      logMessage(`Zoomed in to ${newZoom.toFixed(2)}x`)
      return newZoom
    })
  }, [logMessage])

  const handleZoomOut = useCallback(() => {
    setZoom((prevZoom) => {
      const newZoom = Math.max(prevZoom / 1.2, 0.5)
      logMessage(`Zoomed out to ${newZoom.toFixed(2)}x`)
      return newZoom
    })
  }, [logMessage])

  const handleResetZoom = useCallback(() => {
    setZoom(1)
    logMessage("Zoom reset to 1x")
  }, [logMessage])

  useEffect(() => {
    try {
      const parsed = parseDiagramCode(diagramCode)
      setParsedDiagram(parsed)
      setActions(parsed.edges)

      setNotes((prevNotes) => {
        const newNotes = { ...prevNotes }
        Object.values(parsed.nodes).forEach((node) => {
          if (!newNotes[node.id]) {
            newNotes[node.id] = {
              content: "",
              nodeInfo: {
                id: node.id,
                label: node.label,
                action: node.action,
                subgraph: node.subgraph,
              },
            }
          } else {
            newNotes[node.id].nodeInfo = {
              id: node.id,
              label: node.label,
              action: node.action,
              subgraph: node.subgraph,
            }
          }
        })
        return newNotes
      })
    } catch (err) {
      console.error("Error parsing diagram code:", err)
    }
  }, [diagramCode])

  return {
    diagramCode,
    setDiagramCode,
    notes,
    setNotes,
    error,
    setError,
    zoom,
    logs,
    actions,
    isFocused,
    setIsFocused,
    selectedNodes,
    setSelectedNodes,
    parsedDiagram,
    logMessage,
    handleNodeClick,
    handleNoteChange,
    handleDeleteNote,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
    isExecuting,
    setIsExecuting,
  }
}
