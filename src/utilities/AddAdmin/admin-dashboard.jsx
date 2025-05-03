"use client"

import { useState,useEffect } from "react"
import { Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import AdminTable from "./admin-table"
import CreateAdminModal from "./create-admin-modal"
import { Toaster,toast } from "sonner"
import ProfilePageSkeleton from "../skeleton/ProfilePageSkeleton"
// Mock data for demonstration

export default function AdminDashboard() {

  const [admins, setAdmins] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [adminToEdit, setAdminToEdit] = useState(null)
  const [loading, setLoading] = useState(false)
//fetch all admins

    const fetchAdmins = async () => {
        setLoading(true)
        try{
const response = await fetch("/api/admincrud",{
    method:"GET",
    headers:{
        "Content-Type":"application/json",
        "Authorization":`${localStorage.getItem("dilmsadmintoken")}`
    }
});
const data = await response.json()

setLoading(false)
if(!data.success){
    toast.error(data.message)
    return
}
else{
    setAdmins(data.admins)
    toast.success("Fetched admins successfully")
}
        }
        catch(err){
toast.error("Error fetching admins")
        }
    }

useEffect(() => {
fetchAdmins()
},[])
  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCreateAdmin = async(newAdmin) => {
    try{
        setLoading(true)
        const response = await fetch("/api/admincrud", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("dilmsadmintoken")}`,
            },
            body: JSON.stringify(newAdmin),
        })
        const data = await response.json()
        setLoading(false)
        if (!data.success) {
            toast.error(data.message)
            return
        } else {
            fetchAdmins()
            toast.success("Admin created successfully")
        }
    }
    catch(err){
        toast.error("Error creating admin")
    }
  }

  const handleUpdateAdmin = async(updatedAdmin) => {
  
    try{
    const response = await fetch("/api/admincrud", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("dilmsadmintoken")}`,
        },
        body: JSON.stringify({
            id: updatedAdmin.id,
            username: updatedAdmin.username,
            email: updatedAdmin.email,
            name: updatedAdmin.name,
        }),
    })
    const data = await response.json()
    setLoading(false)
    if (!data.success) {
        toast.error(data.message)
        return
    } else {
        fetchAdmins()
        toast.success("Admin updated successfully")
    }
    }
    catch(err){
        toast.error("Error updating admin")
    }
  }

  const handleDeleteAdmin = async(id) => {
    try{
setLoading(true)
        const response = await fetch("/api/admincrud", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${localStorage.getItem("dilmsadmintoken")}`,
            },
            body: JSON.stringify({ id }),
        })
        const data = await response.json()
        setLoading(false)
        if (!data.success) {
            toast.error(data.message)
            return
        } else {
            fetchAdmins()
            toast.success("Admin deleted successfully")
        }
    }
    catch(error){
        toast.error("Error deleting admin")
    }
  }

  const openEditModal = (admin) => {
   
    setAdminToEdit(admin)
    setIsCreateModalOpen(true)
  }

  return (
    <>
     <Toaster richColors position="top-right" closeButton={false} />
   { loading?<ProfilePageSkeleton/>:<div className="space-y-6">
       
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
    </div>}
    </>
  )
}

