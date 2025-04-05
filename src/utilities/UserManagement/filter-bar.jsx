"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Check } from "lucide-react"

export function FilterBar({ users, onFilter }) {
  const [activeFilter, setActiveFilter] = useState("all")
  const [selectedBatch, setSelectedBatch] = useState("all") // Changed from empty string to "all"
  const [batches, setBatches] = useState([])
  const [newUsersActive, setNewUsersActive] = useState(false)

  useEffect(() => {
    // Extract unique batches (using domain as batch for this example)
    const uniqueBatches = Array.from(new Set(users.map((user) => user.domain)))
    setBatches(uniqueBatches)
  }, [users])

  const applyFilters = () => {
    let result = [...users]
  
    // Apply user type filter
    if (activeFilter === "paid") {
      result = result.filter((user) => user.ispaid)
    }
  
    // Apply batch filter - fixed to use "all" instead of empty string
    if (selectedBatch !== "all") {
      result = result.filter((user) => user.domain === selectedBatch)
    }
  
    // Apply new users filter - get users created in current month who are paid
    if (newUsersActive) {
      const now = new Date()
      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()
      
      result = result.filter((user) => {
        // Make sure createdAt is properly converted to a Date object
        const createdDate = new Date(user.createdAt)
        // Check if user was created in current month AND is paid
        return createdDate.getMonth() === currentMonth && 
               createdDate.getFullYear() === currentYear &&
               user.ispaid === true
      })
    }
  
    onFilter(result)
  }

  const handleFilterClick = (filter) => {
    setActiveFilter(filter)
    setTimeout(applyFilters, 0)
  }

  const handleNewUsersClick = () => {
    setNewUsersActive(!newUsersActive)
    setTimeout(applyFilters, 0)
  }

  const handleBatchChange = (value) => {
    setSelectedBatch(value)
  }

  useEffect(() => {
    applyFilters()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter, newUsersActive])

  return (
    <div className="bg-white border rounded-xl p-6 shadow-md">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-700">
        <Filter className="h-5 w-5" /> Filter Users
      </h2>
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeFilter === "all" ? "default" : "outline"}
            onClick={() => handleFilterClick("all")}
            className={activeFilter === "all" ? "bg-slate-800 hover:bg-slate-700" : ""}
          >
            All Users
            {activeFilter === "all" && <Check className="ml-2 h-4 w-4" />}
          </Button>
          <Button
            variant={activeFilter === "paid" ? "default" : "outline"}
            onClick={() => handleFilterClick("paid")}
            className={activeFilter === "paid" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
          >
            Paid Users
            {activeFilter === "paid" && <Check className="ml-2 h-4 w-4" />}
          </Button>
          <Button
            variant={newUsersActive ? "default" : "outline"}
            onClick={handleNewUsersClick}
            className={newUsersActive ? "bg-amber-500 hover:bg-amber-600" : ""}
          >
            New Users
            {newUsersActive && <Check className="ml-2 h-4 w-4" />}
          </Button>
        </div>

        <div className="flex flex-1 gap-2 items-center">
          <Select value={selectedBatch} onValueChange={handleBatchChange}>
            <SelectTrigger className="w-full sm:w-[220px]">
              <SelectValue placeholder="Select batch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Domains</SelectItem>
              {batches.map((batch) => (
                <SelectItem key={batch} value={batch}>
                  {batch}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={applyFilters} className="bg-slate-800 hover:bg-slate-700">
            Apply Filter
          </Button>
        </div>
      </div>
    </div>
  )
}

