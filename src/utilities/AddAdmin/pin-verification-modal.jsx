"use client"

import { useState, useRef, useEffect } from "react"
import { LockKeyhole, ShieldAlert, ShieldCheck } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { verifyAdminPin } from "../../../functions/actions"

export default function PinVerificationModal({ open, onOpenChange, onPinVerified, action, adminName }) {
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const inputRef = useRef(null)

  const actionText = {
    create: "create",
    edit: "edit",
    delete: "delete",
  }

  const actionColor = {
    create: "text-green-500",
    edit: "text-blue-500",
    delete: "text-red-500",
  }

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus()
      }, 100)
    }
  }, [open])

  const handleVerify = async () => {
    if (!pin) {
      setError("Please enter the admin PIN")
      return
    }

    setIsVerifying(true)
    setError("")

    try {
      const isValid = await verifyAdminPin(pin)

      if (isValid) {
        setIsSuccess(true)
        setTimeout(() => {
          onPinVerified()
          setPin("")
          setIsSuccess(false)
        }, 1000)
      } else {
        setError("Invalid PIN. Please try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleVerify()
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!isVerifying) {
          onOpenChange(newOpen)
          if (!newOpen) {
            setPin("")
            setError("")
            setIsSuccess(false)
          }
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden rounded-2xl border-slate-200 dark:border-slate-800">
        <div
          className={`p-6 ${isSuccess ? "bg-green-500" : "bg-gradient-to-r from-slate-700 to-slate-900"} text-white`}
        >
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center">
              {isSuccess ? <ShieldCheck className="h-6 w-6 mr-2" /> : <LockKeyhole className="h-6 w-6 mr-2" />}
              {isSuccess ? "Verified Successfully" : "PIN Verification"}
            </DialogTitle>
            <DialogDescription className="text-slate-200 opacity-90">
              {isSuccess
                ? "Proceeding with your request..."
                : `Please enter the admin PIN to ${actionText[action]} ${adminName}.`}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6">
          {!isSuccess && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pin" className="text-slate-700 dark:text-slate-300">
                  Admin PIN
                </Label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="pin"
                    ref={inputRef}
                    type="password"
                    placeholder="Enter PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="pl-9 h-10 rounded-lg bg-slate-50 dark:bg-slate-900"
                  />
                </div>
                {error && (
                  <div className="flex items-center text-red-500 text-sm mt-2">
                    <ShieldAlert className="h-4 w-4 mr-1" />
                    {error}
                  </div>
                )}
              </div>

              <div className="rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900 p-3 text-sm text-amber-800 dark:text-amber-300">
                <p className="flex items-start">
                  <ShieldAlert className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>
                    You are about to <span className={`font-medium ${actionColor[action]}`}>{actionText[action]}</span>{" "}
                    {adminName}. This action requires admin verification.
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>

        {!isSuccess && (
          <DialogFooter className="p-6 pt-0">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isVerifying}
              className="rounded-lg border-slate-200 dark:border-slate-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleVerify}
              disabled={isVerifying}
              className={`rounded-lg ${isVerifying ? "bg-slate-400" : "bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"}`}
            >
              {isVerifying ? "Verifying..." : "Verify PIN"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

