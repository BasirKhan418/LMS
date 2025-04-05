"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { AtSign, User, UserCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import PinVerificationModal from "./pin-verification-modal"

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
})

export default function CreateAdminModal({ open, onOpenChange, onSubmit, admin }) {
  const [isPinModalOpen, setIsPinModalOpen] = useState(false)
  const [formData, setFormData] = useState(null)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: admin?.username || "",
      name: admin?.name || "",
      email: admin?.email || "",
    },
  })

  const handleSubmit = (values) => {
    setFormData(values)
    setIsPinModalOpen(true)
  }

  const handlePinVerified = () => {
    if (formData) {
      if (admin) {
        onSubmit({ ...formData, id: admin.id })
      } else {
        onSubmit(formData)
      }
      setIsPinModalOpen(false)
      onOpenChange(false)
      form.reset()
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-2xl border-slate-200 dark:border-slate-800">
          <div className="bg-gray-800 p-6 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center">
                <UserCircle className="h-6 w-6 mr-2" />
                {admin ? "Edit Admin" : "Create Admin"}
              </DialogTitle>
              <DialogDescription className="text-purple-100 dark:text-blue-100 opacity-90">
                {admin ? "Update the admin details below." : "Fill in the details to create a new admin."}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 dark:text-slate-300">Username</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input
                            placeholder="admin123"
                            className="pl-9 h-10 rounded-lg bg-slate-50 dark:bg-slate-900"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 dark:text-slate-300">Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <UserCircle className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input
                            placeholder="John Doe"
                            className="pl-9 h-10 rounded-lg bg-slate-50 dark:bg-slate-900"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 dark:text-slate-300">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <AtSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input
                            placeholder="john@example.com"
                            type="email"
                            className="pl-9 h-10 rounded-lg bg-slate-50 dark:bg-slate-900"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <DialogFooter className="pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    className="rounded-lg border-slate-200 dark:border-slate-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="rounded-lg  hover:from-purple-700 hover:to-blue-600"
                  >
                    {admin ? "Update Admin" : "Create Admin"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      <PinVerificationModal
        open={isPinModalOpen}
        onOpenChange={setIsPinModalOpen}
        onPinVerified={handlePinVerified}
        action={admin ? "edit" : "create"}
        adminName={admin?.name || "new admin"}
      />
    </>
  )
}

