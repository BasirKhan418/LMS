"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, ChevronUp, RefreshCw, Save } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {toast }from "sonner"
export default function PendingTab({ results, onUpdateResults, onChangeStatus }) {
  const [openBatches, setOpenBatches] = useState({})
  const [userResults, setUserResults] = useState({})

  const toggleBatch = (batchId) => {
    setOpenBatches((prev) => ({
      ...prev,
      [batchId]: !prev[batchId],
    }))

    // Initialize user results if not already done
    if (!userResults[batchId]) {
      const result = results.find((r) => r._id === batchId)
      if (result) {
        const initialResults = {}
        result.users.forEach((user) => {
          const existingResult = result.results.find((r) => r._id === user._id)
          initialResults[user._id] = existingResult || {
            _id: user._id,
            projectreview: "",
            viva: "",
            finalprojectreview: "",
            finalviva: "",
            attendance: "",
            socialmediasharing: "",
            totalmarks: "",
          }
        })
        setUserResults((prev) => ({
          ...prev,
          [batchId]: initialResults,
        }))
      }
    }
  }

  const handleInputChange = (batchId, userId, field, value) => {
    setUserResults((prev) => {
      const updatedBatchResults = {
        ...prev[batchId],
        [userId]: {
          ...prev[batchId][userId],
          [field]: value,
        },
      }

      // Calculate total marks
      if (
        ["projectreview", "viva", "finalprojectreview", "finalviva", "attendance", "socialmediasharing"].includes(field)
      ) {
        const userResult = updatedBatchResults[userId]
        const total =
          (Number.parseFloat(userResult.projectreview) || 0) +
          (Number.parseFloat(userResult.viva) || 0) +
          (Number.parseFloat(userResult.finalprojectreview) || 0) +
          (Number.parseFloat(userResult.finalviva) || 0) +
          (Number.parseFloat(userResult.attendance) || 0) +
          (Number.parseFloat(userResult.socialmediasharing) || 0)

        updatedBatchResults[userId].totalmarks = total.toString()
      }

      return {
        ...prev,
        [batchId]: updatedBatchResults,
      }
    })
  }

  const fetchAutomatedMarks = async(batchId, userId) => {
    try{
    const res = await fetch("/api/resultcrud/automatedmark", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Token": localStorage.getItem("dilmsadmintoken"),
      },
      body: JSON.stringify({
        batchid: batchId,
        userid: userId,
      }),
    })
    const data = await res.json()
    if(data.success){
      toast.success("Automated marks fetched successfully for "+userId)
      handleInputChange(batchId, userId, "attendance", data.attendance.toString())
      handleInputChange(batchId, userId, "socialmediasharing", data.socialmedia.toString())
    }
    else{
      toast.error("Error fetching automated marks")
    }
    }
    catch(err){
      console.log(err)
      toast.error("Error fetching automated marks")
    }


  }

  const handleSubmit = (batchId, status) => {
    const batchResults = userResults[batchId]
    if (batchResults) {
      const updatedResults = Object.values(batchResults)
      onUpdateResults(batchId, updatedResults)

      if (status) {
        onChangeStatus(batchId, status)
      }
    }
  }

  if (results.length === 0) {
    return (
      <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
        <AlertDescription className="text-amber-800 dark:text-amber-300">
          No pending results found. Create a new result from the Create tab.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Pending Results</h2>

      {results.map((result) => (
        <Collapsible
          key={result._id}
          open={openBatches[result._id]}
          onOpenChange={() => toggleBatch(result._id)}
          className="bg-white dark:bg-slate-950 rounded-lg shadow-md border border-slate-200 dark:border-slate-800 overflow-hidden"
        >
          <CollapsibleTrigger className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
            <div className="flex items-center space-x-3">
              <Badge
                variant="outline"
                className="bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800"
              >
                Pending
              </Badge>
              <h3 className="text-lg font-medium">{result.batchid.name}</h3>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {new Date(result.createdAt).toLocaleDateString()}
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {result.batchid.domain}
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Duration :- {result.duration} onwards
              </span>
            </div>
            {openBatches[result._id] ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </CollapsibleTrigger>

          <CollapsibleContent>
            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
              <Tabs defaultValue="users">
                <TabsList className="mb-4">
                  <TabsTrigger value="users">Users</TabsTrigger>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                </TabsList>

                <TabsContent value="users">
                  <ScrollArea className="h-[500px] pr-4">
                    {result.users.map((user) => (
                      <Card key={user._id} className="mb-4 border border-slate-200 dark:border-slate-800">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base font-medium flex items-center justify-between">
                            <span>{user.name}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => fetchAutomatedMarks(result._id, user._id)}
                              className="text-xs flex items-center gap-1"
                            >
                              <RefreshCw className="h-3 w-3" />
                              Fetch Automated Marks
                            </Button>
                          </CardTitle>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Email:- {user.email}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Duration:- {user.month}</p>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            <div>
                              <label className="text-xs font-medium block mb-1">
                                Project Review <span className="text-slate-500">(out of 10)</span>
                              </label>
                              <Input
                                type="number"
                                min="0"
                                max="10"
                                value={userResults[result._id]?.[user._id]?.projectreview || ""}
                                onChange={(e) =>
                                  handleInputChange(result._id, user._id, "projectreview", e.target.value)
                                }
                                className="h-8"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium block mb-1">
                                Viva <span className="text-slate-500">(out of 5)</span>
                              </label>
                              <Input
                                type="number"
                                min="0"
                                max="5"
                                value={userResults[result._id]?.[user._id]?.viva || ""}
                                onChange={(e) => handleInputChange(result._id, user._id, "viva", e.target.value)}
                                className="h-8"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium block mb-1">
                                Final Project Review <span className="text-slate-500">(out of 30)</span>
                              </label>
                              <Input
                                type="number"
                                min="0"
                                max="30"
                                value={userResults[result._id]?.[user._id]?.finalprojectreview || ""}
                                onChange={(e) =>
                                  handleInputChange(result._id, user._id, "finalprojectreview", e.target.value)
                                }
                                className="h-8"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium block mb-1">
                                Final Viva <span className="text-slate-500">(out of 5)</span>
                              </label>
                              <Input
                                type="number"
                                min="0"
                                max="5"
                                value={userResults[result._id]?.[user._id]?.finalviva || ""}
                                onChange={(e) => handleInputChange(result._id, user._id, "finalviva", e.target.value)}
                                className="h-8"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium block mb-1">
                                Attendance <span className="text-slate-500">(out of 5)</span>
                              </label>
                              <Input
                                type="number"
                                min="0"
                                max="5"
                                value={userResults[result._id]?.[user._id]?.attendance || ""}
                                onChange={(e) => handleInputChange(result._id, user._id, "attendance", e.target.value)}
                                className="h-8"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium block mb-1">
                                Social Media <span className="text-slate-500">(out of 5)</span>
                              </label>
                              <Input
                                type="number"
                                min="0"
                                max="5"
                                value={userResults[result._id]?.[user._id]?.socialmediasharing || ""}
                                onChange={(e) =>
                                  handleInputChange(result._id, user._id, "socialmediasharing", e.target.value)
                                }
                                className="h-8"
                              />
                            </div>
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            <div>
                              <span className="text-sm font-medium">Total Marks:</span>
                              <span className="ml-2 text-lg font-bold">
                                {userResults[result._id]?.[user._id]?.totalmarks || "0"}/60
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="summary">
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-3">Batch Summary</h3>
                    <div className="space-y-2">
                      <p>
                        <strong>Batch:</strong> {result.batchid.name}
                      </p>
                      <p>
                        <strong>Total Students:</strong> {result.users.length}
                      </p>
                      <p>
                        <strong>Created On:</strong> {new Date(result.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Select onValueChange={(value) => handleSubmit(result._id, value)} defaultValue="pending">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Change status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Keep as Pending</SelectItem>
                      <SelectItem value="evaluated">Mark as Evaluated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => toggleBatch(result._id)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleSubmit(result._id)}
                    className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  )
}
