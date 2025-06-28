"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CreateAlertRequest } from "@/lib/types"
import { AlertCircle, Bell, CheckCircle2 } from "lucide-react"
import { useState } from "react"

interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  tokenId: string
  tokenName: string
  tokenSymbol: string
  currentPrice?: number
  currentBondingPercentage?: number
}

export default function AlertModal({
  isOpen,
  onClose,
  tokenId,
  tokenName,
  tokenSymbol,
  currentPrice,
  currentBondingPercentage
}: AlertModalProps) {
  const [alertType, setAlertType] = useState<'price' | 'percentage' | 'bond'>('price')
  const [condition, setCondition] = useState<'above' | 'below' | 'increases' | 'decreases' | 'reaches'>('above')
  const [threshold, setThreshold] = useState('')
  const [timeframe, setTimeframe] = useState<'5m' | '1h' | '6h' | '24h' | '7d'>('1h')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Get JWT token from localStorage
      const token = localStorage.getItem('auth_token')
      if (!token) {
        throw new Error('Please log in to create alerts')
      }

      // Validate inputs
      if (!threshold || parseFloat(threshold) <= 0) {
        throw new Error('Please enter a valid threshold value')
      }

      const alertData: CreateAlertRequest = {
        tokenId,
        tokenName,
        tokenSymbol,
        alertType,
        condition,
        threshold: parseFloat(threshold),
        ...(alertType === 'percentage' && { timeframe })
      }

      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(alertData)
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Failed to create alert')
      }

      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onClose()
        resetForm()
      }, 2000)

    } catch (error: any) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setAlertType('price')
    setCondition('above')
    setThreshold('')
    setTimeframe('1h')
    setError(null)
    setSuccess(false)
  }

  const handleClose = () => {
    if (!isLoading) {
      onClose()
      resetForm()
    }
  }

  const getConditionOptions = () => {
    switch (alertType) {
      case 'price':
        return [
          { value: 'above', label: 'Goes above' },
          { value: 'below', label: 'Goes below' }
        ]
      case 'percentage':
        return [
          { value: 'increases', label: 'Increases by' },
          { value: 'decreases', label: 'Decreases by' }
        ]
      case 'bond':
        return [
          { value: 'reaches', label: 'Reaches' }
        ]
      default:
        return []
    }
  }

  const getThresholdLabel = () => {
    switch (alertType) {
      case 'price':
        return 'Price (USD)'
      case 'percentage':
        return 'Percentage (%)'
      case 'bond':
        return 'Bonding Percentage (%)'
      default:
        return 'Threshold'
    }
  }

  const getThresholdPlaceholder = () => {
    switch (alertType) {
      case 'price':
        return currentPrice ? `Current: $${currentPrice.toFixed(8)}` : 'Enter price in USD'
      case 'percentage':
        return 'Enter percentage (e.g., 10 for 10%)'
      case 'bond':
        return currentBondingPercentage ? `Current: ${currentBondingPercentage}%` : 'Enter bonding percentage'
      default:
        return 'Enter threshold'
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Create Alert for {tokenSymbol}
          </DialogTitle>
          <DialogDescription>
            Get notified when {tokenName} meets your specified conditions.
          </DialogDescription>
        </DialogHeader>

        {success && (
          <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              Alert created successfully! You'll be notified when the condition is met.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="alert-type">Alert Type</Label>
            <Select value={alertType} onValueChange={(value: any) => {
              setAlertType(value)
              setCondition(value === 'bond' ? 'reaches' : value === 'percentage' ? 'increases' : 'above')
            }}>
              <SelectTrigger id="alert-type">
                <SelectValue placeholder="Select alert type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Price Alert</SelectItem>
                <SelectItem value="percentage">Percentage Change Alert</SelectItem>
                <SelectItem value="bond">Bonding Alert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="condition">Condition</Label>
            <Select value={condition} onValueChange={(value: any) => setCondition(value)}>
              <SelectTrigger id="condition">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                {getConditionOptions().map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="threshold">{getThresholdLabel()}</Label>
            <Input
              id="threshold"
              type="number"
              step="any"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              placeholder={getThresholdPlaceholder()}
              required
            />
          </div>

          {alertType === 'percentage' && (
            <div className="grid gap-2">
              <Label htmlFor="timeframe">Timeframe</Label>
              <Select value={timeframe} onValueChange={(value: any) => setTimeframe(value)}>
                <SelectTrigger id="timeframe">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5m">5 minutes</SelectItem>
                  <SelectItem value="1h">1 hour</SelectItem>
                  <SelectItem value="6h">6 hours</SelectItem>
                  <SelectItem value="24h">24 hours</SelectItem>
                  <SelectItem value="7d">7 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Alert'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
