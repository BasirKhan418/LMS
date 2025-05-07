
"use client"

import { useEffect, useState, use } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import Chat from "@/utilities/Ai/Chat"
import { Toaster,toast } from "sonner"
import ProfielSpinner from "@/utilities/Spinner/ProfielSpinner"
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function Page(props) {
  const params = use(props.params);
  const [allAssignment,setAllAssignment] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [id,setId] = useState("")
  const [alertopen,setAlertopen] = useState(false)
  const [promptmodalopen,setPromptmodalopen] = useState(false)
  const [aiprompt,setAiprompt] = useState("")
  const [ailoading,setAiloading] = useState(false)
  const [submitassignment,setSubmitassignment] = useState([])
  const [evaluated,setEvaluated] = useState([])
  const [grademodal,setGrademodal] = useState(false)
  const [opengradeaimodal,setOpengradeaimodal] = useState(false)
  
  //fetch all asignment
  const fetchAllAssignment = async()=>{
    const res = await fetch(`/api/assignment?id=${params.add}`,{
      method:"GET",
      headers:{
        "Content-Type":"application/json",
        "token":localStorage.getItem("dilmsadmintoken")
      }
    })
    const data = await res.json()
    if(data.success){
      setAllAssignment(data.data)
    }
    else{
      toast.error(data.message)
    }
  }
  
  //fetch all submitted assignment
  const fetchAllSubmittedAssignment = async()=>{
    const res = await fetch(`/api/assignmentcrud?id=${params.add}`,{
      method:"GET",
      headers:{
        "Content-Type":"application/json",
        "token":localStorage.getItem("dilmsadmintoken")
      }
    })
    const data = await res.json()
    if(data.success){
      let submitted = data.data.filter((item)=>item.status=="submitted")
      setSubmitassignment(submitted)
      let evaluated = data.data.filter((item)=>item.status=="evaluated")
      setEvaluated(evaluated)
    }
    else{
      toast.error(data.message)
    }
  }
  
  //useeffectfor fetch all assignment
  useEffect(()=>{
    fetchAllAssignment()
    fetchAllSubmittedAssignment()
  },[])
  
  //end
  const [activeTab, setActiveTab] = useState("create")
  const [aiopen,setaiopen] = useState(false)
  const [loading,setLoading] = useState(false)
  
  //create assignment 
  const [assignmentForm,setAssignmentform]=useState({
    title:"",
    desc:"",
    duedate:"",
    crid:params.add,
    type:"",
    link:"",
  })
  
  //onchange
  const handleChange = (e)=>{
   setAssignmentform({...assignmentForm,[e.target.name]:e.target.value})
  }
  
  //handleAddAssignment
  const handleSubmitForm = async()=>{
    if(assignmentForm.name==""||assignmentForm.type==""||assignmentForm.link==""||assignmentForm.duedate==""||assignmentForm.desc==""){
      toast.error("Please fill all the fields")
      return;
    }
    else{
      setLoading(true)
      const res = await fetch("/api/assignment",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "token":localStorage.getItem("dilmsadmintoken")
        },
        body:JSON.stringify(assignmentForm)
      })
      const data = await res.json()
      setLoading(false)
      if(data.success){
        fetchAllAssignment()
        toast.success(data.message)
        setAssignmentform({
          title:"",
          desc:"",
          duedate:"",
          crid:params.add,
          type:"",
          link:"",
        })
      }
      else{
        toast.error(data.message);
      }
    }
  }
  
  //update functions start from here
  const handleUpdate = (item)=>{
    setAssignmentform({
      title:item.title,
      desc:item.desc,
      duedate:item.duedate,
      crid:params.add,
      type:item.type,
      link:item.link,
      id:item._id
    })
    setId(item._id)
    setModalOpen(true)
  }
  
  //handle Submit Assignment
  const handleSubmitUpdate = async()=>{
    let data = {...assignmentForm,id:id}
    if(assignmentForm.title==""||assignmentForm.type==""||assignmentForm.link==""||assignmentForm.duedate==""||assignmentForm.desc==""){
      toast.error("Please fill all the fields")
      return
    }
    const res = await fetch("/api/assignment",{
      method:"PUT",
      headers:{
        "Content-Type":"application/json",
        "token":localStorage.getItem("dilmsadmintoken")
      },
      body:JSON.stringify(data)
    })
    const resdata = await res.json()
    if(resdata.success){
      toast.success(resdata.message)
      setModalOpen(false)
      setAssignmentform({
        title:"",
        desc:"",
        duedate:"",
        crid:params.add,
        type:"",
        link:"",
      })
      fetchAllAssignment()
    }
    else{
      toast.error(resdata.message)
    }
  }
  
  //delete assignment
  //handle delete prev
  const handleDeletePrev = (id)=>{
    setId(id)
    setAlertopen(true)
  }
  
  //handle delete fom data base
  const handleDelete = async()=>{
    const res = await fetch("/api/assignment",{
      method:"DELETE",
      headers:{
        "Content-Type":"application/json",
        "token":localStorage.getItem("dilmsadmintoken")
      },
      body:JSON.stringify({id:id})
    })
    const data = await res.json()
    if(data.success){
      toast.success(data.message)
      setAlertopen(false)
      fetchAllAssignment()
    }
    else{
      toast.error(data.message)
    }
  }
  
  //ai create assignment starts from here
  const handleAipromptChange=(e)=>{
    setAiprompt(e.target.value)
  }
  
  //intialize ai
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };
  
  const handleRunAi = async()=>{
    if(aiprompt==""){
      toast.error("Please enter prompt")
      return
    }
    try{
      setAiloading(true)
      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });
      let prevprompt = "for this Generate a JSON object for an assignment with the following details: Title: The title of the assignment. Description: A complete description of the assignment. Link: A URL linking to an image, PDF, or video related to the assignment. Due Date: The due date for the assignment. Type: The type of content the assignment is based on. For example, image, video, or PDF ,note:not any other format. json key should look like ,title,desc,link,duedate,type"
      let orginalprompt = prevprompt+" "+aiprompt
      const result = await chatSession.sendMessage(orginalprompt);
      let data = JSON.parse(result.response.text())
      setAssignmentform({
        title:data.title,
        desc:data.desc,
        duedate:data.duedate,
        crid:params.add,
        type:data.type.toLowerCase(),
        link:data.link,
      })
      setAiloading(false)
      setPromptmodalopen(false)
    }
    catch(err){
      toast.error("Something went wrong please try again later.Or Too many requests, please try again later!" + err);
      setAiloading(false)
      setPromptmodalopen(false)
    }
  }
  
  //grade modal starts from here
  const [gradeForm,setGradeForm] = useState({
    title:"",
    desc:"",
    response:"",
    marks:"",
    id:"",
  })
  
  //handle Change
  const handleGradeChange = (e)=>{
    setGradeForm({...gradeForm,[e.target.name]:e.target.value})
  }
  
  const handleGrade = (item)=>{
    setGradeForm({
      title:item.asid.title,
      desc:item.asid.desc,
      response:item.response,
      marks:item.marks,
      id:item._id
    })
    setGrademodal(true)
  }
  
  //handle Update Grade
  const handleUpdateGrade = async()=>{
    if(gradeForm.marks==""){
      toast.error("Please enter marks")
      return
    }
    setLoading(true)
    const res = await fetch("/api/assignmentcrud",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "token":localStorage.getItem("dilmsadmintoken")
      },
      body:JSON.stringify({id:gradeForm.id,marks:gradeForm.marks})
    })
    const data = await res.json()
    setLoading(false)
    if(data.success){
      toast.success(data.message)
      setGrademodal(false)
      fetchAllSubmittedAssignment()
    }
    else{
      toast.error(data.message)
    }
  }
  
  //evalute by ai 
  const handleAiGrade = async(item)=>{
    try{
      setOpengradeaimodal(true)
      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });
      let prompt = `I have an assignment with the following details: question: ${item.asid.title}. Description: ${item.asid.desc}. Answer: ${item.response}. Can you please grade this assignment between 1 to 100? and also check this answer is copy pasted or not and check the plagiarism?.Generate only marks key in json and what you have calculated value withthat value field not anything else.`
      const result = await chatSession.sendMessage(prompt);
      setOpengradeaimodal(false)
      let data = JSON.parse(result.response.text())
      
      setGradeForm({
        title:item.asid.title,
        desc:item.asid.desc,
        response:item.response,
        marks:data.marks,
        id:item._id
      })
      setGrademodal(true)
    }
    catch(err){
      toast.error("Something went wrong please try again later.Or Too many requests, please try again later!" + err);
      setOpengradeaimodal(false)
    }
  }
  
  return (
<div className="w-full min-h-screen bg-background text-foreground">
  <Toaster position="top-center" expand={false} />
  {loading ? 
    <div className="flex justify-center items-center h-full w-full">
      <ProfielSpinner />
    </div> 
    : 
    <>
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-7xl">
        <div className="flex flex-col mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">Assignments</h1>
          <div className="flex flex-wrap gap-1 sm:gap-2 w-full overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
            <Button
              variant={activeTab === "create" ? "primary" : "outline"}
              onClick={() => setActiveTab("create")}
              className="px-2 py-1 text-xs sm:text-sm whitespace-nowrap"
              size="sm"
            >
              Create Assignment
            </Button>
            <Button
              variant={activeTab === "created" ? "primary" : "outline"}
              onClick={() => setActiveTab("created")}
              className="px-2 py-1 text-xs sm:text-sm whitespace-nowrap"
              size="sm"
            >
              Assignments Created
            </Button>
            <Button
              variant={activeTab === "submitted" ? "primary" : "outline"}
              onClick={() => setActiveTab("submitted")}
              className="px-2 py-1 text-xs sm:text-sm whitespace-nowrap"
              size="sm"
            >
              Assignments Submitted
            </Button>
            <Button
              variant={activeTab === "evaluated" ? "primary" : "outline"}
              onClick={() => setActiveTab("evaluated")}
              className="px-2 py-1 text-xs sm:text-sm whitespace-nowrap"
              size="sm"
            >
              Assignments Evaluated
            </Button>
          </div>
        </div>
        
        {activeTab === "create" && (
          <Card className="shadow-lg rounded-lg max-h-[60vh] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
            <CardHeader className="bg-card p-3 sm:p-4 md:p-6">
              <CardTitle className="text-base sm:text-lg font-bold">Create Assignment</CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                Fill out the form to create a new assignment.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                <div className="grid gap-2 col-span-1">
                  <Label htmlFor="title" className="text-xs sm:text-sm font-medium">
                    Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={assignmentForm.title}
                    onChange={handleChange}
                    placeholder="Assignment Title"
                    className="w-full text-xs sm:text-sm"
                  />
                </div>
                <div className="grid gap-2 col-span-1">
                  <Label htmlFor="due-date" className="text-xs sm:text-sm font-medium">
                    Due Date
                  </Label>
                  <Input
                    id="due-date"
                    type="date"
                    name="duedate"
                    value={assignmentForm.duedate}
                    onChange={handleChange}
                    className="w-full text-xs sm:text-sm"
                  />
                </div>
                <div className="grid gap-2 col-span-1 md:col-span-2">
                  <Label htmlFor="description" className="text-xs sm:text-sm font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={assignmentForm.desc}
                    name="desc"
                    onChange={handleChange}
                    placeholder="Assignment Description"
                    className="w-full text-xs sm:text-sm"
                  />
                </div>
                <div className="grid gap-2 col-span-1">
                  <Label htmlFor="link" className="text-xs sm:text-sm font-medium">
                    Links
                  </Label>
                  <Input
                    id="link"
                    type="url"
                    name="link"
                    value={assignmentForm.link}
                    onChange={handleChange}
                    className="w-full text-xs sm:text-sm"
                  />
                </div>
                <div className="grid gap-2 col-span-1">
                  <Label htmlFor="type" className="text-xs sm:text-sm font-medium">
                    Type
                  </Label>
                  <select
                    name="type"
                    onChange={handleChange}
                    value={assignmentForm.type}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm"
                  >
                    <option value={""}>Select</option>
                    <option value={"image"}>Image</option>
                    <option value={"video"}>Video</option>
                    <option value={"pdf"}>Pdf</option>
                  </select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-card p-3 sm:p-4 md:p-6 flex flex-col sm:flex-row gap-2 w-full">
              <Button 
                className="text-xs sm:text-sm w-full"
                onClick={handleSubmitForm}
              >
                Create Assignment
              </Button>
              <Button 
                type="submit" 
                className="text-xs sm:text-sm w-full"
                onClick={() => setPromptmodalopen(true)}
              >
                Create by DI-Nxt Ai
              </Button>
            </CardFooter>
          </Card>
        )}
        
        {activeTab === "created" && (
          <Card className="shadow-lg rounded-lg overflow-hidden">
            <CardHeader className="bg-card p-3 sm:p-4 md:p-6">
              <CardTitle className="text-base sm:text-lg font-bold">Assignments Created</CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                View and manage the assignments you have created.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto max-h-[400px] w-full" style={{ scrollbarWidth: 'thin' }}>
                <div className="w-[300px] sm:w-full p-2">
                  <Table className="border border-gray-200 rounded-lg">
                    <TableHeader className="bg-gray-50 sticky top-0 z-10">
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm font-medium whitespace-nowrap px-4 py-3 w-2/5 border-r">Title</TableHead>
                        <TableHead className="text-xs sm:text-sm font-medium whitespace-nowrap px-4 py-3 w-2/5 border-r">Due Date</TableHead>
                        <TableHead className="text-xs sm:text-sm font-medium whitespace-nowrap px-4 py-3 w-1/5 border-r">Status</TableHead>
                        <TableHead className="text-xs sm:text-sm font-medium text-right whitespace-nowrap px-4 py-3 w-1/5">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allAssignment && allAssignment.map((item, index) => (
                        <TableRow key={index} className="hover:bg-gray-50">
                          <TableCell className="font-medium text-xs sm:text-sm whitespace-nowrap px-4 py-3 border-r truncate max-w-[200px] sm:max-w-none">{item.title}</TableCell>
                          <TableCell className="text-xs sm:text-sm whitespace-nowrap px-4 py-3 border-r">{new Date(item.duedate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</TableCell>
                          <TableCell className="px-4 py-3 border-r">
                            <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs sm:text-sm inline-block">Published</div>
                          </TableCell>
                          <TableCell className="text-right px-4 py-3">
                            <div className="flex justify-end flex-wrap gap-1">
                              <Button variant="" size="sm" className="px-2 py-1 text-xs sm:text-sm" onClick={() => handleUpdate(item)}>
                                Edit
                              </Button>
                              <Button variant="destructive" size="sm" className="px-2 py-1 text-xs sm:text-sm" onClick={() => handleDeletePrev(item._id)}>
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {activeTab === "submitted" && (
          <Card className="shadow-lg rounded-lg overflow-hidden">
            <CardHeader className="bg-card p-3 sm:p-4 md:p-6">
              <CardTitle className="text-base sm:text-lg font-bold">Assignments Submitted</CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                Review and grade the assignments submitted by students.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto max-h-[400px] w-full" style={{ scrollbarWidth: 'thin' }}>
                <div className="w-[300px] sm:w-full p-2">
                  <Table className="border border-gray-200 rounded-lg">
                    <TableHeader className="bg-gray-50 sticky top-0 z-10">
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm font-medium whitespace-nowrap px-4 py-3 w-1/5 border-r">Student</TableHead>
                        <TableHead className="text-xs sm:text-sm font-medium whitespace-nowrap px-4 py-3 w-1/5 border-r">Assignment</TableHead>
                        <TableHead className="text-xs sm:text-sm font-medium whitespace-nowrap px-4 py-3 w-1/5 border-r">Submitted</TableHead>
                        <TableHead className="text-xs sm:text-sm font-medium whitespace-nowrap px-4 py-3 w-1/5 border-r">Due Date</TableHead>
                        <TableHead className="text-xs sm:text-sm font-medium text-right whitespace-nowrap px-4 py-3 w-1/5">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submitassignment && submitassignment.map((item) => (
                        <TableRow key={item._id} className="hover:bg-gray-50">
                          <TableCell className="font-medium text-xs sm:text-sm whitespace-nowrap px-4 py-3 border-r truncate max-w-[100px] sm:max-w-none">{item.userid.name}</TableCell>
                          <TableCell className="text-xs sm:text-sm whitespace-nowrap px-4 py-3 border-r truncate max-w-[100px] sm:max-w-none">{item.asid.title}</TableCell>
                          <TableCell className="text-xs sm:text-sm whitespace-nowrap px-4 py-3 border-r">{new Date(item.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</TableCell>
                          <TableCell className="px-4 py-3 border-r">
                            <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs sm:text-sm inline-block">{new Date(item.asid.duedate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                          </TableCell>
                          <TableCell className="text-right px-4 py-3">
                            <div className="flex justify-end flex-wrap gap-1">
                              <Button variant="outline" size="sm" className="px-2 py-1 text-xs sm:text-sm" onClick={() => handleGrade(item)}>
                                View & Grade
                              </Button>
                              <Button variant="" size="sm" className="px-2 py-1 text-xs sm:text-sm" onClick={() => handleAiGrade(item)}> 
                                Ai Grade
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {activeTab === "evaluated" && (
          <Card className="shadow-lg rounded-lg overflow-hidden">
            <CardHeader className="bg-card p-3 sm:p-4 md:p-6">
              <CardTitle className="text-base sm:text-lg font-bold">Assignments Evaluated</CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                View and manage the assignments that have been evaluated.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto max-h-[400px] w-full" style={{ scrollbarWidth: 'thin' }}>
                <div className="w-[300px] sm:w-full p-2">
                  <Table className="border border-gray-200 rounded-lg">
                    <TableHeader className="bg-gray-50 sticky top-0 z-10">
                      <TableRow>
                        <TableHead className="text-xs sm:text-sm font-medium whitespace-nowrap px-4 py-3 w-1/5 border-r">Student</TableHead>
                        <TableHead className="text-xs sm:text-sm font-medium whitespace-nowrap px-4 py-3 w-1/5 border-r">Assignment</TableHead>
                        <TableHead className="text-xs sm:text-sm font-medium whitespace-nowrap px-4 py-3 w-1/5 border-r">Updated At</TableHead>
                        <TableHead className="text-xs sm:text-sm font-medium whitespace-nowrap px-4 py-3 w-1/5 border-r">Grade</TableHead>
                        <TableHead className="text-xs sm:text-sm font-medium text-right whitespace-nowrap px-4 py-3 w-1/5">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {evaluated && evaluated.map((item) => (
                        <TableRow key={item._id} className="hover:bg-gray-50">
                          <TableCell className="font-medium text-xs sm:text-sm whitespace-nowrap px-4 py-3 border-r truncate max-w-[100px] sm:max-w-none">{item.userid.name}</TableCell>
                          <TableCell className="text-xs sm:text-sm whitespace-nowrap px-4 py-3 border-r truncate max-w-[100px] sm:max-w-none">{item.asid.title}</TableCell>
                          <TableCell className="text-xs sm:text-sm whitespace-nowrap px-4 py-3 border-r">{new Date(item.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</TableCell>
                          <TableCell className="px-4 py-3 border-r">
                            <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs sm:text-sm inline-block">{item.marks}%</div>
                          </TableCell>
                          <TableCell className="text-right px-4 py-3">
                            <Button variant="outline" size="sm" className="px-2 py-1 text-xs sm:text-sm" onClick={() => handleGrade(item)}>
                              View & Update
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <Button 
        className="flex items-center gap-2 fixed bottom-4 right-4 rounded-full p-2 sm:p-3 shadow-lg"
        size="sm"
        onClick={() => setaiopen(!aiopen)}
      >
        <MessageCircleIcon className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="text-xs sm:text-sm">Chat with AI</span>
      </Button>
     
      <Chat aiopen={aiopen} setaiopen={setaiopen} />
    </>
  }
  
  {/* Edit Assignment Dialog */}
  <Dialog open={modalOpen} onOpenChange={setModalOpen}>
    <DialogContent className="sm:max-w-lg w-[95vw] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Edit Assignment</DialogTitle>
        <DialogDescription>
          Make changes to your assignment here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-title" className="text-xs sm:text-sm font-medium">
              Title
            </Label>
            <Input
              id="edit-title"
              name="title"
              value={assignmentForm.title}
              onChange={handleChange}
              placeholder="Assignment Title"
              className="w-full text-xs sm:text-sm"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-due-date" className="text-xs sm:text-sm font-medium">
              Due Date
            </Label>
            <Input
              id="edit-due-date"
              type="date"
              name="duedate"
              value={assignmentForm.duedate}
              onChange={handleChange}
              className="w-full text-xs sm:text-sm"
            />
          </div>
          <div className="grid gap-2 col-span-1 md:col-span-2">
            <Label htmlFor="edit-description" className="text-xs sm:text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="edit-description"
              rows={4}
              value={assignmentForm.desc}
              name="desc"
              onChange={handleChange}
              placeholder="Assignment Description"
              className="w-full text-xs sm:text-sm"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-link" className="text-xs sm:text-sm font-medium">
              Links
            </Label>
            <Input
              id="edit-link"
              type="url"
              name="link"
              value={assignmentForm.link}
              onChange={handleChange}
              className="w-full text-xs sm:text-sm"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-type" className="text-xs sm:text-sm font-medium">
              Type
            </Label>
            <select
              id="edit-type"
              name="type"
              onChange={handleChange}
              value={assignmentForm.type}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm"
            >
              <option value={""}>Select</option>
              <option value={"image"}>Image</option>
              <option value={"video"}>Video</option>
              <option value={"pdf"}>Pdf</option>
            </select>
          </div>
        </div>
      </div>
      <DialogFooter className="flex flex-wrap gap-2 sm:justify-end">
        <Button onClick={handleSubmitUpdate} className="flex-1 sm:flex-none">Update Assignment</Button>
        <Button 
          variant="destructive" 
          onClick={() => {
            setModalOpen(false);
            setAssignmentform({
              title: "",
              desc: "",
              duedate: "",
              crid: params.add,
              type: "",
              link: "",
            });
          }}
          className="flex-1 sm:flex-none"
        >
          Cancel
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  
  {/* Grade Modal */}
  <Dialog open={grademodal}>
    <DialogContent className="w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
      <DialogHeader>
        <DialogTitle>Edit & View Grade</DialogTitle>
        <DialogDescription>
          Make changes to your assignment here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <Card className="shadow-lg rounded-lg">
        <CardContent className="p-3 sm:p-6">
          <div className="grid gap-3 sm:gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-xs sm:text-sm font-medium">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={gradeForm.title}
                onChange={handleGradeChange}
                placeholder="Assignment Title"
                className="rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description" className="text-xs sm:text-sm font-medium">
                Question Description
              </Label>
              <Textarea
                id="description"
                rows={4}
                value={gradeForm.desc}
                name="desc"
                onChange={handleGradeChange}
                placeholder="Assignment Description"
                className="rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="response" className="text-xs sm:text-sm font-medium">
                Answer of the question
              </Label>
              <Textarea
                id="response"
                rows={4}
                value={gradeForm.response}
                name="response"
                onChange={handleGradeChange}
                placeholder="Assignment Response"
                className="rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="marks" className="text-xs sm:text-sm font-medium">
                Marks
              </Label>
              <Input
                id="marks"
                type="number"
                name="marks"
                value={gradeForm.marks}
                onChange={handleGradeChange}
                className="rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <DialogFooter className="flex flex-wrap gap-2 sm:justify-end mt-4">
        <Button onClick={handleUpdateGrade} className="flex-1 sm:flex-none">Update Marks</Button>
        <Button variant={"destructive"} onClick={() => {
          setGrademodal(false);
          setGradeForm({
            title: "",
            desc: "",
            response: "",
            marks: "",
            id: "",
          });
        }} className="flex-1 sm:flex-none">Close</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  
  {/* Confirmation Modal */}
  <AlertDialog open={alertopen}>
    <AlertDialogContent className="w-[95vw] sm:max-w-md">
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your content
          and remove your data from our servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter className="flex flex-wrap gap-2 sm:justify-end">
        <AlertDialogCancel className="flex-1 sm:flex-none" onClick={() => {
          setAlertopen(false);
          setId("");
        }}>Cancel</AlertDialogCancel>
        <AlertDialogAction className="flex-1 sm:flex-none" onClick={handleDelete}>Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
  
  {/* AI Prompt Modal */}
  <Dialog open={promptmodalopen}>
    <DialogContent className="w-[95vw] sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Enter Your Prompt</DialogTitle>
        <DialogDescription>
          Enter your assignment topic name to create an assignment
        </DialogDescription>
      </DialogHeader>
      {!ailoading && <div className="grid gap-4 py-4">
        <div className="">
          <Label htmlFor="name" className="text-xs sm:text-sm text-right">
            Prompt 
          </Label>
          <Input id="name" className="my-2 text-xs sm:text-sm" placeholder="Enter Your Prompt to create an assignment" onChange={handleAipromptChange} value={aiprompt} />
        </div>
      </div>}
      {ailoading && <div className="w-full max-w-md mx-auto animate-pulse p-9">
        <h1 className="h-2 bg-gray-300 rounded-lg w-52 dark:bg-gray-600" />
        <p className="w-48 h-2 mt-6 bg-gray-200 rounded-lg dark:bg-gray-700" />
        <p className="w-full h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700" />
        <p className="w-64 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700" />
        <p className="w-4/5 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700" />
      </div>}
      <DialogFooter className="flex flex-wrap gap-2 sm:justify-end">
        <Button variant={"destructive"} onClick={() => setPromptmodalopen(false)} className="flex-1 sm:flex-none">Cancel</Button>
        <Button onClick={handleRunAi} className="flex-1 sm:flex-none">Create</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  
  {/* AI Grade Loading Modal */}
  <Dialog open={opengradeaimodal}>
    <DialogContent className="w-[95vw] sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>NXT-AI ASSIGNMENT EVALUATOR</DialogTitle>
        <DialogDescription>
          Please wait while we are grading your assignment....
        </DialogDescription>
      </DialogHeader>
      <div className="w-full max-w-md mx-auto animate-pulse p-9">
        <h1 className="h-2 bg-gray-300 rounded-lg w-52 dark:bg-gray-600" />
        <p className="w-48 h-2 mt-6 bg-gray-200 rounded-lg dark:bg-gray-700" />
        <p className="w-full h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700" />
        <p className="w-64 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700" />
        <p className="w-4/5 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700" />
      </div>
      <DialogFooter>
        <Button variant={"destructive"} onClick={() => setOpengradeaimodal(false)}>Cancel</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
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