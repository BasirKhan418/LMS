"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LiaCertificateSolid } from "react-icons/lia";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Video,
  NotebookPen,
  ClipboardList,
  FolderGit2,
  TvMinimalPlay,
  BookCheck,
  MessageCircle,
  Calendar,
  Clock,
  VideoIcon,
  Folder,
  ArrowLeft,
  CheckCircle,
  ChevronDown,
  GraduationCap
} from "lucide-react";

// Component imports
import YtVideo from "./Course/YtVideo";
import VideoContent from "./Course/Video";
import UserAssignment from "./Assignment/UserAssignment";
import Project from "./Course/Project";
import PdfViewer from "./Pdf/pdfViewer";
import Chat from "./Ai/Chat";

export default function CourseSidebar({
  weeksdata,
  alldata,
  allcoursedata,
  crid,
}) {
  const router = useRouter();
  const [activeFolder, setActiveFolder] = useState("overview");
  const [aiopen, setAiopen] = useState(false);
  const [activemenu, setActivemenu] = useState("");
  const [content, setContent] = useState({});  // Initialize as empty object instead of array
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [menuWeek, setMenuWeek] = useState("");
  const [allComment, setAllComment] = useState([]);
  const [currentWeekindex, setCurrentWeekindex] = useState(0);
  const [currentContentindex, setCurrentContentindex] = useState(-1);
  const [userdata, setUserdata] = useState(null);
  const [progress, setProgress] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [batch, setBatch] = useState(null);
  const [currentCourse, setCurrentCourse] = useState(null);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Authentication function
  const validateUser = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/homeauth", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          token: localStorage.getItem("dilmstoken"),
        },
      });
      const res = await response.json();
      
      if (res.success) {
        setUserdata(res.user);
        let resdata = res.data.filter((item) => item.courseid._id === crid)[0];
        setCurrentCourse(resdata.courseid);
        let crcmp = resdata && resdata.crcmp;
        setBatch(res.batch);
        setData(res.data);
        setProgress(resdata?.progress || 0);
        
        if (crcmp && crcmp.length > 0) {
          weeksdata.forEach((weekItem, weekIdx) => {
            let matchedContent = weekItem.content.find(
              (contentItem) => contentItem.name === crcmp[crcmp.length - 1].name
            );
            
            if (matchedContent) {
              setCurrentWeekindex(weekIdx);
              setCurrentContentindex(weekItem.content.indexOf(matchedContent));
              setContent(matchedContent);
              setMenuWeek(weekItem.name);
              setActivemenu(matchedContent.name);
              setActiveFolder(matchedContent.type);
            }
          });
        }
      } else {
        setUserdata(null);
        toast.error(res.message);
      }
    } catch (err) {
      console.error("Authentication error:", err);
      toast.error("Failed to authenticate user");
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (id) => {
    try {
      setAllComment([]);
      const res = await fetch(`/api/comment?id=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("dilmstoken"),
        },
      });
      const result = await res.json();
      
      if (result.success) {
        if (result.data && result.data.comment != null) {
          setAllComment(result.data.comment);
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    }
  };

  const updateProgress = async () => {
    // Check if content and content.name exist before proceeding
    if (!content || !content.name) {
      console.log("No content selected to update progress");
      return;
    }
    
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("dilmstoken"),
        },
        body: JSON.stringify({
          id: userdata?._id, // Add null check for userdata
          crid: crid,
          data: { name: content.name },
        }),
      });
      
      const result = await res.json();
      
      if (result.success) {
        toast.success(result.message);
        getProgressData();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error updating progress:", error);
      toast.error("Failed to update progress");
    }
  };

  const getProgressData = async () => {
    // Add null check for userdata
    if (!userdata || !userdata._id) return;
    
    try {
      const res = await fetch(`/api/progress?id=${userdata._id}&&crid=${crid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("dilmstoken"),
        },
      });
      
      const result = await res.json();
      
      if (result.success) {
        // Refresh user data
        validateUser();
      }
    } catch (error) {
      console.error("Error getting progress data:", error);
    }
  };

  const handleNavigationNext = () => {
    // First update progress for current content
    updateProgress();
    
    // Check if there are any weeks
    if (!weeksdata || weeksdata.length === 0) {
      return;
    }
    
    // Next content in current week
    if (currentContentindex < weeksdata[currentWeekindex]?.content?.length - 1) {
      const nextContentIndex = currentContentindex + 1;
      setCurrentContentindex(nextContentIndex);
      setMenuWeek(weeksdata[currentWeekindex].name);
      const nextContent = weeksdata[currentWeekindex].content[nextContentIndex];
      setContent(nextContent);
      setActivemenu(nextContent.name);
      setActiveFolder(nextContent.type);
    } 
    // First content in next week
    else if (currentWeekindex < weeksdata.length - 1) {
      const nextWeekIndex = currentWeekindex + 1;
      setCurrentWeekindex(nextWeekIndex);
      setCurrentContentindex(0);
      
      // Make sure the next week has content
      if (weeksdata[nextWeekIndex]?.content?.length > 0) {
        const firstContent = weeksdata[nextWeekIndex].content[0];
        setContent(firstContent);
        setMenuWeek(weeksdata[nextWeekIndex].name);
        setActivemenu(firstContent.name);
        setActiveFolder(firstContent.type);
      }
    }
  };

  const handleNavigationPrevious = () => {
    // Previous content in current week
    if (currentContentindex > 0) {
      const prevContentIndex = currentContentindex - 1;
      setCurrentContentindex(prevContentIndex);
      const prevContent = weeksdata[currentWeekindex].content[prevContentIndex];
      setContent(prevContent);
      setActivemenu(prevContent.name);
      setActiveFolder(prevContent.type);
    } 
    // Last content in previous week
    else if (currentWeekindex > 0) {
      const prevWeekIndex = currentWeekindex - 1;
      setCurrentWeekindex(prevWeekIndex);
      
      // Make sure previous week has content
      if (weeksdata[prevWeekIndex]?.content?.length > 0) {
        const lastContentIndex = weeksdata[prevWeekIndex].content.length - 1;
        setCurrentContentindex(lastContentIndex);
        const lastContent = weeksdata[prevWeekIndex].content[lastContentIndex];
        setContent(lastContent);
        setMenuWeek(weeksdata[prevWeekIndex].name);
        setActivemenu(lastContent.name);
        setActiveFolder(lastContent.type);
      }
    }
  };

  const isContentCompleted = (name) => {
    if (!data || !data[0] || !data[0].crcmp) {
      return false;
    }
    
    let courseData = data.find(item => item.courseid._id === crid);
    if (!courseData || !courseData.crcmp) return false;
    
    return courseData.crcmp.some(item => item.name === name);
  };

  const formatTime = (time) => {
    if (!time) return "";
    
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours, 10);
    let period = hours >= 12 ? "PM" : "AM";
    
    if (hours > 12) hours -= 12;
    else if (hours === 0) hours = 12;
    
    return `${hours}:${minutes} ${period}`;
  };

  const handleContentSelection = (item, weekIndex, contentIndex) => {
    setActiveFolder(item.type);
    setActivemenu(item.name);
    setContent(item);
    setCurrentWeekindex(weekIndex);
    setCurrentContentindex(contentIndex);
    
    if (item.type === "video" || item.type === "ytvideo") {
      fetchComments(item.name);
    }
    
    // Close sidebar on mobile when selecting content
    if (window.innerWidth < 768) {
      setIsMenuOpen(false);
    }
  };

  // Initialize data
  useEffect(() => {
    validateUser();
  }, []);

  // Content type icons with custom colors
  const contentTypeIcons = {
    video: <Video className="h-5 w-5 flex-shrink-0 text-blue-500" />,
    ytvideo: <Video className="h-5 w-5 flex-shrink-0 text-red-500" />,
    note: <NotebookPen className="h-5 w-5 flex-shrink-0 text-purple-500" />,
    assignment: <ClipboardList className="h-5 w-5 flex-shrink-0 text-amber-500" />,
    project: <FolderGit2 className="h-5 w-5 flex-shrink-0 text-emerald-500" />,
    meeting: <TvMinimalPlay className="h-5 w-5 flex-shrink-0 text-pink-500" />,
    test: <BookCheck className="h-5 w-5 flex-shrink-0 text-indigo-500" />,
  };

  return (
    <>
      <Toaster position="top-center" expand={false} richColors />

      <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-900">
        {/* Mobile Overlay */}
        {isMenuOpen && window.innerWidth < 768 && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } ${isMenuOpen ? "translate-x-0 md:translate-x-0" : "md:translate-x-0"}`}
        >
          <div className="flex h-full flex-col">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-300">
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center h-10 w-48" onClick={()=>{
                  setActiveFolder("overview")
                }}>
                  <img src="/9.png" alt="Logo" className="h-36 w-36 absolute" />
                </div>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-1 rounded-md bg-white/20 text-white hover:bg-white/30 md:hidden"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Progress Bar */}
            {currentCourse && currentCourse.coursetype !== "live" && (
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2 w-full">
                  <div className="flex-grow">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Course Progress</span>
                      <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                        {progress || 0}%
                      </span>
                    </div>
                    <Progress 
                      value={progress || 0} 
                      className="h-2.5 bg-blue-100 dark:bg-gray-700" 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Sidebar Menu */}
            <div className="flex-1 overflow-y-auto py-2 px-2">
              <Accordion
                type="single"
                collapsible
                value={menuWeek}
                onValueChange={setMenuWeek}
                className="space-y-2"
              >
                {currentCourse && weeksdata &&
                  currentCourse.coursetype === "recording" && weeksdata.map((week, weekIndex) => (
                    <AccordionItem
                      value={week.name}
                      key={weekIndex}
                      className="border rounded-lg overflow-hidden shadow-sm"
                    >
                      <AccordionTrigger className="flex items-center justify-between py-3 px-4 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-left bg-white dark:bg-gray-800">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-medium text-sm">
                            {weekIndex + 1}
                          </div>
                          <span className="font-medium text-sm truncate">{week.name}</span>
                        </div>
                        <ChevronDown className="h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200" />
                      </AccordionTrigger>
                      <AccordionContent className="pt-1 pb-2 bg-gray-50 dark:bg-gray-850">
                        <div className="ml-2 space-y-1">
                          {week.content && week.content.map((item, index) => (
                            <button
                              key={index}
                              className={`flex w-full items-center gap-3 rounded-md py-2.5 px-3 text-sm transition-colors ${
                                activemenu === item.name
                                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
                              }`}
                              onClick={() => handleContentSelection(item, weekIndex, index)}
                            >
                              <div className={`rounded-full p-1.5 ${
                                isContentCompleted(item.name) ? "bg-green-100 dark:bg-green-900/30" : "bg-gray-100 dark:bg-gray-800"
                              }`}>
                                {contentTypeIcons[item.type] || <Folder className="h-4 w-4" />}
                              </div>
                              <span className="truncate text-left flex-1">{item.name}</span>
                              {isContentCompleted(item.name) && (
                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              )}
                            </button>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}

                {userdata && currentCourse && weeksdata &&
                  currentCourse.coursetype === "live" && 
                  weeksdata.slice(0, userdata.month[0] * 4).map((week, weekIndex) => (
                    <AccordionItem
                      value={week.name}
                      key={weekIndex}
                      className="border rounded-lg overflow-hidden shadow-sm"
                    >
                      <AccordionTrigger className="flex items-center justify-between py-3 px-4 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-left bg-white dark:bg-gray-800">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-medium text-sm">
                            {weekIndex + 1}
                          </div>
                          <span className="font-medium text-sm truncate">{week.name}</span>
                        </div>
                        <ChevronDown className="h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200" />
                      </AccordionTrigger>
                      <AccordionContent className="pt-1 pb-2 bg-gray-50 dark:bg-gray-850">
                        <div className="ml-2 space-y-1">
                          {week.content && week.content.map((item, index) => (
                            <button
                              key={index}
                              className={`flex w-full items-center gap-3 rounded-md py-2.5 px-3 text-sm transition-colors ${
                                activemenu === item.name
                                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
                              }`}
                              onClick={() => handleContentSelection(item, weekIndex, index)}
                            >
                              <div className={`rounded-full p-1.5 ${
                                isContentCompleted(item.name) ? "bg-green-100 dark:bg-green-900/30" : "bg-gray-100 dark:bg-gray-800"
                              }`}>
                                {contentTypeIcons[item.type] || <Folder className="h-4 w-4" />}
                              </div>
                              <span className="truncate text-left flex-1">{item.name}</span>
                              {isContentCompleted(item.name) && (
                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              )}
                            </button>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
            </div>
            
            {/* Certificate/Help Button */}
            {currentCourse && currentCourse.coursetype === "recording" && (
              <div className="p-4 border-t">
                <Button
                  variant="outline"
                  className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <LiaCertificateSolid className="h-4 w-4 mr-2" />
                  Certificate
                </Button>
              </div>
            )}
            {currentCourse && currentCourse.coursetype === "live" && (
              <div className="p-4 border-t">
                <Button
                  variant="outline"
                  className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Help
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex flex-1 flex-col ${
          isSidebarOpen ? "md:ml-72" : "ml-0"
        } transition-all duration-300 ease-in-out`}>
          {/* Top Header */}
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white dark:bg-gray-800 px-4 shadow-sm">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {isSidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              
              <div className="hidden md:block">
                <h1 className="text-lg font-semibold">{alldata?.title}</h1>
                {activemenu && (
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="truncate">{activemenu}</span>
                    {activeFolder && (
                      <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                        {activeFolder}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <Link href="/course">
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:flex items-center gap-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Courses
                </Button>
              </Link>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNavigationPrevious}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden md:inline">Previous</span>
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleNavigationNext}
                  className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <span className="hidden md:inline">Mark as Complete</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                {activeFolder === "overview" && (
                  <div className="max-w-6xl mx-auto">
                    <section className="mb-12">
                      <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Welcome to {alldata?.title}
                          </h1>
                          <p className="text-gray-700 dark:text-gray-300 mb-6">
                            {alldata?.desc}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-6">
                            {alldata?.skills &&
                              alldata.skills.split(",").map((item, index) => (
                                <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                                  {item.trim()}
                                </Badge>
                              ))}
                          </div>
                          <div className="flex flex-wrap gap-4">
                            <Button
                              onClick={() => {
                                if (weeksdata && weeksdata.length > 0) {
                                  setMenuWeek(weeksdata[0].name);
                                  setIsSidebarOpen(true);
                                }
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Get Started
                            </Button>
                            <Button variant="outline">
                              <a href="#course-modules">Course Content</a>
                            </Button>
                          </div>
                        </div>
                        <div className="rounded-lg overflow-hidden shadow-lg">
                          <img
                            src={alldata?.img || "/placeholder-course.jpg"}
                            alt="Course Cover"
                            className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </div>
                    </section>

                    <section id="course-modules" className="pb-12">
                      <h2 className="text-2xl font-bold mb-6">Course Modules</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {weeksdata &&
                          weeksdata.map((week, index) => (
                            <Card
                              key={index}
                              className="overflow-hidden transition-all hover:shadow-lg border-none"
                            >
                              <div className="relative">
                                <img
                                  src="/course/folderimg.jpg"
                                  alt={week.name}
                                  className="w-full h-40 object-cover"
                                />
                                <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded-md text-sm">
                                  Module {index + 1}
                                </div>
                              </div>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg">
                                  {week.name}: {week.type}
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <CardDescription>{week.description}</CardDescription>
                                <Button
                                  variant="outline"
                                  className="w-full mt-4 border-blue-200 text-blue-600 hover:bg-blue-50"
                                  onClick={() => {
                                    setMenuWeek(week.name);
                                    setIsSidebarOpen(true);
                                  }}
                                >
                                  View Content
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </section>
                  </div>
                )}

                {activeFolder === "video" && (
                  <div className="max-w-6xl mx-auto">
                    <VideoContent
                      content={content}
                      allcoursedata={allcoursedata}
                      allComment={allComment}
                      setAllComment={setAllComment}
                    />
                  </div>
                )}

                {activeFolder === "ytvideo" && (
                  <div className="max-w-6xl mx-auto">
                    <YtVideo
                      content={content}
                      allcoursedata={allcoursedata}
                      allComment={allComment}
                      setAllComment={setAllComment}
                    />
                  </div>
                )}

                {activeFolder === "assignment" && (
                  <div className="max-w-6xl mx-auto">
                    <UserAssignment
                      id={crid}
                      userid={userdata?._id}
                    />
                  </div>
                )}

                {activeFolder === "note" && (
                  <div className="max-w-6xl mx-auto">
                    <PdfViewer content={content} />
                  </div>
                )}

                {activeFolder === "meeting" && (
                  <div className="max-w-md mx-auto">
                    <Card className="shadow-md border-none">
                      <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                        <CardTitle>{content?.name}</CardTitle>
                        <CardDescription className="text-blue-100">{content?.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4 pt-6">
                        <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                          <Calendar className="h-5 w-5 text-blue-600" />
                          <span>
                            {content?.date ? new Date(content.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }) : "Date not specified"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                          <Clock className="h-5 w-5 text-blue-600" />
                          <span>{formatTime(content?.time)} (IST)</span>
                        </div>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                          <a
                            href={content?.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full"
                          >
                            <VideoIcon className="h-5 w-5" />
                            Join Meeting
                          </a>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {activeFolder === "project" && (
                  <div className="max-w-6xl mx-auto">
                    <Project />
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Chat Button */}
      <Button
        onClick={() => setAiopen(!aiopen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg flex items-center justify-center p-0 z-40 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* AI Chat */}
      <Chat aiopen={aiopen} setaiopen={setAiopen} />
    </>
  );
}