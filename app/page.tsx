"use client"

import Footer from "@/components/footer"
import Navbar from "@/components/landing-navbar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart2, CheckCircle, Globe, Shield, Zap } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-700 to-purple-600 bg-clip-text text-transparent">
                Track Tokens Like a Pro
              </h1>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg">
                Real-time tracking, advanced analytics, and powerful alerts for cryptocurrency tokens. Stay ahead of the
                market with Token Radar.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  <Link href="/login" className="flex items-center">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline">
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <div className="relative w-full h-[400px] md:h-[500px]">
                <div className="absolute top-0 right-0 w-[90%] h-[90%] bg-gradient-to-br from-indigo-600/90 to-purple-600/90 rounded-2xl transform rotate-3"></div>
                <div className="absolute top-4 left-4 w-[90%] h-[90%] bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
                  <Image
                    src="https://qedvault.s3.us-west-1.amazonaws.com/PublicPortal/Token-Tracker.png"
                    alt="Dashboard Preview"
                    width={600}
                    height={500}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-indigo-600 dark:text-indigo-400">10K+</p>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Active Users</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-indigo-600 dark:text-indigo-400">50K+</p>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Tokens Tracked</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-indigo-600 dark:text-indigo-400">99.9%</p>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Uptime</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-indigo-600 dark:text-indigo-400">24/7</p>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners/Integrations Section */}
      <section className="py-16 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-medium text-gray-600 dark:text-gray-400">Trusted by companies worldwide</h2>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all">
                <Image
                  src={`/placeholder.svg?height=40&width=120&text=Partner ${i}`}
                  alt={`Partner ${i}`}
                  width={120}
                  height={40}
                  className="h-8 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Token Radar Works</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Track tokens, set alerts, and stay ahead of the market in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Sign Up</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Create your free account in seconds and access basic tracking features right away.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Track Tokens</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Add tokens to your watchlist and monitor real-time prices, market caps, and trends.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Set Alerts</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Configure custom alerts to notify you of significant price movements and market events.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              <Link href="/signup">Get Started Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Everything you need to track, analyze, and profit from the cryptocurrency market
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center mb-6">
                <BarChart2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-time Analytics</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Track token prices, market caps, and trading volumes in real-time with advanced charts and indicators.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Instant Alerts</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Set custom price alerts and receive instant notifications when tokens hit your target prices.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center mb-6">
                <Globe className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Global Market Data</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Access comprehensive data from multiple exchanges and blockchain networks in one place.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Security Analysis</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Evaluate token security with contract audits, holder distribution analysis, and risk assessments.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center mb-6">
                <CheckCircle className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Watchlist Management</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Create and manage custom watchlists to track your favorite tokens and potential investments.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-indigo-600 dark:text-indigo-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Portfolio Tracking</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Track your crypto portfolio performance with detailed profit/loss analysis and historical data.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Choose the plan that's right for you
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Free</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">For casual traders</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">Free</span>
                  <span className="text-gray-600 dark:text-gray-400">/forever</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">Basic token tracking</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">Limited market data</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">Community support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">Basic analytics</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 border-2 border-indigo-600 dark:border-indigo-500 rounded-xl shadow-lg overflow-hidden relative">
              <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                POPULAR
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Premium</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">For serious traders</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold">2 SOL</span>
                  <span className="text-gray-600 dark:text-gray-400">/month</span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">Advanced token analytics</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">Real-time price alerts</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">Priority customer support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">Unlimited token tracking</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">Advanced market insights</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-gray-600 dark:text-gray-300">Portfolio management tools</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Single Get Started Button */}
          <div className="text-center mt-12">
            <Button
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3"
              onClick={() => router.push('/login')}
            >
              Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Trusted by thousands of traders worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                "Token Radar has completely transformed how I track my crypto investments. The real-time alerts have helped me
                catch several profitable opportunities."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-3">
                  <span className="text-indigo-600 dark:text-indigo-400 font-medium">JD</span>
                </div>
                <div>
                  <p className="font-medium">John Doe</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Crypto Trader</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                "The security analysis feature is a game-changer. It's helped me avoid several risky investments and
                focus on quality tokens."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-3">
                  <span className="text-indigo-600 dark:text-indigo-400 font-medium">JS</span>
                </div>
                <div>
                  <p className="font-medium">Jane Smith</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Investment Advisor</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                "As a fund manager, I need reliable data fast. Token Radar provides everything I need in one dashboard, saving
                me hours of research time."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-3">
                  <span className="text-indigo-600 dark:text-indigo-400 font-medium">RJ</span>
                </div>
                <div>
                  <p className="font-medium">Robert Johnson</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Crypto Fund Manager</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Tracking?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of traders who trust Rader for their token tracking needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-indigo-700 hover:bg-gray-100">
              <Link href="/signup">Sign Up Free</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
              <Link href="/login">Log In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Find answers to the most common questions about Rader
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-white dark:bg-gray-900 border rounded-lg overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  What makes Token Radar different from other token trackers?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  Token Radar combines real-time token tracking with advanced analytics and AI-powered insights. Our platform
                  offers faster updates, more comprehensive data, and a more intuitive user experience than traditional
                  tracking tools.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="bg-white dark:bg-gray-900 border rounded-lg overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  What chains and networks does Rader support?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  Rader currently supports Ethereum, Binance Smart Chain, Polygon, Solana, and Avalanche. We're
                  constantly adding support for more chains and networks based on user demand.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="bg-white dark:bg-gray-900 border rounded-lg overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">
                  Can I track my portfolio performance over time?
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  Yes, with a Pro or Enterprise subscription, you can track your portfolio performance over time with
                  detailed charts, metrics, and historical data. You can also export this data for your records.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4" className="bg-white dark:bg-gray-900 border rounded-lg overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">How do price alerts work?</AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  You can set custom price alerts based on specific price points or percentage changes. When a token
                  reaches your alert criteria, you'll receive a notification via email or push notification (if
                  enabled).
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5" className="bg-white dark:bg-gray-900 border rounded-lg overflow-hidden">
                <AccordionTrigger className="px-6 py-4 hover:no-underline">Is my data secure?</AccordionTrigger>
                <AccordionContent className="px-6 pb-4">
                  Yes, we take security very seriously. We use industry-standard encryption, secure authentication
                  methods, and strict data protection policies. We never share your data with third parties without your
                  consent.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
