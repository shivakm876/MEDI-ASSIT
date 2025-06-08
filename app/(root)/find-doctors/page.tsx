'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from "@/lib/auth-context"
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
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Find Doctors Near You</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Location Status */}
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {location ? (
                <span>Location: {location.lat.toFixed(4)}, {location.lon.toFixed(4)}</span>
              ) : (
                <span>Getting your location...</span>
              )}
            </div>

            {/* Search Controls */}
            <div className="grid gap-4 md:grid-cols-3">
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty.name} value={specialty.name}>
                      {specialty.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="space-y-2">
                <label>Search Radius (meters)</label>
                <Slider
                  value={[radius]}
                  onValueChange={([value]) => setRadius(value)}
                  min={1000}
                  max={5000}
                  step={1000}
                />
                <span>{radius / 1000} km</span>
              </div>

              <div className="space-y-2">
                <label>Results Limit</label>
                <Select value={limit.toString()} onValueChange={(value) => setLimit(Number(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select limit" />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 15, 20].map((value) => (
                      <SelectItem key={value} value={value.toString()}>
                        {value} results
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

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
                "Search Doctors"
              )}
            </Button>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            {/* Results */}
            {results.length > 0 && (
              <div className="space-y-4 mt-6">
                <h3 className="text-lg font-semibold">Found {results.length} doctors</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {results.map((result) => (
                    <Card key={result.id}>
                      <CardContent className="pt-6">
                        <h4 className="font-semibold">{result.poi.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {result.address.freeformAddress}
                        </p>
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
                        <p className="text-sm mt-2">
                          Distance: {(result.dist / 1000).toFixed(1)} km
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 