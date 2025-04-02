"use client"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Toaster,toast } from "sonner"
import { useEffect,useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import SessionDetected from "./Auth/SessionDetected"
import Image from "next/image"
import HomePageSkl from "./skeleton/HomePageSkl"
import useFcmToken from "../../hooks/useFcmToken"
export default function Home() {
  const router = useRouter();
  const { token, notificationPermissionStatus } = useFcmToken();
const [data,setData] = useState(null);
const [user,setUser] = useState(null);
const [loading,setLoading] = useState(false);
const [isansession,setisansession] = useState(false)
const [assignment,setAssignment] = useState(3);
const [project,setProject] = useState(3);
const [allAssignment,setAllAssignment] = useState([]);
//getting projects
//getting submitted assignments
const fetchAllSubmittedAssignment = async(pendata,id,uid)=>{
 
  const res = await fetch(`/api/submitassignment?crid=${id}&&userid=${uid}`,{
    method:"GET",
    headers:{
      "Content-Type":"application/json",
      "token":localStorage.getItem("dilmsadmintoken")
    }
  })
  const data = await res.json()
  setLoading(false)
  if(data.success){
// Check if data.data exists and filter submitted and evaluated items
let submitted = data.data && data.data.filter((item) => item.status === "submitted");
let evaluated = data.data && data.data.filter((item) => item.status === "evaluated");

console.log('Submitted:', submitted);
console.log('Evaluated:', evaluated);

// Filter only pending data using pendata
let pending = pendata && pendata.filter((item) => {
  let isSubmitted = submitted && submitted.find((item2) => item2.asid && item2.asid._id === item._id);
  let isEvaluated = evaluated && evaluated.find((item2) => item2.asid && item2.asid._id === item._id);
  return !isSubmitted && !isEvaluated;
});

console.log('Pending:', pending);

// Set assignment count and all assignments
setAssignment(pending ? pending.length : 0);
setAllAssignment(pending);


    
  }
  else{
    //
  }
}
const fetchAllAssignment = async(id,uid)=>{
  console.log("id is ",id)
  const res = await fetch(`/api/assignment?id=${id}`,{
    method:"GET",
    headers:{
      "Content-Type":"application/json",
      "token":localStorage.getItem("dilmsadmintoken")
    }
  })
  const data = await res.json()
  if(data.success){
    fetchAllSubmittedAssignment(data.data,id,uid)
  }
  else{
    toast.error(data.message)
    console.log(data)
  }
}
//sending notification
const SendNotification = async(id,title)=>{
try{
const res = await fetch("/api/notificationtoken",{
  method:"POST",
  headers:{
    "Content-Type":"application/json",
    "token":localStorage.getItem("dilmstoken")
  },
 body:JSON.stringify({
    crid:id,
    token:token,
    title:title
 })
})
let result  = await res.json();
}
catch(err){
  console.log(err)
}
}
//validating user with home auth
const validatesFunc = async(token)=>{
  console.log(token);
  setLoading(true);
 const response = await fetch("/api/homeauth",{
  method:"POST",
  headers:{
    "content-type":"application/json",
    "token":token
  }
 })
const res = await response.json();
  setLoading(false);
console.log(res);
if(res.success){
setData(res.data);
setUser(res.user)
// fetchAllAssignment(res.data&&res.data[0].courseid._id,res.user._id);
}
else{
toast.error(res.message);
if(res.ansession){
  setisansession(true);
 setTimeout(()=>{
  router.push("/login");
 },1000)
}
  router.push("/login");
}
}
  useEffect(()=>{
 validatesFunc(localStorage.getItem("dilmstoken"));
  },[])
  useEffect(()=>{
    if(token!=null&&data!=null){
      data&&data.map((item,index)=>{
        SendNotification(item.courseid._id,item.courseid.title)
      })
    }
  },[token,data])
  return (
    <>
    <Toaster position="top-center" expand={false}/>
    {loading&&<HomePageSkl/>}
    {isansession&&<SessionDetected/>}
    {!loading&&!isansession&&<div className="flex flex-col w-full min-h-screen bg-background">
      
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Courses</CardTitle>
              <BookOpenIcon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data&&data.length}</div>
              <p className="text-xs text-muted-foreground">Enrolled</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Assignments</CardTitle>
              <ClipboardIcon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assignment}</div>
              <p className="text-xs text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Projects</CardTitle>
              <BriefcaseIcon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{project}</div>
              <p className="text-xs text-muted-foreground">Ongoing</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Leaderboard</CardTitle>
              <TrophyIcon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{"99+"}</div>
              <p className="text-xs text-muted-foreground">Rank</p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Courses</CardTitle>
              <Link href="/course" className="text-sm text-primary" prefetch={false}>
                View All
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {data&&data.map((item,index)=>(<div className="flex items-center justify-between" key={index}>
                  <div className="flex items-center gap-2">
                    <Image src={item.courseid.img} width="40" height="40" className="rounded-lg" alt="Course Thumbnail" />
                    <div>
                      <div className="font-medium">{item.courseid.title}</div>
                      <div className="text-xs text-muted-foreground">Completed: {item.progress}%</div>
                    </div>
                  </div>
                  <Progress value={item.progress
                  } className="w-20" />
                </div>))}
           
            
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Assignments</CardTitle>
              <Link href="/assignment" className="text-sm text-primary" prefetch={false}>
                View All
              </Link>
            </CardHeader>
            <CardContent>
             <div className="grid gap-4">
             { allAssignment&&allAssignment.slice(0,3).map((item,index)=>(<div className="flex items-center justify-between" key={index}>
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-muted p-2 text-2xl">
                      <ClipboardIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-medium">{item.title}</div>
                      <div className="text-xs text-muted-foreground">Due: {new Date(item.duedate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">Pending</div>
                </div>))}
                </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Projects</CardTitle>
              <Link href="/project" className="text-sm text-primary" prefetch={false}>
                View All
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-muted p-2 text-2xl">
                      <BriefcaseIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-medium">Capstone Project</div>
                      <div className="text-xs text-muted-foreground">Completed: 0%</div>
                    </div>
                  </div>
                  <Progress value={1} className="w-20" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-muted p-2 text-2xl">
                      <BriefcaseIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-medium">Group Project</div>
                      <div className="text-xs text-muted-foreground">Completed: 0%</div>
                    </div>
                  </div>
                  <Progress value={1} className="w-20" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-muted p-2 text-2xl">
                      <BriefcaseIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-medium">Individual Project</div>
                      <div className="text-xs text-muted-foreground">Completed: 0%</div>
                    </div>
                  </div>
                  <Progress value={1} className="w-20" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Leaderboard</CardTitle>
            <Link href="#" className="text-sm text-primary" prefetch={false}>
              View All
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-muted p-2 text-2xl">
                    <TrophyIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium">{user&&user.name}</div>
                    <div className="text-xs text-muted-foreground">Overall Score: 92%</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">Rank: 99+</div>
              </div>
           
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Link href="#" className="text-sm text-primary" prefetch={false}>
              View All
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-start gap-2">
                <div className="rounded-lg bg-muted p-2 text-2xl">
                  <BellIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium">New Course Announcement</div>
                  <div className="text-xs text-muted-foreground">
                    A new course on Cloud Computing has been added to the curriculum.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="rounded-lg bg-muted p-2 text-2xl">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium">Upcoming Deadline</div>
                  <div className="text-xs text-muted-foreground">
                    The final project proposal is due on July 26, 2024.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="rounded-lg bg-muted p-2 text-2xl">
                  <AwardIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-medium">Project Evaluation</div>
                  <div className="text-xs text-muted-foreground">
                    The project evaluation is due on August 20th, 2024.
                  </div>
                </div>
                <div />
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>}
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


function FrameIcon(props) {
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
      <line x1="22" x2="2" y1="6" y2="6" />
      <line x1="22" x2="2" y1="18" y2="18" />
      <line x1="6" x2="6" y1="2" y2="22" />
      <line x1="18" x2="18" y1="2" y2="22" />
    </svg>
  )
}


function SearchIcon(props) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
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