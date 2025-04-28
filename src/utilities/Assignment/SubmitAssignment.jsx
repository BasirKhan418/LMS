"use client"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Toaster, toast } from "sonner"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  Clock, Calendar, CheckCircle, XCircle, Share, FileText, 
  AlertTriangle, ChevronLeft, Send, Bookmark, Award, BookOpen,
  Save, Clipboard, ExternalLink, ThumbsUp, HelpCircle
} from "lucide-react"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const DifficultyBadge = ({ level }) => {
  const colors = {
    easy: "bg-emerald-100 text-emerald-800 border-emerald-200",
    medium: "bg-amber-100 text-amber-800 border-amber-200",
    hard: "bg-rose-100 text-rose-800 border-rose-200"
  }
  
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${colors[level] || colors.medium}`}>
      {level?.charAt(0).toUpperCase() + level?.slice(1) || "Medium"}
    </span>
  )
}

const TimeRemaining = ({ dueDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  })
  
  useEffect(() => {
    if (!dueDate) return
    
    const calculateTimeLeft = () => {
      const difference = new Date(dueDate) - new Date()
      
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
      }
      
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        expired: false,
      }
    }
    
    setTimeLeft(calculateTimeLeft())
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)
    
    return () => clearInterval(timer)
  }, [dueDate])
  
  if (!dueDate) return null
  
  return (
    <div className="mt-4 sm:mt-0">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Time Remaining:</span>
      </div>
      
      {timeLeft.expired ? (
        <div className="mt-1 text-rose-600 font-semibold flex items-center gap-1.5">
          <AlertTriangle className="h-4 w-4" />
          <span>Deadline Passed</span>
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-4 gap-2">
          <div className="flex flex-col items-center">
            <div className="text-xl font-bold">{timeLeft.days}</div>
            <div className="text-xs text-muted-foreground">Days</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xl font-bold">{timeLeft.hours}</div>
            <div className="text-xs text-muted-foreground">Hours</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xl font-bold">{timeLeft.minutes}</div>
            <div className="text-xs text-muted-foreground">Mins</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-xl font-bold">{timeLeft.seconds}</div>
            <div className="text-xs text-muted-foreground">Secs</div>
          </div>
        </div>
      )}
    </div>
  )
}

const WordCounter = ({ text }) => {
  const [words, setWords] = useState(0)
  const [chars, setChars] = useState(0)
  
  useEffect(() => {
    if (!text) {
      setWords(0)
      setChars(0)
      return
    }
    
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length
    setWords(wordCount)
    setChars(text.length)
  }, [text])
  
  return (
    <div className="flex items-center gap-4 text-xs text-muted-foreground">
      <div className="flex items-center gap-1">
        <FileText className="h-3 w-3" />
        <span>{words} words</span>
      </div>
      <div className="flex items-center gap-1">
        <Clipboard className="h-3 w-3" />
        <span>{chars} characters</span>
      </div>
    </div>
  )
}

const LoadingSkeleton = () => (
  <div className="w-full h-full">
    <div className="flex items-center gap-2 mb-4">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32 mt-1" />
      </div>
    </div>
    <Skeleton className="h-32 w-full mb-4" />
    <Skeleton className="h-64 w-full" />
  </div>
)

const AutoSaveIndicator = ({ saving }) => (
  <div className="flex items-center gap-1.5 text-xs">
    {saving ? (
      <>
        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
        <span className="text-amber-600">Saving...</span>
      </>
    ) : (
      <>
        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
        <span className="text-emerald-600">Saved</span>
      </>
    )}
  </div>
)

export default function SubmitAssignment({ aid, crid, id }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [wordLimit, setWordLimit] = useState({ min: 100, max: 1000 })
  const [activeTab, setActiveTab] = useState("instructions")
  const router = useRouter()
  const editorRef = useRef(null)
  
  // handle change in response
  const handleChange = (e) => {
    setResponse(e.target.value)
    setSaving(true)
    
    // Debounce saving to localStorage
    const timeout = setTimeout(() => {
      localStorage.setItem(`${aid}Response`, e.target.value)
      setSaving(false)
      setLastSaved(new Date())
    }, 1000)
    
    return () => clearTimeout(timeout)
  }
  
  const fetchAssignment = async() => {
    try {
      setLoading(true)
      const response = await fetch(`/api/getassignment?id=${aid}`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          "token": localStorage.getItem("dilmstoken")
        }
      })
      const res = await response.json()
      setLoading(false)
      
      if (res.success) {
        setData(res.data)
      } else {
        setData(null)
        toast.error(res.message)
      }
    } catch (err) {
      setLoading(false)
      setData(null)
      toast.error("Failed to fetch assignment details")
    }
  }

  const handleContextMenu = (event) => {
    event.preventDefault() // Prevent the default right-click context menu
  }

  useEffect(() => {
    fetchAssignment()
    if (localStorage.getItem(`${aid}Response`)) {
      setResponse(localStorage.getItem(`${aid}Response`))
    }
    
    window.addEventListener('contextmenu', handleContextMenu)
    
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu)
    }
  }, [aid])
  
  // Focus the textarea when component mounts
  useEffect(() => {
    if (editorRef.current && !loading && !submitted) {
      setTimeout(() => {
        editorRef.current.focus()
      }, 500)
    }
  }, [loading, submitted])

  // Handle Submit Assignment
  const handleSubmit = async() => {
    // Validate response length
    if (response.length < 10) {
      return toast.error("Assignment content too short or empty to submit")
    }
    
    if (!data || !data[0]) {
      return toast.error("Assignment details not found")
    }
    
    // Check deadline
    if (Date.now() > new Date(data[0].duedate)) {
      return toast.error("Assignment deadline has passed. You can't submit this assignment anymore! Please contact your instructor for more information.")
    }
    
    setLoading(true)
    
    try {
      const res = await fetch("/api/submitassignment", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "token": localStorage.getItem("dilmstoken"),
        },
        body: JSON.stringify({
          asid: aid,
          crid: crid,
          userid: id,
          response: response
        })
      })
      
      let result = await res.json()
      setLoading(false)
      
      if (result.success) {
        toast.success(result.message)
        localStorage.removeItem(`${aid}Response`)
        setSubmitted(true)
      } else {
        toast.error(result.message)
      }
    } catch (err) {
      setLoading(false)
      toast.error("Failed to submit assignment. Please try again.")
    }
  }
  
  const handleShare = () => {
    const url = encodeURIComponent('https://devsomeware.com')
    const linkedInUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}`
    window.open(linkedInUrl, '_blank')
  }
  
  // Get the word count for progress indicator
  const getWordCount = () => {
    if (!response) return 0
    return response.trim().split(/\s+/).filter(Boolean).length
  }
  
  const wordCount = getWordCount()
  const progressPercentage = Math.min(100, (wordCount / wordLimit.min) * 100)
  
  return (
    <>
      <Head>
        <title>Assignment: {data && data[0].title}</title>
      </Head>
      
      <Toaster position="top-center" richColors />
      
      <div className="bg-gradient-to-b from-primary/5 to-background min-h-screen">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <Button 
            variant="ghost" 
            className="mb-4" 
            onClick={() => router.back()}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              >
                {/* Left panel - Assignment details */}
                <div className="flex flex-col">
                  <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden flex flex-col h-full">
                    {loading ? (
                      <div className="p-6">
                        <LoadingSkeleton />
                      </div>
                    ) : (
                      <>
                        {/* Header */}
                        <div className="bg-primary/5 p-6 border-b border-border">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-primary/10 rounded-full">
                                <BookOpen className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                                  {data && data[0].title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs px-2 py-0">
                                    ID: {aid?.substring(0, 8)}...
                                  </Badge>
                                  <DifficultyBadge level={data && data[0].difficulty || "medium"} />
                                </div>
                              </div>
                            </div>
                            
                            <TimeRemaining dueDate={data && data[0].duedate} />
                          </div>
                        </div>
                        
                        {/* Tabs */}
                        <div className="flex border-b border-border">
                          <button
                            className={`px-4 py-3 text-sm font-medium flex items-center gap-1.5 ${
                              activeTab === "instructions" 
                                ? "border-b-2 border-primary text-primary" 
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                            onClick={() => setActiveTab("instructions")}
                          >
                            <FileText className="h-4 w-4" />
                            Instructions
                          </button>
                          <button
                            className={`px-4 py-3 text-sm font-medium flex items-center gap-1.5 ${
                              activeTab === "resources" 
                                ? "border-b-2 border-primary text-primary" 
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                            onClick={() => setActiveTab("resources")}
                          >
                            <ExternalLink className="h-4 w-4" />
                            Resources
                          </button>
                          <button
                            className={`px-4 py-3 text-sm font-medium flex items-center gap-1.5 ${
                              activeTab === "tips" 
                                ? "border-b-2 border-primary text-primary" 
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                            onClick={() => setActiveTab("tips")}
                          >
                            <HelpCircle className="h-4 w-4" />
                            Tips
                          </button>
                        </div>
                        
                        {/* Tab Content */}
                        <div className="p-6 flex-1 overflow-auto">
                          {activeTab === "instructions" && (
                            <div className="prose prose-sm max-w-none">
                              <h3 className="text-lg font-semibold mb-3">Assignment Description</h3>
                              <div className="text-foreground mb-6">
                                {data && data[0].desc}
                              </div>
                              
                              <div className="bg-muted/50 rounded-lg p-4 mb-6 border border-border">
                                <h4 className="font-medium flex items-center gap-2 mb-3">
                                  <AlertCircle className="h-4 w-4 text-amber-500" />
                                  Important Requirements
                                </h4>
                                <ul className="space-y-2">
                                  <li className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                    <span>Submit original work - plagiarism will result in disqualification</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                    <span>Submissions must be at least {wordLimit.min} words and no more than {wordLimit.max} words</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                    <span>Multiple submissions are not allowed - be thorough before submitting</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                    <span>Do not share your solution with others</span>
                                  </li>
                                </ul>
                              </div>
                              
                              <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                                <h4 className="font-medium mb-2">Evaluation Criteria</h4>
                                <div className="space-y-3">
                                  <div>
                                    <div className="flex justify-between text-xs mb-1">
                                      <span>Originality</span>
                                      <span>25%</span>
                                    </div>
                                    <Progress value={25} className="h-1" />
                                  </div>
                                  <div>
                                    <div className="flex justify-between text-xs mb-1">
                                      <span>Completeness</span>
                                      <span>35%</span>
                                    </div>
                                    <Progress value={35} className="h-1" />
                                  </div>
                                  <div>
                                    <div className="flex justify-between text-xs mb-1">
                                      <span>Quality</span>
                                      <span>40%</span>
                                    </div>
                                    <Progress value={40} className="h-1" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {activeTab === "resources" && (
                            <div>
                              <h3 className="text-lg font-semibold mb-4">Learning Resources</h3>
                              
                              {data && data[0].link ? (
                                <div className="mb-6">
                                  <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg border border-border mb-3">
                                    <iframe 
                                      src={data[0].link} 
                                      width="100%" 
                                      height="100%" 
                                      className="absolute top-0 left-0 w-full h-full"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                        toast.error("Failed to load embedded content");
                                      }}
                                    ></iframe>
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    Watch the video above for additional context and insights.
                                  </div>
                                </div>
                              ) : (
                                <Alert className="mb-6">
                                  <AlertCircle className="h-4 w-4" />
                                  <AlertDescription>
                                    No external resources are provided for this assignment.
                                  </AlertDescription>
                                </Alert>
                              )}
                              
                              <div className="space-y-3">
                                <h4 className="font-medium">Recommended Reading</h4>
                                <div className="grid gap-2">
                                  <a href="#" className="flex items-center p-3 rounded-md hover:bg-muted transition-colors border border-border">
                                    <div className="bg-primary/10 p-2 rounded-md mr-3">
                                      <FileText className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-medium text-sm">Topic Guide</div>
                                      <div className="text-xs text-muted-foreground">Overview of key concepts</div>
                                    </div>
                                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                  </a>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {activeTab === "tips" && (
                            <div>
                              <h3 className="text-lg font-semibold mb-4">Tips for Success</h3>
                              
                              <div className="space-y-4">
                                <div className="bg-blue-50 text-blue-800 p-4 rounded-lg">
                                  <h4 className="font-medium mb-2 flex items-center gap-2">
                                    <ThumbsUp className="h-4 w-4" />
                                    Planning Your Response
                                  </h4>
                                  <p className="text-sm">
                                    Take time to outline your thoughts before writing. Structure your response with clear sections and ensure you address all parts of the assignment.
                                  </p>
                                </div>
                                
                                <div className="bg-amber-50 text-amber-800 p-4 rounded-lg">
                                  <h4 className="font-medium mb-2 flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4" />
                                    Common Mistakes to Avoid
                                  </h4>
                                  <ul className="text-sm space-y-1 list-disc list-inside">
                                    <li>Submitting without proofreading</li>
                                    <li>Going off-topic or missing key requirements</li>
                                    <li>Not providing sufficient detail or examples</li>
                                    <li>Waiting until the last minute to start</li>
                                  </ul>
                                </div>
                                
                                <div className="bg-emerald-50 text-emerald-800 p-4 rounded-lg">
                                  <h4 className="font-medium mb-2 flex items-center gap-2">
                                    <Award className="h-4 w-4" />
                                    Exceeding Expectations
                                  </h4>
                                  <p className="text-sm">
                                    To earn the highest marks, include original insights, demonstrate deep understanding of concepts, and connect ideas in meaningful ways.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Right panel - Submission form */}
                <div className="flex flex-col h-full">
                  <div className="bg-card rounded-lg shadow-sm border border-border overflow-hidden flex flex-col h-full">
                    <div className="bg-primary/5 p-4 border-b border-border flex items-center justify-between">
                      <h2 className="text-lg font-semibold flex items-center gap-2">
                        <div className="p-1.5 bg-primary/10 rounded-full">
                          <Send className="h-4 w-4 text-primary" />
                        </div>
                        Your Submission
                      </h2>
                      <div className="flex items-center gap-3">
                        {lastSaved && (
                          <AutoSaveIndicator saving={saving} />
                        )}
                      </div>
                    </div>
                    
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                              {id?.slice(0, 2)?.toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{id?.substring(0, 8)}</span>
                        </div>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="text-xs text-muted-foreground">
                                <span className={wordCount < wordLimit.min ? "text-amber-500 font-medium" : "text-emerald-500 font-medium"}>
                                  {wordCount}
                                </span>
                                /{wordLimit.min} words minimum
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              {wordCount < wordLimit.min 
                                ? `Need ${wordLimit.min - wordCount} more words to reach minimum`
                                : `You've reached the minimum word count!`
                              }
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      
                      <div className="relative mb-3">
                        {/* Fixed Progress component - removed indicatorClassName prop */}
                        <Progress 
                          value={progressPercentage} 
                          className={`h-1 ${wordCount >= wordLimit.min ? "bg-emerald-500" : "bg-green-200"}`}
                        />
                      </div>
                      
                      <Textarea
                        ref={editorRef}
                        className="flex-1 resize-none p-4 rounded-md border border-input bg-background shadow-sm min-h-[400px] text-base"
                        placeholder="Write your solution here..."
                        onChange={handleChange}
                        value={response}
                        onCopy={(e) => e.preventDefault()}
                        onCut={(e) => e.preventDefault()}
                        onPaste={(e) => e.preventDefault()}
                        disabled={loading}
                      />
                      
                      <div className="flex items-center justify-between mt-4">
                        <WordCounter text={response} />
                        
                        <div className="flex gap-3">
                          <Button 
                            variant="outline" 
                            onClick={() => router.back()}
                            disabled={loading}
                          >
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleSubmit}
                            disabled={loading}
                            className="relative overflow-hidden"
                          >
                            {loading ? (
                              <>
                                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                                Submitting...
                              </>
                            ) : (
                              <>
                                <Send className="mr-2 h-4 w-4" />
                                Submit Assignment
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="max-w-md mx-auto bg-card rounded-lg shadow-lg border border-border p-8 text-center"
              >
                <div className="mx-auto h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                  <CheckCircle className="h-10 w-10" />
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <h1 className="text-2xl font-bold text-foreground mb-2">Submission Complete!</h1>
                  <p className="text-muted-foreground mb-6">
                    Your assignment has been successfully submitted for review. You'll receive feedback once it's evaluated.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href={`/dashboard/${crid}`} passHref>
                      <Button variant="default" className="w-full">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Back to Course
                      </Button>
                    </Link>
                    
                    <Button variant="outline" onClick={handleShare} className="w-full">
                      <Share className="mr-2 h-4 w-4" />
                      Share Achievement
                    </Button>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Submitted on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  )
}