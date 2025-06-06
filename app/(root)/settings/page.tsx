"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Globe, Lock, Save } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { languages, type Language } from "@/lib/translations"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"

interface UserPreferences {
  emailNotifications: boolean
  pushNotifications: boolean
  reminderNotifications: boolean
  theme: string
  language: string
  fontSize: string
  shareData: boolean
  anonymousAnalytics: boolean
}

export default function SettingsPage() {
  const { data: session } = useSession()
  const { t, language, setLanguage } = useLanguage()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [preferences, setPreferences] = useState<UserPreferences>({
    emailNotifications: true,
    pushNotifications: true,
    reminderNotifications: true,
    theme: "system",
    language: "en",
    fontSize: "medium",
    shareData: false,
    anonymousAnalytics: true,
  })

  useEffect(() => {
    if (session?.user) {
      fetchPreferences()
    }
  }, [session])

  const fetchPreferences = async () => {
    try {
      const response = await fetch("/api/user/preferences")
      if (response.ok) {
        const data = await response.json()
        setPreferences(data)
        // Update language context if different
        if (data.language !== language) {
          setLanguage(data.language as Language)
        }
      }
    } catch (error) {
      console.error("Error fetching preferences:", error)
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const response = await fetch("/api/user/preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      })

      if (!response.ok) {
        throw new Error("Failed to save preferences")
      }

      // Update language context
      setLanguage(preferences.language as Language)

      toast({
        title: "Success",
        description: "Settings saved successfully",
      })
    } catch (error) {
      console.error("Error saving preferences:", error)
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const updatePreference = (key: keyof UserPreferences, value: any) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
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
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">{t("settings")}</h1>
            <p className="text-slate-600 dark:text-slate-400">Manage your app preferences and account settings</p>
          </div>

          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="notifications">{t("notifications")}</TabsTrigger>
              <TabsTrigger value="privacy">{t("privacy")}</TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    General Settings
                  </CardTitle>
                  <CardDescription>Customize your app experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="language">{t("language")}</Label>
                    <Select
                      value={preferences.language}
                      onValueChange={(value) => updatePreference("language", value)}
                    >
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(languages).map(([code, name]) => (
                          <SelectItem key={code} value={code}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="theme">{t("theme")}</Label>
                    <Select
                      value={preferences.theme}
                      onValueChange={(value) => updatePreference("theme", value)}
                    >
                      <SelectTrigger id="theme">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fontSize">Font Size</Label>
                    <Select
                      value={preferences.fontSize}
                      onValueChange={(value) => updatePreference("fontSize", value)}
                    >
                      <SelectTrigger id="fontSize">
                        <SelectValue placeholder="Select font size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <>Saving...</>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> {t("save")} Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    {t("notifications")} Settings
                  </CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email {t("notifications")}</Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={preferences.emailNotifications}
                      onCheckedChange={(checked) => updatePreference("emailNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Push {t("notifications")}</Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Receive notifications on your device</p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={preferences.pushNotifications}
                      onCheckedChange={(checked) => updatePreference("pushNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="reminder-notifications">Reminder {t("notifications")}</Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Receive reminders for health checks</p>
                    </div>
                    <Switch
                      id="reminder-notifications"
                      checked={preferences.reminderNotifications}
                      onCheckedChange={(checked) => updatePreference("reminderNotifications", checked)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <>Saving...</>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> {t("save")} Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="privacy">
              <Card className="glass-card border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    {t("privacy")} Settings
                  </CardTitle>
                  <CardDescription>Manage your data and privacy preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="share-data">Share Health Data</Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Share anonymized health data to improve our AI models
                      </p>
                    </div>
                    <Switch
                      id="share-data"
                      checked={preferences.shareData}
                      onCheckedChange={(checked) => updatePreference("shareData", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="anonymous-analytics">Anonymous Analytics</Label>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Allow anonymous usage analytics to improve the app
                      </p>
                    </div>
                    <Switch
                      id="anonymous-analytics"
                      checked={preferences.anonymousAnalytics}
                      onCheckedChange={(checked) => updatePreference("anonymousAnalytics", checked)}
                    />
                  </div>

                  <div className="space-y-2 pt-4 border-t border-border">
                    <h3 className="font-medium">Data Management</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                      Manage your personal data stored in our system
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button variant="outline">{t("download")} My Data</Button>
                      <Button variant="destructive">{t("delete")} My Account</Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <>Saving...</>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> {t("save")} Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  )
}
