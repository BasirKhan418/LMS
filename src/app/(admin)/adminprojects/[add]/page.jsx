
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import Chat from "@/utilities/Ai/Chat"
export default function Page({params}) {
  const [activeTab, setActiveTab] = useState("create")
  const [aiopen,setaiopen] = useState(false)
  return (
    <div className="w-full min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Projects</h1>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button
              variant={activeTab === "create" ? "primary" : "outline"}
              onClick={() => setActiveTab("create")}
              className="px-4 py-2 rounded-md text-sm font-medium"
            >
              Create Project
            </Button>
            <Button
              variant={activeTab === "created" ? "primary" : "outline"}
              onClick={() => setActiveTab("created")}
              className="px-4 py-2 rounded-md text-sm font-medium"
            >
              Projects Created
            </Button>
            <Button
              variant={activeTab === "submitted" ? "primary" : "outline"}
              onClick={() => setActiveTab("submitted")}
              className="px-4 py-2 rounded-md text-sm font-medium"
            >
              Projects Submitted
            </Button>
            <Button
              variant={activeTab === "evaluated" ? "primary" : "outline"}
              onClick={() => setActiveTab("evaluated")}
              className="px-4 py-2 rounded-md text-sm font-medium"
            >
              Projects Evaluated
            </Button>
          </div>
        </div>
        {activeTab === "create" && (
          <Card className="shadow-lg rounded-lg">
            <CardHeader className="bg-card p-6">
              <CardTitle className="text-lg font-bold">Create Project</CardTitle>
              <CardDescription className="text-muted-foreground">
                Fill out the form to create a new Project.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="Assignment Title"
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="due-date" className="text-sm font-medium">
                    Due Date
                  </Label>
                  <Input
                    id="due-date"
                    type="date"
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div className="grid gap-2 col-span-1 md:col-span-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    rows={4}
                    placeholder="Assignment Description"
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div className="grid gap-2 col-span-1 md:col-span-2">
                  <Label htmlFor="attachments" className="text-sm font-medium">
                    Attachments
                  </Label>
                  <Input
                    id="attachments"
                    type="file"
                    multiple
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter className="bg-card p-6">
              <Button type="submit" className="px-4 py-2 rounded-md text-sm font-medium">
                Create Project
              </Button>
              <Button type="submit" className="px-4 py-2 rounded-md text-sm font-medium mx-2">
                Create by DI-Nxt Ai
              </Button>
            </CardFooter>
          </Card>
        )}
        {activeTab === "created" && (
          <Card className="shadow-lg rounded-lg">
            <CardHeader className="bg-card p-6">
              <CardTitle className="text-lg font-bold">Projects Created</CardTitle>
              <CardDescription className="text-muted-foreground">
                View and manage the projects you have created.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-sm font-medium">Title</TableHead>
                    <TableHead className="text-sm font-medium">Due Date</TableHead>
                    <TableHead className="text-sm font-medium">Status</TableHead>
                    <TableHead className="text-sm font-medium text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Midterm Exam</TableCell>
                    <TableCell>2023-05-15</TableCell>
                    <TableCell>
                      <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        Published
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="px-2 py-1 rounded-md text-sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="ml-2 px-2 py-1 rounded-md text-sm">
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Final Project</TableCell>
                    <TableCell>2023-06-30</TableCell>
                    <TableCell>
                      <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                        Draft
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="px-2 py-1 rounded-md text-sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="ml-2 px-2 py-1 rounded-md text-sm">
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
        {activeTab === "submitted" && (
          <Card className="shadow-lg rounded-lg">
            <CardHeader className="bg-card p-6">
              <CardTitle className="text-lg font-bold">Projects Submitted</CardTitle>
              <CardDescription className="text-muted-foreground">
                Review and grade the projects submitted by students.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-sm font-medium">Student</TableHead>
                    <TableHead className="text-sm font-medium">Assignment</TableHead>
                    <TableHead className="text-sm font-medium">Submitted</TableHead>
                    <TableHead className="text-sm font-medium">Grade</TableHead>
                    <TableHead className="text-sm font-medium text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">John Doe</TableCell>
                    <TableCell>Midterm Exam</TableCell>
                    <TableCell>2023-05-14</TableCell>
                    <TableCell>
                      <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">A</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="px-2 py-1 rounded-md text-sm">
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="ml-2 px-2 py-1 rounded-md text-sm">
                        Grade
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Jane Smith</TableCell>
                    <TableCell>Final Project</TableCell>
                    <TableCell>2023-06-29</TableCell>
                    <TableCell>
                      <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">B</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="px-2 py-1 rounded-md text-sm">
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="ml-2 px-2 py-1 rounded-md text-sm">
                        Grade
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
        {activeTab === "evaluated" && (
          <Card className="shadow-lg rounded-lg">
            <CardHeader className="bg-card p-6">
              <CardTitle className="text-lg font-bold">Projects Evaluated</CardTitle>
              <CardDescription className="text-muted-foreground">
                View and manage the projects that have been evaluated.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-sm font-medium">Student</TableHead>
                    <TableHead className="text-sm font-medium">Assignment</TableHead>
                    <TableHead className="text-sm font-medium">Submitted</TableHead>
                    <TableHead className="text-sm font-medium">Grade</TableHead>
                    <TableHead className="text-sm font-medium text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">John Doe</TableCell>
                    <TableCell>Midterm Exam</TableCell>
                    <TableCell>2023-05-14</TableCell>
                    <TableCell>
                      <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">A</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="px-2 py-1 rounded-md text-sm">
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="ml-2 px-2 py-1 rounded-md text-sm">
                        Edit Grade
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Jane Smith</TableCell>
                    <TableCell>Final Project</TableCell>
                    <TableCell>2023-06-29</TableCell>
                    <TableCell>
                      <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">B</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="px-2 py-1 rounded-md text-sm">
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="ml-2 px-2 py-1 rounded-md text-sm">
                        Edit Grade
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
      <Button className="flex items-center gap-2 fixed lg:bottom-4 lg:right-4 md:bottom-4 md:right-4 bottom-2 right-2 rounded-full lg:py-8 md:py-8 py-8 " size="lg" onClick={()=>{
      setaiopen(!aiopen)
    }}>
      <MessageCircleIcon className="h-5 w-5" />
      Chat with AI
    </Button>
   
<Chat aiopen={aiopen} setaiopen={setaiopen}/>
    </div>
  )
}
function MessageCircleIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  )
}