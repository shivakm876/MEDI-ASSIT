"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
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
import { CalendarClock, CalendarDays, Clock, Plus, User, X } from "lucide-react"

// Sample appointments data
const upcomingAppointments = [
  {
    id: "1",
    title: "General Checkup",
    doctor: "Dr. Sarah Johnson",
    date: "May 20, 2025",
    time: "10:30 AM",
    location: "MediCare Clinic, Room 302",
    status: "confirmed",
  },
  {
    id: "2",
    title: "Dental Cleaning",
    doctor: "Dr. Michael Chen",
    date: "June 5, 2025",
    time: "2:15 PM",
    location: "Bright Smile Dental, Suite 105",
    status: "confirmed",
  },
]

const pastAppointments = [
  {
    id: "3",
    title: "Eye Examination",
    doctor: "Dr. Emily Rodriguez",
    date: "April 12, 2025",
    time: "9:00 AM",
    location: "Vision Care Center",
    status: "completed",
  },
  {
    id: "4",
    title: "Physical Therapy",
    doctor: "Dr. James Wilson",
    date: "March 28, 2025",
    time: "11:45 AM",
    location: "Wellness Rehabilitation Center",
    status: "completed",
  },
  {
    id: "5",
    title: "Blood Test",
    doctor: "Dr. Lisa Thompson",
    date: "February 15, 2025",
    time: "8:30 AM",
    location: "MediCare Clinic, Lab 2",
    status: "completed",
  },
]

export default function AppointmentsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [appointmentType, setAppointmentType] = useState("")
  const [doctor, setDoctor] = useState("")
  const [time, setTime] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleBookAppointment = () => {
    // In a real app, this would send the appointment data to the server
    setIsDialogOpen(false)
    // Reset form
    setAppointmentType("")
    setDoctor("")
    setTime("")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">Confirmed</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      case "completed":
        return <Badge variant="outline">Completed</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return null
    }
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
            <h1 className="text-3xl font-bold">Appointments</h1>
            <p className="text-slate-600 dark:text-slate-400">Manage your medical appointments</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0">
                <Plus className="mr-2 h-4 w-4" /> Book Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] w-[95vw] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Book New Appointment</DialogTitle>
                <DialogDescription>
                  Enter the details for your new appointment. All fields marked with * are required.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="appointment-type">Appointment Type *</Label>
                  <Select value={appointmentType} onValueChange={setAppointmentType}>
                    <SelectTrigger id="appointment-type" aria-required="true">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general-checkup">General Checkup</SelectItem>
                      <SelectItem value="specialist-consultation">Specialist Consultation</SelectItem>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                      <SelectItem value="vaccination">Vaccination</SelectItem>
                      <SelectItem value="lab-test">Lab Test</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor">Doctor *</Label>
                  <Select value={doctor} onValueChange={setDoctor}>
                    <SelectTrigger id="doctor" aria-required="true">
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dr-johnson">Dr. Sarah Johnson</SelectItem>
                      <SelectItem value="dr-patel">Dr. Raj Patel</SelectItem>
                      <SelectItem value="dr-williams">Dr. David Williams</SelectItem>
                      <SelectItem value="dr-chen">Dr. Michael Chen</SelectItem>
                      <SelectItem value="dr-rodriguez">Dr. Emily Rodriguez</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="border rounded-md p-3"
                    disabled={(date) => date < new Date() || date > new Date(2025, 12, 31)}
                    aria-required="true"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time *</Label>
                  <Select value={time} onValueChange={setTime}>
                    <SelectTrigger id="time" aria-required="true">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9:00">9:00 AM</SelectItem>
                      <SelectItem value="9:30">9:30 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="10:30">10:30 AM</SelectItem>
                      <SelectItem value="11:00">11:00 AM</SelectItem>
                      <SelectItem value="11:30">11:30 AM</SelectItem>
                      <SelectItem value="1:00">1:00 PM</SelectItem>
                      <SelectItem value="1:30">1:30 PM</SelectItem>
                      <SelectItem value="2:00">2:00 PM</SelectItem>
                      <SelectItem value="2:30">2:30 PM</SelectItem>
                      <SelectItem value="3:00">3:00 PM</SelectItem>
                      <SelectItem value="3:30">3:30 PM</SelectItem>
                      <SelectItem value="4:00">4:00 PM</SelectItem>
                      <SelectItem value="4:30">4:30 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Input id="notes" placeholder="Any special requests or information" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleBookAppointment} disabled={!appointmentType || !doctor || !date || !time}>
                  Book Appointment
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <div className="space-y-4">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <Card key={appointment.id} className="glass-card glass-card-hover overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="bg-slate-100 dark:bg-slate-800 p-4 md:w-48 flex flex-row md:flex-col justify-between md:justify-start gap-4">
                          <div>
                            <div className="flex items-center text-slate-500 dark:text-slate-400 mb-1">
                              <CalendarDays className="h-4 w-4 mr-1" />
                              <span className="text-sm">{appointment.date}</span>
                            </div>
                            <div className="flex items-center text-slate-500 dark:text-slate-400">
                              <Clock className="h-4 w-4 mr-1" />
                              <span className="text-sm">{appointment.time}</span>
                            </div>
                          </div>

                          <div className="md:mt-4">{getStatusBadge(appointment.status)}</div>
                        </div>

                        <div className="p-4 flex-1">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="text-xl font-semibold">{appointment.title}</h3>
                              <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center mt-1">
                                <User className="h-4 w-4 mr-1" /> {appointment.doctor}
                              </p>
                            </div>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="mb-3">
                            <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Location</h4>
                            <p className="text-sm">{appointment.location}</p>
                          </div>

                          <div className="flex gap-2 mt-4">
                            <Button variant="outline" size="sm">
                              Reschedule
                            </Button>
                            <Button variant="destructive" size="sm">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="glass-card border-0">
                  <CardContent className="flex flex-col items-center justify-center py-8">
                    <CalendarClock className="h-12 w-12 text-slate-400 mb-4" />
                    <h3 className="text-xl font-medium mb-2">No Upcoming Appointments</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-center mb-4">
                      You don't have any upcoming appointments scheduled.
                    </p>
                    <Button onClick={() => setIsDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" /> Book Appointment
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="past">
            <div className="space-y-4">
              {pastAppointments.map((appointment) => (
                <Card key={appointment.id} className="glass-card overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <div className="bg-slate-100 dark:bg-slate-800 p-4 md:w-48 flex flex-row md:flex-col justify-between md:justify-start gap-4">
                        <div>
                          <div className="flex items-center text-slate-500 dark:text-slate-400 mb-1">
                            <CalendarDays className="h-4 w-4 mr-1" />
                            <span className="text-sm">{appointment.date}</span>
                          </div>
                          <div className="flex items-center text-slate-500 dark:text-slate-400">
                            <Clock className="h-4 w-4 mr-1" />
                            <span className="text-sm">{appointment.time}</span>
                          </div>
                        </div>

                        <div className="md:mt-4">{getStatusBadge(appointment.status)}</div>
                      </div>

                      <div className="p-4 flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-xl font-semibold">{appointment.title}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center mt-1">
                              <User className="h-4 w-4 mr-1" /> {appointment.doctor}
                            </p>
                          </div>
                        </div>

                        <div className="mb-3">
                          <h4 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Location</h4>
                          <p className="text-sm">{appointment.location}</p>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button variant="secondary" size="sm">
                            Book Similar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
