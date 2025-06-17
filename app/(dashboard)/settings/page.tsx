"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Bell, CreditCard, Key, Lock, Save, User } from "lucide-react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account")
  const { toast } = useToast()

  const [accountForm, setAccountForm] = useState({
    name: "Talal Khan",
    email: "talal@example.com",
    username: "talalkhan",
    bio: "Crypto enthusiast and trader",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    priceAlerts: true,
    newTokens: false,
    marketUpdates: true,
    newsletter: false,
  })

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "system",
    tokenDisplay: "grid",
    chartStyle: "candles",
    defaultTimeframe: "1d",
  })

  const handleAccountFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setAccountForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleNotificationChange = (key: string, checked: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: checked }))
  }

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage your account settings and preferences</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="account" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Account</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M12 5v2M12 17v2M5 12H3M21 12h-2" />
              <path d="m18.364 5.636-1.414 1.414M7.05 16.95l-1.414 1.414M16.95 7.05l1.414-1.414M6.343 6.343 4.929 4.929" />
            </svg>
            <span>Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span>Billing</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            <span>API</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Update your account details and profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={accountForm.name} onChange={handleAccountFormChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={accountForm.email}
                    onChange={handleAccountFormChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={accountForm.username}
                    onChange={handleAccountFormChange}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" name="bio" value={accountForm.bio} onChange={handleAccountFormChange} rows={4} />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveSettings} className="bg-indigo-600 hover:bg-indigo-700">
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Channels</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications" className="font-medium">
                        Email Notifications
                      </Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={notificationSettings.email}
                      onCheckedChange={(checked) => handleNotificationChange("email", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notifications" className="font-medium">
                        Push Notifications
                      </Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications on your device</p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={notificationSettings.push}
                      onCheckedChange={(checked) => handleNotificationChange("push", checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Types</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="price-alerts" className="font-medium">
                        Price Alerts
                      </Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Notifications for your price alerts</p>
                    </div>
                    <Switch
                      id="price-alerts"
                      checked={notificationSettings.priceAlerts}
                      onCheckedChange={(checked) => handleNotificationChange("priceAlerts", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="new-tokens" className="font-medium">
                        New Tokens
                      </Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Notifications about new token listings</p>
                    </div>
                    <Switch
                      id="new-tokens"
                      checked={notificationSettings.newTokens}
                      onCheckedChange={(checked) => handleNotificationChange("newTokens", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="market-updates" className="font-medium">
                        Market Updates
                      </Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Daily and weekly market summaries</p>
                    </div>
                    <Switch
                      id="market-updates"
                      checked={notificationSettings.marketUpdates}
                      onCheckedChange={(checked) => handleNotificationChange("marketUpdates", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="newsletter" className="font-medium">
                        Newsletter
                      </Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Receive our weekly newsletter</p>
                    </div>
                    <Switch
                      id="newsletter"
                      checked={notificationSettings.newsletter}
                      onCheckedChange={(checked) => handleNotificationChange("newsletter", checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveSettings} className="bg-indigo-600 hover:bg-indigo-700">
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize how Rader looks and feels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={appearanceSettings.theme}
                    onValueChange={(value) => setAppearanceSettings((prev) => ({ ...prev, theme: value }))}
                  >
                    <SelectTrigger id="theme">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="token-display">Token Display</Label>
                  <Select
                    value={appearanceSettings.tokenDisplay}
                    onValueChange={(value) => setAppearanceSettings((prev) => ({ ...prev, tokenDisplay: value }))}
                  >
                    <SelectTrigger id="token-display">
                      <SelectValue placeholder="Select display mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">Grid</SelectItem>
                      <SelectItem value="list">List</SelectItem>
                      <SelectItem value="compact">Compact</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chart-style">Chart Style</Label>
                  <Select
                    value={appearanceSettings.chartStyle}
                    onValueChange={(value) => setAppearanceSettings((prev) => ({ ...prev, chartStyle: value }))}
                  >
                    <SelectTrigger id="chart-style">
                      <SelectValue placeholder="Select chart style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="candles">Candlestick</SelectItem>
                      <SelectItem value="line">Line</SelectItem>
                      <SelectItem value="area">Area</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="default-timeframe">Default Timeframe</Label>
                  <Select
                    value={appearanceSettings.defaultTimeframe}
                    onValueChange={(value) => setAppearanceSettings((prev) => ({ ...prev, defaultTimeframe: value }))}
                  >
                    <SelectTrigger id="default-timeframe">
                      <SelectValue placeholder="Select default timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">1 Hour</SelectItem>
                      <SelectItem value="1d">1 Day</SelectItem>
                      <SelectItem value="1w">1 Week</SelectItem>
                      <SelectItem value="1m">1 Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveSettings} className="bg-indigo-600 hover:bg-indigo-700">
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security and authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Change Password</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Sessions</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Active Sessions</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Manage your active sessions</p>
                    </div>
                    <Button variant="outline" className="text-red-500">
                      Sign Out All Devices
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveSettings} className="bg-indigo-600 hover:bg-indigo-700">
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Subscription</CardTitle>
              <CardDescription>Manage your subscription plan and payment methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Current Plan</h3>
                <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-900 dark:bg-indigo-900/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-indigo-700 dark:text-indigo-400">Pro Plan</p>
                      <p className="text-sm text-indigo-600 dark:text-indigo-300">$19/month</p>
                    </div>
                    <Button variant="outline">Upgrade Plan</Button>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-indigo-600 dark:text-indigo-300">
                      Your subscription renews on August 1, 2023
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Payment Methods</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                    <div className="flex items-center">
                      <div className="mr-4 rounded-md bg-gray-100 p-2 dark:bg-gray-800">
                        <CreditCard className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">•••• •••• •••• 4242</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Expires 12/2025</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-500">
                        Remove
                      </Button>
                    </div>
                  </div>
                  <Button variant="outline">Add Payment Method</Button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Billing History</h3>
                <div className="rounded-lg border border-gray-200 dark:border-gray-800">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-800">
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                            Description
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                            Amount
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                            Status
                          </th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                            Receipt
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200 dark:border-gray-800">
                          <td className="px-4 py-3 text-sm">Jul 1, 2023</td>
                          <td className="px-4 py-3 text-sm">Pro Plan - Monthly</td>
                          <td className="px-4 py-3 text-sm">$19.00</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                              Paid
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right text-sm">
                            <Button variant="ghost" size="sm">
                              Download
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-200 dark:border-gray-800">
                          <td className="px-4 py-3 text-sm">Jun 1, 2023</td>
                          <td className="px-4 py-3 text-sm">Pro Plan - Monthly</td>
                          <td className="px-4 py-3 text-sm">$19.00</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                              Paid
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right text-sm">
                            <Button variant="ghost" size="sm">
                              Download
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>Manage your API keys for programmatic access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Your API Keys</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Use these keys to access the Rader API programmatically
                    </p>
                  </div>
                  <Button className="bg-indigo-600 hover:bg-indigo-700">Generate New Key</Button>
                </div>

                <div className="rounded-lg border border-gray-200 dark:border-gray-800">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-800">
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                            Name
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                            Created
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                            Last Used
                          </th>
                          <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200 dark:border-gray-800">
                          <td className="px-4 py-3 text-sm">
                            <div className="font-medium">Main API Key</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">••••••••••••••••</div>
                          </td>
                          <td className="px-4 py-3 text-sm">Jun 15, 2023</td>
                          <td className="px-4 py-3 text-sm">Jul 20, 2023</td>
                          <td className="px-4 py-3 text-right text-sm">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm">
                                Copy
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-500">
                                Revoke
                              </Button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">API Documentation</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Learn how to use the Rader API to build your own applications
                </p>
                <div className="flex gap-2">
                  <Button variant="outline">View Documentation</Button>
                  <Button variant="outline">API Reference</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
