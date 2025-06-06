import { Bell, BookOpen, Calendar, MessageCircle } from "lucide-react"

interface NotificationCardProps {
  id: string
  title: string
  description: string
  time: string
  type?: "general" | "reminder" | "message" | "feature"
}

export function NotificationCard({ id, title, description, time, type = "general" }: NotificationCardProps) {
  const getIcon = () => {
    switch (type) {
      case "reminder":
        return <Calendar className="h-4 w-4" />
      case "message":
        return <MessageCircle className="h-4 w-4" />
      case "feature":
        return <BookOpen className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getIconBgColor = () => {
    switch (type) {
      case "reminder":
        return "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
      case "message":
        return "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
      case "feature":
        return "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
      default:
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
    }
  }

  return (
    <div className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
      <div className={`${getIconBgColor()} rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0`}>
        {getIcon()}
      </div>
      <div>
        <h3 className="font-medium text-sm">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{time}</p>
      </div>
    </div>
  )
}
