import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const API_URL = "https://software-enginnering-mediassist-ml.onrender.com/predict"
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

interface DiseasePrediction {
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

async function getDiseaseDetailsFromAI(diseaseName: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

  const prompt = `For the disease "${diseaseName}", provide the following information in JSON format:
  {
    "description": "A brief description of the disease",
    "precautions": ["List of precautions as an array"],
    "medications": ["List of common medications as an array"],
    "workouts": ["List of recommended exercises as an array"],
    "diets": ["List of dietary recommendations as an array"],
    "aiInsights": {
      "severity": "Mild/Moderate/Severe",
      "recommendedActions": ["List of immediate actions to take"],
      "lifestyleChanges": ["List of recommended lifestyle changes"],
      "warningSigns": ["List of warning signs to watch for"],
      "followUpRecommendations": ["List of follow-up recommendations"]
    }
  }`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Remove markdown code block formatting if present
    const jsonText = text.replace(/```json\n?|\n?```/g, "").trim()
    return JSON.parse(jsonText)
  } catch (error) {
    console.error("Error parsing AI response:", error)
    return {
      description: "Information not available",
      precautions: ["Consult with a healthcare professional"],
      medications: ["Consult with a doctor for proper medication"],
      workouts: ["Light exercise as recommended by doctor"],
      diets: ["Balanced diet as recommended by nutritionist"],
      aiInsights: {
        severity: "Unknown",
        recommendedActions: ["Seek medical consultation"],
        lifestyleChanges: ["Maintain healthy lifestyle"],
        warningSigns: ["Monitor symptoms closely"],
        followUpRecommendations: ["Regular medical check-ups"],
      },
    }
  }
}

export async function POST(req: Request) {
  try {
    const { symptoms } = await req.json()

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return NextResponse.json({ error: "Please provide at least one symptom" }, { status: 400 })
    }

    if (symptoms.length > 5) {
      return NextResponse.json({ error: "Maximum 5 symptoms allowed" }, { status: 400 })
    }

    // Process the symptoms array
    const processedSymptoms = symptoms.map((s: string) => s.toLowerCase().trim())

    // Get prediction from the ML service
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ symptoms: processedSymptoms }),
    })

    if (!response.ok) {
      throw new Error(`ML service responded with status: ${response.status}`)
    }

    const predictionData = await response.json()

    // Ensure predicted_probabilities exists and is an object
    if (!predictionData.predicted_probabilities || typeof predictionData.predicted_probabilities !== "object") {
      throw new Error("Invalid response format from ML service")
    }

    // Process each predicted disease and get AI insights
    const diseasePredictions = await Promise.all(
      Object.entries(predictionData.predicted_probabilities).map(async ([diseaseName, probability]) => {
        const diseaseDetails = await getDiseaseDetailsFromAI(diseaseName)

        return {
          diseaseName,
          probability: probability as number,
          description: diseaseDetails.description,
          precautions: diseaseDetails.precautions,
          medications: diseaseDetails.medications,
          workouts: diseaseDetails.workouts,
          diets: diseaseDetails.diets,
          aiInsights: diseaseDetails.aiInsights,
        } as DiseasePrediction
      }),
    )

    // Ensure we return a consistent structure
    const responseData = {
      predicted_probabilities: predictionData.predicted_probabilities || {},
      individual_model_results: predictionData.individual_model_results || {
        DecisionTree: {},
        NaiveBayes: {},
        RandomForest: {},
      },
      input_symptoms: predictionData.input_symptoms || processedSymptoms,
      iterations_per_model: predictionData.iterations_per_model || 0,
      total_predictions: predictionData.total_predictions || 0,
      diseasePredictions,
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error("Error analyzing symptoms:", error)
    return NextResponse.json(
      {
        error: "Failed to analyze symptoms",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
