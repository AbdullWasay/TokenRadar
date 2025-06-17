import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import Link from "next/link"

export default function SubscribePage() {
  return (
    <div className="container mx-auto max-w-7xl py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Subscribe to Rader</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Get unlimited access to real-time token data, alerts, and advanced features
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <Card className="bg-[#1A1A1A] border-[#333333] hover:border-primary transition-all">
          <CardHeader>
            <CardTitle className="text-xl">Basic</CardTitle>
            <CardDescription>Essential tracking features</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">1</span>
              <span className="text-gray-400"> SOL/month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {["Real-time token tracking", "Basic alerts", "24-hour price history", "Limited token details"].map(
                (feature, i) => (
                  <li key={i} className="flex items-center">
                    <Check size={16} className="mr-2 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ),
              )}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href="/subscribe/payment">Subscribe</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-[#1A1A1A] border-primary relative">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold rounded-bl-lg rounded-tr-lg">
            POPULAR
          </div>
          <CardHeader>
            <CardTitle className="text-xl">Pro</CardTitle>
            <CardDescription>Advanced features for serious traders</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">2</span>
              <span className="text-gray-400"> SOL/month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {[
                "All Basic features",
                "Advanced real-time alerts",
                "Full price history",
                "Detailed token analytics",
                "Watchlist with unlimited tokens",
                "Priority updates",
              ].map((feature, i) => (
                <li key={i} className="flex items-center">
                  <Check size={16} className="mr-2 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href="/subscribe/payment">Subscribe</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-[#1A1A1A] border-[#333333] hover:border-primary transition-all">
          <CardHeader>
            <CardTitle className="text-xl">Enterprise</CardTitle>
            <CardDescription>For professional trading teams</CardDescription>
            <div className="mt-4">
              <span className="text-3xl font-bold">5</span>
              <span className="text-gray-400"> SOL/month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {[
                "All Pro features",
                "Custom alerts and notifications",
                "API access",
                "Advanced data exports",
                "Multi-user access",
                "Dedicated support",
                "Early access to new features",
              ].map((feature, i) => (
                <li key={i} className="flex items-center">
                  <Check size={16} className="mr-2 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" asChild>
              <Link href="/subscribe/payment">Subscribe</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="text-center mt-12">
        <p className="text-gray-400 mb-4">Have questions about our subscription plans?</p>
        <Link href="/contact" className="text-primary hover:underline">
          Contact us
        </Link>
      </div>
    </div>
  )
}
