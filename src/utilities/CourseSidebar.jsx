"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
  ChevronDown
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
  const [content, setContent] = useState([]);
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
        let crcmp = resdata && resdata.crcmp;
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
    if (!content.name) return;
    
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("dilmstoken"),
        },
        body: JSON.stringify({
          id: userdata._id,
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
    updateProgress();
    
    if (currentContentindex < weeksdata[currentWeekindex].content.length - 1) {
      const nextContentIndex = currentContentindex + 1;
      setCurrentContentindex(nextContentIndex);
      setMenuWeek(weeksdata[currentWeekindex].name);
      setContent(weeksdata[currentWeekindex].content[nextContentIndex]);
      setActivemenu(weeksdata[currentWeekindex].content[nextContentIndex].name);
      setActiveFolder(weeksdata[currentWeekindex].content[nextContentIndex].type);
    } else if (currentWeekindex < weeksdata.length - 1) {
      const nextWeekIndex = currentWeekindex + 1;
      setCurrentWeekindex(nextWeekIndex);
      setCurrentContentindex(0);
      const firstContent = weeksdata[nextWeekIndex].content[0];
      setContent(firstContent);
      setMenuWeek(weeksdata[nextWeekIndex].name);
      setActivemenu(firstContent.name);
      setActiveFolder(firstContent.type);
    }
  };

  const handleNavigationPrevious = () => {
    if (currentContentindex > 0) {
      setCurrentContentindex(currentContentindex - 1);
      setContent(weeksdata[currentWeekindex].content[currentContentindex - 1]);
      setActivemenu(weeksdata[currentWeekindex].content[currentContentindex - 1].name);
      setActiveFolder(weeksdata[currentWeekindex].content[currentContentindex - 1].type);
    } else if (currentWeekindex > 0) {
      setCurrentWeekindex(currentWeekindex - 1);
      const lastContentIndex = weeksdata[currentWeekindex - 1].content.length - 1;
      setCurrentContentindex(lastContentIndex);
      setContent(weeksdata[currentWeekindex - 1].content[lastContentIndex]);
      setMenuWeek(weeksdata[currentWeekindex - 1].name);
      setActivemenu(weeksdata[currentWeekindex - 1].content[lastContentIndex].name);
      setActiveFolder(weeksdata[currentWeekindex - 1].content[lastContentIndex].type);
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

  // Content type icons mapping
  const contentTypeIcons = {
    video: <Video className="h-5 w-5 flex-shrink-0" />,
    ytvideo: <Video className="h-5 w-5 flex-shrink-0" />,
    note: <NotebookPen className="h-5 w-5 flex-shrink-0" />,
    assignment: <ClipboardList className="h-5 w-5 flex-shrink-0" />,
    project: <FolderGit2 className="h-5 w-5 flex-shrink-0" />,
    meeting: <TvMinimalPlay className="h-5 w-5 flex-shrink-0" />,
    test: <BookCheck className="h-5 w-5 flex-shrink-0" />,
  };

  return (
    <>
      <Toaster position="top-center" expand={false} richColors />

      <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-900">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } ${isMenuOpen ? "translate-x-0 md:translate-x-0" : "md:translate-x-0"}`}
        >
          <div className="flex h-full flex-col">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-2">
                <img
                  src="/9.png"
                  alt="Logo"
                  className="h-10 w-10 rounded-md"
                  onClick={() => setActiveFolder("overview")}
                />
                <h2 className="text-lg font-semibold truncate">Learning Portal</h2>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2 w-full">
                <div className="flex-grow">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Course Progress</span>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {progress || 0}%
                    </span>
                  </div>
                  <Progress value={progress || 0} className="h-2" />
                </div>
              </div>
            </div>

            {/* Sidebar Menu */}
            <div className="flex-1 overflow-y-auto py-2 px-1">
              <Accordion
                type="single"
                collapsible
                value={menuWeek}
                onValueChange={setMenuWeek}
                className="space-y-1"
              >
                {weeksdata &&
                  weeksdata.map((week, weekIndex) => (
                    <AccordionItem
                      value={week.name}
                      key={weekIndex}
                      className="border-none"
                    >
                      <AccordionTrigger className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-left">
                        <div className="flex items-center gap-2">
                          <Folder className="h-4 w-4 text-blue-500" />
                          <span className="font-medium text-sm">{week.name}</span>
                        </div>
                        <ChevronDown className="h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200" />
                      </AccordionTrigger>
                      <AccordionContent className="pt-1 pb-2">
                        <div className="ml-2 space-y-1">
                          {week.content.map((item, index) => (
                            <button
                              key={index}
                              className={`flex w-full items-center gap-2 rounded-md py-2 px-3 text-sm transition-colors ${
                                activemenu === item.name
                                  ? "bg-blue-50 text-blue-700 dark:bg-gray-700 dark:text-blue-300"
                                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
                              }`}
                              onClick={() => handleContentSelection(item, weekIndex, index)}
                            >
                              {isContentCompleted(item.name) && (
                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              )}
                              {contentTypeIcons[item.type] || <Folder className="h-4 w-4" />}
                              <span className="truncate text-left">{item.name}</span>
                            </button>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
              </Accordion>
            </div>
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
                  className="flex items-center gap-1"
                >
                  <span className="hidden md:inline">Complete & Next</span>
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
                          <h1 className="text-3xl md:text-4xl font-bold mb-4">
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
                                setMenuWeek(weeksdata[0].name);
                                setIsSidebarOpen(true);
                              }}
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
                            className="w-full h-auto object-cover"
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
                              className="overflow-hidden transition-all hover:shadow-lg"
                            >
                              <img
                                src="/course/folderimg.jpg"
                                alt={week.name}
                                className="w-full h-40 object-cover"
                              />
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg">
                                  {week.name}: {week.type}
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <CardDescription>{week.description}</CardDescription>
                                <Button
                                  variant="outline"
                                  className="w-full mt-4"
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
                    <Card className="shadow-md">
                      <CardHeader>
                        <CardTitle>{content.name}</CardTitle>
                        <CardDescription>{content.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-gray-500" />
                          <span>
                            {content.date ? new Date(content.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }) : "Date not specified"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-5 w-5 text-gray-500" />
                          <span>{formatTime(content.time)} (IST)</span>
                        </div>
                        <Button className="w-full">
                          <a
                            href={content.link}
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
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg flex items-center justify-center p-0 z-40"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* AI Chat */}
      <Chat aiopen={aiopen} setaiopen={setAiopen} />
    </>
  );
}