"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp, Send, ExternalLink, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { saveAs } from 'file-saver';
import excel from 'exceljs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function EvaluatedTab({ results, onPublishResult, isadmin }) {
  const [openBatches, setOpenBatches] = useState({})
  const [publishModalOpen, setPublishModalOpen] = useState(false)
  const [currentResultId, setCurrentResultId] = useState(null)
  const [stipendUrl, setStipendUrl] = useState("")
  const [urlError, setUrlError] = useState("")

  const toggleBatch = (batchId) => {
    setOpenBatches((prev) => ({
      ...prev,
      [batchId]: !prev[batchId],
    }))
  }

  const handlePublishClick = (resultId) => {
    setCurrentResultId(resultId)
    setStipendUrl("")
    setUrlError("")
    setPublishModalOpen(true)
  }

  const handleConfirmPublish = () => {
    // Simple URL validation
    if (!stipendUrl.trim()) {
      setUrlError("Stipend URL is required")
      return
    }

    // Basic URL format validation
    try {
      new URL(stipendUrl)
      setUrlError("")
    } catch (e) {
      setUrlError("Please enter a valid URL")
      return
    }

    // If validation passes, publish result and close modal
    console.log("Publishing result with stipend URL:", stipendUrl)
    onPublishResult(currentResultId, stipendUrl)
    setPublishModalOpen(false)
  }

  const exportToExcel = async (result) => {
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet("Results");
    
    // Set up columns
    worksheet.columns = [
      { header: "Student Name", key: "name", width: 30 },
      { header: "Email", key: "email", width: 30 },
      { header: "Project Review", key: "projectreview", width: 15 },
      { header: "Viva", key: "viva", width: 15 },
      { header: "Final Project Review", key: "finalprojectreview", width: 20 },
      { header: "Final Viva", key: "finalviva", width: 15 },
      { header: "Attendance", key: "attendance", width: 15 },
      { header: "Social Media", key: "socialmediasharing", width: 15 },
      { header: "Total Marks", key: "totalmarks", width: 15 },
    ];
    
    // Add header with batch info
    worksheet.addRow([`Batch: ${result.batchid.name}`]).eachCell((cell) => {
      cell.font = { bold: true, size: 14 };
    });
    worksheet.addRow([`Domain: ${result.batchid.domain}`]).eachCell((cell) => {
      cell.font = { bold: true };
    });
    worksheet.addRow([`Duration: ${result.duration} onwards`]).eachCell((cell) => {
      cell.font = { bold: true };
    });
    worksheet.addRow([`Total Students: ${result.users.length}`]).eachCell((cell) => {
      cell.font = { bold: true };
    });
    worksheet.addRow([]); // Empty row for spacing
    
    // Add data for each user
    result.users.forEach((user) => {
      const userResult = result.results.find((r) => r._id === user._id) || {
        projectreview: "0",
        viva: "0",
        finalprojectreview: "0",
        finalviva: "0",
        attendance: "0",
        socialmediasharing: "0",
        totalmarks: "0",
      };
      
      worksheet.addRow({
        name: user.name,
        email: user.email,
        projectreview: userResult.projectreview || "0",
        viva: userResult.viva || "0",
        finalprojectreview: userResult.finalprojectreview || "0",
        finalviva: userResult.finalviva || "0",
        attendance: userResult.attendance || "0",
        socialmediasharing: userResult.socialmediasharing || "0",
        totalmarks: userResult.totalmarks || "0",
      });
    });
    
    // Add summary row
    worksheet.addRow([]); // Empty row for spacing
    worksheet.addRow([
      "Average Scores", 
      "",
      (result.results.reduce((sum, r) => sum + (Number.parseFloat(r.projectreview) || 0), 0) / result.results.length).toFixed(2),
      (result.results.reduce((sum, r) => sum + (Number.parseFloat(r.viva) || 0), 0) / result.results.length).toFixed(2),
      (result.results.reduce((sum, r) => sum + (Number.parseFloat(r.finalprojectreview) || 0), 0) / result.results.length).toFixed(2),
      (result.results.reduce((sum, r) => sum + (Number.parseFloat(r.finalviva) || 0), 0) / result.results.length).toFixed(2),
      (result.results.reduce((sum, r) => sum + (Number.parseFloat(r.attendance) || 0), 0) / result.results.length).toFixed(2),
      (result.results.reduce((sum, r) => sum + (Number.parseFloat(r.socialmediasharing) || 0), 0) / result.results.length).toFixed(2),
      (result.results.reduce((sum, r) => sum + (Number.parseFloat(r.totalmarks) || 0), 0) / result.results.length).toFixed(2),
    ]).eachCell((cell) => {
      cell.font = { bold: true };
    });
    
    // Style header rows
    worksheet.getRow(6).eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };
    });
    
    // Generate the file
    const buf = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buf]), `${result.batchid.name}-${result.duration}.xlsx`);
  };

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
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-left">
              <Badge
                variant="outline"
                className={
                  result.status == "published"
                    ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
                    : "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
                }
              >
                {result.status == "published" ? "Published" : "Evaluated"}
              </Badge>
              <h3 className="text-lg font-medium">{result.batchid.name}</h3>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {new Date(result.createdAt).toLocaleDateString()}
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {result.batchid.domain}
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {result.duration} onwards
              </span>
            </div>
            {openBatches[result._id] ? <ChevronUp className="h-5 w-5 flex-shrink-0" /> : <ChevronDown className="h-5 w-5 flex-shrink-0" />}
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
                        <strong>Batch:</strong> {result.batchid.name}
                      </p>
                      <p>
                        <strong>Domain:</strong> {result.batchid.domain}
                      </p>
                      <p>
                        <strong>Duration:</strong> {result.duration} onwards
                      </p>
                      <p>
                        <strong>Total Students:</strong> {result.users.length}
                      </p>
                      <p>
                        <strong>Created On:</strong> {new Date(result.createdAt).toLocaleDateString()}
                      </p>
                      <p>
                        <strong>Status:</strong> {result.status == "published" ? "Published" : "Evaluated"}
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
                    
                    {result.status == "published" && (
                      <div className="mt-6">
                        <Button
                          onClick={() => exportToExcel(result)}
                          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Export to Excel
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 flex items-center justify-end">
                {result.status != "published" && isadmin && (
                  <Button
                    onClick={() => handlePublishClick(result._id)}
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

      {/* Publish Confirmation Modal */}
      <Dialog open={publishModalOpen} onOpenChange={setPublishModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Publish Results</DialogTitle>
            <DialogDescription>
              Please enter the URL where students can find information about their stipends before publishing the results.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="stipendUrl" className="text-sm font-medium">
                Stipend URL
              </Label>
              <div className="flex items-center space-x-2">
                <ExternalLink className="h-4 w-4 text-slate-400" />
                <Input
                  id="stipendUrl"
                  placeholder="https://example.com/stipends"
                  className="flex-1"
                  value={stipendUrl}
                  onChange={(e) => setStipendUrl(e.target.value)}
                />
              </div>
              {urlError && <p className="text-sm text-red-500">{urlError}</p>}
            </div>
            <Alert className="bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
              <AlertDescription className="text-blue-800 dark:text-blue-300 text-sm">
                Publishing results will notify all students about their performance and provide access to stipend information.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <Button variant="outline" onClick={() => setPublishModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmPublish}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Confirm & Publish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}