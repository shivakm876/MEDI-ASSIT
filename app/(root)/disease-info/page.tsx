"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface DiseaseInfo {
  description: string
  elaboratedDescription: string
  precautions: string[]
  medications: string[]
  diets: string[]
  detailedDietPlan: string
  workouts: string[]
}

// Helper function to parse CSV properly
function parseCSV(csvText: string): string[][] {
  const lines = csvText.trim().split("\n")
  return lines.map((line) => {
    const result: string[] = []
    let current = ""
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]

      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === "," && !inQuotes) {
        result.push(current.trim())
        current = ""
      } else {
        current += char
      }
    }

    result.push(current.trim())
    return result
  })
}

export default function DiseaseInfoPage() {
  const [diseases, setDiseases] = useState<string[]>([])
  const [selectedDisease, setSelectedDisease] = useState<string>("")
  const [diseaseInfo, setDiseaseInfo] = useState<DiseaseInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        setInitialLoading(true)
        setError(null)

        const response = await fetch("/datasets/description.csv")
        if (!response.ok) {
          throw new Error(`Failed to fetch diseases: ${response.statusText}`)
        }

        const data = await response.text()
        const rows = parseCSV(data)

        // Skip header row and extract disease names from first column
        const validDiseases = rows
          .slice(1)
          .map((row) => row[0])
          .filter((disease) => disease && disease.length > 0)
          .sort()

        setDiseases(validDiseases)
      } catch (error) {
        console.error("Error fetching diseases:", error)
        setError("Failed to load disease list. Please check if the CSV files are available.")
      } finally {
        setInitialLoading(false)
      }
    }

    fetchDiseases()
  }, [])

  useEffect(() => {
    if (!selectedDisease) {
      setDiseaseInfo(null)
      return
    }

    const fetchDiseaseInfo = async () => {
      try {
        setLoading(true)
        setError(null)

        const fetchPromises = [
          fetch("/datasets/description.csv"),
          fetch("/datasets/precautions_df.csv"),
          fetch("/datasets/medications.csv"),
          fetch("/datasets/diets.csv"),
          fetch("/datasets/workout_df.csv"),
        ]

        const responses = await Promise.all(fetchPromises)

        // Check if all responses are ok
        for (const response of responses) {
          if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`)
          }
        }

        const [descriptionData, precautionsData, medicationsData, dietsData, workoutsData] = await Promise.all(
          responses.map((res) => res.text()),
        )

        // Parse description
        const descriptionRows = parseCSV(descriptionData)
        const descriptionRow = descriptionRows.find((row) => row[0] === selectedDisease)
        const description = descriptionRow ? descriptionRow[1].trim() : "No description available"
        const elaboratedDescription = descriptionRow ? descriptionRow[2].trim() : "No elaborated description available"

        // Parse precautions
        const precautionsRows = parseCSV(precautionsData)
        const precautionsRow = precautionsRows.find((row) => row[1] === selectedDisease)
        const precautions = precautionsRow ? precautionsRow.slice(2, 6).filter((p) => p && p.trim().length > 0) : []

        // Parse medications
        const medicationsRows = parseCSV(medicationsData)
        const medicationsRow = medicationsRows.find((row) => row[0] === selectedDisease)
        const medications = medicationsRow
          ? medicationsRow[1]
              .replace(/[\[\]']/g, "")
              .split(",")
              .map((m) => m.trim())
              .filter((m) => m && m.length > 0)
          : []

        // Parse diets
        const dietsRows = parseCSV(dietsData)
        const dietsRow = dietsRows.find((row) => row[0] === selectedDisease)
        const diets = dietsRow
          ? dietsRow[1]
              .replace(/[\[\]']/g, "")
              .split(",")
              .map((d) => d.trim())
              .filter((d) => d && d.length > 0)
          : []
        const detailedDietPlan = dietsRow ? dietsRow[2].trim() : "No detailed diet plan available"

        // Parse workouts
        const workoutsRows = parseCSV(workoutsData)
        const workoutsRow = workoutsRows.find((row) => row[0] === selectedDisease)
        const workouts = workoutsRow
          ? workoutsRow[1]
              .split(" | ")
              .map((w) => w.trim())
              .filter((w) => w && w.length > 0)
          : []

        setDiseaseInfo({
          description,
          elaboratedDescription,
          precautions,
          medications,
          diets,
          detailedDietPlan,
          workouts,
        })
      } catch (error) {
        console.error("Error fetching disease information:", error)
        setError("Failed to load disease information. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchDiseaseInfo()
  }, [selectedDisease])

  if (initialLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading diseases...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Disease Information</h1>
        <p className="text-muted-foreground">
          Select a disease to view detailed information about its description, precautions, medications, and recommended
          diets.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Disease</CardTitle>
          </CardHeader>
          <CardContent>
            <Select onValueChange={setSelectedDisease} value={selectedDisease} disabled={diseases.length === 0}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={diseases.length === 0 ? "No diseases available" : "Select a disease"} />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-[200px]">
                  {diseases.map((disease) => (
                    <SelectItem key={disease} value={disease}>
                      {disease}
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {loading && (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading disease information...</span>
              </div>
            </CardContent>
          </Card>
        )}

        {diseaseInfo && !loading && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Overview</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {diseaseInfo.description || "No description available"}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Detailed Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {diseaseInfo.elaboratedDescription || "No elaborated description available"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Precautions</CardTitle>
                </CardHeader>
                <CardContent>
                  {diseaseInfo.precautions.length > 0 ? (
                    <ul className="list-disc list-inside space-y-2">
                      {diseaseInfo.precautions.map((precaution, index) => (
                        <li key={index} className="text-muted-foreground">
                          {precaution}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No precautions available</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Medications</CardTitle>
                </CardHeader>
                <CardContent>
                  {diseaseInfo.medications.length > 0 ? (
                    <ul className="list-disc list-inside space-y-2">
                      {diseaseInfo.medications.map((medication, index) => (
                        <li key={index} className="text-muted-foreground">
                          {medication}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No medications available</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommended Diets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {diseases.length > 0 ? (
                    <>
                      <div>
                        <h3 className="font-semibold mb-2">Diet Types</h3>
                        <ul className="list-disc list-inside space-y-2">
                          {diseaseInfo.diets.map((diet, index) => (
                            <li key={index} className="text-muted-foreground">
                              {diet}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Detailed Diet Plan</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {diseaseInfo.detailedDietPlan}
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="text-muted-foreground">No diet recommendations available</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommended Workouts & Lifestyle Changes</CardTitle>
                </CardHeader>
                <CardContent>
                  {diseaseInfo.workouts.length > 0 ? (
                    <ul className="list-disc list-inside space-y-2">
                      {diseaseInfo.workouts.map((workout, index) => (
                        <li key={index} className="text-muted-foreground">
                          {workout}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No workout recommendations available</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
