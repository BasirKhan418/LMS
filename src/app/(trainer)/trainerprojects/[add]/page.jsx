
"use client"

import { useState,use,useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import Chat from "@/utilities/Ai/Chat"
import { Toaster,toast } from "sonner"
import HomePageSkl from "@/utilities/skeleton/HomePageSkl"
import { ProjectDialog } from "@/utilities/dialog/project-dialog"
export default function Page({params}) {
  const tdata = use(params)
  
  const [activeTab, setActiveTab] = useState("create")
  const [aiopen,setaiopen] = useState(false)
  const [modalOpendata,setModalOpendata] = useState({})
  //project state's
  const [title,setTitle]= useState("");
  const [link,setLink]= useState("");
  const [description,setDescription]= useState("");
  const [attachments,setAttachments]= useState("");
  const [projectData,setProjectData]= useState([]); //state for getting project data from db
  const [loading,setLoading]= useState(false); //loading state for addinf project on db
  const [submittedProjectData,setSubmittedProjectData]= useState([]); //state for getting project data from db
  //state for addinf project on db
  const [open, setOpen] = useState(false)

  //handle submit function
  const handleSubmit = async (e) => {
    e.preventDefault()
    const projectData = {
      title: title,
      link: link,
      desc: description,
      link2: attachments,
      crid:tdata.add
    }
    try{
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

    catch(err){
      
      toast.error("Some thing went wrong please try again after some time")
    }
    
  }
  ///fetch all the projects of the course

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
      
      toast.error("Some thing went wrong please try again after some time")
    }
  }


  //fetch all the projects of the course

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
    
      toast.error("Some thing went wrong please try again after some time")
    }
  }

    //useEffet to fetch the projects when the component mounts
    useEffect(() => {
      fetchProjects()
      fetchSubmittedProjects()
    }, [])
  return (
    <>
    <Toaster richColors position="top-center" closeButton={false} expand={false} />
    {loading?<HomePageSkl/>:<div className="w-full min-h-screen bg-background text-foreground">
      
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
              variant={activeTab === "submitted" ? "primary" : "outline"}
              onClick={() => setActiveTab("submitted")}
              className="px-4 py-2 rounded-md text-sm font-medium"
            >
              Projects Submitted
            </Button>
            {/* <Button
              variant={activeTab === "evaluated" ? "primary" : "outline"}
              onClick={() => setActiveTab("evaluated")}
              className="px-4 py-2 rounded-md text-sm font-medium"
            >
              Projects Evaluated
            </Button> */}
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
                    Project Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="Title"
                    name="title"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
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
                    name="description"
                    placeholder="Assignment Description"
                    onChange={(e) => setDescription(e.target.value)}  
                    value={description}
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div className="grid gap-2 col-span-1 md:col-span-2">
                  <Label htmlFor="attachments" className="text-sm font-medium">
                    Extra Attachments
                  </Label>
                  <Input
                    id="attachments"
                    name="attachments"
                    placeholder="Any other relvant links"
                 onChange={(e) => setAttachments(e.target.value)}
                    value={attachments}
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter className="bg-card p-6">
              <Button type="submit" className="px-4 py-2 rounded-md text-sm font-medium" onClick={handleSubmit}>
                {projectData.length > 0 ? "Update Project" : "Create Project"}
              </Button>
             
            </CardFooter>
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
                    <TableHead className="text-sm font-medium">Domain</TableHead>
                    <TableHead className="text-sm font-medium">Duration</TableHead>
                    <TableHead className="text-sm font-medium">Submitted Date</TableHead>
                    
                    <TableHead className="text-sm font-medium text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submittedProjectData.map((data)=>(<TableRow key={data._id}>
                    <TableCell className="font-medium">{data.userid.name}</TableCell>
                    <TableCell className="font-medium">{data.userid.domain}</TableCell>
                    <TableCell className="font-medium">{data.userid.month}</TableCell>
                    <TableCell>{new Date(data.createdAt).toLocaleDateString('en-IN', {day: '2-digit', month: '2-digit', year: 'numeric'})}</TableCell>
                  
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="px-2 py-1 rounded-md text-sm" onClick={()=>{
                        setModalOpendata(data)
                        setOpen(true)
                      }} >
                        View
                      </Button>
                      {/* <Button variant="outline" size="sm" className="ml-2 px-2 py-1 rounded-md text-sm">
                        Grade
                      </Button> */}
                    </TableCell>
                  </TableRow>))}
                  
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
        {/* {activeTab === "evaluated" && (
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
                      <Button variant="outline" size="sm" className="px-2 py-1 rounded-md text-sm" >
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
        )} */}
      </div>
      <Button className="flex items-center gap-2 fixed lg:bottom-4 lg:right-4 md:bottom-4 md:right-4 bottom-2 right-2 rounded-full lg:py-8 md:py-8 py-8 " size="lg" onClick={()=>{
      setaiopen(!aiopen)
    }}>
      <MessageCircleIcon className="h-5 w-5" />
      Chat with AI
    </Button>
   
<Chat aiopen={aiopen} setaiopen={setaiopen}/>
<ProjectDialog 
initialProject={{
  title: modalOpendata.title,
  description: modalOpendata.desc,
  link: modalOpendata.link,
  extraLink: modalOpendata.link2,
  evaluation: modalOpendata.mark,
}}
open={open} setOpen={setOpen} />
    </div>}
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