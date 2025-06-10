'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from "@/lib/auth-context"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Loader2, MapPin } from "lucide-react"

interface DoctorSearchResult {
  type: string
  id: string
  score: number
  dist: number
  poi: {
    name: string
    categories: string[]
    phone?: string
    phones?: string[]
  }
  address: {
    freeformAddress: string
    municipality: string
    postalCode: string
  }
  position: {
    lat: number
    lon: number
  }
}

interface SearchResponse {
  summary: {
    query: string
    numResults: number
    totalResults: number
  }
  results: DoctorSearchResult[]
}

const specialties = [
  { name: "General Physician", searchTerms: ["general practitioner", "doctor"] },
  { name: "Dermatologist", searchTerms: ["skin clinic", "dermatology"] },
  { name: "Gastroenterologist", searchTerms: ["stomach clinic", "gastro clinic"] },
  { name: "Cardiologist", searchTerms: ["heart clinic", "cardiology"] },
  { name: "Endocrinologist", searchTerms: ["endocrine clinic", "diabetes clinic"] },
  { name: "Pulmonologist", searchTerms: ["lung clinic", "respiratory clinic"] },
  { name: "Neurologist", searchTerms: ["neuro clinic", "neurology"] },
  { name: "Orthopedist", searchTerms: ["orthopedic clinic", "bone clinic"] },
  { name: "Infectious Disease Specialist", searchTerms: ["infection clinic", "fever clinic"] },
  { name: "Urologist", searchTerms: ["urology", "urinary clinic"] },
  { name: "Immunologist", searchTerms: ["immunology", "allergy specialist"] },
  { name: "Dentist", searchTerms: ["dentist", "dental clinic"] },
  { name: "Ophthalmologist", searchTerms: ["eye hospital", "ophthalmology"] },
  { name: "ENT Doctor", searchTerms: ["ent clinic", "ear nose throat"] },
  { name: "Gynecologist", searchTerms: ["gynecologist", "obgyn"] },
  { name: "Pediatrician", searchTerms: ["pediatrician", "child clinic"] },
  { name: "Psychiatrist", searchTerms: ["psychiatrist", "mental health clinic"] }
]

export default function FindDoctorsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedSpecialty, setSelectedSpecialty] = useState("")
  const [radius, setRadius] = useState(3000)
  const [limit, setLimit] = useState(10)
  const [results, setResults] = useState<DoctorSearchResult[]>([])

  useEffect(() => {
    // Check authentication
    if (!user) {
      router.push('/auth/signin')
      return
    }

    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          })
        },
        (error) => {
          setError("Unable to get your location. Please enable location services.")
        }
      )
    } else {
      setError("Geolocation is not supported by your browser")
    }
  }, [user, router])

  const searchDoctors = async () => {
    if (!location || !selectedSpecialty) return

    setLoading(true)
    setError(null)

    try {
      const specialty = specialties.find(s => s.name === selectedSpecialty)
      if (!specialty) throw new Error("Invalid specialty selected")

      const apiKey = process.env.NEXT_PUBLIC_TOMTOM_API_KEY
      if (!apiKey) {
        throw new Error("TomTom API key is not configured")
      }

      // Search for both terms
      const searchPromises = specialty.searchTerms.map(term =>
        fetch(
          `https://api.tomtom.com/search/2/poiSearch/${term}.json?` +
          `lat=${location.lat}&lon=${location.lon}&radius=${radius}&limit=${limit}&key=${apiKey}`
        ).then(res => {
          if (!res.ok) {
            if (res.status === 403) {
              throw new Error("Invalid or missing API key")
            }
            throw new Error(`Failed to fetch doctors: ${res.statusText}`)
          }
          return res.json()
        })
      )

      const searchResults = await Promise.allSettled(searchPromises)
      
      // Combine results and remove duplicates
      const allResults = searchResults
        .filter((result): result is PromiseFulfilledResult<SearchResponse> => 
          result.status === 'fulfilled'
        )
        .flatMap(result => result.value.results)
        .filter((result, index, self) =>
          index === self.findIndex(r => r.id === result.id)
        )
        .sort((a, b) => a.dist - b.dist) // Sort by distance
        .slice(0, limit) // Limit total results

      setResults(allResults)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Search error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <Card>
          <CardHeader>
            <CardTitle>Find Doctors Near You</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-medium">Specialty</label>
                  <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty.name} value={specialty.name}>
                          {specialty.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-medium">Search Radius (meters)</label>
                  <Slider
                    value={[radius]}
                    onValueChange={(value) => setRadius(value[0])}
                    min={1000}
                    max={10000}
                    step={1000}
                  />
                  <p className="text-sm text-muted-foreground">{radius} meters</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-medium">Your Location</label>
                  <div className="p-3 bg-muted rounded-lg">
                    {location ? (
                      <p className="text-sm">
                        Latitude: {location.lat.toFixed(6)}, Longitude: {location.lon.toFixed(6)}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {error || "Getting your location..."}
                      </p>
                    )}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  <label className="text-sm font-medium">Number of Results</label>
                  <Slider
                    value={[limit]}
                    onValueChange={(value) => setLimit(value[0])}
                    min={5}
                    max={20}
                    step={5}
                  />
                  <p className="text-sm text-muted-foreground">{limit} results</p>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  onClick={searchDoctors}
                  disabled={!location || !selectedSpecialty || loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <MapPin className="mr-2 h-4 w-4" />
                      Find Doctors
                    </>
                  )}
                </Button>
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-500"
                >
                  {error}
                </motion.div>
              )}

              <AnimatePresence>
                {results.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-4"
                  >
                    <h3 className="text-lg font-semibold">Results</h3>
                    {results.map((result, index) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 border rounded-lg"
                      >
                        <h4 className="font-medium">{result.poi.name}</h4>
                        <p className="text-sm text-muted-foreground">{result.address.freeformAddress}</p>
                        {(result.poi.phone || result.poi.phones?.length) && (
                          <div className="mt-2 space-y-1">
                            <p className="text-sm font-medium">Contact:</p>
                            {result.poi.phone && (
                              <a 
                                href={`tel:${result.poi.phone}`}
                                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                              >
                                {result.poi.phone}
                              </a>
                            )}
                            {result.poi.phones?.map((phone, index) => (
                              <a 
                                key={index}
                                href={`tel:${phone}`}
                                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                              >
                                {phone}
                              </a>
                            ))}
                          </div>
                        )}
                        <p className="text-sm text-muted-foreground">
                          Distance: {(result.dist / 1000).toFixed(1)} km
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => {
                            const url = `https://www.google.com/maps/search/?api=1&query=${result.position.lat},${result.position.lon}`;
                            window.open(url, '_blank');
                          }}
                        >
                          <MapPin className="mr-2 h-4 w-4" />
                          View in Map
                        </Button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
} 