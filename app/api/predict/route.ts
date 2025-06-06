import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { predict } from "@/lib/ml-model"
import { getCachedSession } from "@/lib/session-cache"

interface PredictionResult {
  disease: string
  description: string
  precautions: string[]
  medications: string[]
  workout: string[]
  diet: string[]
}

export async function POST(request: Request) {
  try {
    const session = await getCachedSession()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { symptoms } = await request.json()

    if (!symptoms || !Array.isArray(symptoms)) {
      return NextResponse.json({ error: "Invalid symptoms input" }, { status: 400 })
    }

    const result = await predict(symptoms) as PredictionResult

    // Store the prediction in the database
    const symptomEntry = await prisma.symptomEntry.create({
      data: {
        userId: session.user.id,
        symptoms: symptoms,
        disease: result.disease,
        description: result.description,
        precautions: result.precautions,
        medications: result.medications,
        workouts: result.workout,
        diets: result.diet,
      },
    })

    return NextResponse.json({
      ...result,
      id: symptomEntry.id,
      createdAt: symptomEntry.createdAt,
    })
  } catch (error) {
    console.error("Prediction error:", error)
    return NextResponse.json(
      { error: "Failed to process prediction request" },
      { status: 500 }
    )
  }
} 