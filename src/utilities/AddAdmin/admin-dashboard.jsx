"use client"

import { useState } from "react"
import { Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import AdminTable from "./admin-table"
import CreateAdminModal from "./create-admin-modal"

// Mock data for demonstration
const initialAdmins = [
  { id: "1", username: "admin1", name: "John Doe", email: "john@example.com" },
  { id: "2", username: "admin2", name: "Jane Smith", email: "jane@example.com" },
  { id: "3", username: "admin3", name: "Robert Johnson", email: "robert@example.com" },
  { id: "4", username: "admin4", name: "Emily Davis", email: "emily@example.com" },
  { id: "5", username: "admin5", name: "Michael Wilson", email: "michael@example.com" },
]

export default function AdminDashboard() {
  const [admins, setAdmins] = useState(initialAdmins)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [adminToEdit, setAdminToEdit] = useState(null)

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCreateAdmin = (newAdmin) => {
    const id = (Math.max(...admins.map((a) => Number.parseInt(a.id))) + 1).toString()
    setAdmins([...admins, { ...newAdmin, id }])
  }

  const handleUpdateAdmin = (updatedAdmin) => {
    setAdmins(admins.map((admin) => (admin.id === updatedAdmin.id ? updatedAdmin : admin)))
  }

  const handleDeleteAdmin = (id) => {
    setAdmins(admins.filter((admin) => admin.id !== id))
  }

  const openEditModal = (admin) => {
    setAdminToEdit(admin)
    setIsCreateModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-[350px]">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            placeholder="Search admins..."
            className="pl-9 w-full h-12 rounded-lg bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          onClick={() => {
            setAdminToEdit(null)
            setIsCreateModalOpen(true)
          }}
          className="h-12 px-5 rounded-lg text-white shadow-md hover:shadow-lg transition-all duration-200"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Admin
        </Button>
      </div>

      <AdminTable admins={filteredAdmins} onEdit={openEditModal} onDelete={handleDeleteAdmin} />

      <CreateAdminModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={adminToEdit ? handleUpdateAdmin : handleCreateAdmin}
        admin={adminToEdit}
      />
    </div>
  )
}

