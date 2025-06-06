"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Clock, Plus, Pill } from "lucide-react"
import { Progress } from "@/components/ui/progress"

// Sample medications data
const activeMedications = [
  {
    id: "1",
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    timeOfDay: "Morning",
    purpose: "Blood pressure",
    refillDate: "June 15, 2025",
    refillsLeft: 2,
    instructions: "Take with food",
    startDate: "January 10, 2025",
    endDate: "December 31, 2025",
    progress: 65,
  },
  {
    id: "2",
    name: "Atorvastatin",
    dosage: "20mg",
    frequency: "Once daily",
    timeOfDay: "Evening",
    purpose: "Cholesterol",
    refillDate: "May 30, 2025",
    refillsLeft: 1,
    instructions: "Take at bedtime",
    startDate: "February 5, 2025",
    endDate: "February 5, 2026",
    progress: 42,
  },
  {
    id: "3",
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    timeOfDay: "Morning and Evening",
    purpose: "Diabetes",
    refillDate: "July 10, 2025",
    refillsLeft: 3,
    instructions: "Take with meals",
    startDate: "March 15, 2025",
    endDate: "March 15, 2026",
    progress: 78,
  },
]

const pastMedications = [
  {
    id: "4",
    name: "Amoxicillin",
    dosage: "500mg",
    frequency: "Three times daily",
    timeOfDay: "Morning, Afternoon, Evening",
    purpose: "Bacterial infection",
    refillDate: "N/A",
    refillsLeft: 0,
    instructions: "Take until completed",
    startDate: "November 10, 2024",
    endDate: "November 24, 2024",
    progress: 100,
  },
  {
    id: "5",
    name: "Prednisone",
    dosage: "10mg",
    frequency: "Once daily",
    timeOfDay: "Morning",
    purpose: "Inflammation",
    refillDate: "N/A",
    refillsLeft: 0,
    instructions: "Taper as directed",
    startDate: "October 5, 2024",
    endDate: "October 19, 2024",
    progress: 100,
  },
]

export default function MedicationsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [medicationName, setMedicationName] = useState("")
  const [dosage, setDosage] = useState("")
  const [frequency, setFrequency] = useState("")
  const [timeOfDay, setTimeOfDay] = useState("")
  const [purpose, setPurpose] = useState("")
  const [instructions, setInstructions] = useState("")

  const handleAddMedication = () => {
    // In a real app, this would send the medication data to the server
    setIsDialogOpen(false)
    // Reset form
    setMedicationName("")
    setDosage("")
    setFrequency("")
    setTimeOfDay("")
    setPurpose("")
    setInstructions("")
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Medications</h1>
            <p className="text-slate-600 dark:text-slate-400">Track and manage your medications</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0">
                <Plus className="mr-2 h-4 w-4" /> Add Medication
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] w-[95vw] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Medication</DialogTitle>
                <DialogDescription>
                  Enter the details for your new medication. All fields marked with * are required.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="medication-name">Medication Name *</Label>
                  <Input
                    id="medication-name"
                    value={medicationName}
                    onChange={(e) => setMedicationName(e.target.value)}
                    placeholder="e.g., Lisinopril"
                    aria-required="true"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosage *</Label>
                  <Input
                    id="dosage"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="e.g., 10mg"
                    aria-required="true"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency *</Label>
                  <Select value={frequency} onValueChange={setFrequency}>
                    <SelectTrigger id="frequency" aria-required="true">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once-daily">Once daily</SelectItem>
                      <SelectItem value="twice-daily">Twice daily</SelectItem>
                      <SelectItem value="three-times-daily">Three times daily</SelectItem>
                      <SelectItem value="four-times-daily">Four times daily</SelectItem>
                      <SelectItem value="as-needed">As needed</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time-of-day">Time of Day *</Label>
                  <Select value={timeOfDay} onValueChange={setTimeOfDay}>
                    <SelectTrigger id="time-of-day" aria-required="true">
                      <SelectValue placeholder="Select time of day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning</SelectItem>
                      <SelectItem value="afternoon">Afternoon</SelectItem>
                      <SelectItem value="evening">Evening</SelectItem>
                      <SelectItem value="bedtime">Bedtime</SelectItem>
                      <SelectItem value="morning-evening">Morning and Evening</SelectItem>
                      <SelectItem value="morning-afternoon-evening">Morning, Afternoon, and Evening</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose</Label>
                  <Input
                    id="purpose"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder="e.g., Blood pressure"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instructions">Special Instructions</Label>
                  <Input
                    id="instructions"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="e.g., Take with food"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddMedication} disabled={!medicationName || !dosage || !frequency || !timeOfDay}>
                  Add Medication
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <div className="space-y-4">
              {activeMedications.length > 0 ? (
                activeMedications.map((medication) => (
                  <Card key={medication.id} className="glass-card glass-card-hover">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{medication.name}</CardTitle>
                          <CardDescription>{medication.purpose}</CardDescription>
                        </div>
                        <Badge className="bg-green-500">Active</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Dosage</h4>
                          <p>{medication.dosage}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Frequency</h4>
                          <p>{medication.frequency}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Time of Day</h4>
                          <p>{medication.timeOfDay}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Refills Left</h4>
                          <p>{medication.refillsLeft}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Instructions</h4>
                        <p className="text-sm">{medication.instructions}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span>Progress</span>
                          <span>{medication.progress}%</span>
                        </div>
                        <Progress value={medication.progress} className="h-2" />
                      </div>

                      {medication.refillsLeft <= 1 && (
                        <div className="mt-4 flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-md">
                          <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Refill Soon</p>
                            <p className="text-xs text-amber-700 dark:text-amber-400">
                              Next refill date: {medication.refillDate}
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button size="sm">Request Refill</Button>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card className="glass-card border-0">
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <Pill className="h-12 w-12 text-slate-400 mb-4" />
                    <h3 className="text-xl font-medium mb-2">No Active Medications</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-center mb-4">
                      You don't have any active medications.
                    </p>
                    <Button onClick={() => setIsDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" /> Add Medication
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="past">
            <div className="space-y-4">
              {pastMedications.map((medication) => (
                <Card key={medication.id} className="glass-card">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{medication.name}</CardTitle>
                        <CardDescription>{medication.purpose}</CardDescription>
                      </div>
                      <Badge variant="outline">Completed</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Dosage</h4>
                        <p>{medication.dosage}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Frequency</h4>
                        <p>{medication.frequency}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Time of Day</h4>
                        <p>{medication.timeOfDay}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Duration</h4>
                        <p className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {medication.startDate} - {medication.endDate}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Instructions</h4>
                      <p className="text-sm">{medication.instructions}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="secondary" size="sm">
                      Renew Prescription
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
