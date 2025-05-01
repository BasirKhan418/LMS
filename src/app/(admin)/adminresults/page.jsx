"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CreateTab from "@/utilities/AdminResults/create-tab"
import PendingTab from "@/utilities/AdminResults/pending-tab"
import EvaluatedTab from "@/utilities/AdminResults/evaluated-tab"

export default function ResultsPage() {
  const [activeTab, setActiveTab] = useState("create")
  const [batches, setBatches] = useState([
    { _id: "1", name: "Batch 2023 Spring" },
    { _id: "2", name: "Batch 2023 Fall" },
    { _id: "3", name: "Batch 2024 Winter" },
  ])

  const [results, setResults] = useState([])

  useEffect(() => {
    // Load results from localStorage if available
    const savedResults = localStorage.getItem("lmsResults")
    if (savedResults) {
      setResults(JSON.parse(savedResults))
    }
  }, [])

  useEffect(() => {
    // Save results to localStorage whenever they change
    localStorage.setItem("lmsResults", JSON.stringify(results))
  }, [results])

  const handleCreateResult = (batchId) => {
    const selectedBatch = batches.find((batch) => batch._id === batchId)

    // Mock users for the selected batch
    const users = [
      { _id: "u1", name: "John Doe", email: "john@example.com" },
      { _id: "u2", name: "Jane Smith", email: "jane@example.com" },
      { _id: "u3", name: "Alex Johnson", email: "alex@example.com" },
      { _id: "u4", name: "Sarah Williams", email: "sarah@example.com" },
    ]

    const newResult = {
      _id: Date.now().toString(),
      status: "pending",
      batchid: batchId,
      batchName: selectedBatch.name,
      users: users,
      results: [],
      createdAt: new Date().toISOString(),
    }

    setResults([...results, newResult])
    setActiveTab("pending")
  }

  const handleUpdateResults = (resultId, updatedUserResults) => {
    setResults((prevResults) =>
      prevResults.map((result) => (result._id === resultId ? { ...result, results: updatedUserResults } : result)),
    )
  }

  const handleChangeStatus = (resultId, newStatus) => {
    setResults((prevResults) =>
      prevResults.map((result) => (result._id === resultId ? { ...result, status: newStatus } : result)),
    )
  }

  const handlePublishResult = (resultId) => {
    setResults((prevResults) =>
      prevResults.map((result) => (result._id === resultId ? { ...result, published: true } : result)),
    )
  }

  return (
    
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <header className="bg-white dark:bg-slate-950 shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-600 text-white p-2 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-graduation-cap"
                  >
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">LMS Results Management</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="create" className="text-base">
                Create
              </TabsTrigger>
              <TabsTrigger value="pending" className="text-base">
                Pending
              </TabsTrigger>
              <TabsTrigger value="evaluated" className="text-base">
                Evaluated
              </TabsTrigger>
            </TabsList>

            <TabsContent value="create">
              <CreateTab batches={batches} onCreateResult={handleCreateResult} />
            </TabsContent>

            <TabsContent value="pending">
              <PendingTab
                results={results.filter((r) => r.status === "pending")}
                onUpdateResults={handleUpdateResults}
                onChangeStatus={handleChangeStatus}
              />
            </TabsContent>

            <TabsContent value="evaluated">
              <EvaluatedTab
                results={results.filter((r) => r.status === "evaluated")}
                onPublishResult={handlePublishResult}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>
   
  )
}
