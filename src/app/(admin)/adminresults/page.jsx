"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CreateTab from "@/utilities/AdminResults/create-tab"
import PendingTab from "@/utilities/AdminResults/pending-tab"
import EvaluatedTab from "@/utilities/AdminResults/evaluated-tab"
import ProfilePageSkeleton from "@/utilities/skeleton/ProfilePageSkeleton"
import { Toaster,toast } from "sonner"
export default function ResultsPage() {
  const [activeTab, setActiveTab] = useState("create")
  const [isLoading, setIsLoading] = useState(false)
  const [batches, setBatches] = useState([])

  const [results, setResults] = useState([])
  const [pendingResults, setPendingResults] = useState([])
    const [evaluatedResults, setEvaluatedResults] = useState([])
  //fetching batch from the db

  const fetchBatches = async () => {
    setBatches([])
    try{
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
    catch(err){
      console.log(err)
      toast.error("Something went wrong while fetching batches")
    }
  }
  //end of fetching batch from the db
  const fetchResults = async () => {
    try{
        setIsLoading(true)
        const data = await fetch("/api/resultcrud", {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `${localStorage.getItem("dilmsadmintoken")}`,
            },
        })
        const res = await data.json()
        setIsLoading(false)
        if (res.success) {
            setResults(res.results)
            setPendingResults(res.results.filter((r) => r.status === "pending"))
            setEvaluatedResults(res.results.filter((r) => r.status === "evaluated"))
        } else {
            toast.warning(res.message)
        }
    }
    catch(err){
        console.log(err)
        toast.error("Something went wrong while fetching results")
    }
  }
  //find 
  useEffect(() => {
    // Load results from localStorage if available
    const savedResults = localStorage.getItem("lmsResults")
    if (savedResults) {
      setResults(JSON.parse(savedResults))
    }
    fetchBatches();
    fetchResults();
  }, [])

  useEffect(() => {
    // Save results to localStorage whenever they change
    localStorage.setItem("lmsResults", JSON.stringify(results))
  }, [results])

  const handleCreateResult = async(batchId) => {
    try{
        setIsLoading(true)
        const data = await fetch("/api/resultcrud", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            "Authorization": `${localStorage.getItem("dilmsadmintoken")}`,
            },
            body: JSON.stringify({ batchid: batchId }),
        })
        const res = await data.json()
        setIsLoading(false)
        if (res.success) {
            toast.success(res.message)
            fetchResults()
        } else {
            toast.warning(res.message)
        }   
    }
    catch(err){
        
        console.log(err)
        setIsLoading(false)
        toast.error("Something went wrong while creating results")
    }
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
    isLoading ? (
      <ProfilePageSkeleton />
    ) : (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <Toaster richColors position="top-center" closeButton />
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
                results={pendingResults}
                onUpdateResults={handleUpdateResults}
                onChangeStatus={handleChangeStatus}
              />
            </TabsContent>

            <TabsContent value="evaluated">
              <EvaluatedTab
                results={evaluatedResults}
                onPublishResult={handlePublishResult}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    )
  )
}