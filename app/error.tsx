"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Home, RefreshCw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="container flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="h-12 w-12" />
      </div>
      <h1 className="text-4xl font-bold mb-2">Something went wrong</h1>
      <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-md">
        We're sorry, but there was an error processing your request.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={() => reset()}>
          <RefreshCw className="mr-2 h-4 w-4" /> Try Again
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" /> Go Home
          </Link>
        </Button>
      </div>
    </div>
  )
}
