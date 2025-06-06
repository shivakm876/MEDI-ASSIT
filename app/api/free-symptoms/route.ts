import { NextResponse } from "next/server"
import { loadModel, predict } from "@/lib/ml-model"

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
    const prediction = await predict(processedSymptoms)

    // console.log(prediction)

    return NextResponse.json(prediction)
  } catch (error) {
    console.error("Error analyzing symptoms:", error)
    return NextResponse.json(
      { error: "Failed to analyze symptoms" },
      { status: 500 }
    )
  }
} 