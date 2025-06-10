import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { id } = await context.params

    const symptomEntry = await prisma.symptomEntry.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
      include: {
        predictions: {
          orderBy: {
            probability: 'desc'
          }
        }
      },
    })

    if (!symptomEntry) {
      return new NextResponse("Not found", { status: 404 })
    }

    return NextResponse.json(symptomEntry)
  } catch (error) {
    console.error("[SYMPTOM_ENTRY_GET]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { id } = await params

    // Delete the symptom entry (this will cascade delete the predictions)
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