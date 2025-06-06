import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl font-bold text-white">404</span>
      </div>
      <h1 className="text-4xl font-bold mb-2">Page Not Found</h1>
      <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-md">
        Sorry, we couldn't find the page you're looking for.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" /> Go Home
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="javascript:history.back()">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Link>
        </Button>
      </div>
    </div>
  )
}
