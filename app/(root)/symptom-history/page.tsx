"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Plus, RefreshCw, Printer, Eye, Trash2 } from "lucide-react"
import Link from "next/link"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useLanguage } from "@/lib/language-context"
import { useToast } from "@/hooks/use-toast"
import debounce from "lodash/debounce"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface SymptomEntry {
  id: string
  symptoms: string[]
  disease: string
  confidence: number
  createdAt: string
  precautions: string[]
  medications: string[]
  workouts: string[]
  diets: string[]
  description: string
}

export default function SymptomHistoryPage() {
  const [timeframe, setTimeframe] = useState("6months")
  const [symptomHistory, setSymptomHistory] = useState<SymptomEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [entryToDelete, setEntryToDelete] = useState<SymptomEntry | null>(null)
  const { t } = useLanguage()
  const { toast } = useToast()
  const router = useRouter()

  // Debounced fetch function
  const debouncedFetch = useCallback(
    debounce(async () => {
    try {
      const response = await fetch("/api/symptoms")
      if (!response.ok) {
        throw new Error("Failed to fetch symptom history")
      }
      const data = await response.json()
      setSymptomHistory(data)
    } catch (error) {
      console.error("Error fetching symptom history:", error)
      toast({
        title: "Error",
        description: "Failed to load symptom history",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
    }, 500), // 500ms debounce delay
    []
  )

  useEffect(() => {
    debouncedFetch()
    // Cleanup
    return () => {
      debouncedFetch.cancel()
    }
  }, [debouncedFetch])

  const handlePrintEntry = (entry: SymptomEntry) => {
    // Create a new window with the entry details for printing
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>MediAssist - Symptom Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .section { margin-bottom: 20px; }
              .section h3 { color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
              .badge { background: #f0f0f0; padding: 2px 8px; border-radius: 4px; margin: 2px; display: inline-block; }
              .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
              ul { margin: 10px 0; padding-left: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>MediAssist - Symptom Report</h1>
              <p>Generated on: ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div class="section">
              <h3>Diagnosis</h3>
              <p><strong>${entry.disease}</strong></p>
              <p>${entry.description}</p>
            </div>

            <div class="grid">
              <div class="section">
                <h3>Symptoms</h3>
                ${entry.symptoms.map((symptom) => `<span class="badge">${symptom}</span>`).join("")}
              </div>
              
              <div class="section">
                <h3>Details</h3>
                <p>Date: ${new Date(entry.createdAt).toLocaleDateString()}</p>
                <p>Time: ${new Date(entry.createdAt).toLocaleTimeString()}</p>
              </div>
            </div>

            <div class="section">
              <h3>Precautions</h3>
              <ul>
                ${entry.precautions.map((precaution) => `<li>${precaution}</li>`).join("")}
              </ul>
            </div>

            <div class="section">
              <h3>Medications</h3>
              <ul>
                ${entry.medications.map((medication) => `<li>${medication}</li>`).join("")}
              </ul>
            </div>

            <div class="section">
              <h3>Diet Recommendations</h3>
              <ul>
                ${entry.diets.map((diet) => `<li>${diet}</li>`).join("")}
              </ul>
            </div>

            <div class="section">
              <h3>Exercise Recommendations</h3>
              <ul>
                ${entry.workouts.map((workout) => `<li>${workout}</li>`).join("")}
              </ul>
            </div>

            <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #666;">
              <p>This is an AI-generated assessment and should not replace professional medical advice.</p>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const handleViewDetails = (entry: SymptomEntry) => {
    // Store the entry data in sessionStorage and navigate to results
    sessionStorage.setItem("symptomResult", JSON.stringify(entry))
    router.push("/results")
  }

  const handleDelete = async (entry: SymptomEntry) => {
    setEntryToDelete(entry)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!entryToDelete) return

    try {
      const response = await fetch(`/api/symptoms/${entryToDelete.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete entry")
      }

      // Remove the deleted entry from the state
      setSymptomHistory((prev) => prev.filter((entry) => entry.id !== entryToDelete.id))

      toast({
        title: "Success",
        description: "Symptom entry deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting entry:", error)
      toast({
        title: "Error",
        description: "Failed to delete symptom entry",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setEntryToDelete(null)
    }
  }

  // Generate chart data from symptom history
  const generateChartData = () => {
    const monthlyData: { [key: string]: { [symptom: string]: number } } = {}

    symptomHistory.forEach((entry) => {
      const month = new Date(entry.createdAt).toLocaleDateString("en-US", { month: "short", year: "2-digit" })
      if (!monthlyData[month]) {
        monthlyData[month] = {}
      }

      entry.symptoms.forEach((symptom) => {
        if (!monthlyData[month][symptom]) {
          monthlyData[month][symptom] = 0
        }
        monthlyData[month][symptom] += 1  
      })
    })

    return Object.entries(monthlyData)
      .map(([month, symptoms]) => ({
        month,
        ...symptoms,
      }))
      .slice(-6)  
  }

  const chartData = generateChartData()

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <p>{t("loading")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">{t("symptomHistory")}</h1>
            <p className="text-slate-600 dark:text-slate-400">{t("symptomHistory.trackChanges")}</p>
          </div>

          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">Last 3 months</SelectItem>
                <SelectItem value="6months">Last 6 months</SelectItem>
                <SelectItem value="1year">Last year</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>

            <Button asChild>
              <Link href="/symptom-input">
                <Plus className="mr-2 h-4 w-4" /> New Check
              </Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <div className="space-y-4">
              {symptomHistory.length === 0 ? (
                <Card className="glass-card border-0">
                  <CardContent className="p-8 text-center">
                    <p className="text-slate-500 dark:text-slate-400 mb-4">{t("symptomHistory.noHistory")}</p>
                    <Button asChild>
                      <Link href="/symptom-input">
                        <Plus className="mr-2 h-4 w-4" /> {t("symptomHistory.checkFirst")}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                symptomHistory.map((entry) => (
                  <Card key={entry.id} className="glass-card glass-card-hover overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="bg-slate-100 dark:bg-slate-800 p-4 md:w-48 flex flex-row md:flex-col justify-between md:justify-start gap-4">
                          <div>
                            <div className="flex items-center text-slate-500 dark:text-slate-400 mb-1">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span className="text-sm">{new Date(entry.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center text-slate-500 dark:text-slate-400">
                              <Clock className="h-4 w-4 mr-1" />
                              <span className="text-sm">{new Date(entry.createdAt).toLocaleTimeString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 flex-1">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="text-xl font-semibold">{entry.disease}</h3>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                              onClick={() => handleDelete(entry)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="mb-3">
                            <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                              {t("symptoms")}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {entry.symptoms.map((symptom) => (
                                <Badge key={symptom} variant="outline">
                                  {symptom}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4">
                            <Button variant="outline" size="sm" onClick={() => handleViewDetails(entry)}>
                              <Eye className="mr-2 h-3 w-3" /> {t("symptomHistory.viewDetails")}
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handlePrintEntry(entry)}>
                              <Printer className="mr-2 h-3 w-3" /> {t("print")}
                            </Button>
                            <Button variant="secondary" size="sm" asChild>
                              <Link href="/symptom-input">
                                <RefreshCw className="mr-2 h-3 w-3" /> {t("symptomHistory.recheck")}
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="trends">
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle>{t("symptomHistory.trends")}</CardTitle>
                <CardDescription>{t("symptomHistory.trackChanges")}</CardDescription>
              </CardHeader>
              <CardContent>
                {chartData.length > 0 ? (
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={chartData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 0,
                          bottom: 0,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            borderRadius: "8px",
                            border: "1px solid #eee",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Legend />
                        {/* Dynamic lines based on symptoms in data */}
                        {Object.keys(chartData[0] || {})
                          .filter((key) => key !== "month")
                          .slice(0, 4)
                          .map((symptom, index) => (
                            <Line
                              key={symptom}
                              type="monotone"
                              dataKey={symptom}
                              stroke={["#3b82f6", "#8b5cf6", "#10b981", "#ef4444"][index]}
                              strokeWidth={2}
                              activeDot={{ r: 8 }}
                            />
                          ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-slate-500 dark:text-slate-400">{t("symptomHistory.noData")}</p>
                  </div>
                )}

                {symptomHistory.length > 0 && (
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                      <h3 className="text-sm font-medium text-purple-600 dark:text-purple-400">{t("symptomHistory.totalEntries")}</h3>
                      <p className="text-2xl font-bold">{symptomHistory.length}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{t("symptomHistory.symptomChecks")}</p>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                      <h3 className="text-sm font-medium text-green-600 dark:text-green-400">{t("symptomHistory.mostCommon")}</h3>
                      <p className="text-lg font-bold">
                        {symptomHistory.length > 0
                          ? Object.entries(
                              symptomHistory.reduce(
                                (acc, entry) => {
                                  entry.symptoms.forEach((symptom) => {
                                    acc[symptom] = (acc[symptom] || 0) + 1
                                  })
                                  return acc
                                },
                                {} as Record<string, number>,
                              ),
                            ).sort((a, b) => b[1] - a[1])[0]?.[0] || "None"
                          : "None"}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{t("symptomHistory.symptom")}</p>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                      <h3 className="text-sm font-medium text-red-600 dark:text-red-400">{t("symptomHistory.lastCheck")}</h3>
                      <p className="text-lg font-bold">
                        {symptomHistory.length > 0
                          ? Math.ceil(
                              (Date.now() - new Date(symptomHistory[0].createdAt).getTime()) / (1000 * 60 * 60 * 24),
                            )
                          : 0}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{t("symptomHistory.daysAgo")}</p>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => window.print()}>
                  {t("symptomHistory.downloadReport")}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the symptom entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
