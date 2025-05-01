"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlusCircle } from "lucide-react"

export default function CreateTab({ batches, onCreateResult }) {
  const [selectedBatch, setSelectedBatch] = useState("")
  const [open, setOpen] = useState(false)

  const handleCreate = () => {
    if (selectedBatch) {
      onCreateResult(selectedBatch)
      setOpen(false)
      setSelectedBatch("")
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white dark:bg-slate-950 border-none shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white">Create New Results</CardTitle>
          <CardDescription>Create a new results entry for a batch of students</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
              <PlusCircle className="w-12 h-12 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-medium text-slate-800 dark:text-white">Start New Evaluation</h3>
            <p className="text-slate-500 dark:text-slate-400 text-center max-w-md">
              Create a new results entry for a batch of students. You'll be able to evaluate their performance and
              publish the results.
            </p>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="mt-4 bg-purple-600 hover:bg-purple-700">
                  Create Results
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Results</DialogTitle>
                  <DialogDescription>Select a batch to create results for.</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select batch" />
                    </SelectTrigger>
                    <SelectContent>
                      {batches.map((batch) => (
                        <SelectItem key={batch._id} value={batch._id}>
                          {batch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreate} disabled={!selectedBatch}>
                    Create
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batches.map((batch) => (
          <Card
            key={batch._id}
            className="bg-white dark:bg-slate-950 border-none shadow-md hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <CardTitle>{batch.name}</CardTitle>
              <CardDescription>Create results for this batch</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => onCreateResult(batch._id)} className="w-full bg-purple-600 hover:bg-purple-700">
                Create Results
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
