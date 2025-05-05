"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Download, Upload, FileWarning, FileCheck } from "lucide-react"
import { toast,Toaster } from "sonner"

// Import the ImportPreviewModal component at the top
import {ImportPreviewModal }from "./import-csv-preview"

export function ImportCSV({ onImport, users }) {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [isDragging, setIsDragging] = useState(false)

  // Add state for preview modal and parsed data
  const [previewData, setPreviewData] = useState([])
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    processFile(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file && file.type === "text/csv") {
      processFile(file)
    } else {
      setErrorMessage("Please upload a CSV file")
      setIsErrorDialogOpen(true)
    }
  }

  // Update the processFile function to show preview instead of immediately importing
  const processFile = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const csvData = e.target?.result
        const importedUsers = parseCSV(csvData)

        if (importedUsers.length === 0) {
          throw new Error("No valid data found in the CSV file")
        }

        // Show preview instead of importing directly
        setPreviewData(importedUsers)
        setIsPreviewOpen(true)
        setIsImportDialogOpen(false)
      } catch (error) {
        setErrorMessage(error.message)
        setIsErrorDialogOpen(true)
      }
    }

    reader.readAsText(file)
  }

  // Add a function to handle confirmation from preview
  const handleConfirmImport = (data) => {
    onImport(data)
    setIsPreviewOpen(false)

    toast.success("Users imported successfully")
    setIsImportDialogOpen(false)
  }

  const parseCSV = (csvData) => {
    const lines = csvData.split("\n");
    const headers = lines[0].split(",").map((header) => header.trim());
  
    // Validate headers
    const requiredHeaders = ["name", "email", "domain", "gender", "number", "month", "ispaid"];
    const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header));
  
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required headers: ${missingHeaders.join(", ")}`);
    }
  
    const users = [];
  
    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
  
      const values = lines[i].split(",").map((value) => value.trim());
  
      if (values.length !== headers.length) {
        throw new Error(`Line ${i + 1} has an incorrect number of values`);
      }
  
      const user = {
        id: `imported-${Date.now()}-${i}`,
      };
  
      headers.forEach((header, index) => {
        if (header === "ispaid") {
          user[header] = values[index].toLowerCase() === "true";
        } else if (header === "startdate" && values[index]) {
          // Convert date from DD-MM-YYYY to a proper Date object
          try {
            const [day, month, year] = values[index].split("-");
            // Create date as YYYY-MM-DD format (month is 1-indexed in the input)
            const dateObj = new Date(`${year}-${month}-${day}`);
            
            // Check if the date is valid
            if (isNaN(dateObj.getTime())) {
              throw new Error(`Invalid date format at line ${i + 1}: ${values[index]}`);
            }
            
            user[header] = dateObj;
          } catch (error) {
            throw new Error(`Failed to parse date at line ${i + 1}: ${values[index]}, ${error.message}`);
          }
        } else {
          user[header] = values[index];
        }
      });
  
      // Set default values for missing fields
      if (user.ispaid === undefined) user.ispaid = false;
  
      users.push(user);
    }
  
    return users;
  };

  const downloadSampleCSV = () => {
    const headers = [
      "name",
      "email",
      "domain",
      "ispaid",
      "gender",
      "number",
      "month",
      "paymentid",
      "orderid",
      "startdate",
    ]
    const sampleData = [
      "John Doe,john@example.com,example.com,true,Male,+1234567890,1 month,pay_123456,ord_123456,22-10-2025",
      "Jane Smith,jane@test.com,test.com,false,Female,+0987654321,3 months,pay_654321,ord_654321,22-05-2025",
    ]

    const csvContent = [headers.join(","), ...sampleData].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = "sample_users.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <>
    <Toaster richColors position="top-right" closeButton={false} />
      <div className="flex gap-2">
        <Button
          onClick={() => setIsImportDialogOpen(true)}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700"
        >
          <Upload className="h-4 w-4" />
          Import CSV
        </Button>
        <Button
          variant="outline"
          onClick={downloadSampleCSV}
          className="flex items-center gap-2 border-slate-300 hover:bg-slate-50"
        >
          <Download className="h-4 w-4" />
          Sample CSV
        </Button>
      </div>

      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-800">Import Users from CSV</DialogTitle>
            <DialogDescription className="text-slate-600">
              Upload a CSV file with user data or drag and drop it below.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                isDragging ? "border-slate-500 bg-slate-50" : "border-slate-300"
              } transition-colors`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center gap-3">
                <Upload className="h-10 w-10 text-slate-400" />
                <p className="text-sm text-slate-600">Drag and drop your CSV file here, or click to browse</p>
                <Input type="file" accept=".csv" onChange={handleFileUpload} className="max-w-xs" />
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <FileCheck className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800">
                <p className="font-medium">Required Format</p>
                <p className="mt-1">
                  Your CSV must include headers for: name, email, domain, gender, phone, and duration. Download the
                  sample CSV to see the exact format.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="outline" onClick={downloadSampleCSV} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Sample CSV
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl text-red-600 flex items-center gap-2">
              <FileWarning className="h-5 w-5" /> Import Error
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">{errorMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsErrorDialogOpen(false)} className="bg-slate-800 hover:bg-slate-700">
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ImportPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        data={previewData}
        onConfirm={handleConfirmImport}
      />
    </>
  )
}

