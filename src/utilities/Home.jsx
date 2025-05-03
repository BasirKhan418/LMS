"use client";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Toaster, toast } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SessionDetected from "./Auth/SessionDetected";
import HomePageSkl from "./skeleton/HomePageSkl";
import useFcmToken from "../../hooks/useFcmToken";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CirclePlay, FolderOpenDot } from "lucide-react";
export default function Home() {
  const router = useRouter();
  const { token, notificationPermissionStatus } = useFcmToken();
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isansession, setisansession] = useState(false);
  const [assignment, setAssignment] = useState(3);
  const [project, setProject] = useState(1);
  const [allAssignment, setAllAssignment] = useState([]);
  const [attendance, setAttendance] = useState(87); // Added attendance state
  const [allNotification, setAllNotification] = useState([]);
  const [notificationCount, setNotificationCount] = useState(3);
  const [attendancepercentage, setAttendancePercentage] = useState(0); // Added attendance percentage state
  const [team, setTeam] = useState({
    team: [],
  }); // Added team state
  // Dummy team members data
  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      name: "Alex Johnson",
      avatar: "/api/placeholder/40/40",
      role: "leader",
    },
    {
      id: 2,
      name: "Maria Garcia",
      avatar: "/api/placeholder/40/40",
      role: "member",
    },
    {
      id: 3,
      name: "Sam Patel",
      avatar: "/api/placeholder/40/40",
      role: "member",
    },
    {
      id: 4,
      name: "Jordan Lee",
      avatar: "/api/placeholder/40/40",
      role: "member",
    },
    {
      id: 5,
      name: "Taylor Reyes",
      avatar: "/api/placeholder/40/40",
      role: "member",
    },
  ]);

  // Project data with progress
  const projectData = [
    { id: 1, title: "Capstone Project", progress: 65, team: teamMembers },
    { id: 2, title: "Group Project", progress: 42, team: [] },
    { id: 3, title: "Individual Project", progress: 28, team: null },
  ];

  // Function to fetch submitted assignments
  const fetchAllSubmittedAssignment = async (pendata, id, uid) => {
    const res = await fetch(`/api/submitassignment?crid=${id}&&userid=${uid}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("dilmsadmintoken"),
      },
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      // Check if data.data exists and filter submitted and evaluated items
      let submitted =
        data.data && data.data.filter((item) => item.status === "submitted");
      let evaluated =
        data.data && data.data.filter((item) => item.status === "evaluated");

      // Filter only pending data using pendata
      let pending =
        pendata &&
        pendata.filter((item) => {
          let isSubmitted =
            submitted &&
            submitted.find(
              (item2) => item2.asid && item2.asid._id === item._id
            );
          let isEvaluated =
            evaluated &&
            evaluated.find(
              (item2) => item2.asid && item2.asid._id === item._id
            );
          return !isSubmitted && !isEvaluated;
        });

      // Set assignment count and all assignments
      setAssignment(pending ? pending.length : 0);
      setAllAssignment(pending);
    }
  };

  const fetchAllAssignment = async (id, uid) => {
    const res = await fetch(`/api/assignment?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("dilmsadmintoken"),
      },
    });
    const data = await res.json();
    if (data.success) {
      fetchAllSubmittedAssignment(data.data, id, uid);
    } else {
      toast.error(data.message);
    }
  };
//handle notification
function getRelativeTime(dateTimeString) {
  // Parse input datetime
  const inputDate = new Date(dateTimeString);
  
  // Get current datetime
  const currentDate = new Date();
  
  // Calculate difference in milliseconds
  const diffMs = inputDate - currentDate;
  const isPast = diffMs < 0;
  
  // Get absolute difference
  const absDiffMs = Math.abs(diffMs);
  
  // Convert to appropriate units
  const seconds = Math.floor(absDiffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  // Format relative time string
  let result = '';
  
  if (years > 0) {
    result = `${years} ${years === 1 ? 'year' : 'years'}`;
  } else if (months > 0) {
    result = `${months} ${months === 1 ? 'month' : 'months'}`;
  } else if (days > 0) {
    result = `${days} ${days === 1 ? 'day' : 'days'}`;
  } else if (hours > 0) {
    result = `${hours} ${hours === 1 ? 'hr' : 'hrs'}`;
  } else if (minutes > 0) {
    result = `${minutes} ${minutes === 1 ? 'min' : 'mins'}`;
  } else {
    result = `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`;
  }
  
  // Add past/future indicator
  return `${result} ${isPast ? 'ago' : 'after'}`;
}
  // Send notification function
  const SendNotification = async (id, title) => {
    try {
      const res = await fetch("/api/notificationtoken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("dilmstoken"),
        },
        body: JSON.stringify({
          crid: id,
          token: token,
          title: title,
        }),
      });
      let result = await res.json();
    } catch (err) {
      console.log(err);
    }
  };
  //find users team details
  const findYourTeam = async (batchid, userid) => {
    try {
      const res = await fetch("/api/findyourteam", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("dilmstoken"),
        },
        body: JSON.stringify({
          batchid: batchid,
          userid: userid,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTeam(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Error in finding your team");
      console.log(err);
    }
  };
  //findallnotification to the user
  const findAllNotification = async (batchid) => {
    try {
      const res = await fetch("/api/usernotification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("dilmstoken"),
        },
        body: JSON.stringify({
          batchid: batchid,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAllNotification(data.data);
        console.log("data is from notification", data.data);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };
  //fetch Attendance 
  const fetchAttendance = async (batchid, duration,userid) => {
    console.log("fetching attendance",batchid,duration,userid)
  try{
    setLoading(true);
 const res = await fetch("/api/attendance/percentage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("dilmstoken"),
    },
    body: JSON.stringify({
      batchid: batchid,
      duration: duration,
      userid:userid
    }),
 })
 const data = await res.json();
 console.log("Attendance data",data)
 setLoading(false);
  if (data.success) {
    console.log("Attendance data",data.data)
    console.log("Attendance percentage",data.userAttendance.attendancePercentage)
   setAttendancePercentage(data.userAttendance.attendancePercentage)
  }
  else{
  console.log(data.message)
  }
  }
  catch(err){
    console.log(err)
  }
  }
  // Validate user with home auth
  const validatesFunc = async (token) => {
    setLoading(true);
    const response = await fetch("/api/homeauth", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        token: token,
      },
    });
    const res = await response.json();
    setLoading(false);

    if (res.success) {
      setData(res.data);
      console.log(res);
      fetchAttendance(res.batch._id, res.user.month,res.user._id);
      findYourTeam(res.batch._id, res.user._id);
      findAllNotification(res.batch._id);
      const result = res.data.find(
        (item) => item.courseid.coursetype == "live"
      );
      fetchAllAssignment(result && result.courseid._id, res.user._id);
      console.log(result);
      setUser(res.user);
      // fetchAllAssignment(res.data && res.data[0].courseid._id, res.user._id);
    } else {
      toast.error(res.message);
      if (res.ansession) {
        setisansession(true);
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      }
      router.push("/login");
    }
  };

  useEffect(() => {
    validatesFunc(localStorage.getItem("dilmstoken"));
  }, []);

  useEffect(() => {
    if (token != null && data != null) {
      data &&
        data.map((item, index) => {
          SendNotification(item.courseid._id, item.courseid.title);
        });
    }
  }, [token, data]);

  // Format date function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };
console.log("attendance percentage",attendancepercentage)
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
                  <h1 className="text-2xl font-bold">
                    Welcome back, {user && user.name}
                  </h1>
                  <p className="text-muted-foreground">
                    Continue your learning journey
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Link
                    href="/poject"
                    className=" hover:underline"
                    prefetch={false}
                  >
                    <Button variant="outline" size="sm">
                      <FolderOpenDot className="w-4 h-4 mr-2" />
                      Manage Projects
                    </Button>
                  </Link>
                  <Link
                    href="/course"
                    className=" hover:underline"
                    prefetch={false}
                  >
                    <Button>
                      <CirclePlay className="w-4 h-4 mr-2" />
                      Continue Learning
                    </Button>
                  </Link>
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
                  <div className="text-3xl font-bold">
                    {data && data.length}
                  </div>
                  <p className="text-xs text-muted-foreground">Enrolled</p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow">
                <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Assignments
                  </CardTitle>
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
                  <CardTitle className="text-sm font-medium">
                    Projects
                  </CardTitle>
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
                  <CardTitle className="text-sm font-medium">
                    Attendance
                  </CardTitle>
                  <div className="p-2 rounded-full bg-purple-100">
                    <CalendarCheckIcon className="w-4 h-4 text-purple-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className="text-3xl font-bold">{attendancepercentage}%</div>
                  </div>
                  <div className="mt-2">
                    <Progress value={attendancepercentage} className="h-2 bg-muted" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Overall Attendance
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Main content */}
            <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-3">
              {/* Courses section */}
              <Card className="md:col-span-1 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      My Courses
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      Track your learning progress
                    </p>
                  </div>
                  <Link
                    href="/course"
                    className="text-sm text-primary hover:underline"
                    prefetch={false}
                  >
                    View All
                  </Link>
                </CardHeader>
                <CardContent className="max-h-96 overflow-y-auto py-2 px-1">
                  <div className="grid gap-4">
                    {data &&
                      data.map((item, index) => (
                        <div
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                          key={index}
                        >
                          <Image
                            src={item.courseid.img || "/api/placeholder/60/60"}
                            width="60"
                            height="60"
                            className="rounded-lg object-cover"
                            alt="Course Thumbnail"
                          />
                          <div className="flex-1">
                            <div className="font-medium line-clamp-1">
                              {item.courseid.title}
                            </div>
                            <div className="flex items-center justify-between mt-1">
                              <div className="text-xs text-muted-foreground">
                                Progress: {item.progress}%
                              </div>
                            </div>
                            <Progress
                              value={item.progress}
                              className="h-1.5 mt-1"
                            />
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
                    <CardTitle className="text-lg font-semibold">
                      Pending Assignments
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      Due tasks to complete
                    </p>
                  </div>
                  <Link
                    href="/assignment"
                    className="text-sm text-primary hover:underline"
                    prefetch={false}
                  >
                    View All
                  </Link>
                </CardHeader>
                <CardContent className="max-h-96 overflow-y-auto py-2 px-1">
                  <div className="grid gap-4">
                    {allAssignment &&
                      allAssignment.slice(0, 5).map((item, index) => (
                        <div
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                          key={index}
                        >
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
                              <Badge
                                variant="outline"
                                className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200"
                              >
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
                    <CardTitle className="text-lg font-semibold">
                      Notifications
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      Recent updates and alerts
                    </p>
                  </div>
                  <button
                   onClick={()=>{
                    setNotificationCount(notificationCount==5?allNotification.length:5)
                   }}
                    className="text-sm text-primary hover:underline"
                    
                  >
                    View All
                  </button>
                </CardHeader>
                <CardContent className="max-h-96 overflow-y-auto py-2 px-1">
                  <div className="grid gap-4">
                    {allNotification &&
                      allNotification.slice(0,notificationCount).map((item) => (
                        <div
                          className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                          key={item._id}
                        >
                          <div className="rounded-lg bg-blue-100 p-2 flex items-center justify-center">
                            {item.category=="Announcements"&&<BellIcon className="w-5 h-5 text-blue-600" />}
                            {item.category=="Schedule"&&<CalendarIcon className="w-5 h-5 text-green-600" />}
                            {item.category=="Project"&&<AwardIcon className="w-5 h-5 text-purple-600" />}
                            {item.category=="Warning"&&<AlertCircleIcon className="w-5 h-5 text-red-600" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="font-medium">{item.title}</div>
                              <Badge variant="outline" className="text-xs">
                                New
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {item.description}
                            </div>
                            <div className="text-xs text-muted-foreground mt-2">
                              {getRelativeTime(item.sentTime)}
                            </div>
                          </div>
                        </div>
                      ))}
                    {allNotification && allNotification.length == 0 && (
                      <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
                        <BellIcon className="w-12 h-12 mb-4" />
                        Notification not found
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Projects and Activity Summary section */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Projects section */}
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      Projects
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      Track your project progress
                    </p>
                  </div>
                  <Link
                    href="/project"
                    className="text-sm text-primary hover:underline"
                    prefetch={false}
                  >
                    View All
                  </Link>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="project-1" className="w-full">
                    {team && team.team.length > 1 ? (
                      <div className="pt-4">
                        <div className="flex items-center justify-between mb-4 flex-wrap">
                          <div className="text-sm font-medium mb-2">Team</div>
                          <div className="text-sm font-medium mb-2 bg-green-100 p-1 rounded">
                            {team.teamname}
                          </div>
                        </div>
                        <div className="space-y-3">
                          {team != null &&
                            team.team.map((member) => (
                              <div
                                className="flex items-center justify-between"
                                key={member._id}
                              >
                                <div className="flex items-center gap-2">
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage
                                      src={member.avatar}
                                      alt={member.name}
                                    />
                                    <AvatarFallback>
                                      {member.name.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="text-sm">{member.name}</div>
                                </div>
                                {team.teamleaderid._id == member._id ? (
                                  <Badge className="bg-amber-500 hover:bg-amber-600">
                                    Leader
                                  </Badge>
                                ) : (
                                  <Badge variant="outline">Member</Badge>
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center p-6 mt-4 bg-muted/20 rounded-lg">
                        <UserPlusIcon className="w-12 h-12 mb-2 text-muted-foreground" />
                        <p className="text-center font-medium">
                          Group not created by admin
                        </p>
                        <p className="text-xs text-muted-foreground text-center mt-1">
                          Wait for instructor to assign team members.
                        </p>
                      </div>
                    )}
                  </Tabs>
                </CardContent>
              </Card>

              {/* Activity Summary section (replacing leaderboard) */}
              <Card className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      Your Activity
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      Recent learning progress
                    </p>
                  </div>
                  <Link
                    href="#"
                    className="text-sm text-primary hover:underline"
                    prefetch={false}
                  >
                    Full Report
                  </Link>
                </CardHeader>
                <CardContent>
                  {/* Weekly activity graph */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium mb-2">
                      Weekly Activity
                    </h4>
                    <div className="grid grid-cols-7 gap-2 mb-2">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                        (day, i) => (
                          <div
                            key={i}
                            className="text-xs text-center text-muted-foreground"
                          >
                            {day}
                          </div>
                        )
                      )}
                      {[40, 65, 85, 32, 45, 20, 60].map((height, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <div
                            className="w-full bg-primary/20 rounded-sm"
                            style={{ height: `${height}px` }}
                          ></div>
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground text-center mt-1">
                      Activity minutes by day
                    </div>
                  </div>

                  {/* Upcoming deadlines */}
                  <div className="space-y-4 mb-6">
                    <h4 className="text-sm font-medium">Upcoming Deadlines</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 rounded-lg bg-muted/20">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-full bg-red-100">
                            <FileClockIcon className="w-4 h-4 text-red-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">
                              Database Project
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Tomorrow, 11:59 PM
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-red-50 text-red-700 border-red-200"
                        >
                          Urgent
                        </Badge>
                      </div>

                      <div className="flex justify-between items-center p-2 rounded-lg bg-muted/20">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-full bg-amber-100">
                            <FileClockIcon className="w-4 h-4 text-amber-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">
                              UI/UX Design Quiz
                            </div>
                            <div className="text-xs text-muted-foreground">
                              May 2, 2025
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-amber-50 text-amber-700 border-amber-200"
                        >
                          Coming soon
                        </Badge>
                      </div>

                      <div className="flex justify-between items-center p-2 rounded-lg bg-muted/20">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-full bg-green-100">
                            <FileClockIcon className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">
                              Data Structures Assignment
                            </div>
                            <div className="text-xs text-muted-foreground">
                              May 5, 2025
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200"
                        >
                          Planned
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Learning streak */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Current Streak</h4>
                    <div className="flex items-center justify-between bg-gradient-to-r from-amber-100 to-amber-50 p-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-amber-500/20">
                          <FlameIcon className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                          <div className="font-medium text-lg">7 Days</div>
                          <div className="text-xs text-muted-foreground">
                            Keep learning to maintain your streak!
                          </div>
                        </div>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                          <div
                            key={day}
                            className="w-6 h-6 flex items-center justify-center"
                          >
                            <div className="w-4 h-4 rounded-full bg-amber-500"></div>
                          </div>
                        ))}
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
  );
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
  );
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
  );
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
  );
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
  );
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
  );
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
  );
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
  );
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
  );
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
  );
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
  );
}

function UserPlusIcon(props) {
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
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" x2="19" y1="8" y2="14" />
      <line x1="22" x2="16" y1="11" y2="11" />
    </svg>
  );
}
function FileClockIcon(props) {
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
      <path d="M16 22h2c.5 0 1-.2 1.4-.6.4-.4.6-.9.6-1.4V7.5L14.5 2H6c-.5 0-1 .2-1.4.6C4.2 3 4 3.5 4 4v3" />
      <path d="M14 2v6h6" />
      <circle cx="8" cy="16" r="6" />
      <path d="M9.5 17.5 8 16.25V14" />
    </svg>
  );
}
function FlameIcon(props) {
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
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}
