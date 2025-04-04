"use client"

import { useState } from "react"
import { Pencil, Trash2, Search, UserPlus, Users, Briefcase, ChevronDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TrainersPage() {
  // Sample batches data
  const batches = [
    { id: "1", name: "Web Development Batch 1" },
    { id: "2", name: "Data Science Batch 2" },
    { id: "3", name: "UI/UX Design Batch 3" },
    { id: "4", name: "Mobile Development Batch 4" },
    { id: "5", name: "Cloud Computing Batch 5" },
  ]

  // State for trainers
  const [trainers, setTrainers] = useState([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 234 567 890",
      batches: ["1", "3"],
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1 987 654 321",
      batches: ["2", "4"],
    },
    {
      id: "3",
      name: "Robert Johnson",
      email: "robert@example.com",
      phone: "+1 555 123 456",
      batches: ["1", "5"],
    },
  ])

  // State for form
  const [isOpen, setIsOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    batches: [],
  })
  const [currentTrainerId, setCurrentTrainerId] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [trainerToDelete, setTrainerToDelete] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle batch selection
  const handleBatchSelect = (batchId) => {
    setFormData((prev) => {
      // If batch is already selected, remove it
      if (prev.batches.includes(batchId)) {
        return {
          ...prev,
          batches: prev.batches.filter((id) => id !== batchId),
        }
      }
      // Otherwise add it
      return {
        ...prev,
        batches: [...prev.batches, batchId],
      }
    })
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      batches: [],
    })
    setCurrentTrainerId(null)
    setIsEditMode(false)
  }

  // Open modal for creating new trainer
  const openCreateModal = () => {
    resetForm()
    setIsOpen(true)
  }

  // Open modal for editing trainer
  const openEditModal = (trainer) => {
    setFormData({
      name: trainer.name,
      email: trainer.email,
      phone: trainer.phone,
      batches: trainer.batches,
    })
    setCurrentTrainerId(trainer.id)
    setIsEditMode(true)
    setIsOpen(true)
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()

    if (isEditMode && currentTrainerId) {
      // Update existing trainer
      setTrainers((prev) =>
        prev.map((trainer) => (trainer.id === currentTrainerId ? { ...trainer, ...formData } : trainer)),
      )
    } else {
      // Create new trainer
      const newTrainer = {
        id: Date.now().toString(),
        ...formData,
      }
      setTrainers((prev) => [...prev, newTrainer])
    }

    setIsOpen(false)
    resetForm()
  }

  // Open delete confirmation dialog
  const openDeleteDialog = (trainerId) => {
    setTrainerToDelete(trainerId)
    setDeleteDialogOpen(true)
  }

  // Handle trainer deletion
  const handleDeleteTrainer = () => {
    if (trainerToDelete) {
      setTrainers((prev) => prev.filter((trainer) => trainer.id !== trainerToDelete))
      setDeleteDialogOpen(false)
      setTrainerToDelete(null)
    }
  }

  // Get batch name by id
  const getBatchName = (batchId) => {
    return batches.find((batch) => batch.id === batchId)?.name || "Unknown Batch"
  }

  // Filter trainers based on search query
  const filteredTrainers = trainers.filter((trainer) => {
    const query = searchQuery.toLowerCase()
    return (
      trainer.name.toLowerCase().includes(query) ||
      trainer.email.toLowerCase().includes(query) ||
      trainer.phone.includes(query) ||
      trainer.batches.some((batchId) => getBatchName(batchId).toLowerCase().includes(query))
    )
  })

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Trainers Management</h1>
        <p className="text-muted-foreground">Manage your LMS platform trainers and their batch assignments.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trainers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trainers.length}</div>
            <p className="text-xs text-muted-foreground">Active trainers in the system</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{batches.length}</div>
            <p className="text-xs text-muted-foreground">Available training batches</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Batches per Trainer</CardTitle>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trainers.length
                ? (trainers.reduce((acc, trainer) => acc + trainer.batches.length, 0) / trainers.length).toFixed(1)
                : "0"}
            </div>
            <p className="text-xs text-muted-foreground">Average batch assignments</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-auto max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search trainers..."
            className="pl-8 w-full sm:w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={openCreateModal} className="w-full sm:w-auto">
          <UserPlus className="mr-2 h-4 w-4" /> Add New Trainer
        </Button>
      </div>

      {/* Trainers Table */}
      <div className="rounded-md border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Phone</TableHead>
              <TableHead>Assigned Batches</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTrainers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  {searchQuery
                    ? "No trainers match your search."
                    : "No trainers found. Add your first trainer to get started."}
                </TableCell>
              </TableRow>
            ) : (
              filteredTrainers.map((trainer) => (
                <TableRow key={trainer.id} className="group">
                  <TableCell className="font-medium">
                    <div>
                      {trainer.name}
                      <div className="md:hidden text-xs text-muted-foreground mt-1">{trainer.email}</div>
                      <div className="md:hidden text-xs text-muted-foreground mt-1">{trainer.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{trainer.email}</TableCell>
                  <TableCell className="hidden md:table-cell">{trainer.phone}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {trainer.batches.length > 0 ? (
                        trainer.batches.map((batchId) => (
                          <Badge key={batchId} variant="secondary" className="whitespace-nowrap">
                            {getBatchName(batchId)}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">No batches assigned</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditModal(trainer)}
                        className="opacity-70 group-hover:opacity-100"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive opacity-70 group-hover:opacity-100"
                        onClick={() => openDeleteDialog(trainer.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Trainer Modal */}
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) resetForm()
          setIsOpen(open)
        }}
      >
        <DialogContent className="sm:max-w-[550px] max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl">{isEditMode ? "Edit Trainer" : "Add New Trainer"}</DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update the trainer details and batch assignments below."
                : "Fill in the details to add a new trainer to your LMS platform."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="grid gap-6 py-4 overflow-y-auto pr-1 scrollbar-thin">
              <div className="grid gap-6 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter trainer's full name"
                    className="h-10"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="trainer@example.com"
                    className="h-10"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 000-0000"
                    className="h-10"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">Assign to Batches</Label>
                  <div className="text-xs text-muted-foreground mb-2">
                    Select the batches this trainer will be assigned to. Click to select or deselect.
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {batches.map((batch) => (
                      <div
                        key={batch.id}
                        className={`p-3 rounded-md border transition-all cursor-pointer hover:border-primary ${
                          formData.batches.includes(batch.id)
                            ? "bg-primary/10 border-primary shadow-sm"
                            : "bg-card border-input hover:bg-accent"
                        }`}
                        onClick={() => handleBatchSelect(batch.id)}
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{batch.name}</p>
                          {formData.batches.includes(batch.id) && (
                            <Badge variant="outline" className="bg-primary/20 text-primary border-primary">
                              Selected
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {formData.batches.length > 0 && (
                  <div className="bg-muted p-3 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium">Selected Batches</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => setFormData((prev) => ({ ...prev, batches: [] }))}
                      >
                        Clear All
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.batches.map((batchId) => (
                        <Badge
                          key={batchId}
                          variant="secondary"
                          className="pl-2 pr-1 py-1 flex items-center gap-1 bg-background"
                        >
                          {getBatchName(batchId)}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 ml-1 rounded-full hover:bg-muted-foreground/20"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleBatchSelect(batchId)
                            }}
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter className="pt-2 mt-2">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="ml-2">
                {isEditMode ? "Update Trainer" : "Create Trainer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the trainer and remove their data from the
              system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTrainer}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Trainer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

