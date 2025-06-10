"use client"

import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth-context"
import { LanguageProvider } from "@/lib/language-context"
import { SessionProvider } from "next-auth/react"
import { Toaster } from "@/components/ui/toaster"
import { UserProvider } from "@/lib/user-context"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <LanguageProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
            <UserProvider>
              {children}
            </UserProvider>
            <Toaster />
          </ThemeProvider>
        </LanguageProvider>
      </AuthProvider>
    </SessionProvider>
  )
} 