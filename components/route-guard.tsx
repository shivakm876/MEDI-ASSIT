"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

interface RouteGuardProps {
  children: React.ReactNode
}

export function RouteGuard({ children }: RouteGuardProps) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/signup"]
  const isPublicRoute = publicRoutes.includes(pathname)

  // Protected routes that require authentication
  const protectedRoutes = [
    "/dashboard",
    "/profile",
    "/settings",
    "/symptom-input",
    "/symptom-history",
    "/followup-chatbot",
    "/book-chatbot",
    "/appointments",
    "/medications",
    "/results",
  ]
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  useEffect(() => {
    if (!loading) {
      // If user is not authenticated and trying to access protected route
      if (!isAuthenticated && isProtectedRoute) {
        router.replace("/login")
        return
      }

      // If user is authenticated and trying to access auth pages
      if (isAuthenticated && (pathname === "/login" || pathname === "/signup")) {
        router.replace("/dashboard")
        return
      }
    }
  }, [isAuthenticated, loading, pathname, router, isProtectedRoute])

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-950 dark:to-blue-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render protected content if user is not authenticated
  if (!isAuthenticated && isProtectedRoute) {
    return null
  }

  // Don't render auth pages if user is already authenticated
  if (isAuthenticated && (pathname === "/login" || pathname === "/signup")) {
    return null
  }

  return <>{children}</>
}
