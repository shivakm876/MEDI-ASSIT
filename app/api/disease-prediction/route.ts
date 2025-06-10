import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCachedSession } from '@/lib/session-cache';
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_URL = 'https://software-enginnering-mediassist-ml.onrender.com/predict';
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

async function getDiseaseDetailsFromAI(diseaseName: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
  const prompt = `For the disease "${diseaseName}", provide the following information in JSON format:
  {
    "description": "A brief description of the disease",
    "precautions": ["List of precautions as an array"],
    "medications": ["List of common medications as an array"],
    "workouts": ["List of recommended exercises as an array"],
    "diets": ["List of dietary recommendations as an array"]
  }`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  try {
    // Remove markdown code block formatting if present
    const jsonText = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return {
      description: "Information not available",
      precautions: [],
      medications: [],
      workouts: [],
      diets: []
    };
  }
}

export async function POST(request: Request) {
  try {
    const session = await getCachedSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { symptoms } = body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return NextResponse.json(
        { error: 'Please provide at least one symptom' },
        { status: 400 }
      );
    }

    if (symptoms.length > 5) {
      return NextResponse.json(
        { error: 'Maximum 5 symptoms allowed' },
        { status: 400 }
      );
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ symptoms }),
    });

    if (!response.ok) {
      throw new Error('Failed to get predictions from ML service');
    }

    const predictionData = await response.json();
    
    // Create symptom entry
    const symptomEntry = await prisma.symptomEntry.create({
      data: {
        userId: session.user.id,
        symptoms: symptoms,
      },
    });

    // Process each predicted disease and store with probabilities
    const diseasePredictions = await Promise.all(
      Object.entries(predictionData.predicted_probabilities).map(async ([diseaseName, probability]) => {
        const diseaseDetails = await getDiseaseDetailsFromAI(diseaseName);
        
        return prisma.diseasePrediction.create({
          data: {
            symptomEntryId: symptomEntry.id,
            diseaseName,
            probability: probability as number,
            description: diseaseDetails.description,
            precautions: diseaseDetails.precautions,
            medications: diseaseDetails.medications,
            workouts: diseaseDetails.workouts,
            diets: diseaseDetails.diets,
          },
        });
      })
    );

    return NextResponse.json({
      ...predictionData,
      symptomEntryId: symptomEntry.id,
      diseasePredictions,
    });
  } catch (error) {
    console.error('Prediction error:', error);
    return NextResponse.json(
      { error: 'Failed to get predictions' },
      { status: 500 }
    );
  }
} 