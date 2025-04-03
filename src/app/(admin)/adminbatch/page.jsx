"use client"

import { useState } from "react"
import { PlusCircle, Pencil, Trash2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import BatchDialog from "@/utilities/Batch/batch-dialog"
import UsersDialog from "@/utilities/Batch/users-dialog"

export default function BatchManagement() {
  const [batches, setBatches] = useState([
    { id: "1", name: "Web Development", domain: "IT", date: "2023-04-15" },
    { id: "2", name: "Data Science", domain: "Analytics", date: "2023-05-20" },
    { id: "3", name: "UI/UX Design", domain: "Design", date: "2023-06-10" },
  ])

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isUsersOpen, setIsUsersOpen] = useState(false)
  const [currentBatch, setCurrentBatch] = useState(null)

  // Mock users data
  const mockUsers = {
    1: [
      { id: "1", name: "John Doe", email: "john@example.com" },
      { id: "2", name: "Jane Smith", email: "jane@example.com" },
      { id: "3", name: "Mike Johnson", email: "mike@example.com" },
      { id: "4", name: "Sarah Williams", email: "sarah@example.com" },
      { id: "5", name: "Alex Brown", email: "alex@example.com" },
      { id: "6", name: "Emily Davis", email: "emily@example.com" },
      { id: "7", name: "Chris Wilson", email: "chris@example.com" },
    ],
    2: [
      { id: "8", name: "Robert Taylor", email: "robert@example.com" },
      { id: "9", name: "Lisa Anderson", email: "lisa@example.com" },
    ],
    3: [
      { id: "10", name: "David Miller", email: "david@example.com" },
      { id: "11", name: "Emma Wilson", email: "emma@example.com" },
      { id: "12", name: "James Thomas", email: "james@example.com" },
    ],
  }

  const handleCreateBatch = (batch) => {
    const newBatch = {
      ...batch,
      id: (batches.length + 1).toString(),
    }
    setBatches([...batches, newBatch])
    setIsCreateOpen(false)
  }

  const handleEditBatch = (updatedBatch) => {
    setBatches(batches.map((batch) => (batch.id === updatedBatch.id ? updatedBatch : batch)))
    setIsEditOpen(false)
    setCurrentBatch(null)
  }

  const handleDeleteBatch = (id) => {
    setBatches(batches.filter((batch) => batch.id !== id))
  }

  const openEditDialog = (batch) => {
    setCurrentBatch(batch)
    setIsEditOpen(true)
  }

  const openUsersDialog = (batch) => {
    setCurrentBatch(batch)
    setIsUsersOpen(true)
  }

  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">Batch Management</CardTitle>
          <Button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Create Batch
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch Name</TableHead>
                    <TableHead>Domain</TableHead>
                    <TableHead>Batch Date</TableHead>
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
                      <TableRow key={batch.id}>
                        <TableCell className="font-medium">{batch.name}</TableCell>
                        <TableCell>{batch.domain}</TableCell>
                        <TableCell>{new Date(batch.date).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openUsersDialog(batch)}
                              className="hidden sm:flex items-center gap-1"
                            >
                              <Users className="h-4 w-4" />
                              <span>View Users</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => openUsersDialog(batch)}
                              className="sm:hidden"
                            >
                              <Users className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => openEditDialog(batch)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDeleteBatch(batch.id)}
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
            batchName={currentBatch.name}
            users={mockUsers[currentBatch.id] || []}
          />
        </>
      )}
    </div>
  )
}

