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
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true)
      try {
        // This would be replaced with an actual API call
        const mockUsers = Array.from({ length: 50 }, (_, i) => ({
          id: `user-${i + 1}`,
          name: `User ${i + 1}`,
          email: `user${i + 1}@example.com`,
          domain: ["example.com", "test.com", "domain.com"][Math.floor(Math.random() * 3)],
          ispaid: Math.random() > 0.5,
          viewol: Math.floor(Math.random() * 100),
          gender: ["Male", "Female", "Other"][Math.floor(Math.random() * 3)],
          phone: `+1${Math.floor(Math.random() * 10000000000)}`,
          duration: ["1 month", "3 months", "6 months", "1 year"][Math.floor(Math.random() * 4)],
          paymentId: `pay_${Math.random().toString(36).substring(2, 10)}`,
          orderId: `ord_${Math.random().toString(36).substring(2, 10)}`,
        }))

        setUsers(mockUsers)
        setFilteredUsers(mockUsers)
        setTotalPages(Math.ceil(mockUsers.length / itemsPerPage))
      } catch (error) {
        console.error("Failed to fetch users:", error)
      } finally {
        setIsLoading(false)
      }
    }

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
      // Mock API call
      const updatedUsers = users.filter((user) => user.id !== selectedUser.id)
      setUsers(updatedUsers)
      setFilteredUsers(updatedUsers)
      setTotalPages(Math.ceil(updatedUsers.length / itemsPerPage))
    } catch (error) {
      console.error("Failed to delete user:", error)
    } finally {
      setIsDeleteDialogOpen(false)
      setSelectedUser(null)
    }
  }

  const handleSaveUser = async (updatedUser) => {
    // This would be replaced with an actual API call
    try {
      const updatedUsers = users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      setUsers(updatedUsers)
      setFilteredUsers(updatedUsers)
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

  const handleImportCSV = (importedUsers) => {
    // This would be replaced with an actual API call to save imported users
    const newUsers = [...users, ...importedUsers]
    setUsers(newUsers)
    setFilteredUsers(newUsers)
    setTotalPages(Math.ceil(newUsers.length / itemsPerPage))
  }

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredUsers.slice(startIndex, endIndex)
  }

  return (
    <div className="space-y-8">
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

