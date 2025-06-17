"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { z } from "zod"

interface AddTokenModalProps {
  isOpen: boolean
  onClose: () => void
}

const tokenSchema = z.object({
  name: z.string().min(1, "Token name is required"),
  symbol: z.string().min(1, "Token symbol is required"),
  contractAddress: z.string().min(1, "Contract address is required"),
})

export default function AddTokenModal({ isOpen, onClose }: AddTokenModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    contractAddress: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate form data
      tokenSchema.parse(formData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Success
      toast({
        title: "Token added successfully",
        description: "The token has been added to your list.",
      })

      // Reset form and close modal
      setFormData({
        name: "",
        symbol: "",
        contractAddress: "",
      })
      onClose()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(newErrors)
      } else {
        toast({
          variant: "destructive",
          title: "Failed to add token",
          description: "There was an error adding the token. Please try again.",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Token</DialogTitle>
          <DialogDescription>Enter the token details to add it to your tracking list.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Token Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="symbol">Token Symbol</Label>
              <Input
                id="symbol"
                name="symbol"
                value={formData.symbol}
                onChange={handleChange}
                className={errors.symbol ? "border-red-500" : ""}
              />
              {errors.symbol && <p className="text-red-500 text-xs">{errors.symbol}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="contractAddress">Contract Address</Label>
              <Input
                id="contractAddress"
                name="contractAddress"
                value={formData.contractAddress}
                onChange={handleChange}
                className={errors.contractAddress ? "border-red-500" : ""}
              />
              {errors.contractAddress && <p className="text-red-500 text-xs">{errors.contractAddress}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700">
              {isLoading ? "Adding..." : "Add Token"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
