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

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        email: true,
        age: true,
        gender: true,
        image: true,
      },
    })

    if (!user) {
      return new NextResponse("User not found", { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("[PROFILE_GET]", error)
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
    const { name, email, age, gender } = body

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        email,
        age: age ? parseInt(age) : undefined,
        gender,
      },
      select: {
        name: true,
        email: true,
        age: true,
        gender: true,
        image: true,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("[PROFILE_PUT]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 