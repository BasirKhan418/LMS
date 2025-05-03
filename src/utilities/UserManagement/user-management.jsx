"use client"

import { useState, useEffect } from "react"
import { UserTable } from "./user-table"
import { FilterBar } from "./filter-bar"
import {EditUserModal} from "./edit-user-modal"
import { ImportCSV } from "./import-csv"
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
import { toast, Toaster } from "sonner"

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const itemsPerPage = 10

  // Mock API call to fetch users
  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      // This would be replaced with an actual API call
      const response = await fetch("/api/user-mn",{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${localStorage.getItem("dilmsadmintoken")}`,
        },
      })
      const data = await response.json()
      setIsLoading(false)
      
      if(data.success){
        setUsers(data.users)
        setFilteredUsers(data.users)
        setTotalPages(Math.ceil(data.users.length / itemsPerPage))
      }
      else{
        toast.error(data.message)
      }
      
    } catch (error) {
      console.error("Failed to fetch users:", error)
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
   

    fetchUsers()
  }, [])

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setIsEditModalOpen(true)
  }

  const handleDeleteUser = (user) => {
    setSelectedUser(user)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedUser) return

    // This would be replaced with an actual API call
    try {
      setIsLoading(true)
      const response = await fetch("/api/user-mn", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${localStorage.getItem("dilmsadmintoken")}`,
        },
        body: JSON.stringify(selectedUser),
      })
      const data = await response.json()
      setIsLoading(false)
      if(data.success){
        fetchUsers()
        toast.success(data.message)
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      console.error("Failed to delete user:", error)
    } finally {
      setIsDeleteDialogOpen(false)
      setSelectedUser(null)
    }
  }

  const handleSaveUser = async (updatedUser) => {
    // This would be replaced with an actual API call
    setIsLoading(true)
    try {
     const response = await fetch("/api/user-mn", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${localStorage.getItem("dilmsadmintoken")}`,
        },
        body: JSON.stringify(updatedUser),
     })
      const data = await response.json()
      setIsLoading(false)
      if(data.success){
        fetchUsers()
        toast.success(data.message)
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      console.error("Failed to update user:", error)
    } finally {
      setIsEditModalOpen(false)
      setSelectedUser(null)
    }
  }

  const handleFilter = (filteredData) => {
    setFilteredUsers(filteredData)
    setTotalPages(Math.ceil(filteredData.length / itemsPerPage))
    setCurrentPage(1)
  }

  const handleImportCSV = async(importedUsers) => {
    setIsLoading(true)
 try{
  const response = await fetch("/api/user-mn", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${localStorage.getItem("dilmsadmintoken")}`,
    },
    body: JSON.stringify(importedUsers),
  })
  const data = await response.json()
  setIsLoading(false)
  if(data.success){
    fetchUsers()
    toast.success(data.message)
  }
  else{
    toast.error(data.message)
  }
 }
 catch(error){
  toast.error(error.message)
 }
  }

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredUsers.slice(startIndex, endIndex)
  }

  return (
    <div className="space-y-8">
      <Toaster position="top-right" richColors closeButton />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-slate-50 to-slate-100 p-6 rounded-lg shadow-sm border">
        <h1 className="text-3xl font-bold text-slate-800">LMS User Management</h1>
        <ImportCSV onImport={handleImportCSV} users={users} />
      </div>

      <FilterBar users={users} onFilter={handleFilter} />

      <UserTable
        users={getCurrentPageData()}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        isLoading={isLoading}
      />

      {isEditModalOpen && selectedUser && (
        <EditUserModal
          user={selectedUser}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedUser(null)
          }}
          onSave={handleSaveUser}
          users={users}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl text-red-600">Delete User</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Are you sure you want to delete {selectedUser?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="border-2">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

