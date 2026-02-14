"use client"
import { useEffect, useRef, useState } from "react"

export default function AgentNetworkVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        setDimensions({ width, height })
      }
    }

    // Initial update
    updateDimensions()

    // Update on resize
    window.addEventListener("resize", updateDimensions)

    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || dimensions.width === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = dimensions.width
    canvas.height = dimensions.height

    // Node data - positions are relative to canvas size
    const nodes = [
      {
        x: dimensions.width * 0.5,
        y: dimensions.height * 0.5,
        radius: 15,
        color: "#e91e63",
        pulse: true,
        label: "CORE",
      },
      {
        x: dimensions.width * 0.3,
        y: dimensions.height * 0.3,
        radius: 10,
        color: "#e91e63",
        pulse: true,
        label: "AGENT_1",
      },
      {
        x: dimensions.width * 0.7,
        y: dimensions.height * 0.3,
        radius: 10,
        color: "#e91e63",
        pulse: true,
        label: "AGENT_2",
      },
      {
        x: dimensions.width * 0.3,
        y: dimensions.height * 0.7,
        radius: 10,
        color: "#e91e63",
        pulse: true,
        label: "AGENT_3",
      },
      {
        x: dimensions.width * 0.7,
        y: dimensions.height * 0.7,
        radius: 10,
        color: "#e91e63",
        pulse: true,
        label: "AGENT_4",
      },
      {
        x: dimensions.width * 0.2,
        y: dimensions.height * 0.5,
        radius: 8,
        color: "#666",
        pulse: false,
        label: "NODE_1",
      },
      {
        x: dimensions.width * 0.8,
        y: dimensions.height * 0.5,
        radius: 8,
        color: "#666",
        pulse: false,
        label: "NODE_2",
      },
      {
        x: dimensions.width * 0.5,
        y: dimensions.height * 0.2,
        radius: 8,
        color: "#666",
        pulse: false,
        label: "NODE_3",
      },
      {
        x: dimensions.width * 0.5,
        y: dimensions.height * 0.8,
        radius: 8,
        color: "#666",
        pulse: false,
        label: "NODE_4",
      },
    ]

    // Connection data
    const connections = [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 0, to: 3 },
      { from: 0, to: 4 },
      { from: 1, to: 5 },
      { from: 2, to: 7 },
      { from: 3, to: 8 },
      { from: 4, to: 6 },
    ]

    // Data packets for animation
    let packets: { fromNode: number; toNode: number; progress: number; speed: number; active: boolean }[] = []

    // Initialize packets
    const initPackets = () => {
      packets = connections.map((conn) => ({
        fromNode: conn.from,
        toNode: conn.to,
        progress: Math.random(),
        speed: 0.002 + Math.random() * 0.003,
        active: Math.random() > 0.3,
      }))
    }

    initPackets()

    // Animation variables
    let animationFrame: number
    let time = 0

    // Draw function
    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update time
      time += 0.01

      // Draw connections
      connections.forEach((conn) => {
        const fromNode = nodes[conn.from]
        const toNode = nodes[conn.to]

        ctx.beginPath()
        ctx.moveTo(fromNode.x, fromNode.y)
        ctx.lineTo(toNode.x, toNode.y)
        ctx.strokeStyle = "#333"
        ctx.lineWidth = 1
        ctx.stroke()
      })

      // Update and draw packets
      packets.forEach((packet) => {
        if (!packet.active) return

        packet.progress += packet.speed
        if (packet.progress >= 1) {
          packet.progress = 0
          packet.active = Math.random() > 0.3
        }

        const fromNode = nodes[packet.fromNode]
        const toNode = nodes[packet.toNode]

        const x = fromNode.x + (toNode.x - fromNode.x) * packet.progress
        const y = fromNode.y + (toNode.y - fromNode.y) * packet.progress

        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fillStyle = "#e91e63"
        ctx.fill()
      })

      // Draw nodes
      nodes.forEach((node) => {
        // Draw node
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fillStyle = node.color
        ctx.fill()

        // Draw pulse effect
        if (node.pulse) {
          const pulseSize = node.radius + 5 + Math.sin(time * 3) * 3
          ctx.beginPath()
          ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2)
          ctx.strokeStyle = `${node.color}40`
          ctx.lineWidth = 2
          ctx.stroke()
        }

        // Draw label
        ctx.fillStyle = "#fff"
        ctx.font = "8px monospace"
        ctx.textAlign = "center"
        ctx.fillText(node.label, node.x, node.y + node.radius + 12)
      })

      // Continue animation
      animationFrame = requestAnimationFrame(draw)
    }

    // Start animation
    draw()

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [dimensions])

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(233,30,99,0.05),transparent_70%)]"></div>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full"></canvas>
    </div>
  )
}
