import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { password } = body

    if (!password) {
      return new NextResponse("Password is required", { status: 400 })
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    })

    if (!user?.password) {
      return new NextResponse("User not found", { status: 404 })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return new NextResponse("Password is incorrect", { status: 400 })
    }

    // Delete all sessions for this user
    await prisma.session.deleteMany({
      where: { userId: session.user.id }
    })

    // Delete user and all associated data
    await prisma.user.delete({
      where: { id: session.user.id },
    })

    // Return response with instructions to sign out
    return NextResponse.json({ 
      message: "Account deleted successfully",
      shouldSignOut: true 
    })
  } catch (error) {
    console.error("[DELETE_ACCOUNT]", error)
    return new NextResponse("Internal error", { status: 500 })
  }
} 