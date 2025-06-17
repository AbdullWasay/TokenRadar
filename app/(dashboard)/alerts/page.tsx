"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bell, BellOff, Clock, Edit, MoreHorizontal, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import BondAlerts from "@/components/bond-alerts"

// Mock data
const priceAlerts = [
  {
    id: "1",
    token: {
      name: "Bitcoin",
      symbol: "BTC",
      image: "/placeholder.svg?height=40&width=40",
    },
    condition: "above",
    price: 70000,
    created: "2 days ago",
    active: true,
  },
  {
    id: "2",
    token: {
      name: "Ethereum",
      symbol: "ETH",
      image: "/placeholder.svg?height=40&width=40",
    },
    condition: "below",
    price: 3000,
    created: "1 week ago",
    active: true,
  },
  {
    id: "3",
    token: {
      name: "Solana",
      symbol: "SOL",
      image: "/placeholder.svg?height=40&width=40",
    },
    condition: "above",
    price: 150,
    created: "3 days ago",
    active: false,
  },
]

const percentageAlerts = [
  {
    id: "4",
    token: {
      name: "Cardano",
      symbol: "ADA",
      image: "/placeholder.svg?height=40&width=40",
    },
    condition: "increases",
    percentage: 10,
    timeframe: "1h",
    created: "5 days ago",
    active: true,
  },
  {
    id: "5",
    token: {
      name: "Dogecoin",
      symbol: "DOGE",
      image: "/placeholder.svg?height=40&width=40",
    },
    condition: "decreases",
    percentage: 15,
    timeframe: "24h",
    created: "2 days ago",
    active: true,
  },
]

const recentAlerts = [
  {
    id: "6",
    token: {
      name: "Bitcoin",
      symbol: "BTC",
      image: "/placeholder.svg?height=40&width=40",
    },
    message: "Bitcoin price is above $65,000",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "7",
    token: {
      name: "Ethereum",
      symbol: "ETH",
      image: "/placeholder.svg?height=40&width=40",
    },
    message: "Ethereum increased by 5% in the last hour",
    time: "5 hours ago",
    read: true,
  },
  {
    id: "8",
    token: {
      name: "Solana",
      symbol: "SOL",
      image: "/placeholder.svg?height=40&width=40",
    },
    message: "Solana decreased by 8% in the last 24 hours",
    time: "1 day ago",
    read: true,
  },
]

export default function AlertsPage() {
  const [activeTab, setActiveTab] = useState("bond")
  const [isCreateAlertOpen, setIsCreateAlertOpen] = useState(false)
  const [alertType, setAlertType] = useState("price")
  const [selectedToken, setSelectedToken] = useState("")
  const [condition, setCondition] = useState("above")
  const [price, setPrice] = useState("")
  const [percentage, setPercentage] = useState("")
  const [timeframe, setTimeframe] = useState("1h")
  const [bondThreshold, setBondThreshold] = useState("90")

  const handleCreateAlert = () => {
    // Here you would handle the alert creation
    setIsCreateAlertOpen(false)
    // Reset form
    setSelectedToken("")
    setCondition("above")
    setPrice("")
    setPercentage("")
    setTimeframe("1h")
    setBondThreshold("90")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Alerts</h1>
          <p className="text-gray-500 dark:text-gray-400">Set up notifications for price movements and bond events</p>
        </div>
        <Button onClick={() => setIsCreateAlertOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="mr-2 h-4 w-4" /> Create Alert
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="bond">Bond Alerts</TabsTrigger>
          <TabsTrigger value="price">Price Alerts</TabsTrigger>
          <TabsTrigger value="percentage">Percentage Alerts</TabsTrigger>
          <TabsTrigger value="recent">Recent Alerts</TabsTrigger>
        </TabsList>
      </Tabs>

      {activeTab === "bond" && <BondAlerts />}

      {activeTab === "price" && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Price Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            {priceAlerts.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium mb-2">No price alerts</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Get notified when a token reaches a specific price
                </p>
                <Button onClick={() => setIsCreateAlertOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="mr-2 h-4 w-4" /> Create Alert
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Token
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Condition
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Price
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Created
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Status
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {priceAlerts.map((alert) => (
                      <tr
                        key={alert.id}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full overflow-hidden mr-3 bg-gray-100 dark:bg-gray-800">
                              <Image
                                src={alert.token.image || "/placeholder.svg"}
                                alt={alert.token.name}
                                width={32}
                                height={32}
                              />
                            </div>
                            <div>
                              <div className="font-medium">{alert.token.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{alert.token.symbol}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant="outline" className="capitalize">
                            {alert.condition}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">${alert.price.toLocaleString()}</td>
                        <td className="py-4 px-4">{alert.created}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <Switch checked={alert.active} />
                            <span className="ml-2">{alert.active ? "Active" : "Inactive"}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-500">
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "percentage" && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Percentage Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            {percentageAlerts.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium mb-2">No percentage alerts</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Get notified when a token price changes by a certain percentage
                </p>
                <Button onClick={() => setIsCreateAlertOpen(true)} className="bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="mr-2 h-4 w-4" /> Create Alert
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Token
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Condition
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Percentage
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Timeframe
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Created
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Status
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {percentageAlerts.map((alert) => (
                      <tr
                        key={alert.id}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full overflow-hidden mr-3 bg-gray-100 dark:bg-gray-800">
                              <Image
                                src={alert.token.image || "/placeholder.svg"}
                                alt={alert.token.name}
                                width={32}
                                height={32}
                              />
                            </div>
                            <div>
                              <div className="font-medium">{alert.token.name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{alert.token.symbol}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant="outline" className="capitalize">
                            {alert.condition}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">{alert.percentage}%</td>
                        <td className="py-4 px-4">{alert.timeframe}</td>
                        <td className="py-4 px-4">{alert.created}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <Switch checked={alert.active} />
                            <span className="ml-2">{alert.active ? "Active" : "Inactive"}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-500">
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "recent" && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle>Recent Alerts</CardTitle>
              <Button variant="outline" size="sm">
                Mark All as Read
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentAlerts.length === 0 ? (
              <div className="text-center py-12">
                <BellOff className="h-12 w-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium mb-2">No recent alerts</h3>
                <p className="text-gray-500 dark:text-gray-400">You haven't received any alerts yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border ${
                      alert.read
                        ? "border-gray-200 dark:border-gray-800"
                        : "border-indigo-200 bg-indigo-50 dark:border-indigo-900 dark:bg-indigo-900/20"
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded-full overflow-hidden mr-3 bg-gray-100 dark:bg-gray-800">
                        <Image
                          src={alert.token.image || "/placeholder.svg"}
                          alt={alert.token.name}
                          width={40}
                          height={40}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">
                              {alert.token.name} ({alert.token.symbol})
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{alert.message}</div>
                          </div>
                          <div className="flex items-center">
                            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {alert.time}
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 ml-2">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create Alert Dialog */}
      <Dialog open={isCreateAlertOpen} onOpenChange={setIsCreateAlertOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Alert</DialogTitle>
            <DialogDescription>
              Set up a new alert to get notified about price movements or bond events.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="alert-type">Alert Type</Label>
              <Select value={alertType} onValueChange={setAlertType}>
                <SelectTrigger id="alert-type">
                  <SelectValue placeholder="Select alert type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bond">Bond Alert</SelectItem>
                  <SelectItem value="price">Price Alert</SelectItem>
                  <SelectItem value="percentage">Percentage Alert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="token">Token</Label>
              <Select value={selectedToken} onValueChange={setSelectedToken}>
                <SelectTrigger id="token">
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                  <SelectItem value="eth">Ethereum (ETH)</SelectItem>
                  <SelectItem value="sol">Solana (SOL)</SelectItem>
                  <SelectItem value="ada">Cardano (ADA)</SelectItem>
                  <SelectItem value="doge">Dogecoin (DOGE)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {alertType === "bond" ? (
              <div className="grid gap-2">
                <Label htmlFor="bondThreshold">Bond Threshold (%)</Label>
                <Select value={bondThreshold} onValueChange={setBondThreshold}>
                  <SelectTrigger id="bondThreshold">
                    <SelectValue placeholder="Select bond threshold" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">100% (Fully Bonded)</SelectItem>
                    <SelectItem value="90">90% (Almost Bonded)</SelectItem>
                    <SelectItem value="75">75% (Bonding)</SelectItem>
                    <SelectItem value="50">50% (Halfway Bonded)</SelectItem>
                    <SelectItem value="25">25% (Early Stage)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : alertType === "price" ? (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Select value={condition} onValueChange={setCondition}>
                    <SelectTrigger id="condition">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="above">Price Above</SelectItem>
                      <SelectItem value="below">Price Below</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="price">Price (USD)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="Enter price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="condition">Condition</Label>
                  <Select value={condition} onValueChange={setCondition}>
                    <SelectTrigger id="condition">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="increases">Increases By</SelectItem>
                      <SelectItem value="decreases">Decreases By</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="percentage">Percentage (%)</Label>
                  <Input
                    id="percentage"
                    type="number"
                    placeholder="Enter percentage"
                    value={percentage}
                    onChange={(e) => setPercentage(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="timeframe">Timeframe</Label>
                  <Select value={timeframe} onValueChange={setTimeframe}>
                    <SelectTrigger id="timeframe">
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">1 Hour</SelectItem>
                      <SelectItem value="24h">24 Hours</SelectItem>
                      <SelectItem value="7d">7 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateAlertOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAlert} className="bg-indigo-600 hover:bg-indigo-700">
              Create Alert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
