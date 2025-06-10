import { NextResponse } from "next/server"
import { loadModel, predict } from "@/lib/ml-model"

interface Prediction {
  disease: string
  probability: number
  description: string
  precautions?: string[]
  medications?: string[]
  workouts?: string[]
  diets?: string[]
}

export async function POST(req: Request) {
  try {
    const { symptoms } = await req.json()

    if (!symptoms || !Array.isArray(symptoms)) {
      return NextResponse.json(
        { error: "Invalid symptoms data" },
        { status: 400 }
      )
    }

    // Process the symptoms array
    const processedSymptoms = symptoms.map((s: string) => s.toLowerCase().trim())

    // Get prediction from the model
    const predictions = await predict(processedSymptoms) as Prediction[]

    // Format the response to match the new schema
    const response = {
      predictions: predictions.map((pred) => ({
        diseaseName: pred.disease,
        probability: pred.probability,
        description: pred.description,
        precautions: pred.precautions || [],
        medications: pred.medications || [],
        workouts: pred.workouts || [],
        diets: pred.diets || []
      }))
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error analyzing symptoms:", error)
    return NextResponse.json(
      { error: "Failed to analyze symptoms" },
      { status: 500 }
    )
  }
} 