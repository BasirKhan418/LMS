"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, Send } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

export default function EvaluatedTab({ results, onPublishResult }) {
  const [openBatches, setOpenBatches] = useState({})

  const toggleBatch = (batchId) => {
    setOpenBatches((prev) => ({
      ...prev,
      [batchId]: !prev[batchId],
    }))
  }

  if (results.length === 0) {
    return (
      <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
        <AlertDescription className="text-blue-800 dark:text-blue-300">
          No evaluated results found. Evaluate results from the Pending tab.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Evaluated Results</h2>

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
                className={
                  result.published
                    ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
                    : "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
                }
              >
                {result.published ? "Published" : "Evaluated"}
              </Badge>
              <h3 className="text-lg font-medium">{result.batchName}</h3>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {new Date(result.createdAt).toLocaleDateString()}
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
                    {result.users.map((user) => {
                      const userResult = result.results.find((r) => r._id === user._id) || {
                        projectreview: "0",
                        viva: "0",
                        finalprojectreview: "0",
                        finalviva: "0",
                        attendance: "0",
                        socialmediasharing: "0",
                        totalmarks: "0",
                      }

                      const totalMarks = Number.parseFloat(userResult.totalmarks) || 0
                      const percentage = (totalMarks / 60) * 100

                      return (
                        <Card key={user._id} className="mb-4 border border-slate-200 dark:border-slate-800">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base font-medium">{user.name}</CardTitle>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                              <div>
                                <span className="text-xs font-medium block mb-1">Project Review</span>
                                <p className="font-medium">{userResult.projectreview || "0"}/10</p>
                              </div>
                              <div>
                                <span className="text-xs font-medium block mb-1">Viva</span>
                                <p className="font-medium">{userResult.viva || "0"}/5</p>
                              </div>
                              <div>
                                <span className="text-xs font-medium block mb-1">Final Project Review</span>
                                <p className="font-medium">{userResult.finalprojectreview || "0"}/30</p>
                              </div>
                              <div>
                                <span className="text-xs font-medium block mb-1">Final Viva</span>
                                <p className="font-medium">{userResult.finalviva || "0"}/5</p>
                              </div>
                              <div>
                                <span className="text-xs font-medium block mb-1">Attendance</span>
                                <p className="font-medium">{userResult.attendance || "0"}/5</p>
                              </div>
                              <div>
                                <span className="text-xs font-medium block mb-1">Social Media</span>
                                <p className="font-medium">{userResult.socialmediasharing || "0"}/5</p>
                              </div>
                            </div>

                            <div className="mt-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium">Total Marks:</span>
                                <span className="text-lg font-bold">{userResult.totalmarks || "0"}/60</span>
                              </div>
                              <Progress value={percentage} className="h-2" />
                              <div className="flex justify-between mt-1">
                                <span className="text-xs text-slate-500">0%</span>
                                <span className="text-xs text-slate-500">100%</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="summary">
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-3">Batch Summary</h3>
                    <div className="space-y-2">
                      <p>
                        <strong>Batch:</strong> {result.batchName}
                      </p>
                      <p>
                        <strong>Total Students:</strong> {result.users.length}
                      </p>
                      <p>
                        <strong>Created On:</strong> {new Date(result.createdAt).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Status:</strong> {result.published ? "Published" : "Evaluated"}
                      </p>
                    </div>

                    {result.results.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Performance Overview</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white dark:bg-slate-800 p-3 rounded-lg">
                            <p className="text-sm text-slate-500 dark:text-slate-400">Average Score</p>
                            <p className="text-xl font-bold">
                              {(
                                result.results.reduce((sum, r) => sum + (Number.parseFloat(r.totalmarks) || 0), 0) /
                                result.results.length
                              ).toFixed(1)}
                              /60
                            </p>
                          </div>
                          <div className="bg-white dark:bg-slate-800 p-3 rounded-lg">
                            <p className="text-sm text-slate-500 dark:text-slate-400">Highest Score</p>
                            <p className="text-xl font-bold">
                              {Math.max(...result.results.map((r) => Number.parseFloat(r.totalmarks) || 0))}/60
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 flex items-center justify-end">
                {!result.published && (
                  <Button
                    onClick={() => onPublishResult(result._id)}
                    className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Publish Results
                  </Button>
                )}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  )
}
