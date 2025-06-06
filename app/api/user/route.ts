import { NextResponse } from "next/server"

// Sample user data
const userData = {
  id: "user123",
  name: "John Doe",
  email: "john.doe@example.com",
  age: 35,
  gender: "male",
  preferences: {
    emailNotifications: true,
    pushNotifications: true,
    reminderNotifications: true,
    theme: "system",
    language: "english",
  },
}

export async function GET() {
  try {
    // In a real app, this would fetch the user data from a database
    // based on authentication

    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json(userData)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const updatedData = await request.json()

    // In a real app, this would update the user data in a database

    // Simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Return the updated data
    return NextResponse.json({
      ...userData,
      ...updatedData,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user data" }, { status: 500 })
  }
}
