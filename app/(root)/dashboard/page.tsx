"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, ChevronRight, MessageCircle, Plus, Stethoscope, User , Search } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

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

export default function DashboardPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [recentSymptoms, setRecentSymptoms] = useState<SymptomEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRecentSymptoms() {
      if (!session?.user) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch("/api/symptoms")
        if (!response.ok) {
          throw new Error("Failed to fetch symptoms")
        }
        const data = await response.json()
        if (Array.isArray(data)) {
          setRecentSymptoms(data)
        } else {
          setRecentSymptoms([])
        }
      } catch (error) {
        console.error("Error fetching symptoms:", error)
        setRecentSymptoms([])
      } finally {
        setLoading(false)
      }
    }

    fetchRecentSymptoms()
  }, [session])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Welcome back, {session?.user?.name || 'User'}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
            {/* <AvatarImage src={session?.user?.image || "/placeholder.svg?height=40&width=40"} alt="User" /> */}
            <AvatarFallback>{session?.user?.name?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6"
      >
        <motion.div variants={item}>
          <Card className="glass-card glass-card-hover h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <Button asChild variant="outline" className="w-full justify-between h-auto py-3">
                <Link href="/disease-predictor">
                  <div className="flex items-center">
                    <Stethoscope className="mr-2 h-4 w-4" />
                    <span className="text-sm sm:text-base">Check Symptoms</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full justify-between h-auto py-3">
                <Link href="/followup-chatbot">
                  <div className="flex items-center">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    <span className="text-sm sm:text-base">Chat with Assistant</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full justify-between h-auto py-3">
                <Link href="/find-doctors">
                  <div className="flex items-center">
                    <Search className="mr-2 h-4 w-4" />
                    <span className="text-sm sm:text-base">Find Near by Doctors</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full justify-between h-auto py-3">
                <Link href="/profile">
                  <div className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span className="text-sm sm:text-base">View Profile</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="glass-card glass-card-hover h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg sm:text-xl">Recent Symptoms</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/symptom-history">View All</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              {loading ? (
                <div className="text-center py-4">
                  <p className="text-slate-500">Loading...</p>
                </div>
              ) : recentSymptoms.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-slate-500">No recent symptoms found</p>
                </div>
              ) : (
                recentSymptoms.slice(0, 2).map((item) => (
                  <div key={item.id} className="border border-border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-sm sm:text-base">{item.disease}</h3>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                          {new Date(item.createdAt).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.symptoms.map((symptom) => (
                        <Badge key={symptom} variant="outline" className="text-xs">
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))
              )}

              <Button variant="outline" className="w-full h-auto py-3" asChild>
                <Link href="/disease-predictor">
                  <Plus className="mr-2 h-4 w-4" /> 
                  <span className="text-sm sm:text-base">New Check</span>
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-4 sm:mt-6"
      >
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Health Insights</CardTitle>
            <CardDescription className="text-sm sm:text-base">Your health trends and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 text-center">
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                {session?.user ? "Your health insights will appear here" : "Sign in to see your health insights"}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
