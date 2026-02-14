import { CosmicAgent } from "./cosmic-agent"

export const initialCosmicState = {
  agents: [],
  connections: [],
  workflowInput: "",
  workflowOutput: "",
  isRunning: false,
  apiKey: "",
  thinkingLog: [],
  paused: false,
  configName: "",
  savedConfigs: [],
  error: null,
  knowledgeBase: "",
}

export const cosmicReducer = (state: any, action: { type: string; payload?: any }) => {
  switch (action.type) {
    case "ADD_AGENT":
      return {
        ...state,
        agents: [
          ...state.agents,
          new CosmicAgent(Math.random().toString(36).substring(2, 15), `Cosmic Agent ${state.agents.length + 1}`),
        ],
      }
    case "REMOVE_AGENT":
      return {
        ...state,
        agents: state.agents.filter((_: any, index: number) => index !== action.payload),
        connections: state.connections.filter(
          (conn: any) => conn.from !== state.agents[action.payload].id && conn.to !== state.agents[action.payload].id,
        ),
      }
    case "MOVE_AGENT":
      const newAgents = [...state.agents]
      const [movedAgent] = newAgents.splice(action.payload.fromIndex, 1)
      newAgents.splice(action.payload.toIndex, 0, movedAgent)
      return { ...state, agents: newAgents }
    case "UPDATE_AGENT":
      return {
        ...state,
        agents: state.agents.map((agent: any, index: number) =>
          index === action.payload.index ? action.payload.agent : agent,
        ),
      }
    case "SET_WORKFLOW_INPUT":
      return { ...state, workflowInput: action.payload }
    case "SET_WORKFLOW_OUTPUT":
      return { ...state, workflowOutput: action.payload }
    case "APPEND_WORKFLOW_OUTPUT":
      return { ...state, workflowOutput: state.workflowOutput + action.payload }
    case "SET_IS_RUNNING":
      return { ...state, isRunning: action.payload }
    case "SET_API_KEY":
      return { ...state, apiKey: action.payload }
    case "SET_THINKING_LOG":
      return { ...state, thinkingLog: action.payload }
    case "APPEND_THINKING_LOG":
      return { ...state, thinkingLog: [...state.thinkingLog, action.payload] }
    case "SET_PAUSED":
      return { ...state, paused: action.payload }
    case "SET_CONFIG_NAME":
      return { ...state, configName: action.payload }
    case "ADD_SAVED_CONFIG":
      return { ...state, savedConfigs: [...state.savedConfigs, action.payload] }
    case "DELETE_SAVED_CONFIG":
      return {
        ...state,
        savedConfigs: state.savedConfigs.filter((config: any) => config.id !== action.payload),
      }
    case "LOAD_CONFIG":
      return {
        ...state,
        agents: action.payload.agents,
        connections: action.payload.connections,
      }
    case "IMPORT_CONFIG":
      return { ...state, ...action.payload }
    case "SET_ERROR":
      return { ...state, error: action.payload }
    case "SET_KNOWLEDGE_BASE":
      return { ...state, knowledgeBase: action.payload }
    default:
      return state
  }
}
