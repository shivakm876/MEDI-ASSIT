"use client"

import type React from "react"
import { useAuth } from "@/lib/auth-context"
import { usePathname } from "next/navigation"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated, loading } = useAuth()
  const pathname = usePathname()

  // Public routes that don't need authentication
  const publicRoutes = ["/", "/login", "/signup"]
  const isPublicRoute = publicRoutes.includes(pathname)

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-950 dark:to-blue-950">
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full">
          {isAuthenticated && !isPublicRoute && <Sidebar />}
          <SidebarInset className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
