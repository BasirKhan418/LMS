"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CalendarIcon } from "lucide-react"
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect } from "react"

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
    } else if (open && !defaultValues) {
      form.reset({
        name: "",
        domain: "",
        date: new Date(),
      })
    }
  }, [open, defaultValues, form])

  function handleSubmit(values) {
    if (defaultValues) {
      onSubmit({
        _id: defaultValues._id,  // Use _id instead of id to match API expectations
        name: values.name,
        domain: values.domain,
        date: values.date.toISOString(),  // Send full ISO date
      })
    } else {
      onSubmit({
        name: values.name,
        domain: values.domain,
        date: values.date.toISOString(),  // Send full ISO date
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Fill in the details for the batch. Click save when you're done.</DialogDescription>
        </DialogHeader>
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
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={`w-full pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                        >
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}