import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const preferences = await prisma.userPreferences.findUnique({
      where: { userId: session.user.id },
    })

    if (!preferences) {
      // Create default preferences if none exist
      const defaultPreferences = await prisma.userPreferences.create({
        data: {
          userId: session.user.id,
          emailNotifications: true,
          pushNotifications: true,
          reminderNotifications: true,
          theme: "system",
          language: "en",
          fontSize: "medium",
          shareData: false,
          anonymousAnalytics: true,
        },
      })
      return NextResponse.json(defaultPreferences)
    }

    return NextResponse.json(preferences)
  } catch (error) {
    console.error("[PREFERENCES_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const {
      emailNotifications,
      pushNotifications,
      reminderNotifications,
      theme,
      language,
      fontSize,
      shareData,
      anonymousAnalytics,
    } = body

    const preferences = await prisma.userPreferences.upsert({
      where: { userId: session.user.id },
      update: {
        emailNotifications,
        pushNotifications,
        reminderNotifications,
        theme,
        language,
        fontSize,
        shareData,
        anonymousAnalytics,
      },
      create: {
        userId: session.user.id,
        emailNotifications,
        pushNotifications,
        reminderNotifications,
        theme,
        language,
        fontSize,
        shareData,
        anonymousAnalytics,
      },
    })

    return NextResponse.json(preferences)
  } catch (error) {
    console.error("[PREFERENCES_PUT]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}
