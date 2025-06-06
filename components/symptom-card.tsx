import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, ChevronRight, Clock, RefreshCw } from "lucide-react"
import Link from "next/link"

interface SymptomCardProps {
  id: string
  date: string
  time: string
  diagnosis: string
  severity: number
  symptoms: string[]
}

export function SymptomCard({ id, date, time, diagnosis, severity, symptoms }: SymptomCardProps) {
  return (
    <Card className="glass-card glass-card-hover overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="bg-slate-100 dark:bg-slate-800 p-4 md:w-48 flex flex-row md:flex-col justify-between md:justify-start gap-4">
            <div>
              <div className="flex items-center text-slate-500 dark:text-slate-400 mb-1">
                <Calendar className="h-4 w-4 mr-1" />
                <span className="text-sm">{date}</span>
              </div>
              <div className="flex items-center text-slate-500 dark:text-slate-400">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-sm">{time}</span>
              </div>
            </div>

            <div className="md:mt-4">
              <div className="text-sm text-slate-500 dark:text-slate-400">Severity</div>
              <div className="flex items-center">
                <span className="text-2xl font-bold">{severity}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">/10</span>
              </div>
            </div>
          </div>

          <div className="p-4 flex-1">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-semibold">{diagnosis}</h3>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="mb-3">
              <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Symptoms</h4>
              <div className="flex flex-wrap gap-2">
                {symptoms.map((symptom) => (
                  <Badge key={symptom} variant="outline">
                    {symptom}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/results?id=${id}`}>View Details</Link>
              </Button>
              <Button variant="secondary" size="sm" asChild>
                <Link href="/symptom-input">
                  <RefreshCw className="mr-2 h-3 w-3" /> Recheck
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
