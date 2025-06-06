"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Camera, Check, Lock, Save, User } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"

interface UserProfile {
  name: string
  email: string
  age: number | null
  gender: string | null
  image: string | null
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    age: null,
    gender: null,
    image: null,
  })
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [reminderNotifications, setReminderNotifications] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (session?.user) {
      fetchProfile()
      fetchPreferences()
    }
  }, [session])

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/user/profile")
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPreferences = async () => {
    try {
      const response = await fetch("/api/user/preferences")
      if (response.ok) {
        const data = await response.json()
        setEmailNotifications(data.emailNotifications)
        setPushNotifications(data.pushNotifications)
        setReminderNotifications(data.reminderNotifications)
      }
    } catch (error) {
      console.error("Error fetching preferences:", error)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      // Update profile
      const profileResponse = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      })

      if (!profileResponse.ok) {
        throw new Error("Failed to update profile")
      }

      // Update preferences
      const preferencesResponse = await fetch("/api/user/preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailNotifications,
          pushNotifications,
          reminderNotifications,
        }),
      })

      if (!preferencesResponse.ok) {
        throw new Error("Failed to update preferences")
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error) {
      console.error("Error saving profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3">
            <Card className="glass-card border-0">
              <CardContent className="pt-6 flex flex-col items-center">
                <div className="relative mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.image || "/placeholder.svg?height=96&width=96"} alt={profile.name} />
                    <AvatarFallback className="text-2xl">
                      {profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 h-8 w-8 rounded-full">
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <h2 className="text-xl font-bold">{profile.name}</h2>
                <p className="text-slate-500 dark:text-slate-400">{profile.email}</p>

                <div className="w-full mt-6 space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={() => document.getElementById('personal-tab')?.click()}>
                    <User className="mr-2 h-4 w-4" /> Personal Information
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => document.getElementById('notifications-tab')?.click()}>
                    <Bell className="mr-2 h-4 w-4" /> Notifications
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => document.getElementById('security-tab')?.click()}>
                    <Lock className="mr-2 h-4 w-4" /> Security
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:w-2/3">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="personal" id="personal-tab">Personal</TabsTrigger>
                <TabsTrigger value="notifications" id="notifications-tab">Notifications</TabsTrigger>
                <TabsTrigger value="security" id="security-tab">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" id="personal">
                <Card className="glass-card border-0">
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          type="number"
                          value={profile.age || ""}
                          onChange={(e) => setProfile({ ...profile, age: e.target.value ? parseInt(e.target.value) : null })}
                          min="1"
                          max="120"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select
                          value={profile.gender || ""}
                          onValueChange={(value) => setProfile({ ...profile, gender: value })}
                        >
                          <SelectTrigger id="gender">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? (
                        <>Saving...</>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" /> Save Changes
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" id="notifications">
                <Card className="glass-card border-0">
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Manage how you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Receive notifications via email</p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="push-notifications">Push Notifications</Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Receive notifications on your device
                        </p>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={pushNotifications}
                        onCheckedChange={setPushNotifications}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="reminder-notifications">Medication Reminders</Label>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          Receive reminders for medications and appointments
                        </p>
                      </div>
                      <Switch
                        id="reminder-notifications"
                        checked={reminderNotifications}
                        onCheckedChange={setReminderNotifications}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? (
                        <>Saving...</>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" /> Save Preferences
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="security" id="security">
                <Card className="glass-card border-0">
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your account security</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>

                    <div className="pt-4">
                      <h3 className="text-sm font-medium mb-2">Two-Factor Authentication</h3>
                      <div className="flex items-center gap-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-md">
                        <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                          <Check className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Two-factor authentication is enabled</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Your account is secured with two-factor authentication
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving ? (
                        <>Saving...</>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" /> Save Changes
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
