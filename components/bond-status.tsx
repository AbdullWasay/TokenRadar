import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock } from "lucide-react"

interface BondStatusProps {
  bondedPercentage?: number
  percentage?: number
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
}

export default function BondStatus({ bondedPercentage, percentage, size = "md", showLabel = true }: BondStatusProps) {
  const actualPercentage = bondedPercentage ?? percentage ?? 0;
  const getStatusColor = () => {
    if (actualPercentage === 100) return "bg-green-500"
    if (actualPercentage >= 90) return "bg-yellow-500"
    return "bg-blue-500"
  }

  const getStatusText = () => {
    if (actualPercentage === 100) return "Bonded"
    if (actualPercentage >= 90) return "Almost Bonded"
    if (actualPercentage >= 50) return "Bonding"
    return "Early Stage"
  }

  const getStatusIcon = () => {
    if (actualPercentage === 100) return <CheckCircle className="h-3 w-3" />
    return <Clock className="h-3 w-3" />
  }

  return (
    <div className="flex flex-col gap-1">
      {showLabel && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">Bond Status</span>
          <Badge
            variant="outline"
            className={`text-xs px-1.5 py-0 h-5 ${
              actualPercentage === 100
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800"
                : actualPercentage >= 90
                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
                  : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800"
            }`}
          >
            <span className="flex items-center gap-1">
              {getStatusIcon()}
              {getStatusText()}
            </span>
          </Badge>
        </div>
      )}
      <div className="flex items-center gap-2">
        <Progress
          value={actualPercentage}
          className={`h-${size === "sm" ? "1" : size === "md" ? "2" : "3"} bg-gray-200 dark:bg-gray-700`}
          indicatorClassName={getStatusColor()}
        />
        <span className="text-xs font-medium">{actualPercentage}%</span>
      </div>
    </div>
  )
}
