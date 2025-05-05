"use client"

import { useState, use, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import Chat from "@/utilities/Ai/Chat"
import { Toaster, toast } from "sonner"
import HomePageSkl from "@/utilities/skeleton/HomePageSkl"
import { ProjectDialog } from "@/utilities/dialog/project-dialog"

export default function Page({params}) {
  const tdata = use(params)
  
  const [activeTab, setActiveTab] = useState("create")
  const [aiopen, setaiopen] = useState(false)
  const [modalOpendata, setModalOpendata] = useState({})
  //project state's
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState("");
  const [projectData, setProjectData] = useState([]); //state for getting project data from db
  const [loading, setLoading] = useState(false); //loading state for adding project on db
  const [submittedProjectData, setSubmittedProjectData] = useState([]); //state for getting project data from db
  const [open, setOpen] = useState(false)

  //handle submit function
  const handleSubmit = async (e) => {
    e.preventDefault()
    const projectData = {
      title: title,
      link: link,
      desc: description,
      link2: attachments,
      crid: tdata.add
    }
    try {
      setLoading(true)
      const res = await fetch("/api/project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Token: `${localStorage.getItem("dilmsadmintoken")}`,
        },
        body: JSON.stringify(projectData),
      })
      const data = await res.json()
      setLoading(false)
      if (data.success) {
        toast.success(data.message)
        setTitle("")
        setLink("")
        setDescription("")
        setAttachments("")
        fetchProjects()
      } else {
        toast.error(data.message)
      }
    }
    catch(err) {
      setLoading(false)
      toast.error("Something went wrong please try again after some time")
    }
  }

  // fetch all the projects of the course
  const fetchProjects = async () => {
    try {
      const res = await fetch(`/api/project?id=${tdata.add}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Token: `${localStorage.getItem("dilmsadmintoken")}`,
        },
      })
      const data = await res.json()
      if (data.success) {
        setTitle(data.data[0].title)
        setLink(data.data[0].link)
        setDescription(data.data[0].desc)
        setAttachments(data.data[0].link2)
        setProjectData(data.data)
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      toast.error("Something went wrong please try again after some time")
    }
  }

  // fetch all the submitted projects of the course
  const fetchSubmittedProjects = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/project/submitted?id=${tdata.add}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Token: `${localStorage.getItem("dilmsadmintoken")}`,
        },
      })
      const data = await res.json()
      setLoading(false)
      if (data.success) {
        setSubmittedProjectData(data.data)
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      setLoading(false)
      toast.error("Something went wrong please try again after some time")
    }
  }

  // useEffect to fetch the projects when the component mounts
  useEffect(() => {
    fetchProjects()
    fetchSubmittedProjects()
  }, [])

  return (
    <>
      <Toaster richColors position="top-center" closeButton={false} expand={false} />
      {loading ? <HomePageSkl /> : 
        <div className="w-full min-h-screen bg-background text-foreground">
          <div className="container mx-auto px-4 py-4 md:py-6 lg:py-8 max-w-7xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
              <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">Projects</h1>
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <Button
                  variant={activeTab === "create" ? "primary" : "outline"}
                  onClick={() => setActiveTab("create")}
                  className="flex-1 md:flex-none px-3 py-2 text-sm font-medium"
                >
                  Create Project
                </Button>
                <Button
                  variant={activeTab === "submitted" ? "primary" : "outline"}
                  onClick={() => setActiveTab("submitted")}
                  className="flex-1 md:flex-none px-3 py-2 text-sm font-medium"
                >
                  Projects Submitted
                </Button>
              </div>
            </div>
            
            {activeTab === "create" && (
              <Card className="shadow-lg border rounded-lg">
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-lg md:text-xl font-bold">Create Project</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    Fill out the form to create a new Project.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="title" className="text-sm font-medium">
                        Project Title
                      </Label>
                      <Input
                        id="title"
                        placeholder="Title"
                        name="title"
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                        className="rounded-md text-sm"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="link" className="text-sm font-medium">
                        Link (Pdf,docs,github,figma)
                      </Label>
                      <Input
                        id="link"
                        placeholder="link://"
                        name="link"
                        onChange={(e) => setLink(e.target.value)}
                        value={link}
                        className="rounded-md text-sm"
                      />
                    </div>
                    <div className="grid gap-2 col-span-1 lg:col-span-2">
                      <Label htmlFor="description" className="text-sm font-medium">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        rows={4}
                        name="description"
                        placeholder="Assignment Description"
                        onChange={(e) => setDescription(e.target.value)}  
                        value={description}
                        className="rounded-md text-sm"
                      />
                    </div>
                    <div className="grid gap-2 col-span-1 lg:col-span-2">
                      <Label htmlFor="attachments" className="text-sm font-medium">
                        Extra Attachments
                      </Label>
                      <Input
                        id="attachments"
                        name="attachments"
                        placeholder="Any other relevant links"
                        onChange={(e) => setAttachments(e.target.value)}
                        value={attachments}
                        className="rounded-md text-sm"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 md:p-6 flex flex-wrap gap-2">
                  <Button 
                    type="submit" 
                    className="w-full sm:w-auto px-4 py-2 text-sm font-medium" 
                    onClick={handleSubmit}
                  >
                    {projectData.length > 0 ? "Update Project" : "Create Project"}
                  </Button>
                </CardFooter>
              </Card>
            )}
            
            {activeTab === "submitted" && (
              <Card className="shadow-lg border rounded-lg">
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-lg md:text-xl font-bold">Projects Submitted</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    Review and grade the projects submitted by students.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 md:p-2">
                  <div className="overflow-auto">
                    <div className="min-w-max md:w-full p-2">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-xs md:text-sm font-medium whitespace-nowrap">Student</TableHead>
                            <TableHead className="text-xs md:text-sm font-medium whitespace-nowrap">Domain</TableHead>
                            <TableHead className="text-xs md:text-sm font-medium whitespace-nowrap">Duration</TableHead>
                            <TableHead className="text-xs md:text-sm font-medium whitespace-nowrap">Submitted Date</TableHead>
                            <TableHead className="text-xs md:text-sm font-medium text-right whitespace-nowrap">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {submittedProjectData.length > 0 ? submittedProjectData.map((data) => (
                            <TableRow key={data._id}>
                              <TableCell className="font-medium text-xs md:text-sm whitespace-nowrap">{data.userid.name}</TableCell>
                              <TableCell className="text-xs md:text-sm whitespace-nowrap">{data.userid.domain}</TableCell>
                              <TableCell className="text-xs md:text-sm whitespace-nowrap">{data.userid.month}</TableCell>
                              <TableCell className="text-xs md:text-sm whitespace-nowrap">
                                {new Date(data.createdAt).toLocaleDateString('en-IN', {day: '2-digit', month: '2-digit', year: 'numeric'})}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="px-2 py-1 text-xs md:text-sm" 
                                  onClick={() => {
                                    setModalOpendata(data)
                                    setOpen(true)
                                  }}
                                >
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          )) : (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-6 text-sm">
                                No submitted projects found
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="fixed bottom-4 right-4 z-10">
            <Button 
              className="flex items-center justify-center rounded-full w-12 h-12 md:w-auto md:h-auto md:rounded-md md:py-2 md:px-4 shadow-lg" 
              onClick={() => {
                setaiopen(!aiopen)
              }}
            >
              <MessageCircleIcon className="h-5 w-5 md:mr-2" />
              <span className="hidden md:inline">Chat with AI</span>
            </Button>
          </div>
         
          <Chat aiopen={aiopen} setaiopen={setaiopen} />
          <ProjectDialog 
            initialProject={{
              title: modalOpendata.title,
              description: modalOpendata.desc,
              link: modalOpendata.link,
              extraLink: modalOpendata.link2,
              evaluation: modalOpendata.mark,
            }}
            open={open} 
            setOpen={setOpen} 
          />
        </div>
      }
    </>
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