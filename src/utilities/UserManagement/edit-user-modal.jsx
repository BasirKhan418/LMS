"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Save, X } from "lucide-react"

export function EditUserModal({ user, isOpen, onClose, onSave,users }) {
  const [formData, setFormData] = useState({ ...user })
  const [batches, setBatches] = useState([])
  useEffect(()=>{
    const uniqueBatches = Array.from(new Set(users.map((user) => user.domain)))
    setBatches(uniqueBatches)
  },[users])
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {

    e.preventDefault()
    console.log(formData)
    onSave(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden bg-white max-h-[80vh]">
        <DialogHeader className="px-6 pt-6 pb-2 bg-gradient-to-r from-slate-50 to-slate-100 border-b">
          <DialogTitle className="text-xl font-bold text-slate-800">Edit User Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <ScrollArea className="max-h-[60vh] pr-4 overflow-y-auto custom-scrollbar">
            <div className="grid gap-6 p-6">
              <div className="grid gap-3">
                <Label htmlFor="name" className="text-slate-700">
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="border-slate-300 focus:border-slate-500"
                  required
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email" className="text-slate-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="border-slate-300 focus:border-slate-500"
                  required
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="domain" className="text-slate-700">
                  Domain
                </Label>
                <Select value={formData.domain} onValueChange={(value) => handleChange("domain", value)}>
                  <SelectTrigger id="domain" className="border-slate-300 focus:border-slate-500">
                    <SelectValue placeholder="Select domain" />
                  </SelectTrigger>
                  <SelectContent>
                  {batches.map((batch) => (
                <SelectItem key={batch} value={batch}>
                  {batch}
                </SelectItem>
              ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="duration" className="text-slate-700">
                 Duration
                </Label>
                <Select value={formData.month} onValueChange={(value) => handleChange("month", value)}>
                  <SelectTrigger id="duration" className="border-slate-300 focus:border-slate-500">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1 Month">1 Month</SelectItem>
                    <SelectItem value="2 Months">2 Months</SelectItem>
                    <SelectItem value="3 Months">3 Months</SelectItem>
                    <SelectItem value="4 Months">4 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="ispaid" className="text-slate-700">
                  Payment Status
                </Label>
                <Select
                  value={formData.ispaid ? "true" : "false"}
                  onValueChange={(value) => handleChange("ispaid", value === "true")}
                >
                  <SelectTrigger id="ispaid" className="border-slate-300 focus:border-slate-500">
                    <SelectValue placeholder="Select payment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Paid</SelectItem>
                    <SelectItem value="false">Unpaid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="paymentId" className="text-slate-700">
                  Payment ID
                </Label>
                <Input
                  id="paymentId"
                  value={formData.paymentid || ""}
                  onChange={(e) => handleChange("paymentid", e.target.value)}
                  className="border-slate-300 focus:border-slate-500"
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="orderId" className="text-slate-700">
                  Order ID
                </Label>
                <Input
                  id="orderId"
                  value={formData.orderid || ""}
                  onChange={(e) => handleChange("orderid", e.target.value)}
                  className="border-slate-300 focus:border-slate-500"
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="phone" className="text-slate-700">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={formData.number}
                  onChange={(e) => handleChange("number", e.target.value)}
                  className="border-slate-300 focus:border-slate-500"
                />
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="px-6 py-4 bg-slate-50 border-t flex flex-row justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="gap-2">
              <X className="h-4 w-4" /> Cancel
            </Button>
            <Button type="submit" className="gap-2 bg-slate-800 hover:bg-slate-700">
              <Save className="h-4 w-4" /> Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

