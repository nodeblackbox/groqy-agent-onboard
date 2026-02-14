"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronLeft, Check, X, User, Code, Brain, Zap, Shield } from "lucide-react"

interface OnboardingProps {
  onComplete: () => void
}

interface UserData {
  fullName: string
  email: string
  role: string
  skills: string[]
  languages: string[]
  strengths: string[]
  weaknesses: string[]
  termsAccepted: boolean
}

const skillOptions = [
  { id: "frontend", label: "Frontend Development", icon: Code },
  { id: "backend", label: "Backend Development", icon: Code },
  { id: "design", label: "UI/UX Design", icon: User },
  { id: "data", label: "Data Analysis", icon: Brain },
  { id: "ai", label: "AI/ML", icon: Brain },
  { id: "security", label: "Security", icon: Shield },
  { id: "devops", label: "DevOps", icon: Zap },
  { id: "management", label: "Project Management", icon: User },
]

const languageOptions = [
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "python", label: "Python" },
  { id: "java", label: "Java" },
  { id: "csharp", label: "C#" },
  { id: "go", label: "Go" },
  { id: "rust", label: "Rust" },
  { id: "ruby", label: "Ruby" },
  { id: "php", label: "PHP" },
  { id: "swift", label: "Swift" },
  { id: "kotlin", label: "Kotlin" },
]

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0)
  const [userData, setUserData] = useState<UserData>({
    fullName: "",
    email: "",
    role: "",
    skills: [],
    languages: [],
    strengths: [],
    weaknesses: [],
    termsAccepted: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const totalSteps = 6

  const updateUserData = (field: keyof UserData, value: any) => {
    setUserData((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const toggleArrayItem = (field: keyof UserData, item: string) => {
    setUserData((prev) => {
      const currentArray = prev[field] as string[]
      if (currentArray.includes(item)) {
        return { ...prev, [field]: currentArray.filter((i) => i !== item) }
      } else {
        return { ...prev, [field]: [...currentArray, item] }
      }
    })
  }

  const validateStep = () => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 0: // Welcome
        break
      case 1: // Basic Info
        if (!userData.fullName.trim()) newErrors.fullName = "Full name is required"
        if (!userData.email.trim()) {
          newErrors.email = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
          newErrors.email = "Email is invalid"
        }
        if (!userData.role.trim()) newErrors.role = "Role is required"
        break
      case 2: // Skills
        if (userData.skills.length === 0) newErrors.skills = "Select at least one skill"
        break
      case 3: // Languages
        if (userData.languages.length === 0) newErrors.languages = "Select at least one language"
        break
      case 4: // Strengths & Weaknesses
        if (userData.strengths.length === 0) newErrors.strengths = "Enter at least one strength"
        if (userData.weaknesses.length === 0) newErrors.weaknesses = "Enter at least one area for improvement"
        break
      case 5: // Terms
        if (!userData.termsAccepted) newErrors.termsAccepted = "You must accept the terms to continue"
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep()) {
      if (step < totalSteps - 1) {
        setStep(step + 1)
      } else {
        // Final step - complete onboarding
        setIsLoading(true)
        setTimeout(() => {
          onComplete()
        }, 1500)
      }
    }
  }

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <div className="mb-8 flex justify-center">
              <div className="w-24 h-24 bg-[#e91e63] rounded-full flex items-center justify-center animate-pulse-custom">
                <Zap size={48} className="text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-4">Welcome to Groqy AI</h1>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Let's set up your profile to get the most out of our AI-powered dashboard. This will only take a few
              minutes.
            </p>
            <div className="flex justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <button
                  onClick={nextStep}
                  className="bg-[#e91e63] text-white px-8 py-3 rounded-md font-medium flex items-center"
                >
                  Get Started <ChevronRight size={20} className="ml-2" />
                </button>
              </motion.div>
            </div>
          </motion.div>
        )

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="w-full max-w-md"
          >
            <h2 className="text-2xl font-bold mb-6">Tell us about yourself</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  value={userData.fullName}
                  onChange={(e) => updateUserData("fullName", e.target.value)}
                  className="w-full bg-black border border-[#333] rounded-md p-3 focus:border-[#e91e63] focus:outline-none"
                  placeholder="Enter your full name"
                />
                {errors.fullName && <p className="text-[#e91e63] text-sm mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) => updateUserData("email", e.target.value)}
                  className="w-full bg-black border border-[#333] rounded-md p-3 focus:border-[#e91e63] focus:outline-none"
                  placeholder="Enter your email"
                />
                {errors.email && <p className="text-[#e91e63] text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <input
                  type="text"
                  value={userData.role}
                  onChange={(e) => updateUserData("role", e.target.value)}
                  className="w-full bg-black border border-[#333] rounded-md p-3 focus:border-[#e91e63] focus:outline-none"
                  placeholder="e.g. Frontend Developer, Project Manager"
                />
                {errors.role && <p className="text-[#e91e63] text-sm mt-1">{errors.role}</p>}
              </div>
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="w-full max-w-md"
          >
            <h2 className="text-2xl font-bold mb-6">Select your skills</h2>
            <p className="text-gray-400 mb-4">Choose all that apply to you.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {skillOptions.map((skill) => {
                const isSelected = userData.skills.includes(skill.id)
                const Icon = skill.icon
                return (
                  <motion.div
                    key={skill.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleArrayItem("skills", skill.id)}
                    className={`flex items-center p-3 border ${
                      isSelected ? "border-[#e91e63] bg-[#e91e63]/10" : "border-[#333] bg-black"
                    } rounded-md cursor-pointer transition-colors`}
                  >
                    <Icon size={16} className={`mr-2 ${isSelected ? "text-[#e91e63]" : "text-gray-400"}`} />
                    <span className={isSelected ? "text-white" : "text-gray-300"}>{skill.label}</span>
                    {isSelected && <Check size={16} className="ml-auto text-[#e91e63]" />}
                  </motion.div>
                )
              })}
            </div>

            {errors.skills && <p className="text-[#e91e63] text-sm mt-1">{errors.skills}</p>}

            <div className="mt-4">
              <p className="text-sm text-gray-400">Don't see your skill? Add a custom one:</p>
              <div className="flex mt-2">
                <input
                  type="text"
                  id="customSkill"
                  className="flex-1 bg-black border border-[#333] rounded-l-md p-2 focus:border-[#e91e63] focus:outline-none"
                  placeholder="Enter custom skill"
                />
                <button
                  onClick={() => {
                    const customSkill = (document.getElementById("customSkill") as HTMLInputElement).value
                    if (customSkill.trim()) {
                      toggleArrayItem("skills", customSkill.trim())
                      ;(document.getElementById("customSkill") as HTMLInputElement).value = ""
                    }
                  }}
                  className="bg-[#333] px-4 rounded-r-md hover:bg-[#444]"
                >
                  Add
                </button>
              </div>
            </div>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="w-full max-w-md"
          >
            <h2 className="text-2xl font-bold mb-6">Programming Languages</h2>
            <p className="text-gray-400 mb-4">Select the languages you're proficient in.</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {languageOptions.map((lang) => {
                const isSelected = userData.languages.includes(lang.id)
                return (
                  <motion.div
                    key={lang.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleArrayItem("languages", lang.id)}
                    className={`px-3 py-2 rounded-full border ${
                      isSelected ? "border-[#e91e63] bg-[#e91e63]/10 text-white" : "border-[#333] text-gray-400"
                    } cursor-pointer transition-colors`}
                  >
                    {lang.label}
                  </motion.div>
                )
              })}
            </div>

            {errors.languages && <p className="text-[#e91e63] text-sm mt-1">{errors.languages}</p>}

            <div className="mt-4">
              <p className="text-sm text-gray-400">Don't see your language? Add a custom one:</p>
              <div className="flex mt-2">
                <input
                  type="text"
                  id="customLanguage"
                  className="flex-1 bg-black border border-[#333] rounded-l-md p-2 focus:border-[#e91e63] focus:outline-none"
                  placeholder="Enter language"
                />
                <button
                  onClick={() => {
                    const customLang = (document.getElementById("customLanguage") as HTMLInputElement).value
                    if (customLang.trim()) {
                      toggleArrayItem("languages", customLang.trim())
                      ;(document.getElementById("customLanguage") as HTMLInputElement).value = ""
                    }
                  }}
                  className="bg-[#333] px-4 rounded-r-md hover:bg-[#444]"
                >
                  Add
                </button>
              </div>
            </div>
          </motion.div>
        )

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="w-full max-w-md"
          >
            <h2 className="text-2xl font-bold mb-6">Strengths & Areas for Improvement</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Your Strengths</label>
              <p className="text-gray-400 text-sm mb-2">What are you great at? (Press Enter after each item)</p>

              <div className="flex flex-wrap gap-2 mb-2">
                {userData.strengths.map((strength, index) => (
                  <div key={index} className="bg-[#333] text-white px-3 py-1 rounded-full flex items-center">
                    {strength}
                    <X
                      size={14}
                      className="ml-2 cursor-pointer text-gray-400 hover:text-white"
                      onClick={() => {
                        setUserData((prev) => ({
                          ...prev,
                          strengths: prev.strengths.filter((_, i) => i !== index),
                        }))
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="flex">
                <input
                  type="text"
                  id="strengthInput"
                  className="flex-1 bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none"
                  placeholder="e.g. Problem solving, Communication"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      const input = e.currentTarget
                      if (input.value.trim()) {
                        setUserData((prev) => ({
                          ...prev,
                          strengths: [...prev.strengths, input.value.trim()],
                        }))
                        input.value = ""
                      }
                    }
                  }}
                />
              </div>
              {errors.strengths && <p className="text-[#e91e63] text-sm mt-1">{errors.strengths}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Areas for Improvement</label>
              <p className="text-gray-400 text-sm mb-2">
                What would you like to improve? (Press Enter after each item)
              </p>

              <div className="flex flex-wrap gap-2 mb-2">
                {userData.weaknesses.map((weakness, index) => (
                  <div key={index} className="bg-[#333] text-white px-3 py-1 rounded-full flex items-center">
                    {weakness}
                    <X
                      size={14}
                      className="ml-2 cursor-pointer text-gray-400 hover:text-white"
                      onClick={() => {
                        setUserData((prev) => ({
                          ...prev,
                          weaknesses: prev.weaknesses.filter((_, i) => i !== index),
                        }))
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="flex">
                <input
                  type="text"
                  id="weaknessInput"
                  className="flex-1 bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none"
                  placeholder="e.g. Public speaking, Time management"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      const input = e.currentTarget
                      if (input.value.trim()) {
                        setUserData((prev) => ({
                          ...prev,
                          weaknesses: [...prev.weaknesses, input.value.trim()],
                        }))
                        input.value = ""
                      }
                    }
                  }}
                />
              </div>
              {errors.weaknesses && <p className="text-[#e91e63] text-sm mt-1">{errors.weaknesses}</p>}
            </div>
          </motion.div>
        )

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="w-full max-w-md"
          >
            <h2 className="text-2xl font-bold mb-6">Terms & Conditions</h2>

            <div className="bg-[#111] border border-[#333] rounded-md p-4 mb-6 h-64 overflow-y-auto">
              <h3 className="text-lg font-medium mb-2">Terms of Service</h3>
              <p className="text-sm text-gray-400 mb-4">Last updated: April 16, 2025</p>

              <div className="space-y-4 text-sm text-gray-300">
                <p>Welcome to Groqy AI. By accessing our platform, you agree to these Terms of Service.</p>

                <h4 className="font-medium">1. Use of Service</h4>
                <p>
                  You agree to use our services only for lawful purposes and in accordance with these Terms. You are
                  responsible for maintaining the confidentiality of your account information.
                </p>

                <h4 className="font-medium">2. Data Privacy</h4>
                <p>
                  We collect and process personal information as described in our Privacy Policy. By using our services,
                  you consent to such processing and you warrant that all data provided by you is accurate.
                </p>

                <h4 className="font-medium">3. Intellectual Property</h4>
                <p>
                  Our platform and its original content, features, and functionality are owned by Groqy AI and are
                  protected by international copyright, trademark, patent, trade secret, and other intellectual property
                  laws.
                </p>

                <h4 className="font-medium">4. User Contributions</h4>
                <p>
                  Any content you contribute to our platform may be used, copied, reproduced, processed, adapted,
                  modified, published, transmitted, displayed, and distributed in any and all media or distribution
                  methods.
                </p>

                <h4 className="font-medium">5. Termination</h4>
                <p>
                  We may terminate or suspend your account and bar access to the Service immediately, without prior
                  notice or liability, under our sole discretion, for any reason whatsoever.
                </p>

                <h4 className="font-medium">6. Limitation of Liability</h4>
                <p>
                  In no event shall Groqy AI, nor its directors, employees, partners, agents, suppliers, or affiliates,
                  be liable for any indirect, incidental, special, consequential or punitive damages.
                </p>

                <h4 className="font-medium">7. Changes</h4>
                <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time.</p>
              </div>
            </div>

            <div className="flex items-start mb-6">
              <input
                type="checkbox"
                id="termsCheckbox"
                checked={userData.termsAccepted}
                onChange={(e) => updateUserData("termsAccepted", e.target.checked)}
                className="mt-1 mr-3"
              />
              <label htmlFor="termsCheckbox" className="text-sm">
                I have read and agree to the Terms of Service and Privacy Policy
              </label>
            </div>

            {errors.termsAccepted && <p className="text-[#e91e63] text-sm">{errors.termsAccepted}</p>}
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(233,30,99,0.15),transparent_70%)]"></div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Progress bar */}
          {step > 0 && (
            <div className="mb-8 w-full max-w-md mx-auto">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-400">
                  Step {step} of {totalSteps - 1}
                </span>
                <span className="text-sm text-gray-400">{Math.round((step / (totalSteps - 1)) * 100)}% Complete</span>
              </div>
              <div className="h-2 bg-[#333] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#e91e63] rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${(step / (totalSteps - 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Card */}
          <div className="bg-black/80 border border-[#333] rounded-xl p-8 backdrop-blur-sm">
            <AnimatePresence mode="wait">
              <div key={step} className="flex flex-col items-center">
                {renderStep()}

                {/* Navigation buttons */}
                {step > 0 && (
                  <div className="flex justify-between w-full max-w-md mt-8">
                    <button onClick={prevStep} className="flex items-center text-gray-400 hover:text-white">
                      <ChevronLeft size={20} className="mr-1" /> Back
                    </button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={nextStep}
                      className="bg-[#e91e63] text-white px-6 py-2 rounded-md font-medium flex items-center"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                          Processing...
                        </>
                      ) : step === totalSteps - 1 ? (
                        <>Complete</>
                      ) : (
                        <>
                          Next <ChevronRight size={20} className="ml-1" />
                        </>
                      )}
                    </motion.button>
                  </div>
                )}
              </div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
