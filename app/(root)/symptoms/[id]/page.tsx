"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Printer, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

interface DiseasePrediction {
  id: string
  diseaseName: string
  probability: number
  description: string
  precautions: string[]
  medications: string[]
  workouts: string[]
  diets: string[]
  aiInsights?: {
    severity: string
    recommendedActions: string[]
    lifestyleChanges: string[]
    warningSigns: string[]
    followUpRecommendations: string[]
  }
}

interface SymptomEntry {
  id: string
  symptoms: string[]
  createdAt: string
  predictions: DiseasePrediction[]
}

export default function SymptomEntryPage() {
  const params = useParams()
  const [entry, setEntry] = useState<SymptomEntry | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedDisease, setExpandedDisease] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const response = await fetch(`/api/symptoms/${params.id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch symptom entry")
        }
        const data = await response.json()
        setEntry(data)
      } catch (error) {
        console.error("Error fetching symptom entry:", error)
        toast({
          title: "Error",
          description: "Failed to load symptom entry",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchEntry()
  }, [params.id, toast])

  const toggleDiseaseDetails = (diseaseId: string) => {
    setExpandedDisease(expandedDisease === diseaseId ? null : diseaseId)
  }

  const handlePrint = () => {
    window.print()
  }

  const getChartData = () => {
    if (!entry) return null;

    const predictions = entry.predictions
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 5); // Show top 5 predictions

    const colors = [
      'rgba(255, 99, 132, 0.8)',
      'rgba(54, 162, 235, 0.8)',
      'rgba(255, 206, 86, 0.8)',
      'rgba(75, 192, 192, 0.8)',
      'rgba(153, 102, 255, 0.8)',
    ];

    return {
      labels: predictions.map(prediction => prediction.diseaseName),
      datasets: [
        {
          data: predictions.map(prediction => prediction.probability),
          backgroundColor: colors,
          borderColor: colors.map(color => color.replace('0.8', '1')),
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.label}: ${context.raw.toFixed(2)}%`;
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!entry) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <p>Symptom entry not found</p>
          <Button asChild className="mt-4">
            <Link href="/symptom-history">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to History
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <Button variant="ghost" asChild>
          <Link href="/symptom-history">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to History
          </Link>
        </Button>
        <Button onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" /> Print
        </Button>
      </div>

      <div className="space-y-6">
        <Card className="print:shadow-none print:border-none">
          <CardHeader>
            <CardTitle>Entry Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Date & Time</h3>
                <p>{new Date(entry.createdAt).toLocaleString()}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Symptoms</h3>
                <div className="flex flex-wrap gap-2">
                  {entry.symptoms.map((symptom, index) => (
                    <Badge key={index} variant="secondary">
                      {symptom}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="print:break-before-page">
          <h2 className="text-2xl font-bold mb-4 print:text-center">Disease Predictions & Recommendations</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="print:shadow-none print:border-none">
              <CardHeader>
                <CardTitle>Prediction Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  {getChartData() && <Pie data={getChartData()!} options={chartOptions} />}
                </div>
              </CardContent>
            </Card>

            <Card className="print:shadow-none print:border-none">
              <CardHeader>
                <CardTitle>Top Predictions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {entry.predictions
                    .sort((a, b) => b.probability - a.probability)
                    .slice(0, 5)
                    .map((prediction) => (
                      <div
                        key={prediction.id}
                        className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {prediction.diseaseName}
                        </span>
                        <Badge variant="outline" className="text-lg">
                          {prediction.probability.toFixed(1)}%
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {entry.predictions.map((prediction) => (
              <Card key={prediction.id} className="print:shadow-none print:border-none">
                <CardHeader 
                  className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
                  onClick={() => toggleDiseaseDetails(prediction.id)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <CardTitle>{prediction.diseaseName}</CardTitle>
                      {expandedDisease === prediction.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                    <Badge variant="outline" className="text-lg">
                      {prediction.probability.toFixed(1)}%
                    </Badge>
                  </div>
                </CardHeader>
                {expandedDisease === prediction.id && (
                  <CardContent className="animate-fadeIn">
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-2">Description</h3>
                        <p className="text-gray-600 dark:text-gray-300">{prediction.description}</p>
                      </div>

                      {prediction.aiInsights && (
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                          <h3 className="text-lg font-semibold mb-4">AI Analysis & Recommendations</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="font-medium mb-2">Recommended Actions</h4>
                              <ul className="space-y-2">
                                {prediction.aiInsights.recommendedActions.map((action, index) => (
                                  <li key={index} className="flex items-start text-gray-600 dark:text-gray-300">
                                    <span className="mr-2">•</span>
                                    <span>{action}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Warning Signs</h4>
                              <ul className="space-y-2">
                                {prediction.aiInsights.warningSigns.map((sign, index) => (
                                  <li key={index} className="flex items-start text-gray-600 dark:text-gray-300">
                                    <span className="mr-2">•</span>
                                    <span>{sign}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Lifestyle Changes</h4>
                              <ul className="space-y-2">
                                {prediction.aiInsights.lifestyleChanges.map((change, index) => (
                                  <li key={index} className="flex items-start text-gray-600 dark:text-gray-300">
                                    <span className="mr-2">•</span>
                                    <span>{change}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">Follow-up Recommendations</h4>
                              <ul className="space-y-2">
                                {prediction.aiInsights.followUpRecommendations.map((rec, index) => (
                                  <li key={index} className="flex items-start text-gray-600 dark:text-gray-300">
                                    <span className="mr-2">•</span>
                                    <span>{rec}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-medium mb-2">Precautions</h3>
                          <ul className="space-y-2">
                            {prediction.precautions.map((precaution, index) => (
                              <li key={index} className="flex items-start text-gray-600 dark:text-gray-300">
                                <span className="mr-2">•</span>
                                <span>{precaution}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-medium mb-2">Medications</h3>
                          <ul className="space-y-2">
                            {prediction.medications.map((medication, index) => (
                              <li key={index} className="flex items-start text-gray-600 dark:text-gray-300">
                                <span className="mr-2">•</span>
                                <span>{medication}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-medium mb-2">Recommended Exercises</h3>
                          <ul className="space-y-2">
                            {prediction.workouts.map((workout, index) => (
                              <li key={index} className="flex items-start text-gray-600 dark:text-gray-300">
                                <span className="mr-2">•</span>
                                <span>{workout}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h3 className="font-medium mb-2">Dietary Recommendations</h3>
                          <ul className="space-y-2">
                            {prediction.diets.map((diet, index) => (
                              <li key={index} className="flex items-start text-gray-600 dark:text-gray-300">
                                <span className="mr-2">•</span>
                                <span>{diet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>

        <div className="print:break-before-page">
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg print:border print:border-gray-300">
            <h3 className="text-xl font-semibold mb-4">Important Notes</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="mr-2">⚠️</span>
                <span>This is an AI-assisted prediction and should not be considered as a final medical diagnosis. Always consult with a healthcare professional for proper medical advice.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">📋</span>
                <span>Keep track of any changes in your symptoms and report them to your healthcare provider.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">💊</span>
                <span>Do not start any new medications without consulting your doctor first.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🏥</span>
                <span>Seek immediate medical attention if you experience severe symptoms or emergency warning signs.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
} 