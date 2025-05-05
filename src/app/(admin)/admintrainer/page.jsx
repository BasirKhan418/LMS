"use client"

import { useState, useEffect } from "react"
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
import { Toaster, toast } from "sonner"
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
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"

export default function TrainersPage() {
  const [batches, setBatches] = useState([])
  const [loading, setLoading] = useState(false)
  const [trainers, setTrainers] = useState([])
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024)
  
  // Responsive view determination
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  // Determine current view mode
  const isMobile = windowWidth < 640
  const isTablet = windowWidth >= 640 && windowWidth < 1024
  
  // Fetch all trainers and batches from API
  const fetchTrainers = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/trainerscrud", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("dilmsadmintoken"),
        },
      })
      const data = await res.json()
      
      if (data.success) {
        setTrainers(data.trainers)
        setBatches(data.batch)
      } else {
        toast.error(data.message)
      }
    } catch(err) {
      toast.error("Something went wrong, please try again later")
    } finally {
      setLoading(false)
    }
  }
  
  // Fetch trainers and batches on page load
  useEffect(() => {
    fetchTrainers()
  }, [])

  // Form state
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
      if (prev.batches.includes(batchId)) {
        return {
          ...prev,
          batches: prev.batches.filter((id) => id !== batchId),
        }
      }
      return {
        ...prev,
        batches: [...prev.batches, batchId],
      }
    })
  }

  // Reset form data
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
      batches: trainer.batches || [],
    })
    setCurrentTrainerId(trainer._id)
    setIsEditMode(true)
    setIsOpen(true)
  }

  // Handle form submission for creating a new trainer
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)
      const res = await fetch("/api/trainerscrud", {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          batches: formData.batches,
        }),
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("dilmsadmintoken"),
        }
      })
      const data = await res.json()
      
      if (data.success) {
        toast.success("Trainer created successfully")
        fetchTrainers()
        setIsOpen(false)
        resetForm()
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error("Something went wrong, please try again later")
    } finally {
      setLoading(false)
    }
  }

  // Open delete confirmation dialog
  const openDeleteDialog = (trainerId) => {
    setTrainerToDelete(trainerId)
    setDeleteDialogOpen(true)
  }

  // Handle trainer deletion
  const handleDeleteTrainer = async () => {
    if (!trainerToDelete) return
    
    try {
      setLoading(true)
      const res = await fetch("/api/trainerscrud", {
        method: "DELETE",
        body: JSON.stringify({ _id: trainerToDelete }),
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("dilmsadmintoken"),
        }
      })
      const data = await res.json()
      
      if (data.success) {
        toast.success("Trainer deleted successfully")
        fetchTrainers()
        setDeleteDialogOpen(false)
        setTrainerToDelete(null)
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error("Something went wrong, please try again later")
    } finally {
      setLoading(false)
    }
  }

  // Get batch name by ID
  const getBatchName = (batchId) => {
    return batches.find((batch) => batch._id === batchId)?.name || "Unknown Batch"
  }

  // Filter trainers based on search query
  const filteredTrainers = trainers.filter((trainer) => {
    const query = searchQuery.toLowerCase()
    return (
      trainer.name?.toLowerCase().includes(query) ||
      trainer.email?.toLowerCase().includes(query) ||
      trainer.phone?.includes(query) ||
      (trainer.batches || []).some((batchId) => getBatchName(batchId).toLowerCase().includes(query))
    )
  })
  
  // Update trainer details
  const updateTrainer = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      const res = await fetch("/api/trainerscrud", {
        method: "PUT",
        body: JSON.stringify({
          _id: currentTrainerId,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          batches: formData.batches,
        }),
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("dilmsadmintoken"),
        }
      })
      const data = await res.json()
      
      if (data.success) {
        toast.success("Trainer updated successfully")
        fetchTrainers()
        setIsOpen(false)
        resetForm()
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error("Something went wrong, please try again later")
    } finally {
      setLoading(false)
    }
  }
  
  // Form content component - shared between dialog and sheet
  const FormContent = () => (
    <>
      <div className="space-y-4 py-2 pb-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter trainer's full name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="trainer@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="+1 (555) 000-0000"
            required
          />
        </div>

        <div className="space-y-3">
          <Label>Assign to Batches</Label>
          <p className="text-xs text-muted-foreground">
            Select the batches this trainer will be assigned to.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
            {batches.map((batch) => (
              <div
                key={batch._id}
                className={`p-2 rounded-md border cursor-pointer transition-all ${
                  formData.batches.includes(batch._id)
                    ? "bg-primary/10 border-primary"
                    : "bg-card border-input hover:bg-accent"
                }`}
                onClick={() => handleBatchSelect(batch._id)}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium truncate">{batch.name}</p>
                  {formData.batches.includes(batch._id) && (
                    <Badge variant="outline" className="bg-primary/20 text-primary border-primary text-xs">
                      Selected
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {formData.batches.length > 0 && (
          <div className="bg-muted p-2 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm">Selected Batches</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => setFormData((prev) => ({ ...prev, batches: [] }))}
              >
                Clear
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {formData.batches.map((batchId) => (
                <Badge
                  key={batchId}
                  variant="secondary"
                  className="pl-2 pr-1 py-1 flex items-center gap-1 text-xs"
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
    </>
  )

  // Trainer Card for mobile view
  const TrainerCard = ({ trainer }) => (
    <div className="border rounded-lg p-3 mb-3 shadow-sm bg-card">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium">{trainer.name}</h3>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => openEditModal(trainer)}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-destructive"
            onClick={() => openDeleteDialog(trainer._id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-1.5 text-sm">
        <p className="text-muted-foreground text-xs">
          {trainer.email}
        </p>
        <p className="text-muted-foreground text-xs">
          {trainer.phone}
        </p>
        
        <div className="mt-2">
          <p className="text-xs font-medium mb-1">Assigned Batches:</p>
          <div className="flex flex-wrap gap-1">
            {(trainer.batches || []).length > 0 ? (
              trainer.batches.map((batchId) => (
                <Badge key={batchId} variant="secondary" className="text-xs">
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
  
  // Calculate average batches per trainer
  const avgBatchesPerTrainer = trainers.length 
    ? (trainers.reduce((acc, trainer) => acc + (trainer.batches?.length || 0), 0) / trainers.length).toFixed(1)
    : "0"
  
  if (loading) {
    return <ProfilePageSkeleton />
  }
  
  return (
    <>
      <Toaster position="top-center" richColors closeButton />
      
      <div className="w-full max-w-full overflow-hidden">
        <div className="p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Trainers Management</h1>
            <p className="text-sm text-muted-foreground">Manage your LMS platform trainers and their batch assignments.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Trainers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{trainers.length}</div>
                <p className="text-xs text-muted-foreground">Active trainers</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{batches.length}</div>
                <p className="text-xs text-muted-foreground">Available batches</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm sm:col-span-2 lg:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Batches per Trainer</CardTitle>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{avgBatchesPerTrainer}</div>
                <p className="text-xs text-muted-foreground">Average assignments</p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Add Trainer */}
          <div className="flex flex-col sm:flex-row gap-3">
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
            <Button 
              onClick={openCreateModal} 
              className="sm:w-auto w-full whitespace-nowrap"
            >
              <UserPlus className="mr-2 h-4 w-4" /> Add New Trainer
            </Button>
          </div>

          {/* Mobile Trainer Cards */}
          <div className="sm:hidden space-y-1">
            {filteredTrainers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
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

          {/* Tablet/Desktop Trainer Table */}
          <div className="hidden sm:block rounded-md border shadow-sm overflow-hidden bg-card">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Name</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead className="hidden md:table-cell">Phone</TableHead>
                    <TableHead>Assigned Batches</TableHead>
                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTrainers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        {searchQuery
                          ? "No trainers match your search."
                          : "No trainers found. Add your first trainer to get started."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTrainers.map((trainer) => (
                      <TableRow key={trainer._id}>
                        <TableCell className="font-medium">
                          <div>
                            {trainer.name}
                            <div className="md:hidden text-xs text-muted-foreground mt-1">{trainer.email}</div>
                            <div className="md:hidden text-xs text-muted-foreground mt-1">{trainer.phone}</div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                          {trainer.email}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {trainer.phone}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {(trainer.batches || []).length > 0 ? (
                              trainer.batches.map((batchId) => (
                                <Badge 
                                  key={batchId} 
                                  variant="secondary" 
                                  className="whitespace-nowrap text-xs"
                                >
                                  {getBatchName(batchId)}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-xs text-muted-foreground">No batches assigned</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditModal(trainer)}
                              className="h-8 w-8"
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
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

          {/* Form Dialog for Larger Screens */}
          {!isMobile && (
            <Dialog open={isOpen} onOpenChange={(open) => {
              if (!open) resetForm()
              setIsOpen(open)
            }}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{isEditMode ? "Edit Trainer" : "Add New Trainer"}</DialogTitle>
                  <DialogDescription>
                    {isEditMode
                      ? "Update trainer details and batch assignments."
                      : "Fill in the details to add a new trainer."}
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={isEditMode ? updateTrainer : handleSubmit}>
                  <FormContent />
                  
                  <DialogFooter className="mt-4">
                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {isEditMode ? "Update Trainer" : "Create Trainer"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}

          {/* Sheet for Mobile */}
          {isMobile && (
            <Sheet open={isOpen} onOpenChange={(open) => {
              if (!open) resetForm()
              setIsOpen(open)
            }}>
              <SheetContent className="w-full max-w-full">
                <SheetHeader>
                  <SheetTitle>{isEditMode ? "Edit Trainer" : "Add New Trainer"}</SheetTitle>
                  <SheetDescription>
                    {isEditMode
                      ? "Update trainer details and batch assignments."
                      : "Fill in the details to add a new trainer."}
                  </SheetDescription>
                </SheetHeader>
                
                <form className="mt-4" onSubmit={isEditMode ? updateTrainer : handleSubmit}>
                  <div className="overflow-y-auto max-h-[calc(100vh-180px)]">
                    <FormContent />
                  </div>
                  
                  <SheetFooter className="mt-6">
                    <div className="flex flex-col gap-2 w-full">
                      <Button type="submit" className="w-full">
                        {isEditMode ? "Update Trainer" : "Create Trainer"}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="w-full">
                        Cancel
                      </Button>
                    </div>
                  </SheetFooter>
                </form>
              </SheetContent>
            </Sheet>
          )}

          {/* Delete Confirmation Dialog */}
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent className="max-w-[90%] sm:max-w-[425px]">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Trainer?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the trainer and remove their data from the
                  system.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="sm:space-x-2">
                <AlertDialogCancel className="mt-2 sm:mt-0">Cancel</AlertDialogCancel>
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
      </div>
    </>
  )
}