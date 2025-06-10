import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getCachedSession } from "@/lib/session-cache"

// AI Analysis function (mock implementation)
async function analyzeSymptoms(symptoms: string[], severity: number, duration: number) {
  
  const commonDiseases = {
    "fever,cough,sore throat": {
      disease: "Common Cold",
      description:
        "The common cold is a viral infection of your nose and throat (upper respiratory tract). It's usually harmless, although it might not feel that way.",
    },
    "headache,nausea,dizziness": {
      disease: "Migraine",
      description:
        "A migraine is a headache that can cause severe throbbing pain or a pulsing sensation, usually on one side of the head.",
    },
    "fever,body ache,fatigue": {
      disease: "Flu",
      description:
        "Influenza (flu) is a viral infection that attacks your respiratory system — your nose, throat and lungs.",
    },
  }

  const symptomKey = symptoms.slice(0, 3).join(",").toLowerCase()
  const match = Object.entries(commonDiseases).find(([key]) =>
    key.split(",").some((symptom) => symptoms.some((s) => s.toLowerCase().includes(symptom))),
  )

  const result = match ? match[1] : commonDiseases["fever,cough,sore throat"]

  return {
    ...result,
    precautions: [
      "Rest and stay hydrated",
      "Avoid close contact with others",
      "Wash hands frequently",
      "Monitor symptoms closely",
    ],
    medications: [
      "Acetaminophen for pain and fever",
      "Decongestants for congestion",
      "Cough suppressants if needed",
      "Consult doctor for prescription medications",
    ],
    workouts: [
      "Rest until symptoms improve",
      "Light walking when feeling better",
      "Avoid strenuous exercise",
      "Gradually return to normal activity",
    ],
    diets: [
      "Drink plenty of fluids",
      "Eat vitamin C rich foods",
      "Consume warm soups and broths",
      "Avoid dairy if congested",
    ],
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { symptoms, duration, severity } = await request.json()

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return NextResponse.json({ error: "Symptoms are required" }, { status: 400 })
    }

    // Analyze symptoms with AI
    const analysis = await analyzeSymptoms(symptoms, severity, duration)

    // Save to database
    const symptomEntry = await prisma.symptomEntry.create({
      data: {
        userId: session.user.id,
        symptoms,
        predictions: {
          create: {
            diseaseName: analysis.disease,
            probability: 100,
            description: analysis.description,
            precautions: analysis.precautions,
            medications: analysis.medications,
            workouts: analysis.workouts,
            diets: analysis.diets,
          }
        }
      },
      include: {
        predictions: true
      }
    })

    return NextResponse.json(symptomEntry)
  } catch (error) {
    console.error("Symptom analysis error:", error)
    return NextResponse.json({ error: "Failed to process symptoms" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getCachedSession()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const symptoms = await prisma.symptomEntry.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        predictions: {
          orderBy: {
            probability: 'desc'
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(symptoms)
  } catch (error) {
    console.error("Error fetching symptoms:", error)
    return NextResponse.json(
      { error: "Failed to fetch symptoms" },
      { status: 500 }
    )
  }
}
