"use client"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Toaster, toast } from "sonner"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import SessionDetected from "./Auth/SessionDetected"
import HomePageSkl from "./skeleton/HomePageSkl"
import useFcmToken from "../../hooks/useFcmToken"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  const router = useRouter();
  const { token, notificationPermissionStatus } = useFcmToken();
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isansession, setisansession] = useState(false)
  const [assignment, setAssignment] = useState(3);
  const [project, setProject] = useState(3);
  const [allAssignment, setAllAssignment] = useState([]);
  const [attendance, setAttendance] = useState(87); // Added attendance state
  
  // Dummy team members data
  const teamMembers = [
    { id: 1, name: "Alex Johnson", avatar: "/api/placeholder/40/40", role: "leader" },
    { id: 2, name: "Maria Garcia", avatar: "/api/placeholder/40/40", role: "member" },
    { id: 3, name: "Sam Patel", avatar: "/api/placeholder/40/40", role: "member" },
    { id: 4, name: "Jordan Lee", avatar: "/api/placeholder/40/40", role: "member" },
    { id: 5, name: "Taylor Reyes", avatar: "/api/placeholder/40/40", role: "member" },
  ];

  // Project data with progress
  const projectData = [
    { id: 1, title: "Capstone Project", progress: 65, team: teamMembers },
    { id: 2, title: "Group Project", progress: 42, team: teamMembers },
    { id: 3, title: "Individual Project", progress: 28, team: null },
  ];

  // Function to fetch submitted assignments
  const fetchAllSubmittedAssignment = async(pendata, id, uid) => {
    const res = await fetch(`/api/submitassignment?crid=${id}&&userid=${uid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "token": localStorage.getItem("dilmsadmintoken")
      }
    })
    const data = await res.json()
    setLoading(false)
    if(data.success) {
      // Check if data.data exists and filter submitted and evaluated items
      let submitted = data.data && data.data.filter((item) => item.status === "submitted");
      let evaluated = data.data && data.data.filter((item) => item.status === "evaluated");
      
      // Filter only pending data using pendata
      let pending = pendata && pendata.filter((item) => {
        let isSubmitted = submitted && submitted.find((item2) => item2.asid && item2.asid._id === item._id);
        let isEvaluated = evaluated && evaluated.find((item2) => item2.asid && item2.asid._id === item._id);
        return !isSubmitted && !isEvaluated;
      });
      
      // Set assignment count and all assignments
      setAssignment(pending ? pending.length : 0);
      setAllAssignment(pending);
    }
  }

  const fetchAllAssignment = async(id, uid) => {
    const res = await fetch(`/api/assignment?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "token": localStorage.getItem("dilmsadmintoken")
      }
    })
    const data = await res.json()
    if(data.success) {
      fetchAllSubmittedAssignment(data.data, id, uid)
    }
    else {
      toast.error(data.message)
    }
  }

  // Send notification function
  const SendNotification = async(id, title) => {
    try {
      const res = await fetch("/api/notificationtoken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token": localStorage.getItem("dilmstoken")
        },
        body: JSON.stringify({
          crid: id,
          token: token,
          title: title
        })
      })
      let result = await res.json();
    }
    catch(err) {
      console.log(err)
    }
  }

  // Validate user with home auth
  const validatesFunc = async(token) => {
    setLoading(true);
    const response = await fetch("/api/homeauth", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "token": token
      }
    })
    const res = await response.json();
    setLoading(false);
    
    if(res.success) {
      setData(res.data);
      setUser(res.user)
      // fetchAllAssignment(res.data && res.data[0].courseid._id, res.user._id);
    }
    else {
      toast.error(res.message);
      if(res.ansession) {
        setisansession(true);
        setTimeout(() => {
          router.push("/login");
        }, 1000)
      }
      router.push("/login");
    }
  }

  useEffect(() => {
    validatesFunc(localStorage.getItem("dilmstoken"));
  }, [])

  useEffect(() => {
    if(token != null && data != null) {
      data && data.map((item, index) => {
        SendNotification(item.courseid._id, item.courseid.title)
      })
    }
  }, [token, data])

  // Format date function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  return (
    <>
      <Toaster position="top-center" expand={false} />
      {loading && <HomePageSkl />}
      {isansession && <SessionDetected />}
      {!loading && !isansession && (
        <div className="flex flex-col w-full min-h-screen bg-gradient-to-b from-background to-muted/20">
          {/* Welcome section */}
          <div className="bg-primary/10 p-6 mb-4">
            <div className="container mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold">Welcome back, {user && user.name}</h1>
                  <p className="text-muted-foreground">Continue your learning journey</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <BellIcon className="w-4 h-4 mr-2" />
                    Notifications
                  </Button>
                  <Button>
                    <ClipboardIcon className="w-4 h-4 mr-2" />
                    Upcoming Tasks
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-6 px-4 py-2 md:px-10">
            {/* Stats cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Courses</CardTitle>
                  <div className="p-2 rounded-full bg-blue-100">
                    <BookOpenIcon className="w-4 h-4 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{data && data.length}</div>
                  <p className="text-xs text-muted-foreground">Enrolled</p>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Assignments</CardTitle>
                  <div className="p-2 rounded-full bg-yellow-100">
                    <ClipboardIcon className="w-4 h-4 text-yellow-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{assignment}</div>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Projects</CardTitle>
                  <div className="p-2 rounded-full bg-green-100">
                    <BriefcaseIcon className="w-4 h-4 text-green-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{project}</div>
                  <p className="text-xs text-muted-foreground">Ongoing</p>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Attendance</CardTitle>
                  <div className="p-2 rounded-full bg-purple-100">
                    <CalendarCheckIcon className="w-4 h-4 text-purple-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className="text-3xl font-bold">{attendance}%</div>
                  </div>
                  <div className="mt-2">
                    <Progress value={attendance} className="h-2 bg-muted" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Overall Attendance</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Main content */}
            <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
              {/* Courses section */}
              <Card className="md:col-span-1 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-lg font-semibold">My Courses</CardTitle>
                    <p className="text-xs text-muted-foreground">Track your learning progress</p>
                  </div>
                  <Link href="/course" className="text-sm text-primary hover:underline" prefetch={false}>
                    View All
                  </Link>
                </CardHeader>
                <CardContent className="max-h-96 overflow-y-auto py-2 px-1">
                  <div className="grid gap-4">
                    {data && data.map((item, index) => (
                      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors" key={index}>
                        <Image 
                          src={item.courseid.img || "/api/placeholder/60/60"} 
                          width="60" 
                          height="60" 
                          className="rounded-lg object-cover" 
                          alt="Course Thumbnail" 
                        />
                        <div className="flex-1">
                          <div className="font-medium line-clamp-1">{item.courseid.title}</div>
                          <div className="flex items-center justify-between mt-1">
                            <div className="text-xs text-muted-foreground">Progress: {item.progress}%</div>
                          </div>
                          <Progress value={item.progress} className="h-1.5 mt-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Assignments section */}
              <Card className="md:col-span-1 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-lg font-semibold">Pending Assignments</CardTitle>
                    <p className="text-xs text-muted-foreground">Due tasks to complete</p>
                  </div>
                  <Link href="/assignment" className="text-sm text-primary hover:underline" prefetch={false}>
                    View All
                  </Link>
                </CardHeader>
                <CardContent className="max-h-96 overflow-y-auto py-2 px-1">
                  <div className="grid gap-4">
                    {allAssignment && allAssignment.slice(0, 5).map((item, index) => (
                      <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors" key={index}>
                        <div className="rounded-lg bg-yellow-100 p-2 flex items-center justify-center">
                          <ClipboardIcon className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{item.title}</div>
                          <div className="flex items-center justify-between mt-1">
                            <div className="text-xs text-muted-foreground flex items-center">
                              <CalendarIcon className="w-3 h-3 mr-1" />
                              Due: {formatDate(item.duedate)}
                            </div>
                            <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                              Pending
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                    {(!allAssignment || allAssignment.length === 0) && (
                      <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                        <ClipboardCheckIcon className="w-12 h-12 mb-2" />
                        <p>No pending assignments</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Notifications section */}
              <Card className="md:col-span-1 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-lg font-semibold">Notifications</CardTitle>
                    <p className="text-xs text-muted-foreground">Recent updates and alerts</p>
                  </div>
                  <Link href="#" className="text-sm text-primary hover:underline" prefetch={false}>
                    View All
                  </Link>
                </CardHeader>
                <CardContent className="max-h-96 overflow-y-auto py-2 px-1">
                  <div className="grid gap-4">
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="rounded-lg bg-blue-100 p-2 flex items-center justify-center">
                        <BellIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="font-medium">New Course Announcement</div>
                          <Badge variant="outline" className="text-xs">New</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          A new course on Cloud Computing has been added to the curriculum.
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">2 hours ago</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="rounded-lg bg-green-100 p-2 flex items-center justify-center">
                        <CalendarIcon className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">Upcoming Deadline</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          The final project proposal is due on July 26, 2024.
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">1 day ago</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="rounded-lg bg-purple-100 p-2 flex items-center justify-center">
                        <AwardIcon className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium">Project Evaluation</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          The project evaluation is due on August 20th, 2024.
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">3 days ago</div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="rounded-lg bg-red-100 p-2 flex items-center justify-center">
                        <AlertCircleIcon className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <div className="font-medium">Attendance Warning</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Your attendance is below the required percentage in Database Design.
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">4 days ago</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Projects and Leaderboard section */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Projects section with tabs */}
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-lg font-semibold">Projects</CardTitle>
                    <p className="text-xs text-muted-foreground">Track your project progress</p>
                  </div>
                  <Link href="/project" className="text-sm text-primary hover:underline" prefetch={false}>
                    View All
                  </Link>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="capstone" className="w-full">
                    <TabsList className="grid grid-cols-3 mb-4">
                      <TabsTrigger value="capstone">Capstone</TabsTrigger>
                      <TabsTrigger value="group">Group</TabsTrigger>
                      <TabsTrigger value="individual">Individual</TabsTrigger>
                    </TabsList>
                    
                    {projectData.map((project, index) => (
                      <TabsContent value={index === 0 ? "capstone" : index === 1 ? "group" : "individual"} key={index}>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="font-semibold">{project.title}</div>
                            <Badge variant={index === 0 ? "default" : index === 1 ? "secondary" : "outline"}>
                              {project.progress}% Complete
                            </Badge>
                          </div>
                          
                          <Progress value={project.progress} className="h-2" />
                          
                          {project.team && (
                            <div className="pt-4">
                              <div className="text-sm font-medium mb-2">Team Members</div>
                              <div className="space-y-3">
                                {project.team.map((member) => (
                                  <div className="flex items-center justify-between" key={member.id}>
                                    <div className="flex items-center gap-2">
                                      <Avatar className="w-8 h-8">
                                        <AvatarImage src={member.avatar} alt={member.name} />
                                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                      </Avatar>
                                      <div className="text-sm">{member.name}</div>
                                    </div>
                                    {member.role === "leader" && (
                                      <Badge className="bg-amber-500 hover:bg-amber-600">Leader</Badge>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex justify-end pt-2">
                            <Button size="sm">View Details</Button>
                          </div>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
              
              {/* Leaderboard section with attendance */}
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-lg font-semibold">Leaderboard</CardTitle>
                    <p className="text-xs text-muted-foreground">Your performance and ranking</p>
                  </div>
                  <Link href="#" className="text-sm text-primary hover:underline" prefetch={false}>
                    View All
                  </Link>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-6 bg-gradient-to-r from-primary/20 to-primary/5 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-primary/20 p-2">
                        <TrophyIcon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-lg">{user && user.name}</div>
                        <div className="text-xs text-muted-foreground">Overall Score: 92%</div>
                      </div>
                    </div>
                    <div>
                      <Badge variant="outline" className="bg-primary/10 text-primary">Rank: 99+</Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-sm font-medium">Attendance</div>
                        <div className="text-sm">{attendance}%</div>
                      </div>
                      <Progress value={attendance} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-sm font-medium">Assignment Completion</div>
                        <div className="text-sm">85%</div>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-sm font-medium">Quiz Performance</div>
                        <div className="text-sm">92%</div>
                      </div>
                      <Progress value={92} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <div className="text-sm font-medium">Project Grades</div>
                        <div className="text-sm">78%</div>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t">
                    <h4 className="text-sm font-medium mb-3">Top Performers</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-amber-500 hover:bg-amber-600 w-6 h-6 flex items-center justify-center rounded-full p-0">1</Badge>
                          <Avatar className="w-8 h-8">
                            <AvatarImage src="/api/placeholder/40/40" alt="Top performer" />
                            <AvatarFallback>JP</AvatarFallback>
                          </Avatar>
                          <div className="text-sm">John Parker</div>
                        </div>
                        <div className="text-sm">97%</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-slate-400 hover:bg-slate-500 w-6 h-6 flex items-center justify-center rounded-full p-0">2</Badge>
                          <Avatar className="w-8 h-8">
                            <AvatarImage src="/api/placeholder/40/40" alt="Top performer" />
                            <AvatarFallback>SS</AvatarFallback>
                          </Avatar>
                          <div className="text-sm">Sarah Smith</div>
                        </div>
                        <div className="text-sm">95%</div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-amber-700 hover:bg-amber-800 w-6 h-6 flex items-center justify-center rounded-full p-0">3</Badge>
                          <Avatar className="w-8 h-8">
                            <AvatarImage src="/api/placeholder/40/40" alt="Top performer" />
                            <AvatarFallback>RK</AvatarFallback>
                          </Avatar>
                          <div className="text-sm">Ryan Kim</div>
                        </div>
                        <div className="text-sm">94%</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      )}
    </>
  )
}

function AwardIcon(props) {
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
      <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526" />
      <circle cx="12" cy="8" r="6" />
    </svg>
  )
}

function BellIcon(props) {
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
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )
}

function BookOpenIcon(props) {
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
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
}

function BriefcaseIcon(props) {
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
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <rect width="20" height="14" x="2" y="6" rx="2" />
    </svg>
  )
}

function CalendarIcon(props) {
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
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  )
}

function CalendarCheckIcon(props) {
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
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="m9 16 2 2 4-4" />
    </svg>
  )
}

function ClipboardIcon(props) {
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
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  )
}

function ClipboardCheckIcon(props) {
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
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="m9 14 2 2 4-4" />
    </svg>
  )
}

function TrophyIcon(props) {
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
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  )
}

function AlertCircleIcon(props) {
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
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  )
}