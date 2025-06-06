import { getServerSession } from "next-auth"
import { authOptions } from "./auth"

// Cache session for 5 minutes
let sessionCache: { session: any; timestamp: number } | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

// Helper function to get cached session
export async function getCachedSession() {
  const now = Date.now()
  
  // Return cached session if it exists and is not expired
  if (sessionCache && (now - sessionCache.timestamp) < CACHE_DURATION) {
    return sessionCache.session
  }
  
  // Get fresh session
  const session = await getServerSession(authOptions)
  
  // Update cache
  sessionCache = {
    session,
    timestamp: now
  }
  
  return session
} 