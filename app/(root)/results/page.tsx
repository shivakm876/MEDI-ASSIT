"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Printer } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

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

export default function ResultsPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const [result, setResult] = useState<SymptomEntry | null>(null)

  useEffect(() => {
    const storedResult = sessionStorage.getItem("symptomResult")
    if (storedResult) {
      setResult(JSON.parse(storedResult))
    } else {
      router.push("/symptom-history")
    }
  }, [router])

  const handlePrint = () => {
    if (!result) return

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
              <p><strong>${result.disease}</strong></p>
              <p>${result.description}</p>
            </div>

            <div class="grid">
              <div class="section">
                <h3>Symptoms</h3>
                ${result.symptoms.map((symptom) => `<span class="badge">${symptom}</span>`).join("")}
              </div>
              
              <div class="section">
                <h3>Details</h3>
                <p>Date: ${new Date(result.createdAt).toLocaleDateString()}</p>
                <p>Time: ${new Date(result.createdAt).toLocaleTimeString()}</p>
              </div>
            </div>

            <div class="section">
              <h3>Precautions</h3>
              <ul>
                ${result.precautions.map((precaution) => `<li>${precaution}</li>`).join("")}
              </ul>
            </div>

            <div class="section">
              <h3>Medications</h3>
              <ul>
                ${result.medications.map((medication) => `<li>${medication}</li>`).join("")}
              </ul>
            </div>

            <div class="section">
              <h3>Diet Recommendations</h3>
              <ul>
                ${result.diets.map((diet) => `<li>${diet}</li>`).join("")}
              </ul>
            </div>

            <div class="section">
              <h3>Exercise Recommendations</h3>
              <ul>
                ${result.workouts.map((workout) => `<li>${workout}</li>`).join("")}
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

  if (!result) {
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
      >
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" /> {t("print")}
          </Button>
            </div>

        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-2xl">{result.disease}</CardTitle>
            <CardDescription>
              {new Date(result.createdAt).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">{t("description")}</h3>
              <p className="text-slate-600 dark:text-slate-400">{result.description}</p>
          </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">{t("symptoms")}</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.symptoms.map((symptom, index) => (
                  <Badge key={index} variant="outline">
                    {symptom}
                  </Badge>
                    ))}
                  </div>
                </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">{t("precautions")}</h3>
              <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                {result.precautions.map((precaution, index) => (
                  <li key={index}>{precaution}</li>
                ))}
              </ul>
                </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">{t("recommendations.medication")}</h3>
              <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                {result.medications.map((medication, index) => (
                  <li key={index}>{medication}</li>
                  ))}
              </ul>
                </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">{t("recommendations.workouts")}</h3>
              <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                {result.workouts.map((workout, index) => (
                  <li key={index}>{workout}</li>
                ))}
              </ul>
                </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">{t("recommendations.diets")}</h3>
              <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                {result.diets.map((diet, index) => (
                  <li key={index}>{diet}</li>
                ))}
              </ul>
              </div>

            <div className="mt-8 pt-6 border-t text-sm text-slate-500 dark:text-slate-400">
              <p>This is an AI-generated assessment and should not replace professional medical advice.</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
