"use client"

import { useState } from "react"
import { Check, Link2, Star, X, FileText, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ProjectDialog({ initialProject,open,setOpen } = {}) {

const [project, setProject] = useState({
    title: initialProject?.title || "",
    description: initialProject?.description || "",
    link: initialProject?.link || "",
    extraLink: initialProject?.extraLink || "",
    evaluation: initialProject?.evaluation || 0,
})

  const handleChange = (e) => {
    const { name, value } = e.target
    setProject((prev) => ({
      ...prev,
      [name]: name === "evaluation" ? Number(value) : value,
    }))
  }

  const handleSubmit = () => {

    setOpen(false)
  }

  // Generate stars for rating visualization
  const renderStars = () => {
    const stars = []
    for (let i = 1; i <= 10; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-5 w-5 cursor-pointer transition-all duration-200 ${
            i <= project.evaluation ? "fill-amber-500 text-amber-500" : "text-gray-300"
          }`}
          onClick={() => setProject((prev) => ({ ...prev, evaluation: i }))}
        />,
      )
    }
    return stars
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      
      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden rounded-xl border-0 shadow-2xl">
        <div className="bg-gradient-to-r from-violet-500 to-indigo-600 p-6 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Project Details</DialogTitle>
            <DialogDescription className="text-violet-100 opacity-90 mt-1">
              View  the details of user's project
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6">
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium flex items-center">
                <Info className="h-4 w-4 mr-1 text-violet-500" />
                Project Title
              </Label>
              <Input
                id="title"
                name="title"
                value={initialProject.title}
                onChange={handleChange}
                className="border-violet-200 focus:border-violet-500 focus:ring-violet-500 transition-all"
                placeholder="Enter project title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium flex items-center">
                <FileText className="h-4 w-4 mr-1 text-violet-500" />
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={initialProject.description}
                onChange={handleChange}
                className="border-violet-200 focus:border-violet-500 focus:ring-violet-500 min-h-[100px] transition-all"
                placeholder="Describe your project in detail"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="link" className="text-sm font-medium flex items-center">
                  <Link2 className="h-4 w-4 mr-1 text-violet-500" />
                  Main Link
                </Label>
                <Input
                  id="link"
                  name="link"
                  value={initialProject.link}
                  onChange={handleChange}
                  className="border-violet-200 focus:border-violet-500 focus:ring-violet-500 transition-all"
                  placeholder="https://example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="extraLink" className="text-sm font-medium flex items-center">
                  <Link2 className="h-4 w-4 mr-1 text-violet-500" />
                  Extra Link
                </Label>
                <Input
                  id="extraLink"
                  name="extraLink"
                  value={initialProject.extraLink}
                  onChange={handleChange}
                  className="border-violet-200 focus:border-violet-500 focus:ring-violet-500 transition-all"
                  placeholder="https://github.com/example"
                />
              </div>
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="evaluation" className="text-sm font-medium flex items-center">
                <Star className="h-4 w-4 mr-1 text-violet-500" />
                Evaluation Score
              </Label>
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">{renderStars()}</div>
                <Badge variant="outline" className="ml-2 bg-violet-50 text-violet-700 border-violet-200">
                  {project.evaluation}/10
                </Badge>
              </div>
            </div> */}
          </div>
        </div>

        {/* <Card className="m-6 mt-0 p-4 bg-gray-50 border-gray-100 rounded-lg">
          <div className="text-sm text-gray-500 flex items-start">
            <Info className="h-4 w-4 mr-2 mt-0.5 text-violet-500" />
            <span>
              Update your project details and click save when you're done. All changes will be automatically saved to
              your profile.
            </span>
          </div>
        </Card> */}

        <DialogFooter className="px-6 pb-6 pt-0 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all"
          >
            <X className="mr-1 h-4 w-4" />
            Cancel
          </Button>
          {/* <Button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 text-white transition-all"
          >
            <Check className="mr-1 h-4 w-4" />
            Save Changes
          </Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
