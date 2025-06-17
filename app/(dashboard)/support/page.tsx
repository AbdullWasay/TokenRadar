"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Mail, MessageSquare, Phone } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
    priority: "normal",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setSubmitSuccess(true)
    setFormData({
      name: "",
      email: "",
      subject: "",
      category: "",
      message: "",
      priority: "normal",
    })
    setIsSubmitting(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Contact Us</h1>
        <p className="text-gray-500 dark:text-gray-400">We're here to help with any questions or concerns</p>
      </div>

      {submitSuccess && (
        <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-400 px-4 py-3 rounded mb-4">
          <p className="font-medium">Message sent successfully!</p>
          <p className="text-sm">We'll get back to you as soon as possible.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
              <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="How can we help you?"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="technical">Technical Support</SelectItem>
                        <SelectItem value="billing">Billing & Payments</SelectItem>
                        <SelectItem value="feature">Feature Request</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Describe your issue or question in detail..."
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <RadioGroup
                    value={formData.priority}
                    onValueChange={(value) => handleSelectChange("priority", value)}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low" id="low" />
                      <Label htmlFor="low" className="cursor-pointer">
                        Low
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="normal" id="normal" />
                      <Label htmlFor="normal" className="cursor-pointer">
                        Normal
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="high" />
                      <Label htmlFor="high" className="cursor-pointer">
                        High
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700">
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-indigo-600 mt-0.5" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">support@rader.com</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">For faster response on urgent matters</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-indigo-600 mt-0.5" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">+1 (800) 123-4567</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Mon-Fri, 9AM-5PM EST</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MessageSquare className="h-5 w-5 text-indigo-600 mt-0.5" />
                <div>
                  <p className="font-medium">Live Chat</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Available for Pro and Enterprise users</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I upgrade my subscription?</AccordionTrigger>
                  <AccordionContent>
                    You can upgrade your subscription from the Settings &gt; Billing page. Select the new plan you want
                    and follow the payment instructions.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Can I request a refund?</AccordionTrigger>
                  <AccordionContent>
                    Yes, we offer a 14-day money-back guarantee for all plans. Contact our support team with your
                    request.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>How do I add a custom token?</AccordionTrigger>
                  <AccordionContent>
                    Click the "Add Token" button in the sidebar or dashboard, then enter the token's contract address,
                    name, and symbol.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Do you offer API access?</AccordionTrigger>
                  <AccordionContent>
                    Yes, API access is available for Enterprise users. You can generate API keys in the Settings &gt;
                    API page.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
