"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Send, Trash2 } from "lucide-react"
import { useSession } from "next-auth/react"
import ReactMarkdown from "react-markdown"
import { Components } from "react-markdown"

interface Message {
  role: "user" | "model"
  parts: { text: string }[]
}

interface SymptomEntry {
  id: string
  symptoms: string[]
  disease: string
  createdAt: string
  precautions: string[]
  medications: string[]
  workouts: string[]
  diets: string[]
  description: string
}

const GREETING_MESSAGE: Message = {
  role: "model",
  parts: [{ text: "Hello! I'm your medical assistant. I can help answer questions about your symptoms and provide guidance. How can I help you today?" }]
}

export default function FollowupChatbotPage() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      const savedMessages = localStorage.getItem('chatMessages')
      return savedMessages ? JSON.parse(savedMessages) : [GREETING_MESSAGE]
    }
    return [GREETING_MESSAGE]
  })
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [recentSymptoms, setRecentSymptoms] = useState<SymptomEntry[]>([])
  const chatRef = useRef<HTMLDivElement>(null)

  // Fetch symptoms once when the page loads
  useEffect(() => {
    async function fetchSymptoms() {
      if (!session?.user) return

      try {
        const response = await fetch("/api/symptoms")
        if (response.ok) {
          const data = await response.json()
          if (Array.isArray(data)) {
            setRecentSymptoms(data.slice(0, 3))
          }
        }
      } catch (error) {
        console.error("Error fetching symptoms:", error)
      }
    }

    fetchSymptoms()
  }, [session])

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('chatMessages', JSON.stringify(messages))
    }
  }, [messages])

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setIsLoading(true)

    // Add user message immediately to the UI
    const newUserMessage: Message = { role: "user", parts: [{ text: userMessage }] }
    setMessages(prev => [...prev, newUserMessage])

    try {
      // Filter out the initial greeting message when sending to API
      const apiHistory = messages.filter(msg => msg !== GREETING_MESSAGE)
      
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          history: apiHistory,
          recentSymptoms // Pass the symptoms we already have
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      const data = await response.json()
      // Add back the greeting message to the history
      setMessages([GREETING_MESSAGE, ...data.history])
    } catch (error) {
      console.error("Error sending message:", error)
      setMessages(prev => [
        ...prev,
        {
          role: "model",
          parts: [{ text: "Sorry, I encountered an error. Please try again." }]
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearChat = () => {
    setMessages([GREETING_MESSAGE])
    if (typeof window !== 'undefined') {
      localStorage.removeItem('chatMessages')
    }
  }

  const markdownComponents: Components = {
    h1: ({ children }) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
    h2: ({ children }) => <h2 className="text-lg font-semibold mb-2">{children}</h2>,
    h3: ({ children }) => <h3 className="text-base font-semibold mb-2">{children}</h3>,
    p: ({ children }) => <p className="mb-2">{children}</p>,
    ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
    li: ({ children }) => <li className="mb-1">{children}</li>,
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-slate-300 pl-4 italic my-2">{children}</blockquote>
    ),
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Medical Assistant Chat</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearChat}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear Chat
            </Button>
        </CardHeader>
        <CardContent>
          <div
            ref={chatRef}
            className="h-[500px] overflow-y-auto mb-4 space-y-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg"
          >
              <AnimatePresence>
            {messages.map((message, index) => (
                  <motion.div
                key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-white dark:bg-slate-800 shadow-sm"
                  }`}
                >
                  {message.role === "model" ? (
                    <div className="prose dark:prose-invert max-w-none">
                      <ReactMarkdown components={markdownComponents}>
                        {message.parts[0].text}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{message.parts[0].text}</p>
                  )}
                </div>
                  </motion.div>
            ))}
            {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-start"
                  >
                <div className="bg-white dark:bg-slate-800 rounded-lg p-3 shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
                  </motion.div>
            )}
              </AnimatePresence>
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
      </motion.div>
    </div>
  )
}
