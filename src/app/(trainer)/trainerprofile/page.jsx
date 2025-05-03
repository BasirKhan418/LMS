"use client"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {Toaster,toast} from "sonner";
import { useEffect, useState } from "react"
import ProfilePageSkeleton from "@/utilities/skeleton/ProfilePageSkeleton";
import { CourseData } from "../../../../functions/Coursedata"
export default function Page() {
  const [data,setData] =useState(null)
  const [courses,setCourses] = useState(null)
  const [loading,setLoading] = useState(false)
  const [avname,setavname] = useState("DI")
  //validate function
  const validatesFunc = async(token)=>{
    
    setLoading(true);
   const response = await fetch("/api/trainerhomeauth",{
    method:"POST",
    headers:{
      "content-type":"application/json",
      "token":token
    }
   })
  const res = await response.json();
  
    setLoading(false);
  if(res.success){
    setData(res.data)
    fetchCoursedata(res.data[0].batches);
    let user = res.data[0];

    // Split the name into an array of words
    let nameParts = user.name.split(" ");
    
    // Extract the initials from the first and second words
    let initials = nameParts[0][0].toUpperCase() + nameParts[1][0].toUpperCase();
    
   
    
    // Set the initials to the state variable (assuming setavname is a state setter function)
    setavname(initials);
  }
  else{
  toast.error(res.message);
  setTimeout(()=>{
    router.push("/adminlogin");
      },1000)
  }
  }
  const fetchCoursedata = async(batch)=>{
    setLoading(true);
    let data = await CourseData();
    setLoading(false);

    if(data.success){
        let coursedata = data.data.filter((course)=>{
            return batch.includes(course.batch);
        })
        
        setCourses(coursedata);
    }
    else{
      toast.error(data.message);
    } 
  }
  useEffect(()=>{
validatesFunc(localStorage.getItem("dilmsadmintoken"))

  },[])

  return (
    <>
    <Toaster position='top-center' expand={false}/>
    {loading?<ProfilePageSkeleton/>:<div className="flex flex-col items-center justify-center min-h-screen bg-muted/40">
      <div className="w-full max-w-4xl bg-background rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row">
          <div className="bg-slate-900 p-8 rounded-t-lg md:rounded-t-none md:rounded-l-lg md:w-1/3">
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback>{avname}</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold text-primary-foreground mb-2">{data&&data[0].name}</h2>
              <p className="text-primary-foreground">
                <span className="font-medium "> {data&&data[0].email}</span> 
              </p>
              <p className="text-primary-foreground">
                <span className="font-medium">TrainerId:</span>{data&&data[0]._id.slice(10)}
              </p>
            </div>
          </div>
          <div className="p-8 md:w-2/3">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Trainer Details</h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={()=>{toast.error("Contact admin to edit your profile")}}>
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={()=>{toast.error("Contact admin to delete your profile")}}>
                  Delete
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="text-lg font-medium mb-2">Role</h4>
                <p>Trainer</p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="text-lg font-medium mb-2">Permissions</h4>
                <ul className="list-disc pl-4">
                  <li>Take classses</li>
                  <li>Manage courses</li>
                  <li>Generate reports</li>
                  <li>Access Projects</li>
                  <li>Access Assignments</li>
                </ul>
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4">Courses Managed</h3>
            <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Course Name</TableHead>
          <TableHead>Image</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Seats</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {courses&&courses.map((course, index) => (
          <TableRow key={index}>
            <TableCell>{course.title}</TableCell>
            <TableCell>
              <img src={course.img} alt={course.title} className="w-16 h-16 rounded-md" />
            </TableCell>
            <TableCell>
              <Badge variant={course.isopen ? "success" : "warning"}>
                {course.isopen ? "Open" : "Closed"}
              </Badge>
            </TableCell>
            <TableCell>{course.seats}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2" >
                <Button variant="outline" size="sm" onClick={()=>{toast.warning("You dont have permission to edit this course details . Go to courses page to manage this course")}}>
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={()=>{toast.warning("You dont have permission to delete this course")}}>
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
      </div>
    </div>}
    </>
  )
}