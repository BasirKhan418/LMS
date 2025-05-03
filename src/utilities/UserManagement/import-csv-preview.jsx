"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Check, X, FileText } from "lucide-react"

export function ImportPreviewModal({ isOpen, onClose, data, onConfirm }) {
  // Limit preview to first 10 rows
  const previewData = data.slice(0, 10)
  const totalRows = data.length
  

  // Get all unique keys from the data for table headers
  const allKeys = previewData.reduce((keys, item) => {
    Object.keys(item).forEach((key) => {
      if (!keys.includes(key) && key !== "id") {
        keys.push(key)
      }
    })
    return keys
  }, [])

  // Sort keys to ensure consistent order
  const sortedKeys = ["name", "email", "domain", "ispaid", "gender", "number", "month"].concat(
    allKeys.filter((key) => !["name", "email", "domain", "ispaid", "gender", "number", "month", "id"].includes(key)),
  )
 

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden bg-white max-h-[80vh]">
        <DialogHeader className="px-6 pt-6 pb-2 bg-gradient-to-r from-slate-50 to-slate-100 border-b">
          <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            CSV Import Preview
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 border-b">
          <p className="text-slate-600">
            {totalRows} records found in the CSV file. Please review the data below before importing.
            {totalRows > 10 && " (Showing first 10 records)"}
          </p>
        </div>

        <ScrollArea className="max-h-[50vh] overflow-y-auto custom-scrollbar">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  {sortedKeys.map((key) => (
                    <TableHead key={key} className="font-semibold whitespace-nowrap">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewData.map((item, index) => (
                  <TableRow key={index} className="hover:bg-slate-50">
                    {sortedKeys.map((key) => (
                      <TableCell key={`${index}-${key}`} className="whitespace-nowrap">
                        {key === "ispaid"
                          ? item[key]
                            ? "Yes"
                            : "No"
                          : item[key] !== undefined
                            ? String(item[key])
                            : "-"}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ScrollArea>

        <DialogFooter className="px-6 py-4 bg-slate-50 border-t flex flex-row justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose} className="gap-2">
            <X className="h-4 w-4" /> Cancel
          </Button>
          <Button type="button" onClick={() => onConfirm(data)} className="gap-2 bg-slate-800 hover:bg-slate-700">
            <Check className="h-4 w-4" /> Import Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

