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
import { AiOutlineMenuFold } from "react-icons/ai";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoVideocamOutline } from "react-icons/io5";
import { MdOutlineAssignmentTurnedIn } from "react-icons/md";
import { FaFolder } from "react-icons/fa";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import YtVideo from "./Course/YtVideo";
import {
  ClipboardList,
  FolderGit2,
  TvMinimalPlay,
  X,
  BookCheck,
  NotebookPen,
  Video,
} from "lucide-react";
import VideoContent from "./Course/Video";
import { Toaster, toast } from "sonner";
import UserAssignment from "./Assignment/UserAssignment";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
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
  const [aiopen, setaiopen] = useState(false);
  const [activemenu, setActivemenu] = useState("");
  const [content, setContent] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isopen, setIsopen] = useState(true);
  const [menuWeek, setMenuWeek] = useState("");
  const [allComment, setAllComment] = useState([]);
  const [currentWeekindex, setCurrentWeekindex] = useState(0);
  const [currentContentindex, setCurrentContentindex] = useState(-1);
  const [userdata, setUserdata] = useState(null);
  const [progress, setProgress] = useState(0);
  const [data, setData] = useState(null);
  //authentication
  const validatefun = async () => {
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
        console.log("res is from res.data ", res.data);
        setUserdata(res.user);
        let resdata = res.data.filter((item)=>item.courseid._id==crid)[0];
        let crcmp = resdata && resdata.crcmp;
        setData(res.data);
        setProgress(resdata.progress);
        weeksdata.map((item) => {
          let a = item.content.filter(
            (item) => item.name == crcmp[crcmp.length - 1].name
          );
          if (a.length > 0) {
            setCurrentWeekindex(weeksdata.indexOf(item));
            setCurrentContentindex(item.content.indexOf(a[0]));
            setContent(a[0]);
            setMenuWeek(item.name);
            setActivemenu(a[0].name);
            setActiveFolder(a[0].type);
          }
        });
        console.log(res.data);
      } else {
        setUserdata(null);
        toast.error(res.message);
        console.log(res.message);
      }
    } catch (err) {
      console.log(err);
    }
  };
  //vaidate and get function
  const validatefunGet = async () => {
    try {
      const response = await fetch("/api/homeauth", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          token: localStorage.getItem("dilmstoken"),
        },
      });
      const res = await response.json();
      console.log("res is ", res);
      if (res.success) {
        setUserdata(res.user);
        setData(res.data);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      setLoading(false);
      toast.error("Something went wrong! try again later");
    }
  };
  useEffect(() => {
    validatefun();
  }, []);
  //fetch all comment
  const fetchallComment = async (id) => {
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
  };
  //
  // get and if possible update progress
  const UpdateandGetProgress = async () => {
    // const data = data && data.filter((item) => item.courseid._id == crid);
    try {
      const res = await fetch(
        `/api/progress?id=${userdata._id}&&crid=${crid}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("dilmstoken"),
          },
        }
      );
      const result = await res.json();
    } catch (err) {
      console.log(err);
    }
  };
  //endded
  const UpdateProgress = async () => {
    // const data = data && data.filter((item) => item.courseid._id == crid);
    if (content.name == null) {
      return;
    }
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
      UpdateandGetProgress();
      validatefunGet();
    } else {
      toast.error(result.message);
    }
  };
  const handleNavigationNext = () => {
    UpdateProgress();
    if (currentContentindex < weeksdata[currentWeekindex].content.length - 1) {
      const nextContentIndex = currentContentindex + 1;
      setCurrentContentindex(nextContentIndex);
      setMenuWeek(weeksdata[currentWeekindex].name);
      setContent(weeksdata[currentWeekindex].content[nextContentIndex]);
      setActivemenu(weeksdata[currentWeekindex].content[nextContentIndex].name);
      setActiveFolder(
        weeksdata[currentWeekindex].content[nextContentIndex].type
      );
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

  //handle Previous
  const handleNavigationPrevious = () => {
    if (currentContentindex > 0) {
      setCurrentContentindex(currentContentindex - 1);
      setContent(weeksdata[currentWeekindex].content[currentContentindex - 1]);
      setActivemenu(
        weeksdata[currentWeekindex].content[currentContentindex - 1].name
      );
      setActiveFolder(
        weeksdata[currentWeekindex].content[currentContentindex - 1].type
      );
    } else {
      if (currentWeekindex > 0) {
        setCurrentWeekindex(currentWeekindex - 1);
        setCurrentContentindex(
          weeksdata[currentWeekindex - 1].content.length - 1
        );
        setContent(
          weeksdata[currentWeekindex - 1].content[
            weeksdata[currentWeekindex - 1].content.length - 1
          ]
        );
        setMenuWeek(weeksdata[currentWeekindex - 1].name);
        setActivemenu(
          weeksdata[currentWeekindex - 1].content[
            weeksdata[currentWeekindex - 1].content.length - 1
          ].name
        );
        setActiveFolder(
          weeksdata[currentWeekindex - 1].content[
            weeksdata[currentWeekindex - 1].content.length - 1
          ].type
        );
      }
    }
  };

  const getContentExistOrNot = (name) => {
    if (!data || !data[0] || !data[0].crcmp) {
      return false;
    }
   let datai = data && data.filter((item) => item.courseid._id == crid)[0];
    const exists = datai.crcmp.some((item) => item.name === name);
    return exists;
  };
  //
  const convertTimeTo12HourFormat = (time) => {
    let [hours, minutes] = time.split(":");
    let period = "AM";

    hours = parseInt(hours, 10);
    if (hours >= 12) {
      period = "PM";
      if (hours > 12) {
        hours -= 12;
      }
    } else if (hours === 0) {
      hours = 12;
    }

    return `${hours}:${minutes} ${period}`;
  };
  console.log("userdata is ", userdata);
  return (
    <>
      <Toaster position="top-center" expand={false} />

      <div className=" h-[100vh] w-full flex-col  ">
        <header className="lg:fixed lg:top-0 lg:left-0 w-full bg-white dark:bg-gray-900 p-3 md:p-4 flex flex-col md:flex-row justify-between items-center shadow h-20 z-20 md:fixed md:top-0 md:left-0">
          <div className="flex items-center mb-2 md:mb-0">
            {!isopen && (
              <div className="mx-4">
                <AiOutlineMenuUnfold
                  className="h-7 w-7"
                  onClick={() => {
                    setIsopen(!isopen);
                  }}
                />
              </div>
            )}
            <img
              src="https://res.cloudinary.com/db0x5vhbk/image/upload/v1733634184/x0vx8af6jmxfpp5tjjjk.png"
              alt="Company Logo"
              className="h-6 mr-2"
              onClick={() => {
                setActiveFolder("overview");
              }}
            />
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              Devsomeware
            </h1>
          </div>
          <h2 className="text-md md:text-lg font-bold text-gray-800 dark:text-gray-400 mb-2 md:mb-0">
            {alldata.title}
          </h2>
          <div className="flex space-x-3">
            <button
              className="flex items-center bg-blue-600 text-white px-3 py-1.5 rounded-full shadow hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition duration-300 ease-in-out"
              onClick={handleNavigationPrevious}
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
              Previous
            </button>
            <button
              className="flex items-center bg-blue-600 text-white px-3 py-1.5 rounded-full shadow hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition duration-300 ease-in-out"
              onClick={handleNavigationNext}
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
              Complete & Next
            </button>
          </div>
        </header>
        <header className="flex items-center justify-between bg-muted px-4 py-3 md:hidden my-6 lg:my-0 md:my-0">
          <Link href="/course">
            <IoMdArrowRoundBack className="h-6 w-6" />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </header>

        <div className="flex flex-1 pt-16">
          <div
            className={`z-50 bg-white dark:bg-gray-800 p-6 border-r w-[300px] fixed top-0 left-0 h-full transform transition-transform duration-300 ease-in-out ${
              isopen ? "sm:translate-x-0" : "-translate-x-full"
            } ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <div className="flex items-center mb-2 md:mb-0 justify-between">
              <div
                className="flex justify-center items-center"
                onClick={() => {
                  setActiveFolder("overview");
                }}
              >
                <img
                  src="https://res.cloudinary.com/db0x5vhbk/image/upload/v1733634184/x0vx8af6jmxfpp5tjjjk.png"
                  alt="Company Logo"
                  className="h-6 mr-2"
                />
                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  Devsomeware
                </h1>
              </div>
              {!isMenuOpen && (
                <Link href="/course">
                  <IoMdArrowRoundBack className="h-6 w-6" />
                </Link>
              )}
            </div>

            <div className="flex items-center justify-between mb-4 mt-4 ">
              {!isMenuOpen && (
                <AiOutlineMenuFold
                  className="h-6 w-6"
                  onClick={() => {
                    setIsopen(!isopen);
                  }}
                />
              )}
              {isMenuOpen && (
                <AiOutlineMenuFold
                  className="h-6 w-6"
                  onClick={() => {
                    setIsMenuOpen(!isMenuOpen);
                  }}
                />
              )}

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {progress==null?0:progress }%
                </span>
                <Progress
                  value={progress==null?0:progress}
                  className="w-32"
                />
              </div>
            </div>
            <Accordion
              type="single"
              collapsible
              value={menuWeek}
              onValueChange={setMenuWeek}
            >
              {weeksdata &&
                weeksdata.map((item, weekindex) => (
                  <AccordionItem value={item.name} key={weekindex}>
                    <AccordionTrigger className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FolderIcon className="h-5 w-5" />
                        <span className="font-semibold">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ChevronRightIcon className="h-4 w-4 transition-transform data-[state=open]:rotate-90" />
                        <ChevronRightIcon className="h-4 w-4 transition-transform data-[state=open]:rotate-90" />
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid gap-2 pl-4">
                        {item.content.map((item, index) => (
                          <div key={index}>
                            {item.type == "video" && (
                              <Link
                                href="#"
                                key={index}
                                className={`cursor-pointer flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-accent hover:text-accent-foreground font-medium ${
                                  activemenu == item.name
                                    ? "bg-accent text-accent-foreground"
                                    : ""
                                }`}
                                onClick={() => {
                                  setActiveFolder("video");
                                  setActivemenu(item.name);
                                  setContent(item);
                                  fetchallComment(item.name);
                                  setCurrentWeekindex(weekindex);
                                  setCurrentContentindex(index);
                                }}
                              >
                                {getContentExistOrNot(item.name) && (
                                  <IoCheckmarkDoneCircleSharp className="h-5 w-5 text-primary flex-shrink-0" />
                                )}
                                <Video className="h-5 w-5 flex-shrink-0" />
                                <span>{item.name}</span>
                              </Link>
                            )}
                            {item.type == "ytvideo" && (
                              <Link
                                href="#"
                                key={index}
                                className={`cursor-pointer flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-accent hover:text-accent-foreground font-medium ${
                                  activemenu == item.name
                                    ? "bg-accent text-accent-foreground"
                                    : ""
                                }`}
                                onClick={() => {
                                  setActiveFolder("ytvideo");
                                  setActivemenu(item.name);
                                  setContent(item);
                                  fetchallComment(item.name);
                                  setCurrentWeekindex(weekindex);
                                  setCurrentContentindex(index);
                                }}
                              >
                                {getContentExistOrNot(item.name) && (
                                  <IoCheckmarkDoneCircleSharp className="h-5 w-5 text-primary flex-shrink-0" />
                                )}
                                <Video className="h-5 w-5 flex-shrink-0" />
                                <span>{item.name}</span>
                              </Link>
                            )}

                            {item.type == "note" && (
                              <Link
                                href={"#"}
                                key={index}
                                className={`cursor-pointer flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-accent hover:text-accent-foreground font-medium ${
                                  activemenu === item.name
                                    ? "bg-accent text-accent-foreground"
                                    : ""
                                }`}
                                onClick={() => {
                                  setActiveFolder("note");
                                  setActivemenu(item.name);
                                  setContent(item);
                                  setCurrentWeekindex(weekindex);
                                  setCurrentContentindex(index);
                                }}
                              >
                                {getContentExistOrNot(item.name) && (
                                  <IoCheckmarkDoneCircleSharp className="h-5 w-5 text-primary flex-shrink-0" />
                                )}
                                <NotebookPen className="h-5 w-5 flex-shrink-0" />
                                <span>{item.name}</span>
                              </Link>
                            )}
                            {item.type == "assignment" && (
                              <Link
                                href={"#"}
                                key={index}
                                className={`cursor-pointer flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-accent hover:text-accent-foreground font-medium ${
                                  activemenu === item.name
                                    ? "bg-accent text-accent-foreground"
                                    : ""
                                }`}
                                onClick={() => {
                                  setActiveFolder("assignment");
                                  setActivemenu(item.name);
                                  setContent(item);
                                  setCurrentWeekindex(weekindex);
                                  setCurrentContentindex(index);
                                }}
                              >
                                {getContentExistOrNot(item.name) && (
                                  <IoCheckmarkDoneCircleSharp className="h-5 w-5 text-primary flex-shrink-0" />
                                )}
                                <ClipboardList className="h-5 w-5 flex-shrink-0" />
                                <span>{item.name}</span>
                              </Link>
                            )}
                            {item.type == "project" && (
                              <Link
                                href={"#"}
                                key={index}
                                className={`cursor-pointer flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-accent hover:text-accent-foreground font-medium ${
                                  activemenu === item.name
                                    ? "bg-accent text-accent-foreground"
                                    : ""
                                }`}
                                onClick={() => {
                                  setActiveFolder("project");
                                  setActivemenu(item.name);
                                  setContent(item);
                                  setCurrentWeekindex(weekindex);
                                  setCurrentContentindex(index);
                                }}
                              >
                                {getContentExistOrNot(item.name) && (
                                  <IoCheckmarkDoneCircleSharp className="h-5 w-5 text-primary flex-shrink-0" />
                                )}
                                <FolderGit2 className="h-5 w-5 flex-shrink-0" />
                                <span>{item.name}</span>
                              </Link>
                            )}
                            {item.type == "meeting" && (
                              <Link
                                href={"#"}
                                key={index}
                                className={`cursor-pointer flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-accent hover:text-accent-foreground font-medium ${
                                  activemenu === item.name
                                    ? "bg-accent text-accent-foreground"
                                    : ""
                                }`}
                                onClick={() => {
                                  setActiveFolder("meeting");
                                  setActivemenu(item.name);
                                  setContent(item);
                                  setCurrentWeekindex(weekindex);
                                  setCurrentContentindex(index);
                                }}
                              >
                                {getContentExistOrNot(item.name) && (
                                  <IoCheckmarkDoneCircleSharp className="h-5 w-5 text-primary flex-shrink-0" />
                                )}
                                <TvMinimalPlay className="h-5 w-5 flex-shrink-0" />
                                <span>{item.name}</span>
                              </Link>
                            )}
                            {item.type == "test" && (
                              <Link
                                href={"#"}
                                key={index}
                                className={`cursor-pointer flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-accent hover:text-accent-foreground font-medium ${
                                  activemenu === item.name
                                    ? "bg-accent text-accent-foreground"
                                    : ""
                                }`}
                                onClick={() => {
                                  setActiveFolder("test");
                                  setActivemenu(item.name);
                                  setContent(item);
                                  setCurrentWeekindex(weekindex);
                                  setCurrentContentindex(index);
                                }}
                              >
                                {getContentExistOrNot(item.name) && (
                                  <IoCheckmarkDoneCircleSharp className="h-5 w-5 text-primary flex-shrink-0" />
                                )}
                                <BookCheck className="h-5 w-5 flex-shrink-0" />
                                <span>{item.name}</span>
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
          </div>
          <div className="flex-1 px-8 mt-8">
            {activeFolder === "overview" && (
              <div className={`${isopen ? "sm:absolute sm:left-80" : ""} `}>
                <div className="flex flex-col">
                  <section className="bg-white lg:py-12  ">
                    <div className="container mx-auto px-4 md:px-6 lg:px-8 grid md:grid-cols-2 gap-8 items-center">
                      <div className="text-center md:text-left">
                        <h1 className="text-4xl font-bold text-black md:text-5xl lg:text-5xl">
                          Welcome to Our {alldata && alldata.title} Course
                        </h1>
                        <p className=" text-sm text-gray-700 font-medium mt-10 leading-6">
                          {alldata && alldata.desc}
                        </p>
                        <div className=" text-sm text-gray-700 font-medium mt-2 leading-6">
                          {alldata.skills &&
                            alldata.skills.split(",").map((item, index) => (
                              <Badge
                                variant="outline"
                                className="mx-2 my-2 "
                                key={index}
                              >
                                {item}{" "}
                              </Badge>
                            ))}
                        </div>
                        <div className="mt-8">
                          <button
                            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-1 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 my-2"
                            onClick={() => {
                              setMenuWeek(weeksdata[0].name);
                              setIsopen(true);
                            }}
                          >
                            Get Started
                          </button>
                          <a
                            href="#coursecontent"
                            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-1 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 mx-6 my-2"
                          >
                            Course Content
                          </a>
                        </div>
                      </div>
                      <div className="w-full md:max-w-[500px] lg:max-w-[600px] mx-auto ">
                        <img
                          src={alldata && alldata.img}
                          width={600}
                          height={400}
                          alt="Hero Image"
                          className="rounded-lg object-cover w-full"
                        />
                      </div>
                    </div>
                  </section>
                  <section
                    className="py-12 md:py-20 lg:py-28"
                    id="coursecontent"
                  >
                    <div className="container mx-auto px-4 md:px-6 lg:px-8">
                      <h2 className="mb-8 text-3xl font-bold md:text-4xl">
                        Course Modules
                      </h2>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {weeksdata &&
                          weeksdata.map((item, index) => (
                            <div
                              className="rounded-lg bg-card p-4 shadow transition-all hover:scale-105"
                              key={index}
                              onClick={() => {
                                setMenuWeek(item.name);
                                setIsopen(true);
                              }}
                            >
                              <img
                                src="/course/folderimg.jpg"
                                width={300}
                                height={200}
                                alt={item.name}
                                className="mb-4 rounded-lg object-cover "
                              />
                              <h3 className="mb-2 text-lg font-semibold">
                                {item.name}: {item.type}
                              </h3>
                              <p className="text-muted-foreground">
                                {item.description}
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            )}
            {/* video starts here */}
            {activeFolder === "video" && (
              <>
                <div className={`${isopen ? "sm:absolute sm:left-80" : ""} `}>
                  <VideoContent
                    content={content}
                    allcoursedata={allcoursedata}
                    allComment={allComment}
                    setAllComment={setAllComment}
                  />
                </div>
              </>
            )}
            {activeFolder === "ytvideo" && (
              <>
                <div className={`${isopen ? "sm:absolute sm:left-80" : ""} `}>
                  <YtVideo
                    content={content}
                    allcoursedata={allcoursedata}
                    allComment={allComment}
                    setAllComment={setAllComment}
                  />
                </div>
              </>
            )}
            {/* assigment starts here */}
            {activeFolder === "assignment" && (
              <>
                <div className={`${isopen ? "sm:absolute sm:left-80" : ""} `}>
                  <UserAssignment
                    id={crid}
                    userid={userdata && userdata._id}
                  />
                </div>
              </>
            )}
            {/* note start here */}
            {activeFolder === "note" && (
              <>
                <div className={`${isopen ? "sm:absolute sm:left-80" : ""} `}>
                  <PdfViewer content={content} />
                </div>
              </>
            )}
            {/* //meeting starts here */}
            {activeFolder === "meeting" && (
              <>
                <div className={`${isopen ? "sm:absolute sm:left-80" : ""} `}>
                  <div className="flex flex-col bg-background">
                    <main className="flex-1 py-10 px-6 md:px-10">
                      <div className="flex justify-center items-center h-full w-full">
                        <Card className="bg-card text-card-foreground shadow-sm  ">
                          <CardHeader>
                            <h2 className="text-xl font-bold mb-4">Meeting</h2>
                            <CardTitle>{content.name}</CardTitle>
                            <CardDescription>
                              {content.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="grid gap-4">
                            <div className="flex items-center gap-2">
                              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                {new Date(content.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                  }
                                )}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <ClockIcon className="h-5 w-5 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                {convertTimeTo12HourFormat(content.time)} (IST)
                              </p>
                            </div>
                            <Button variant="secondary">
                              <Link
                                href={`${content.link}`}
                                target="_blank"
                                className="flex justify-center items-center"
                              >
                                <VideoIcon className="mr-2 h-5 w-5" />
                                Join Meeting
                              </Link>
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </main>
                  </div>
                </div>
              </>
            )}
            {/* //project starts here */}
            {activeFolder === "project" && (
              <>
                <Project />
                <div
                  className={`${isopen ? "sm:absolute sm:left-80" : ""} `}
                ></div>
              </>
            )}
          </div>
        </div>
      </div>
      <Button
        className="flex items-center gap-2 fixed lg:bottom-6 lg:right-6 md:bottom-4 md:right-4 bottom-2 right-2 rounded-full lg:py-8 md:py-8 py-8"
        size="lg"
        onClick={() => {
          setaiopen(!aiopen);
        }}
      >
        <MessageCircleIcon className="h-5 w-5" />
        Chat with AI
      </Button>
      <Chat aiopen={aiopen} setaiopen={setaiopen} />
    </>
  );
}

function ChevronRightIcon(props) {
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function FileIcon(props) {
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
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}

function FolderIcon(props) {
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
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </svg>
  );
}

function MenuIcon(props) {
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
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function MountainIcon(props) {
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
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
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

function ClockIcon(props) {
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
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function VideoIcon(props) {
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
      <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
      <rect x="2" y="6" width="14" height="12" rx="2" />
    </svg>
  );
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
  );
}
