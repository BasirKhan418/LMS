"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LiaCertificateSolid } from "react-icons/lia";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import AdminView  from "../LiveAdmin/admin-view";
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
  ChevronDown,
  GraduationCap
} from "lucide-react";

// Component imports
import YtVideo from "../Course/YtVideo";
import VideoContent from "../Course/Video";
import Project from "../Course/Project";
import PdfViewer from "../Pdf/pdfViewer";

export default function AdminCourseSidebar({
  weeksdata,
  alldata,
  allcoursedata,
  crid,
  isadmin,
  data
}) {
  const router = useRouter();
  const [activeFolder, setActiveFolder] = useState("overview");
  const [activemenu, setActivemenu] = useState("");
  const [content, setContent] = useState({});  // Initialize as empty object instead of array
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [menuWeek, setMenuWeek] = useState("");
  const [currentWeekindex, setCurrentWeekindex] = useState(0);
  const [currentContentindex, setCurrentContentindex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [allComment, setAllComment] = useState([]);
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

  const handleNavigationNext = () => {
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

  const formatTime = (time) => {
    if (!time) return "";
    
    let [hours, minutes] = time.split(":");
    hours = parseInt(hours, 10);
    let period = hours >= 12 ? "PM" : "AM";
    
    if (hours > 12) hours -= 12;
    else if (hours === 0) hours = 12;
    
    return `${hours}:${minutes} ${period}`;
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
   
      toast.error("Failed to load comments");
    }
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
                <div className="flex items-center justify-center h-10 w-48">
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

            {/* Admin Badge */}
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 border-b">
              <Badge className="w-full justify-center bg-indigo-600 text-white hover:bg-indigo-700">
                <GraduationCap className="h-4 w-4 mr-1" /> {isadmin ? "Admin" : "Trainer"} View
              </Badge>
            </div>

            {/* Sidebar Menu */}
            <div className="flex-1 overflow-y-auto py-2 px-2">
              <Accordion
                type="single"
                collapsible
                value={menuWeek}
                onValueChange={setMenuWeek}
                className="space-y-2"
              >
                {weeksdata && weeksdata.map((week, weekIndex) => (
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
                            <div className="rounded-full p-1.5 bg-gray-100 dark:bg-gray-800">
                              {contentTypeIcons[item.type] || <Folder className="h-4 w-4" />}
                            </div>
                            <span className="truncate text-left flex-1">{item.name}</span>
                          </button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            
            {/* Admin Controls */}
            <div className="p-4 border-t">
              <Button
                variant="outline"
                className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                onClick={() => router.back()}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                {isadmin ? "Admin" : "Trainer"} Controls
              </Button>
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
              
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden md:flex items-center gap-1"
                  onClick={()=>{
                    router.back()
                  }}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to {isadmin?"Admin":"Trainer"} Panel
                </Button>
             
              
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
                  <span className="hidden md:inline">Next</span>
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
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-indigo-600 text-white hover:bg-indigo-700"> {isadmin?"Admin":"Trainer"} View</Badge>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">{alldata?.courseType || "Course"}</Badge>
                          </div>
                          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            {alldata?.title}
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
                              Browse Content
                            </Button>
                            <Button variant="outline">
                              <a href="#course-modules">Course Structure</a>
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
                                <div className="flex flex-wrap gap-2 mt-2 mb-3">
                                  {week.content && (
                                    <>
                                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                        {week.content.length} items
                                      </Badge>
                                      {week.content.some(item => item.type === "video") && (
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                          Videos
                                        </Badge>
                                      )}
                                      {week.content.some(item => item.type === "note") && (
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                          Notes
                                        </Badge>
                                      )}
                                      {week.content.some(item => item.type === "assignment") && (
                                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                          Assignments
                                        </Badge>
                                      )}
                                    </>
                                  )}
                                </div>
                                <Button
                                  variant="outline"
                                  className="w-full mt-2 border-blue-200 text-blue-600 hover:bg-blue-50"
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
                      isAdminView={true}
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
                      isAdminView={true}
                    />
                  </div>
                )}

                {activeFolder === "assignment" && (
                  <div className="max-w-6xl mx-auto">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                      <h2 className="text-2xl font-bold mb-4">{content?.name || "Assignment"}</h2>
                      <div className="prose dark:prose-invert max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: content?.description || "No description available." }} />
                      </div>
                      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <ClipboardList className="h-5 w-5 text-blue-600" />
                            <h3 className="font-medium">Admin View - Assignment Details</h3>
                          </div>
                          <Badge variant="outline" className="bg-indigo-50 text-indigo-700">Admin Only</Badge>
                        </div>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Assignment Type</p>
                            <p className="font-medium">{content?.assignmentType || "Standard"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Points</p>
                            <p className="font-medium">{content?.points || "N/A"}</p>
                          </div>
                          {content?.dueDate && (
                            <div>
                              <p className="text-sm text-gray-500 mb-1">Due Date</p>
                              <p className="font-medium">{new Date(content.dueDate).toLocaleDateString()}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeFolder === "note" && (
                  <div className="max-w-6xl mx-auto">
                    <PdfViewer content={content} />
                  </div>
                )}

                {activeFolder === "meeting" && (
                  <div className="">
                   <AdminView content={content} data={data} week={currentWeekindex} alldata={alldata}/>
                  </div>
                )}

                {activeFolder === "project" && (
                  <div className="max-w-6xl mx-auto">
                    <Project isAdminView={true} />
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
}