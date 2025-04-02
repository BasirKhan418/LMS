"use client"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Toaster,toast } from "sonner"
import ProfielSpinner from "../Spinner/ProfielSpinner";
import { NoAssignment } from "../Course/NoAssignment"
export default function UserAssignment({id,userid}) {
  const [allAssignments, setAllAssignments] = useState([]);
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const [evaluatedAssignments, setEvaluatedAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchAllAssignment = async()=>{
    setLoading(true)
    const res = await fetch(`/api/assignment?id=${id}`,{
      method:"GET",
      headers:{
        "Content-Type":"application/json",
        "token":localStorage.getItem("dilmsadmintoken")
      }
    })
    const data = await res.json()
    setLoading(false)
    if(data.success){
      setAllAssignments(data.data)
      fetchAllSubmittedAssignment(data.data)
    }
    else{
      toast.error(data.message)
      console.log(data)
    }
  }
  const fetchAllSubmittedAssignment = async(pendata)=>{
    setLoading(true)
    console.log(id,userid)
    const res = await fetch(`/api/submitassignment?crid=${id}&&userid=${userid}`,{
      method:"GET",
      headers:{
        "Content-Type":"application/json",
        "token":localStorage.getItem("dilmstoken")
      }
    })
    const data = await res.json()
    console.log("submitted",data)
    setLoading(false)
    if(data.success){
    let submitted = data.data&&data.data.filter((item)=>item.status=="submitted")
    let evaluated = data.data&&data.data.filter((item)=>item.status=="evaluated")
    let pending = pendata&&data.data&&pendata.filter((item)=>!submitted.find((item2)=>item2.asid._id==item._id)&&!evaluated.find((item2)=>item2.asid._id==item._id))
    setAllAssignments(pending)
    setSubmittedAssignments(submitted)
    setEvaluatedAssignments(evaluated)
    }
    else{
      //
    }
  }
  useEffect(()=>{
    fetchAllAssignment();
  },[userid])
  console.log(allAssignments)
  return (
    <>
    <Toaster position="top-center" expand={"false"}/>
    {loading?<div className="flex justify-center items-center"><ProfielSpinner/></div>:<>
   <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Assignments</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Pending Assignments</h2>
          {allAssignments&&allAssignments.map((item,index)=>(<Card className="my-2" key={index}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.desc.slice(0,90)+"...."}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Due: {new Date(item.duedate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/assignment/${id}/${item._id}`}><Button>View Assignment</Button></Link>
            </CardFooter>
          </Card>))}
          {allAssignments&&allAssignments.length==0&&<NoAssignment/>}
          
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-4 mt-2">Submitted Assignments</h2>
          {submittedAssignments.map((item)=>(<Card className="my-2" key={item._id}>
            <CardHeader>
              <CardTitle>{item.asid.title}</CardTitle>
              <CardDescription>{item.asid.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Submitted At: {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                <Badge variant="success">Submitted</Badge>
              </div>
            </CardContent>
          </Card>))}
          {submittedAssignments&&submittedAssignments.length==0&&<NoAssignment/>}
          
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-4 mt-2">Evaluated Assignments</h2>
          {evaluatedAssignments&&evaluatedAssignments.map((item)=>(<Card className="my-2" key={item._id}>
            <CardHeader>
              <CardTitle>{item.asid.title}</CardTitle>
              <CardDescription>{item.asid.desc.slice(0,75)+"..."}</CardDescription>
              <div className="text-sm text-muted-foreground">Evaluated At : <span className="text-purple-600">{new Date(item.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span></div>
            </CardHeader>
            
            <CardContent>
              <div className="flex items-center justify-between">
                
                <div className="flex items-center gap-2">
                  <Badge variant="success">Evaluated</Badge>
                  <div className="text-sm text-primary font-semibold">Score: {item.marks}%</div>
                </div>
              </div>
            </CardContent>
          </Card>))}
          {evaluatedAssignments&&evaluatedAssignments.length==0&&<NoAssignment/>}
        </div>
      </div>
    </div>
    </>}
    </>
  )
}