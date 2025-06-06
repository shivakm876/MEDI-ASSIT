import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const API_KEY = process.env.GOOGLE_AI_API_KEY;

if (!API_KEY) {
  throw new Error("Missing GOOGLE_AI_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export async function POST(req: Request) {
  try {
    const { message, history, recentSymptoms = [] } = await req.json();
    const session = await getServerSession(authOptions);

    // Create context from recent symptoms
    let medicalContext = "Recent Symptom History:\n";
    if (recentSymptoms.length > 0) {
      recentSymptoms.forEach((entry: any) => {
        medicalContext += `
Date: ${new Date(entry.createdAt).toLocaleDateString()}
Disease: ${entry.disease}
Symptoms: ${entry.symptoms.join(", ")}
Description: ${entry.description}
Precautions: ${entry.precautions.join(", ")}
Medications: ${entry.medications.join(", ")}
Workouts: ${entry.workouts.join(", ")}
Diets: ${entry.diets.join(", ")}
---\n`;
      });
    } else {
      medicalContext += "No recent symptom history available.\n";
    }

    // Add medical disclaimer and instructions
    medicalContext += `
Medical Disclaimer:
The information provided is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

Tone Instructions:
- Be empathetic and acknowledge the user's concerns
- Use simple, non-technical language
- Include appropriate disclaimers
- Provide practical, actionable advice when appropriate
- Reference the user's symptom history when relevant
`;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      systemInstruction: medicalContext
    });

    // Start a new chat with the current message
    const chat = model.startChat();
    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    // Return the complete history including the new messages
    return NextResponse.json({ 
      message: text,
      history: [
        ...(history || []),
        { role: "user", parts: [{ text: message }] },
        { role: "model", parts: [{ text }] }
      ]
    });

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}
