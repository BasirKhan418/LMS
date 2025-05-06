"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
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
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Batch name must be at least 2 characters.",
  }),
  domain: z.string().min(2, {
    message: "Domain must be at least 2 characters.",
  }),
  date: z.date({
    required_error: "Batch date is required.",
  }),
})

export default function BatchDialog({ open, onOpenChange, onSubmit, title, defaultValues }) {
  // State to track whether calendar is visible
  const [calendarVisible, setCalendarVisible] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      domain: "",
      date: new Date(),
    },
  })

  // Reset form values when defaultValues change or dialog opens
  useEffect(() => {
    if (open && defaultValues) {
      const date = new Date(defaultValues.date)
      // Ensure we're using local date without timezone shifts
      const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      
      form.reset({
        name: defaultValues.name,
        domain: defaultValues.domain,
        date: localDate,
      })
      // Hide calendar initially when editing
      setCalendarVisible(false);
    } else if (open && !defaultValues) {
      form.reset({
        name: "",
        domain: "",
        date: new Date(),
      })
      // Hide calendar initially when creating new
      setCalendarVisible(false);
    }
  }, [open, defaultValues, form])

  function handleSubmit(values) {
    if (defaultValues) {
      onSubmit({
        _id: defaultValues._id,
        name: values.name,
        domain: values.domain,
        date: values.date.toISOString(),
      })
    } else {
      onSubmit({
        name: values.name,
        domain: values.domain,
        date: values.date.toISOString(),
      })
    }
  }

  // Function to toggle calendar visibility
  const toggleCalendar = (e) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event bubbling
    setCalendarVisible(!calendarVisible);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Fill in the details for the batch. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <div className="overflow-y-auto pr-1" style={{ maxHeight: "300px" }}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Batch Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter batch name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Domain</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select domain" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Web Development">Software Development</SelectItem>
                        <SelectItem value="Python Development">Python Development</SelectItem>
                        <SelectItem value="Data Science & Machine Learning">Data Science & Machine Learning</SelectItem>
                        <SelectItem value="Cyber Security">Cyber Security</SelectItem>
                        <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
                        <SelectItem value="Data Analytics">Data Analytics</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Batch Date</FormLabel>
                    <div className="space-y-2">
                      {/* Date display button */}
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full text-left justify-between font-normal"
                        onClick={toggleCalendar}
                      >
                        {field.value ? format(field.value, "PPP") : "Select a date"}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 opacity-50">
                          <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                          <line x1="16" x2="16" y1="2" y2="6" />
                          <line x1="8" x2="8" y1="2" y2="6" />
                          <line x1="3" x2="21" y1="10" y2="10" />
                        </svg>
                      </Button>
                      
                      {/* Inline calendar */}
                      {calendarVisible && (
                        <div className="rounded-md border shadow-sm p-1 bg-white">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              if (date) {
                                field.onChange(date);
                                setCalendarVisible(false);
                              }
                            }}
                            disabled={false}
                            initialFocus
                          />
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter className="mt-4">
          <Button type="button" onClick={form.handleSubmit(handleSubmit)}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}