import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const symptomEntry = await prisma.symptomEntry.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!symptomEntry) {
      return NextResponse.json({ error: "Symptom entry not found" }, { status: 404 })
    }

    return NextResponse.json(symptomEntry)
  } catch (error) {
    console.error("Failed to fetch symptom entry:", error)
    return NextResponse.json({ error: "Failed to fetch symptom entry" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { id } = params

    await prisma.symptomEntry.delete({
      where: {
        id: id,
        userId: session.user.id,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[SYMPTOMS_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
