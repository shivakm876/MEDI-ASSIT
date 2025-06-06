import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  iconColor?: string
  iconBgColor?: string
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  iconColor = "text-blue-600 dark:text-blue-400",
  iconBgColor = "bg-blue-100 dark:bg-blue-900/50",
}: FeatureCardProps) {
  return (
    <Card className="glass-card glass-card-hover rounded-2xl p-6">
      <CardContent className="p-0">
        <div className={`${iconBgColor} w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400">{description}</p>
      </CardContent>
    </Card>
  )
}
