"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff } from "lucide-react"

interface VoiceInputButtonProps {
  onTextCapture: (text: string) => void
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  disabled?: boolean
}

export function VoiceInputButton({
  onTextCapture,
  variant = "outline",
  size = "icon",
  className = "",
  disabled = false,
}: VoiceInputButtonProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isSupported, setIsSupported] = useState(true)

  useEffect(() => {
    // Check if SpeechRecognition is supported
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setIsSupported(false)
    }
  }, [])

  const handleVoiceInput = () => {
    if (!isSupported) return

    setIsRecording(!isRecording)

    if (!isRecording) {
      // In a real implementation, this would use the Web Speech API
      // For this demo, we'll simulate voice recognition with a timeout
      setTimeout(() => {
        const simulatedTexts = [
          "I've been experiencing headaches and fatigue for the past three days.",
          "My symptoms started yesterday with a sore throat and mild fever.",
          "I have a sharp pain in my lower back that gets worse when I stand up.",
          "I've been feeling dizzy and nauseous since this morning.",
        ]

        const randomText = simulatedTexts[Math.floor(Math.random() * simulatedTexts.length)]
        onTextCapture(randomText)
        setIsRecording(false)
      }, 2000)
    }
  }

  if (!isSupported) {
    return null
  }

  return (
    <Button
      type="button"
      variant={isRecording ? "destructive" : variant}
      size={size}
      onClick={handleVoiceInput}
      className={className}
      disabled={disabled}
    >
      {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      {size !== "icon" && <span className="ml-2">{isRecording ? "Stop" : "Voice Input"}</span>}
    </Button>
  )
}
