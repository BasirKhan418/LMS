"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog"
import CreateTab from "@/utilities/AdminResults/create-tab"
import PendingTab from "@/utilities/AdminResults/pending-tab"
import EvaluatedTab from "@/utilities/AdminResults/evaluated-tab"
import ProfilePageSkeleton from "@/utilities/skeleton/ProfilePageSkeleton"
import { Toaster, toast } from "sonner"

export default function ResultsPage() {
  const [activeTab, setActiveTab] = useState("create")
  const [isLoading, setIsLoading] = useState(false)
  const [batches, setBatches] = useState([])
  const [results, setResults] = useState([])
  const [pendingResults, setPendingResults] = useState([])
  const [evaluatedResults, setEvaluatedResults] = useState([])
  
  // Alert dialog state
  const [alertOpen, setAlertOpen] = useState(false)
  const [alertConfig, setAlertConfig] = useState({
    title: "",
    description: "",
    actionText: "Confirm",
    onConfirm: () => {},
  })

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
            setEvaluatedResults(res.results.filter((r) => r.status === "evaluated" || r.status === "published"))
        } else {
            toast.warning(res.message)
        }
    }
    catch(err){
        console.log(err)
        toast.error("Something went wrong while fetching results")
    }
  }
  
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

  const handleUpdateResults = async(resultId, updatedUserResults) => {
   try{
    setIsLoading(true)
     const res = await fetch(`/api/resultcrud`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${localStorage.getItem("dilmsadmintoken")}`,
      },
      body: JSON.stringify({ resultid:resultId, updatedresults:updatedUserResults }),
     })
     setIsLoading(false)
     const data = await res.json()
     if(data.success){
      toast.success(data.message)
      fetchResults()
     }
     else{
      toast.error(data.message)
     }
   }
   catch(err){
    console.log(err)
    toast.error("Something went wrong while updating results")
   }
  }

  const showConfirmationDialog = (title, description, actionText, onConfirm) => {
    setAlertConfig({
      title,
      description,
      actionText,
      onConfirm,
    })
    setAlertOpen(true)
  }

  const handleChangeStatus = async(resultId, newStatus) => {
    showConfirmationDialog(
      "Change Status",
      "Are you sure you want to change the status of this result?",
      "Change Status",
      async () => {
        try{
          setIsLoading(true)
          const res = await fetch(`/api/resultcrud/updatestatus`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `${localStorage.getItem("dilmsadmintoken")}`,
            },
            body: JSON.stringify({ resultid: resultId, status: newStatus }),
          })
          setIsLoading(false)
          const data = await res.json()
          if(data.success){
            toast.success(data.message)
            fetchResults()
          }
          else{
            toast.error(data.message)
          }
        }
        catch(err){
          console.log(err)
          toast.error("Something went wrong while changing status")
        }
      }
    )
  }

  const handlePublishResult = async(resultId, url) => {
    showConfirmationDialog(
      "Publish Result",
      "Are you sure you want to publish this result?",
      "Publish",
      async () => {
        try{
          setIsLoading(true)
          const data = await fetch(`/api/resultcrud/updatestatus`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `${localStorage.getItem("dilmsadmintoken")}`,
            },
            body: JSON.stringify({ resultid: resultId, status: "published", url }),
          })
          const res = await data.json()
          setIsLoading(false)
          if(res.success){
            toast.success(res.message)
            fetchResults()
          }
          else{
            toast.error(res.message)
          }
        }
        catch(err){
          console.log(err)
          toast.error("Something went wrong while publishing results")
        }
      }
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
                isadmin={true}
              />
            </TabsContent>
          </Tabs>

          {/* Alert Dialog Component */}
          <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
            <AlertDialogContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-xl text-slate-900 dark:text-white">
                  {alertConfig.title}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-slate-500 dark:text-slate-400">
                  {alertConfig.description}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-0">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-purple-600 hover:bg-purple-700 text-white" 
                  onClick={() => {
                    alertConfig.onConfirm();
                    setAlertOpen(false);
                  }}
                >
                  {alertConfig.actionText}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </main>
      </div>
    )
  )
}