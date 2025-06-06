interface HealthMetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  bgColor?: string
  textColor?: string
}

export function HealthMetricCard({
  title,
  value,
  subtitle = "Current severity",
  bgColor = "bg-blue-50 dark:bg-blue-900/20",
  textColor = "text-blue-600 dark:text-blue-400",
}: HealthMetricCardProps) {
  return (
    <div className={`${bgColor} p-3 rounded-lg`}>
      <h3 className={`text-sm font-medium ${textColor}`}>{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
    </div>
  )
}
