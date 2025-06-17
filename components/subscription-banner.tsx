import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface SubscriptionBannerProps {
  className?: string
}

export default function SubscriptionBanner({ className }: SubscriptionBannerProps) {
  return (
    <Card className={cn("bg-gradient-to-r from-primary/20 to-primary/5 border-primary/20", className)}>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary/20 p-3 rounded-full">
              <Zap size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Upgrade to Pro</h3>
              <p className="text-gray-400">Get unlimited access to all features and real-time alerts</p>
            </div>
          </div>
          <Link href="/subscribe">
            <Button>Subscribe Now</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
