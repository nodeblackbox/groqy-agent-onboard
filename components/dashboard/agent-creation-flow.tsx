"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Upload, FileText, ChevronRight, ChevronLeft, Check, X, Loader, RefreshCw, Play, Pause } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"

// Sample voice options
const voiceOptions = [
  { id: "voice-1", name: "Emma", gender: "Female", accent: "American", preview: "/voice-samples/emma.mp3" },
  { id: "voice-2", name: "James", gender: "Male", accent: "British", preview: "/voice-samples/james.mp3" },
  { id: "voice-3", name: "Sofia", gender: "Female", accent: "Spanish", preview: "/voice-samples/sofia.mp3" },
  { id: "voice-4", name: "Alex", gender: "Male", accent: "American", preview: "/voice-samples/alex.mp3" },
  { id: "voice-5", name: "Yuki", gender: "Female", accent: "Japanese", preview: "/voice-samples/yuki.mp3" },
  { id: "voice-6", name: "Custom", gender: "Any", accent: "Upload your own", preview: null },
]

// Agent types
const agentTypes = [
  { id: "assistant", name: "Personal Assistant", description: "Helps with scheduling, reminders, and daily tasks" },
  { id: "researcher", name: "Research Assistant", description: "Gathers and analyzes information on specific topics" },
  { id: "writer", name: "Content Creator", description: "Generates and edits written content for various purposes" },
  { id: "analyst", name: "Data Analyst", description: "Processes and interprets data to extract insights" },
  { id: "custom", name: "Custom Agent", description: "Create a specialized agent for your specific needs" },
]

interface AgentCreationFlowProps {
  onComplete: (agentData: any) => void
  onCancel: () => void
}

export default function AgentCreationFlow({ onComplete, onCancel }: AgentCreationFlowProps) {
  const [step, setStep] = useState(0)
  const [agentData, setAgentData] = useState({
    name: "",
    type: "",
    voice: "",
    description: "",
    skills: [],
    resume: null as File | null,
    resumeText: "",
    customPrompt: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [generatedProfile, setGeneratedProfile] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const resumeTextRef = useRef<HTMLTextAreaElement>(null)

  const totalSteps = 5

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAgentData((prev) => ({ ...prev, resume: file }))

      // Simulate parsing the resume
      setIsProcessing(true)
      setTimeout(() => {
        // In a real app, you would use a PDF parsing library or API
        const mockResumeText =
          "John Doe\nSoftware Engineer\n\nExperience:\n- Senior Developer at Tech Co (2018-Present)\n- Web Developer at StartUp Inc (2015-2018)\n\nSkills:\nJavaScript, React, Node.js, Python, AWS\n\nEducation:\nB.S. Computer Science, University of Technology"
        setAgentData((prev) => ({ ...prev, resumeText: mockResumeText }))
        if (resumeTextRef.current) {
          resumeTextRef.current.value = mockResumeText
        }
        setIsProcessing(false)
      }, 2000)
    }
  }

  // Handle voice playback
  const handlePlayVoice = (voiceId: string) => {
    // Stop any currently playing audio
    if (currentlyPlaying && audioRefs.current[currentlyPlaying]) {
      audioRefs.current[currentlyPlaying]?.pause()
      audioRefs.current[currentlyPlaying]?.load()
    }

    // Play the selected voice
    if (voiceId !== currentlyPlaying) {
      audioRefs.current[voiceId]?.play()
      setCurrentlyPlaying(voiceId)
    } else {
      setCurrentlyPlaying(null)
    }
  }

  // Stop audio when component unmounts
  useEffect(() => {
    return () => {
      Object.values(audioRefs.current).forEach((audio) => {
        if (audio) {
          audio.pause()
          audio.load()
        }
      })
    }
  }, [])

  // Handle audio ended event
  const handleAudioEnded = () => {
    setCurrentlyPlaying(null)
  }

  // Update agent data
  const updateAgentData = (field: string, value: any) => {
    setAgentData((prev) => ({ ...prev, [field]: value }))

    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // Validate current step
  const validateStep = () => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 0: // Voice selection
        if (!agentData.voice) {
          newErrors.voice = "Please select a voice for your agent"
        }
        break
      case 1: // Resume upload
        // Resume is optional, so no validation needed
        break
      case 2: // Agent type
        if (!agentData.type) {
          newErrors.type = "Please select an agent type"
        }
        break
      case 3: // Agent details
        if (!agentData.name.trim()) {
          newErrors.name = "Please provide a name for your agent"
        }
        if (!agentData.description.trim()) {
          newErrors.description = "Please provide a description for your agent"
        }
        break
      case 4: // Review
        // No validation needed for review step
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Generate agent profile using Groq
  const generateAgentProfile = async () => {
    setIsGenerating(true)

    try {
      const prompt = `
Create a detailed AI agent profile based on the following information:

Name: ${agentData.name}
Type: ${agentData.type}
Description: ${agentData.description}
${agentData.resumeText ? `Resume Information: ${agentData.resumeText}` : ""}
${agentData.customPrompt ? `Additional Instructions: ${agentData.customPrompt}` : ""}

Format the profile with these sections:
1. Agent Overview
2. Primary Capabilities
3. Knowledge Areas
4. Interaction Style
5. Recommended Use Cases
      `

      const { text } = await generateText({
        model: groq("llama3-70b-8192"),
        prompt: prompt,
        system:
          "You are an expert AI system designer. Your task is to create detailed, professional agent profiles based on user input. Focus on being specific, practical, and highlighting the agent's strengths and capabilities.",
      })

      setGeneratedProfile(text)
    } catch (error) {
      console.error("Error generating profile:", error)
      setGeneratedProfile("Error generating profile. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  // Navigate to next step
  const nextStep = async () => {
    if (validateStep()) {
      if (step < totalSteps - 1) {
        setStep(step + 1)

        // Generate profile when reaching the review step
        if (step === 3) {
          generateAgentProfile()
        }
      } else {
        // Complete the flow
        onComplete(agentData)
      }
    }
  }

  // Navigate to previous step
  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  // Render step content
  const renderStepContent = () => {
    switch (step) {
      case 0: // Voice Selection
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full"
          >
            <h2 className="text-2xl font-bold mb-6">Select a Voice for Your Agent</h2>
            <p className="text-gray-400 mb-6">
              Choose how your AI agent will sound when speaking to you. You can preview each voice before making your
              selection.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {voiceOptions.map((voice) => {
                const isSelected = agentData.voice === voice.id
                const isPlaying = currentlyPlaying === voice.id

                return (
                  <div
                    key={voice.id}
                    className={`border ${isSelected ? "border-[#e91e63]" : "border-[#333]"} rounded-lg p-4 cursor-pointer transition-colors hover:border-[#e91e63]/50`}
                    onClick={() => updateAgentData("voice", voice.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-lg">{voice.name}</h3>
                        <p className="text-sm text-gray-400">
                          {voice.gender} • {voice.accent}
                        </p>
                      </div>
                      {isSelected && <Check className="text-[#e91e63]" size={20} />}
                    </div>

                    {voice.preview ? (
                      <div className="mt-4 flex items-center">
                        <button
                          className={`p-2 rounded-full ${isPlaying ? "bg-[#e91e63]" : "bg-[#333]"} mr-2`}
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePlayVoice(voice.id)
                          }}
                        >
                          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                        </button>
                        <div className="text-sm text-gray-400">Preview voice</div>

                        <audio
                          ref={(el) => (audioRefs.current[voice.id] = el)}
                          src={voice.preview}
                          onEnded={handleAudioEnded}
                        />
                      </div>
                    ) : (
                      <div className="mt-4 flex items-center">
                        <button
                          className="p-2 rounded-full bg-[#333] mr-2"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Open file upload for custom voice
                            alert("Custom voice upload would be implemented here")
                          }}
                        >
                          <Upload size={16} />
                        </button>
                        <div className="text-sm text-gray-400">Upload custom voice sample</div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {errors.voice && <p className="text-[#e91e63] text-sm mb-4">{errors.voice}</p>}
          </motion.div>
        )

      case 1: // Resume Upload
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full"
          >
            <h2 className="text-2xl font-bold mb-6">Upload Resume (Optional)</h2>
            <p className="text-gray-400 mb-6">
              Upload a resume to help your AI agent understand your background, skills, and experience. This will help
              personalize the agent to your needs.
            </p>

            <div className="border border-dashed border-[#333] rounded-lg p-8 text-center mb-6">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx"
                className="hidden"
              />

              {!agentData.resume ? (
                <div>
                  <div className="mb-4 flex justify-center">
                    <FileText size={48} className="text-gray-500" />
                  </div>
                  <p className="text-gray-400 mb-4">Drag and drop your resume here, or click to browse</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-[#333] hover:bg-[#444] text-white px-4 py-2 rounded-md transition-colors"
                  >
                    Select File
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-4 flex justify-center">
                    <FileText size={48} className="text-[#e91e63]" />
                  </div>
                  <p className="font-medium mb-2">{agentData.resume.name}</p>
                  <p className="text-gray-400 text-sm mb-4">{(agentData.resume.size / 1024 / 1024).toFixed(2)} MB</p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-[#333] hover:bg-[#444] text-white px-4 py-2 rounded-md transition-colors"
                    >
                      Replace
                    </button>
                    <button
                      onClick={() => updateAgentData("resume", null)}
                      className="bg-transparent border border-[#333] hover:border-[#e91e63] text-white px-4 py-2 rounded-md transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="border border-[#333] rounded-lg p-4">
              <h3 className="font-bold mb-2 flex items-center">
                <FileText size={16} className="mr-2" />
                Extracted Information
              </h3>

              {isProcessing ? (
                <div className="flex items-center justify-center py-8">
                  <Loader size={24} className="animate-spin text-[#e91e63] mr-2" />
                  <span>Processing resume...</span>
                </div>
              ) : (
                <textarea
                  ref={resumeTextRef}
                  className="w-full h-40 bg-black border border-[#333] rounded-md p-3 mt-2 focus:border-[#e91e63] focus:outline-none resize-none"
                  placeholder="Resume information will appear here after upload. You can also manually enter information about yourself."
                  value={agentData.resumeText}
                  onChange={(e) => updateAgentData("resumeText", e.target.value)}
                ></textarea>
              )}
            </div>
          </motion.div>
        )

      case 2: // Agent Type
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full"
          >
            <h2 className="text-2xl font-bold mb-6">Select Agent Type</h2>
            <p className="text-gray-400 mb-6">
              Choose the type of AI agent you want to create. This will determine the agent's primary capabilities and
              focus areas.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {agentTypes.map((type) => {
                const isSelected = agentData.type === type.id

                return (
                  <div
                    key={type.id}
                    className={`border ${isSelected ? "border-[#e91e63]" : "border-[#333]"} rounded-lg p-4 cursor-pointer transition-colors hover:border-[#e91e63]/50`}
                    onClick={() => updateAgentData("type", type.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{type.name}</h3>
                        <p className="text-sm text-gray-400 mt-1">{type.description}</p>
                      </div>
                      {isSelected && <Check className="text-[#e91e63]" size={20} />}
                    </div>
                  </div>
                )
              })}
            </div>

            {errors.type && <p className="text-[#e91e63] text-sm mb-4">{errors.type}</p>}

            {agentData.type === "custom" && (
              <div className="border border-[#333] rounded-lg p-4 mt-4">
                <h3 className="font-bold mb-2">Custom Agent Instructions</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Provide detailed instructions for your custom agent. Describe what you want it to do, how it should
                  behave, and any specific knowledge it should have.
                </p>
                <textarea
                  className="w-full h-40 bg-black border border-[#333] rounded-md p-3 focus:border-[#e91e63] focus:outline-none resize-none"
                  placeholder="Example: I want an agent that can help me analyze financial data, track market trends, and provide investment recommendations based on my risk profile..."
                  value={agentData.customPrompt}
                  onChange={(e) => updateAgentData("customPrompt", e.target.value)}
                ></textarea>
              </div>
            )}
          </motion.div>
        )

      case 3: // Agent Details
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full"
          >
            <h2 className="text-2xl font-bold mb-6">Agent Details</h2>
            <p className="text-gray-400 mb-6">
              Provide a name and description for your AI agent. This information will help personalize your interaction
              experience.
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Agent Name</label>
                <input
                  type="text"
                  className="w-full bg-black border border-[#333] rounded-md p-3 focus:border-[#e91e63] focus:outline-none"
                  placeholder="e.g., Alex, DataBot, Assistant"
                  value={agentData.name}
                  onChange={(e) => updateAgentData("name", e.target.value)}
                />
                {errors.name && <p className="text-[#e91e63] text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Agent Description</label>
                <textarea
                  className="w-full h-40 bg-black border border-[#333] rounded-md p-3 focus:border-[#e91e63] focus:outline-none resize-none"
                  placeholder="Describe what you want your agent to help you with, its personality, and any specific traits it should have."
                  value={agentData.description}
                  onChange={(e) => updateAgentData("description", e.target.value)}
                ></textarea>
                {errors.description && <p className="text-[#e91e63] text-sm mt-1">{errors.description}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Agent Skills (Optional)</label>
                <p className="text-xs text-gray-400 mb-2">Enter skills and press Enter to add them</p>

                <div className="flex flex-wrap gap-2 mb-2">
                  {agentData.skills.map((skill, index) => (
                    <div key={index} className="bg-[#333] text-white px-3 py-1 rounded-full flex items-center">
                      {skill}
                      <X
                        size={14}
                        className="ml-2 cursor-pointer text-gray-400 hover:text-white"
                        onClick={() => {
                          const newSkills = [...agentData.skills]
                          newSkills.splice(index, 1)
                          updateAgentData("skills", newSkills)
                        }}
                      />
                    </div>
                  ))}
                </div>

                <input
                  type="text"
                  className="w-full bg-black border border-[#333] rounded-md p-3 focus:border-[#e91e63] focus:outline-none"
                  placeholder="e.g., Data Analysis, Writing, Research"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      const input = e.currentTarget
                      if (input.value.trim()) {
                        updateAgentData("skills", [...agentData.skills, input.value.trim()])
                        input.value = ""
                      }
                    }
                  }}
                />
              </div>
            </div>
          </motion.div>
        )

      case 4: // Review
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full"
          >
            <h2 className="text-2xl font-bold mb-6">Review Your Agent</h2>
            <p className="text-gray-400 mb-6">Review the details of your AI agent before finalizing its creation.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="border border-[#333] rounded-lg p-4">
                <h3 className="font-bold mb-4">Agent Configuration</h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Name</p>
                    <p className="font-medium">{agentData.name || "Not specified"}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Type</p>
                    <p className="font-medium">
                      {agentTypes.find((t) => t.id === agentData.type)?.name || "Not specified"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Voice</p>
                    <p className="font-medium">
                      {voiceOptions.find((v) => v.id === agentData.voice)?.name || "Not specified"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Resume</p>
                    <p className="font-medium">{agentData.resume ? agentData.resume.name : "Not uploaded"}</p>
                  </div>

                  {agentData.skills.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-400">Skills</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {agentData.skills.map((skill, index) => (
                          <span key={index} className="bg-[#333] text-white px-3 py-1 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="border border-[#333] rounded-lg p-4">
                <h3 className="font-bold mb-4 flex items-center justify-between">
                  <span>Generated Profile</span>
                  {isGenerating ? (
                    <Loader size={16} className="animate-spin text-[#e91e63]" />
                  ) : (
                    <RefreshCw
                      size={16}
                      className="cursor-pointer text-gray-400 hover:text-white"
                      onClick={generateAgentProfile}
                    />
                  )}
                </h3>

                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Loader size={24} className="animate-spin text-[#e91e63] mb-4" />
                    <span>Generating agent profile...</span>
                    <p className="text-sm text-gray-400 mt-2">This may take a moment</p>
                  </div>
                ) : generatedProfile ? (
                  <div className="text-sm overflow-y-auto max-h-[300px] whitespace-pre-line">{generatedProfile}</div>
                ) : (
                  <div className="flex items-center justify-center py-8 text-gray-400">
                    Profile generation failed. Please try again.
                  </div>
                )}
              </div>
            </div>

            <div className="border border-[#333] rounded-lg p-4">
              <h3 className="font-bold mb-2">Agent Description</h3>
              <p className="text-sm whitespace-pre-line">{agentData.description || "No description provided"}</p>
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black border border-[#333] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-[#333] flex justify-between items-center">
          <h1 className="text-xl font-bold">Create New AI Agent</h1>
          <button onClick={onCancel} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-400">
                Step {step + 1} of {totalSteps}
              </span>
              <span className="text-sm text-gray-400">{Math.round(((step + 1) / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="h-2 bg-[#222] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#e91e63] rounded-full transition-all duration-300"
                style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              className={`flex items-center text-gray-400 hover:text-white ${step === 0 ? "invisible" : ""}`}
            >
              <ChevronLeft size={20} className="mr-1" /> Back
            </button>

            <button
              onClick={nextStep}
              className="bg-[#e91e63] hover:bg-[#d81b60] text-white px-6 py-2 rounded-md flex items-center transition-colors"
            >
              {step === totalSteps - 1 ? "Create Agent" : "Next"}
              {step < totalSteps - 1 && <ChevronRight size={20} className="ml-1" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
