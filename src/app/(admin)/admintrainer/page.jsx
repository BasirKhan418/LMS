"use client"

import { useState, useEffect } from "react"
import { Pencil, Trash2, Search, UserPlus, Users, Briefcase, ChevronDown, X, Menu } from "lucide-react"
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
import { Toaster, toast } from "sonner";
import ProfilePageSkeleton from "@/utilities/skeleton/ProfilePageSkeleton"
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
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer"

export default function TrainersPage() {
  // Sample batches data
  const [batches, setBatches] = useState([])
  const [loading, setLoading] = useState(false)
  // State for trainers
  const [trainers, setTrainers] = useState([])
  const [isMobile, setIsMobile] = useState(false)
  
  // Check if it's mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    
    return () => {
      window.removeEventListener('resize', checkIfMobile)
    }
  }, [])
  
  //fetch all trainers and batches from api
  const fetchTrainers = async () => {
    try {
      setLoading(true)
      let res = await fetch("/api/trainerscrud", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("dilmsadmintoken"),
        },
      })
      let data = await res.json()
      
      setLoading(false)
      if (data.success) {
        setTrainers(data.trainers)
        setBatches(data.batch)
      } else {
        toast.error(data.message)
      }
    }
    catch(err) {
      setLoading(false)
      toast.error("Something went wrong, please try again later");
    }
  }
  
  //fetch all trainers and batches on page load
  useEffect(() => {
    fetchTrainers()
  }, [])

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
    setCurrentTrainerId(trainer._id)
    setIsEditMode(true)
    setIsOpen(true)
  }

  // Handle form submission
  const handleSubmit = async(e) => {
    e.preventDefault()

    try {
      setLoading(true);
      let res = await fetch("/api/trainerscrud", {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          batches: formData.batches,
        }),
        headers:{
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("dilmsadmintoken"),
        }
      })
      const data = await res.json()
      setLoading(false)
      if(data.success) {
        toast.success("Trainer created successfully")
        fetchTrainers()
        setIsOpen(false)
        resetForm()
      }
      else {
        toast.error(data.message)
      }
    }
    catch(err) {
      setLoading(false)
      setIsOpen(false)
      resetForm()
      toast.error("Something went wrong, please try again later")
    }
  }

  // Open delete confirmation dialog
  const openDeleteDialog = (trainerId) => {
    setTrainerToDelete(trainerId)
    setDeleteDialogOpen(true)
  }

  // Handle trainer deletion
  const handleDeleteTrainer = async() => {
    if (trainerToDelete) {
      try {
        setLoading(true)
        const data = await fetch("/api/trainerscrud", {
          method: "DELETE",
          body: JSON.stringify({ _id: trainerToDelete }),
          headers:{
            "Content-Type": "application/json",
            "Authorization": localStorage.getItem("dilmsadmintoken"),
          }
        })
        const res = await data.json()
        setLoading(false)
        if(res.success) {
          toast.success("Trainer deleted successfully")
          fetchTrainers()
          setDeleteDialogOpen(false)
          setTrainerToDelete(null)
        }
        else {
          toast.error(res.message)
        }
      }
      catch(err) {
        setLoading(false)
        toast.error("Something went wrong, please try again later")
      }
    }
  }

  // Get batch name by id
  const getBatchName = (batchId) => {
    return batches.find((batch) => batch._id === batchId)?.name || "Unknown Batch"
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
  
  //update trainer details
  const UpdateData = async(e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const data = await fetch("/api/trainerscrud", {
        method: "PUT",
        body: JSON.stringify({
          _id: currentTrainerId,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          batches: formData.batches,
        }),
        headers:{
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("dilmsadmintoken"),
        }
      })
      const res = await data.json()
      setLoading(false)
      if(res.success) {
        toast.success("Trainer updated successfully")
        fetchTrainers()
        setIsOpen(false)
        resetForm()
      }
      else {
        toast.error(res.message)
      }
    }
    catch(err) {
      setLoading(false)
      toast.error("Something went wrong, please try again later")
    }
  }

  // Form component - shared between modal and drawer
  const FormContent = ({ isSubmit = true }) => (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="grid gap-4 py-2 overflow-y-auto pr-1 scrollbar-thin">
        <div className="grid gap-4">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {batches.map((batch) => (
                <div
                  key={batch._id}
                  className={`p-3 rounded-md border transition-all cursor-pointer hover:border-primary ${
                    formData.batches.includes(batch._id)
                      ? "bg-primary/10 border-primary shadow-sm"
                      : "bg-card border-input hover:bg-accent"
                  }`}
                  onClick={() => handleBatchSelect(batch._id)}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{batch.name}</p>
                    {formData.batches.includes(batch._id) && (
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
                {formData.batches.map((batchId, index) => (
                  <Badge
                    key={`selected-${batchId}-${index}`}
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
      <div className="pt-4 mt-auto space-x-2 flex justify-end">
        <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
        {!isEditMode && isSubmit && (
          <Button type="submit">
            Create Trainer
          </Button>
        )}
        {isEditMode && (
          <Button onClick={UpdateData}>
            Update Trainer
          </Button>
        )}
      </div>
    </div>
  )

  // Trainer Card for mobile view
  const TrainerCard = ({ trainer }) => (
    <div className="p-4 border rounded-lg mb-4 bg-card">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium text-base">{trainer.name}</h3>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => openEditModal(trainer)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={() => openDeleteDialog(trainer._id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex gap-2">
          <span className="text-muted-foreground">Email:</span>
          <span className="font-medium">{trainer.email}</span>
        </div>
        
        <div className="flex gap-2">
          <span className="text-muted-foreground">Phone:</span>
          <span className="font-medium">{trainer.phone}</span>
        </div>
        
        <div>
          <span className="text-muted-foreground block mb-1">Batches:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {trainer.batches.length > 0 ? (
              trainer.batches.map((batchId, index) => (
                <Badge key={`${trainer._id}-batch-${batchId}-${index}`} variant="secondary" className="whitespace-nowrap">
                  {getBatchName(batchId)}
                </Badge>
              ))
            ) : (
              <span className="text-xs text-muted-foreground">No batches assigned</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
  
  return (
    <>
      <Toaster position="top-center" richColors closeButton={true} />
      {loading ? <ProfilePageSkeleton/> : 
        <div className="container mx-auto py-4 sm:py-8 px-4 space-y-6">
          {/* Header Section */}
          <div className="flex flex-col space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Trainers Management</h1>
            <p className="text-sm text-muted-foreground">Manage your LMS platform trainers and their batch assignments.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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
            <Card className="sm:col-span-2 lg:col-span-1">
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
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search trainers..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={openCreateModal} className="w-full sm:w-auto whitespace-nowrap">
              <UserPlus className="mr-2 h-4 w-4" /> Add New Trainer
            </Button>
          </div>

          {/* Mobile View: Trainer Cards */}
          {isMobile && (
            <div className="sm:hidden">
              {filteredTrainers.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  {searchQuery
                    ? "No trainers match your search."
                    : "No trainers found. Add your first trainer to get started."}
                </div>
              ) : (
                filteredTrainers.map((trainer) => (
                  <TrainerCard key={trainer._id} trainer={trainer} />
                ))
              )}
            </div>
          )}

          {/* Desktop View: Trainers Table */}
          <div className="hidden sm:block rounded-md border bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
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
                      <TableRow key={trainer._id} className="group">
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
                              trainer.batches.map((batchId, index) => (
                                <Badge key={`${trainer._id}-batch-${batchId}-${index}`} variant="secondary" className="whitespace-nowrap">
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
                              onClick={() => openDeleteDialog(trainer._id)}
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
          </div>

          {/* Desktop: Create/Edit Trainer Modal */}
          {!isMobile && (
            <Dialog
              open={isOpen}
              onOpenChange={(open) => {
                if (!open) resetForm()
                setIsOpen(open)
              }}
            >
              <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-hidden">
                <DialogHeader>
                  <DialogTitle>{isEditMode ? "Edit Trainer" : "Add New Trainer"}</DialogTitle>
                  <DialogDescription>
                    {isEditMode
                      ? "Update the trainer details and batch assignments below."
                      : "Fill in the details to add a new trainer to your LMS platform."}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="max-h-full">
                  <FormContent />
                </form>
              </DialogContent>
            </Dialog>
          )}

          {/* Mobile: Create/Edit Trainer Drawer */}
          {isMobile && (
            <Drawer
              open={isOpen}
              onOpenChange={(open) => {
                if (!open) resetForm()
                setIsOpen(open)
              }}
            >
              <DrawerContent className="max-h-[85vh]">
                <DrawerHeader className="text-left">
                  <DrawerTitle>{isEditMode ? "Edit Trainer" : "Add New Trainer"}</DrawerTitle>
                  <DrawerDescription>
                    {isEditMode
                      ? "Update the trainer details and batch assignments below."
                      : "Fill in the details to add a new trainer to your LMS platform."}
                  </DrawerDescription>
                </DrawerHeader>
                <form onSubmit={handleSubmit} className="px-4">
                  <FormContent />
                </form>
                <DrawerFooter className="pt-2">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  {!isEditMode ? (
                    <Button onClick={handleSubmit}>Create Trainer</Button>
                  ) : (
                    <Button onClick={UpdateData}>Update Trainer</Button>
                  )}
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          )}

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
      }
    </>
  )
}