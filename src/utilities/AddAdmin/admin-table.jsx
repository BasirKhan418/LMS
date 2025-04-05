"use client"

import { useState } from "react"
import { Edit, Trash2, UserCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import PinVerificationModal from "./pin-verification-modal"

export default function AdminTable({ admins, onEdit, onDelete }) {
  const [isPinModalOpen, setIsPinModalOpen] = useState(false)
  const [actionType, setActionType] = useState("delete")
  const [selectedAdmin, setSelectedAdmin] = useState(null)

  const handleEditClick = (admin) => {
    setSelectedAdmin(admin)
    setActionType("edit")
    setIsPinModalOpen(true)
  }

  const handleDeleteClick = (admin) => {
    setSelectedAdmin(admin)
    setActionType("delete")
    setIsPinModalOpen(true)
  }

  const handlePinVerified = () => {
    if (actionType === "edit" && selectedAdmin) {
      onEdit(selectedAdmin)
    } else if (actionType === "delete" && selectedAdmin) {
      onDelete(selectedAdmin._id)
    }
    setIsPinModalOpen(false)
  }

  return (
    <>
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-950 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-slate-900">
              <TableHead className="font-semibold text-slate-900 dark:text-slate-100">Username</TableHead>
              <TableHead className="font-semibold text-slate-900 dark:text-slate-100">Name</TableHead>
              <TableHead className="font-semibold text-slate-900 dark:text-slate-100">Email</TableHead>
              <TableHead className="text-right font-semibold text-slate-900 dark:text-slate-100">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                    <UserCircle className="h-10 w-10 mb-2 opacity-40" />
                    <p>No admins found.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              admins.map((admin) => (
                <TableRow key={admin._id} className="hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                  <TableCell className="font-medium">
                    <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800 font-mono text-xs">
                      {admin.username}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{admin.name}</TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-300">{admin.email}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-lg border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        onClick={() => handleEditClick(admin)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-lg border-slate-200 dark:border-slate-700 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800 transition-colors"
                        onClick={() => handleDeleteClick(admin)}
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

      <PinVerificationModal
        open={isPinModalOpen}
        onOpenChange={setIsPinModalOpen}
        onPinVerified={handlePinVerified}
        action={actionType}
        adminName={selectedAdmin?.name || ""}
      />
    </>
  )
}

