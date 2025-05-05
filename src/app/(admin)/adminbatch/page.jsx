"use client"

import { useEffect, useState } from "react"
import { PlusCircle, Pencil, Trash2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import BatchDialog from "@/utilities/Batch/batch-dialog"
import UsersDialog from "@/utilities/Batch/users-dialog"
import { Toaster, toast } from "sonner"
import ProfilePageSkeleton from "@/utilities/skeleton/ProfilePageSkeleton"

export default function BatchManagement() {
  const [batches, setBatches] = useState([])
  const [users, setUsers] = useState([])
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isUsersOpen, setIsUsersOpen] = useState(false)
  const [currentBatch, setCurrentBatch] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch all batches from API
  const fetchBatches = async () => {
    setBatches([])
    try {
      setIsLoading(true)
      const data = await fetch("/api/batchcrud", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${localStorage.getItem("dilmsadmintoken")}`,
        },
      })
      const res = await data.json()
      setIsLoading(false)
      if (res.success) {
        setBatches(res.batch)
      } else {
        toast.warning(res.message)
      }
    }
    catch (err) {
      setIsLoading(false)
      toast.error("Something went wrong while fetching batches")
    }
  }

  // Update on all render
  useEffect(() => {
    fetchBatches()
  }, [])

  // Create batch function
  const handleCreateBatch = async (batch) => {
    try {
      setIsLoading(true)
      const data = await fetch("/api/batchcrud", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${localStorage.getItem("dilmsadmintoken")}`,
        },
        body: JSON.stringify(batch),
      })
      const res = await data.json()
      setIsLoading(false)
      if (res.success) {
        fetchBatches()
        setIsCreateOpen(false)
        toast.success(res.message)
      }
      else {
        toast.error(res.message)
      }
    }
    catch (err) {
      setIsLoading(false)
      toast.error("Something went wrong while creating batch")
    }
  }

  // Edit batch function
  const handleEditBatch = async (updatedBatch) => {
    try {
      setIsLoading(true)
      const data = await fetch("/api/batchcrud", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${localStorage.getItem("dilmsadmintoken")}`,
        },
        body: JSON.stringify(updatedBatch),
      })
      const res = await data.json()
      setIsLoading(false)
      if (res.success) {
        fetchBatches()
        setCurrentBatch(null)
        setIsEditOpen(false)
        toast.success(res.message)
      }
      else {
        toast.error(res.message)
      }
    }
    catch (err) {
      setIsLoading(false)
      toast.error("Something went wrong while updating batch")
    }
  }

  // Delete batch function
  const handleDeleteBatch = async (id) => {
    try {
      setIsLoading(true)
      const data = await fetch("/api/batchcrud", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${localStorage.getItem("dilmsadmintoken")}`,
        },
        body: JSON.stringify({ id }),
      })
      const res = await data.json()
      setIsLoading(false)
      if (res.success) {
        fetchBatches()
        toast.success(res.message)
      }
      else {
        toast.error(res.message)
      }
    }
    catch (err) {
      setIsLoading(false)
      toast.error("Something went wrong while deleting batch")
    }
  }

  // Function to open the edit dialog with a fresh copy of the batch object
  const openEditDialog = (batch) => {
    // Create a fresh copy of the batch object to avoid reference issues
    setCurrentBatch({
      _id: batch._id,
      name: batch.name,
      domain: batch.domain,
      date: batch.date
    });
    setIsEditOpen(true);
  }

  // Function to open the users dialog with the selected batch
  const openUsersDialog = async (batch) => {
    try {
      setIsLoading(true)
      const data = await fetch("/api/batchcrud/getuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${localStorage.getItem("dilmsadmintoken")}`,
        },
        body: JSON.stringify({ batchid: batch._id }),
      })
      const res = await data.json()
      setIsLoading(false)
      if (res.success) {
        setUsers(res.users)
        setCurrentBatch({ ...batch, id: batch._id })
        setIsUsersOpen(true)
        toast.success(res.message)
      } else {
        toast.error(res.message)
      }
    }
    catch (err) {
      setIsLoading(false)
      toast.error("Something went wrong while fetching users")
    }
  }

  return (
    <>
      <Toaster richColors position="top-right" />
      {isLoading ? (
        <ProfilePageSkeleton />
      ) : (
        <div className="w-full max-w-7xl mx-auto py-4 px-2 sm:px-4 md:px-6 lg:px-8">
          <Card className="w-full">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0 pb-4">
              <CardTitle className="text-xl sm:text-2xl font-bold">Batch Management</CardTitle>
              <Button 
                onClick={() => setIsCreateOpen(true)} 
                className="w-full sm:w-auto flex items-center justify-center gap-2"
                size="sm"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Create Batch</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                {/* For mobile: Card-based layout */}
                <div className="block sm:hidden">
                  {batches.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      No batches found. Create your first batch!
                    </div>
                  ) : (
                    batches.map((batch) => (
                      <div key={batch._id} className="p-4 border-b last:border-b-0">
                        <div className="font-medium mb-1">{batch.name}</div>
                        <div className="text-sm text-muted-foreground mb-1">
                          <span className="font-medium">Domain:</span> {batch.domain}
                        </div>
                        <div className="text-sm text-muted-foreground mb-3">
                          <span className="font-medium">Date:</span> {new Date(batch.date).toLocaleDateString()}
                        </div>
                        <div className="flex flex-wrap gap-2 justify-start">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openUsersDialog(batch)}
                            className="flex items-center gap-1"
                          >
                            <Users className="h-4 w-4" />
                            <span>Users</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openEditDialog(batch)}
                            className="flex items-center gap-1"
                          >
                            <Pencil className="h-4 w-4" />
                            <span>Edit</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteBatch(batch._id)}
                            className="text-destructive hover:text-destructive flex items-center gap-1"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {/* For tablet and desktop: Table layout */}
                <div className="hidden sm:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Batch Name</TableHead>
                        <TableHead className="hidden md:table-cell">Domain</TableHead>
                        <TableHead className="hidden md:table-cell">Batch Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {batches.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                            No batches found. Create your first batch!
                          </TableCell>
                        </TableRow>
                      ) : (
                        batches.map((batch) => (
                          <TableRow key={batch._id}>
                            <TableCell className="font-medium">
                              {batch.name}
                              <div className="md:hidden text-xs text-muted-foreground mt-1">
                                <div>{batch.domain}</div>
                                <div>{new Date(batch.date).toLocaleDateString()}</div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{batch.domain}</TableCell>
                            <TableCell className="hidden md:table-cell">{new Date(batch.date).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end flex-wrap gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openUsersDialog(batch)}
                                  className="hidden sm:flex items-center gap-1"
                                >
                                  <Users className="h-4 w-4" />
                                  <span className="hidden lg:inline">View Users</span>
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => openUsersDialog(batch)}
                                  className="sm:hidden"
                                >
                                  <Users className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  onClick={() => openEditDialog(batch)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => handleDeleteBatch(batch._id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
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
            </CardContent>
          </Card>

          <BatchDialog
            open={isCreateOpen}
            onOpenChange={setIsCreateOpen}
            onSubmit={handleCreateBatch}
            title="Create Batch"
          />

          {currentBatch && (
            <>
              <BatchDialog
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                onSubmit={handleEditBatch}
                title="Edit Batch"
                defaultValues={currentBatch}
              />

              <UsersDialog
                open={isUsersOpen}
                onOpenChange={setIsUsersOpen}
                batch={currentBatch}
                users={users}
              />
            </>
          )}
        </div>
      )}
    </>
  )
}