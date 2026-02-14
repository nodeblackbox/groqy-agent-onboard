interface NodeInfo {
  id: string
  label: string
  action?: string[]
  subgraph?: string
}

interface Edge {
  source: string
  target: string
  action: string
}

export interface ParsedDiagram {
  nodes: Record<string, NodeInfo>
  edges: Edge[]
  subgraphs: Record<string, string[]>
}

export function parseDiagramCode(code: string): ParsedDiagram {
  const lines = code
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("%%") && !line.startsWith("//") && !line.startsWith("style"))

  const nodes: Record<string, NodeInfo> = {}
  const edges: Edge[] = []
  const subgraphs: Record<string, string[]> = {}
  let currentSubgraph: string | null = null

  lines.forEach((line) => {
    if (line.startsWith("subgraph")) {
      const match = line.match(/^subgraph\s+"?(.+?)"?$/)
      if (match) {
        currentSubgraph = match[1]
        if (!subgraphs[currentSubgraph]) {
          subgraphs[currentSubgraph] = []
        }
      }
    } else if (line === "end") {
      currentSubgraph = null
    } else {
      const edgeMatch = line.match(/^(.+?)\s*--.*?>(?:\|(.+?)\|)?\s*(.+)$/)
      if (edgeMatch) {
        let [_, sourceDef, action, targetDef] = edgeMatch
        action = action || ""
        const sourceMatch = sourceDef.match(/^([^[$$]+)(\[.+\]|\(.+$$)?$/)
        const targetMatch = targetDef.match(/^([^[$$]+)(\[.+\]|\(.+$$)?$/)
        if (sourceMatch && targetMatch) {
          const sourceId = sourceMatch[1].trim()
          const targetId = targetMatch[1].trim()
          if (!nodes[sourceId]) {
            nodes[sourceId] = { id: sourceId, label: sourceId, subgraph: currentSubgraph || undefined, action: [] }
          } else if (currentSubgraph) {
            nodes[sourceId].subgraph = currentSubgraph
          }
          if (!nodes[targetId]) {
            nodes[targetId] = { id: targetId, label: targetId, subgraph: currentSubgraph || undefined, action: [] }
          } else if (currentSubgraph) {
            nodes[targetId].subgraph = currentSubgraph
          }
          edges.push({ source: sourceId, target: targetId, action: action.trim() })

          if (action.trim()) {
            nodes[sourceId].action?.push(`To ${targetId}: ${action.trim()}`)
            nodes[targetId].action?.push(`From ${sourceId}: ${action.trim()}`)
          }
        }
      } else {
        const nodeMatch = line.match(/^([^[$$]+)(\[.+\]|\(.+$$)$/)
        if (nodeMatch) {
          const [_, nodeId, labelDef] = nodeMatch
          const label = labelDef.slice(1, -1).trim()
          nodes[nodeId.trim()] = { id: nodeId.trim(), label, subgraph: currentSubgraph || undefined, action: [] }
          if (currentSubgraph) {
            if (!subgraphs[currentSubgraph]) {
              subgraphs[currentSubgraph] = []
            }
            subgraphs[currentSubgraph].push(nodeId.trim())
          }
        }
      }
    }
  })

  return { nodes, edges, subgraphs }
}
