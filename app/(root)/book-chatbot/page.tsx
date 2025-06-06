"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Mic, MicOff, Search, Send } from "lucide-react"
import { useRouter } from "next/navigation"

type Message = {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: Date
  sources?: {
    title: string
    page: number
  }[]
}

// Sample initial messages
const initialMessages: Message[] = [
  {
    id: "1",
    content: "Hello! I can search through medical textbooks to answer your questions. What would you like to know?",
    sender: "assistant",
    timestamp: new Date(),
  },
]

export default function BookChatbotPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (input.trim() === "") return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)
    setIsSearching(true)

    // Simulate search and AI response after a delay
    setTimeout(() => {
      setIsSearching(false)

      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: getBookResponse(input),
        sender: "assistant",
        timestamp: new Date(),
        sources: [
          {
            title: "Principles of Internal Medicine",
            page: 342,
          },
          {
            title: "Clinical Medicine Handbook",
            page: 127,
          },
          {
            title: "Respiratory Diseases and Treatments",
            page: 89,
          },
        ],
      }

      setMessages((prev) => [...prev, responseMessage])
      setIsTyping(false)
    }, 2500)
  }

  const handleVoiceInput = () => {
    setIsRecording(!isRecording)

    // Simulate voice recognition
    if (!isRecording) {
      setTimeout(() => {
        setInput("What are the complications of untreated strep throat?")
        setIsRecording(false)
      }, 2000)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Simple response generator based on input
  const getBookResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes("strep throat") || input.includes("streptococcal")) {
      return "Untreated strep throat can lead to several complications including:\n\n1. Rheumatic fever, which can damage heart valves and lead to rheumatic heart disease\n\n2. Post-streptococcal glomerulonephritis, an inflammation of the kidneys\n\n3. Peritonsillar abscess, a collection of pus behind the tonsils\n\n4. Scarlet fever, characterized by a distinctive rash\n\n5. Sinusitis and otitis media (ear infection)\n\nThese complications are rare with proper antibiotic treatment, which is why it's important to complete the full course of prescribed antibiotics even if symptoms improve."
    } else if (input.includes("diabetes") || input.includes("blood sugar")) {
      return "Diabetes mellitus is a metabolic disorder characterized by chronic hyperglycemia resulting from defects in insulin secretion, insulin action, or both. The two main types are Type 1 (autoimmune destruction of insulin-producing beta cells) and Type 2 (insulin resistance with relative insulin deficiency).\n\nComplications include:\n- Macrovascular: coronary artery disease, peripheral arterial disease, stroke\n- Microvascular: nephropathy, neuropathy, retinopathy\n- Other: increased susceptibility to infections, impaired wound healing\n\nManagement focuses on glycemic control through diet, exercise, medication, and regular monitoring of blood glucose levels."
    } else if (input.includes("hypertension") || input.includes("blood pressure")) {
      return "Hypertension (high blood pressure) is defined as systolic BP ≥130 mmHg or diastolic BP ≥80 mmHg. It's a major risk factor for cardiovascular disease, stroke, renal failure, and mortality.\n\nPrimary (essential) hypertension accounts for 90-95% of cases, while secondary hypertension results from identifiable causes like renal disease, endocrine disorders, or medications.\n\nTreatment includes lifestyle modifications (reduced sodium intake, DASH diet, physical activity, weight management, limited alcohol) and pharmacological therapy (diuretics, ACE inhibitors, ARBs, calcium channel blockers, beta-blockers)."
    } else if (input.includes("migraine") || input.includes("headache")) {
      return "Migraines are recurrent, moderate to severe headaches that typically present with unilateral location, pulsating quality, and associated symptoms such as nausea, vomiting, and sensitivity to light and sound.\n\nThe pathophysiology involves activation of the trigeminovascular system, release of inflammatory neuropeptides, and cortical spreading depression.\n\nTreatment approaches include:\n- Acute therapy: NSAIDs, triptans, anti-emetics, and in some cases, ergot derivatives\n- Preventive therapy: Beta-blockers, anticonvulsants, calcium channel blockers, antidepressants, and CGRP antagonists\n- Non-pharmacological: Trigger avoidance, stress management, regular sleep, and biofeedback"
    } else {
      return "I've searched through our medical textbooks but couldn't find specific information on that topic. Could you rephrase your question or ask about a different medical condition? I can provide information on common conditions like hypertension, diabetes, respiratory infections, cardiovascular diseases, and many other medical topics."
    }
  }

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <Card className="glass-card border-0 h-[70vh] flex flex-col">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Medical Book Search</CardTitle>
            <CardDescription className="text-center">Ask questions to search through medical textbooks</CardDescription>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex gap-3 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                      {message.sender === "assistant" && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI" />
                          <AvatarFallback className="bg-green-500 text-white">
                            <BookOpen className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div
                        className={`rounded-lg p-3 ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line">{message.content}</p>

                        {message.sources && (
                          <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                            <p className="text-xs font-medium mb-1">Sources:</p>
                            <div className="space-y-1">
                              {message.sources.map((source, index) => (
                                <p key={index} className="text-xs">
                                  {source.title} (p. {source.page})
                                </p>
                              ))}
                            </div>
                          </div>
                        )}

                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>

                      {message.sender === "user" && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                          <AvatarFallback className="bg-slate-500 text-white">U</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex gap-3 max-w-[80%]">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI" />
                        <AvatarFallback className="bg-green-500 text-white">
                          <BookOpen className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>

                      <div className="bg-secondary text-secondary-foreground rounded-lg p-3">
                        {isSearching ? (
                          <div className="flex items-center gap-2">
                            <Search className="h-4 w-4 animate-pulse" />
                            <span className="text-sm">Searching medical textbooks...</span>
                          </div>
                        ) : (
                          <div className="flex space-x-1">
                            <div className="h-2 w-2 bg-slate-400 dark:bg-slate-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="h-2 w-2 bg-slate-400 dark:bg-slate-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="h-2 w-2 bg-slate-400 dark:bg-slate-600 rounded-full animate-bounce"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          <CardFooter className="border-t border-border p-4">
            <div className="flex w-full items-center gap-2">
              <Button
                type="button"
                variant={isRecording ? "destructive" : "outline"}
                size="icon"
                onClick={handleVoiceInput}
                className="flex-shrink-0"
              >
                {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>

              <div className="relative flex-1">
                {isRecording && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-md">
                    <p className="text-sm text-muted-foreground animate-pulse">Listening...</p>
                  </div>
                )}
                <Input
                  placeholder="Ask a medical question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isRecording}
                  className="pr-10"
                />
              </div>

              <Button
                type="button"
                size="icon"
                onClick={handleSendMessage}
                disabled={input.trim() === "" || isRecording}
                className="flex-shrink-0"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>

            <div className="w-full mt-4 flex justify-center">
              <Button variant="outline" size="sm" onClick={() => router.push("/followup-chatbot")}>
                Switch to Follow-Up Assistant
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
