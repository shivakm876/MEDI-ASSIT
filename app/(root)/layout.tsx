import type React from "react"
import { AppLayout } from "@/components/app-layout"
import { RouteGuard } from "@/components/route-guard"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RouteGuard>
      <AppLayout>{children}</AppLayout>
    </RouteGuard>
  )
}
