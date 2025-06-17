import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react"
import Footer from "@/components/footer"
import Navbar from "@/components/landing-navbar"

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50 dark:bg-gray-900">
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Have questions or need help? We're here for you. Reach out and we'll respond as quickly as we can.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
                    <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name">Your Name</Label>
                          <Input id="name" placeholder="John Doe" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input id="email" type="email" placeholder="john@example.com" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" placeholder="How can we help you?" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" placeholder="Your message..." rows={6} />
                      </div>

                      <Button type="submit" className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700">
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Contact Information</h3>
                    <div className="space-y-6">
                      <div className="flex">
                        <div className="flex-shrink-0 mt-1">
                          <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-full">
                            <Mail className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-base font-medium">Email</h4>
                          <p className="text-gray-600 dark:text-gray-400">
                            <a
                              href="mailto:contact@rader.com"
                              className="hover:text-indigo-600 dark:hover:text-indigo-400"
                            >
                              contact@rader.com
                            </a>
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">We respond within 24 hours</p>
                        </div>
                      </div>

                      <div className="flex">
                        <div className="flex-shrink-0 mt-1">
                          <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-full">
                            <Phone className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-base font-medium">Phone</h4>
                          <p className="text-gray-600 dark:text-gray-400">
                            <a href="tel:+18001234567" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                              +1 (800) 123-4567
                            </a>
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Mon-Fri from 8am to 5pm EST</p>
                        </div>
                      </div>

                      <div className="flex">
                        <div className="flex-shrink-0 mt-1">
                          <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-full">
                            <MessageCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-base font-medium">Live Chat</h4>
                          <p className="text-gray-600 dark:text-gray-400">Available for Pro and Enterprise users</p>
                          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">24/7 support</p>
                        </div>
                      </div>

                      <div className="flex">
                        <div className="flex-shrink-0 mt-1">
                          <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-full">
                            <MapPin className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-base font-medium">Office</h4>
                          <p className="text-gray-600 dark:text-gray-400">
                            123 Innovation Way
                            <br />
                            San Francisco, CA 94103
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Follow Us</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Stay up to date with the latest news and updates
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" className="flex items-center justify-center gap-2">
                        <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                        </svg>
                        Facebook
                      </Button>
                      <Button variant="outline" className="flex items-center justify-center gap-2">
                        <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                        </svg>
                        Twitter
                      </Button>
                      <Button variant="outline" className="flex items-center justify-center gap-2">
                        <svg className="h-5 w-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.45 14.89L6.44 13.92l4.56-4.56 1.97 12.03z" />
                        </svg>
                        Instagram
                      </Button>
                      <Button variant="outline" className="flex items-center justify-center gap-2">
                        <svg className="h-5 w-5 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                        </svg>
                        LinkedIn
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
