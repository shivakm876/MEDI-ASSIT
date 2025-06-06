"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useSession } from "next-auth/react"

interface User {
  id: string
  name: string | null
  email: string | null
  image: string | null
}

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(status === "loading")
  }, [status])

  const value = {
    user: session?.user
      ? {
          id: session.user.id as string,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
        }
      : null,
    loading,
    isAuthenticated: !!session?.user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
