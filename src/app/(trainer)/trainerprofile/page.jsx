"use client"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Toaster, toast } from "sonner"
import { useEffect, useState } from "react"
import ProfilePageSkeleton from "@/utilities/skeleton/ProfilePageSkeleton"
import { CourseData } from "../../../../functions/Coursedata"
import { useRouter } from "next/navigation"

export default function Page() {
  const router = useRouter()
  const [data, setData] = useState(null)
  const [courses, setCourses] = useState(null)
  const [loading, setLoading] = useState(false)
  const [avname, setavname] = useState("DI")

  // Validate function
  const validatesFunc = async(token) => {
    setLoading(true)
    const response = await fetch("/api/trainerhomeauth", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "token": token
      }
    })
    const res = await response.json()
    
    setLoading(false)
    if(res.success) {
      setData(res.data)
      fetchCoursedata(res.data[0].batches)
      let user = res.data[0]

      // Split the name into an array of words
      let nameParts = user.name.split(" ")
      
      // Extract the initials safely
      let initials = ""
      if (nameParts[0]) initials += nameParts[0][0]?.toUpperCase() || ""
      if (nameParts[1]) initials += nameParts[1][0]?.toUpperCase() || ""
      
      // Set the initials to the state variable
      setavname(initials || "DI")
    }
    else {
      toast.error(res.message)
      setTimeout(() => {
        router.push("/adminlogin")
      }, 1000)
    }
  }
  
  const fetchCoursedata = async(batch) => {
    setLoading(true)
    let data = await CourseData()
    setLoading(false)

    if(data.success) {
      let coursedata = data.data.filter((course) => {
        return batch.includes(course.batch)
      })
      
      setCourses(coursedata)
    }
    else {
      toast.error(data.message)
    } 
  }
  
  useEffect(() => {
    validatesFunc(localStorage.getItem("dilmsadmintoken"))
  }, [])

  return (
    <>
      <Toaster position='top-center' expand={false} />
      {loading ? <ProfilePageSkeleton /> : (
        <div className="flex flex-col items-center justify-center min-h-screen w-full bg-muted/40 px-2 py-4 sm:px-4">
          <div className="w-full max-w-4xl bg-background rounded-lg shadow-lg overflow-hidden">
            {/* Profile section - stack vertically on mobile, side by side on larger screens */}
            <div className="flex flex-col lg:flex-row w-full">
              {/* Profile sidebar */}
              <div className="bg-slate-900 p-4 sm:p-6 w-full lg:w-1/3">
                <div className="flex flex-col items-center">
                  <Avatar className="h-16 w-16 sm:h-20 sm:w-20 mb-4">
                    <AvatarFallback>{avname}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold text-primary-foreground mb-2 text-center">
                    {data && data[0].name}
                  </h2>
                  <p className="text-primary-foreground text-sm sm:text-base text-center break-words w-full">
                    {data && data[0].email}
                  </p>
                  <p className="text-primary-foreground text-sm sm:text-base mt-2">
                    <span className="font-medium">TrainerId: </span>
                    {data && data[0]._id.slice(10)}
                  </p>
                </div>
              </div>

              {/* Main content area */}
              <div className="p-4 sm:p-6 w-full lg:w-2/3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                  <h3 className="text-xl font-bold">Trainer Details</h3>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {toast.error("Contact admin to edit your profile")}}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {toast.error("Contact admin to delete your profile")}}
                    >
                      Delete
                    </Button>
                  </div>
                </div>

                {/* Info cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-muted p-3 rounded-lg">
                    <h4 className="text-base font-medium mb-2">Role</h4>
                    <p>Trainer</p>
                  </div>
                  <div className="bg-muted p-3 rounded-lg">
                    <h4 className="text-base font-medium mb-2">Permissions</h4>
                    <ul className="list-disc pl-4 text-sm">
                      <li>Take classses</li>
                      <li>Manage courses</li>
                      <li>Generate reports</li>
                      <li>Access Projects</li>
                      <li>Access Assignments</li>
                    </ul>
                  </div>
                </div>

                {/* Courses section */}
                <h3 className="text-xl font-bold mb-3">Courses Managed</h3>
                
                {/* Mobile-friendly course cards instead of table for small screens */}
                <div className="block sm:hidden">
                  {courses && courses.length > 0 ? (
                    <div className="space-y-4">
                      {courses.map((course, index) => (
                        <div key={index} className="bg-muted p-3 rounded-lg">
                          <div className="flex items-center gap-3 mb-2">
                            <img 
                              src={course.img} 
                              alt={course.title} 
                              className="w-12 h-12 rounded-md object-cover" 
                            />
                            <div>
                              <h4 className="font-medium">{course.title}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant={course.isopen ? "success" : "warning"}>
                                  {course.isopen ? "Open" : "Closed"}
                                </Badge>
                                <span className="text-sm">Seats: {course.seats}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex-1"
                              onClick={() => {toast.warning("You dont have permission to edit this course details. Go to courses page to manage this course")}}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="flex-1"
                              onClick={() => {toast.warning("You dont have permission to delete this course")}}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-muted p-4 rounded-lg text-center">
                      No courses assigned yet
                    </div>
                  )}
                </div>
                
                {/* Table for larger screens */}
                <div className="hidden sm:block">
                  <div className="w-full">
                    <div className="border rounded-md">
                      {/* Table Header */}
                      <div className="grid grid-cols-12 gap-2 p-3 border-b bg-muted/50 font-medium text-sm">
                        <div className="col-span-3">Course Name</div>
                        <div className="col-span-2">Image</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-2">Seats</div>
                        <div className="col-span-3">Actions</div>
                      </div>
                      
                      {/* Table Body */}
                      {courses && courses.length > 0 ? (
                        courses.map((course, index) => (
                          <div key={index} className="grid grid-cols-12 gap-2 p-3 border-b items-center text-sm">
                            <div className="col-span-3 font-medium">{course.title}</div>
                            <div className="col-span-2">
                              <img 
                                src={course.img} 
                                alt={course.title} 
                                className="w-12 h-12 rounded-md object-cover" 
                              />
                            </div>
                            <div className="col-span-2">
                              <Badge variant={course.isopen ? "success" : "warning"}>
                                {course.isopen ? "Open" : "Closed"}
                              </Badge>
                            </div>
                            <div className="col-span-2">{course.seats}</div>
                            <div className="col-span-3">
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {toast.warning("You dont have permission to edit this course details. Go to courses page to manage this course")}}
                                >
                                  Edit
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {toast.warning("You dont have permission to delete this course")}}
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center">
                          No courses assigned yet
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}