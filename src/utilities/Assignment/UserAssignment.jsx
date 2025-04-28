"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Toaster, toast } from "sonner"
import { format } from "date-fns"
import Link from "next/link"
import { 
  Clock, FileCheck, FileWarning, Award, Calendar, 
  CheckCircle, Bookmark, ChevronRight, BookOpen, AlertCircle 
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const AssignmentCard = ({ assignment, type, onClick,id }) => {
  const statusColors = {
    pending: "bg-amber-100 text-amber-700",
    submitted: "bg-blue-100 text-blue-700",
    evaluated: "bg-emerald-100 text-emerald-700",
    overdue: "bg-rose-100 text-rose-700"
  }

  const statusIcons = {
    pending: <Clock className="h-4 w-4" />,
    submitted: <FileCheck className="h-4 w-4" />,
    evaluated: <Award className="h-4 w-4" />,
    overdue: <FileWarning className="h-4 w-4" />
  }

  const getStatus = () => {
    if (type === "pending") {
      return new Date(assignment.duedate) < new Date() ? "overdue" : "pending"
    }
    return type
  }

  const status = getStatus()
  const dueDate = type === "pending" ? new Date(assignment.duedate) : 
                  type === "submitted" ? new Date(assignment.createdAt) : 
                  new Date(assignment.updatedAt)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border border-gray-200 hover:border-primary/40 transition-all hover:shadow-md">
        <div className={`h-1 w-full ${type === "evaluated" ? "bg-gradient-to-r from-indigo-500 to-purple-600" : status === "overdue" ? "bg-rose-500" : "bg-blue-500"}`}></div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg line-clamp-1 pr-4">{type === "pending" ? assignment.title : assignment.asid.title}</CardTitle>
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
              {statusIcons[status]}
              <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
            </div>
          </div>
          <CardDescription className="line-clamp-2 mt-1">
            {type === "pending" ? assignment.desc.slice(0, 100) : assignment.asid.desc.slice(0, 100)}
            {((type === "pending" && assignment.desc.length > 100) || 
              (type !== "pending" && assignment.asid.desc.length > 100)) && "..."}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-3">
          <div className="flex items-center text-sm text-muted-foreground gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>
              {type === "pending" ? "Due: " : type === "submitted" ? "Submitted: " : "Evaluated: "}
              {format(dueDate, "MMM dd, yyyy")}
            </span>
          </div>
          
          {type === "evaluated" && (
            <div className="mt-3">
              <div className="flex justify-between items-center mb-1.5 text-sm">
                <span className="font-medium">Score</span>
                <span className="font-semibold">{assignment.marks}%</span>
              </div>
              <Progress 
                value={assignment.marks} 
                className="h-2 bg-gray-100" 
                indicatorClassName={`${
                  assignment.marks >= 80 ? "bg-emerald-500" : 
                  assignment.marks >= 60 ? "bg-amber-500" : "bg-rose-500"
                }`}
              />
            </div>
          )}
        </CardContent>
        
        <CardFooter className="pt-0">
          {type === "pending" && (
           <Link href={`/assignment/${id}/${assignment._id}`} className="w-full">
           <Button variant="outline" className="w-full group">
             <span>View Assignment</span>
             <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
           </Button>
         </Link>
          )}
          {type === "submitted" && (
            <Button variant="secondary" className="w-full" disabled>
              <FileCheck className="mr-2 h-4 w-4" />
              <span>Awaiting Evaluation</span>
            </Button>
          )}
          {type === "evaluated" && (
            <Button variant="ghost" className="w-full text-primary hover:text-primary hover:bg-primary/10" onClick={onClick}>
              <Award className="mr-2 h-4 w-4" />
              <span>View Feedback</span>
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}

const EmptyState = ({ type }) => {
  const illustrations = {
    pending: "/assets/empty-assignments.svg", // These would be placeholder paths to your SVG assets
    submitted: "/assets/no-submissions.svg",
    evaluated: "/assets/no-evaluations.svg"
  }
  
  const messages = {
    pending: "No pending assignments",
    submitted: "No submitted assignments yet",
    evaluated: "No evaluated assignments yet"
  }
  
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center h-56">
      <div className="rounded-full bg-gray-50 p-4 mb-4">
        {type === "pending" ? (
          <BookOpen className="h-8 w-8 text-gray-400" />
        ) : type === "submitted" ? (
          <FileCheck className="h-8 w-8 text-gray-400" />
        ) : (
          <Award className="h-8 w-8 text-gray-400" />
        )}
      </div>
      <h3 className="text-base font-medium mb-1">{messages[type]}</h3>
      <p className="text-sm text-muted-foreground">
        {type === "pending" 
          ? "You're all caught up! Check back later for new assignments."
          : type === "submitted" 
            ? "Submit your pending assignments to see them here."
            : "Complete assignments to receive feedback and scores."
        }
      </p>
    </div>
  )
}

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[1, 2].map((i) => (
      <Card key={i} className="overflow-hidden">
        <div className="h-1 w-full bg-gray-200"></div>
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-6 w-full mt-4" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    ))}
  </div>
)

const FeedbackDialog = ({ isOpen, onClose, assignment }) => {
  if (!isOpen || !assignment) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold">{assignment.asid.title}</h3>
            <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">Evaluated on</div>
              <div className="text-sm font-medium">{format(new Date(assignment.updatedAt), "MMMM dd, yyyy")}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">Score</div>
              <div className="text-sm font-semibold">{assignment.marks}%</div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <h4 className="text-sm font-medium mb-2">Instructor Feedback</h4>
            <div className="text-sm">
              {assignment.feedback || "No feedback provided."}
            </div>
          </div>
          
          <Button onClick={onClose} className="w-full">Close</Button>
        </div>
      </div>
    </div>
  )
}

const AssignmentsSummaryCard = ({ assignments }) => {
  // Calculate statistics
  const total = assignments.pending.length + assignments.submitted.length + assignments.evaluated.length;
  const completed = assignments.submitted.length + assignments.evaluated.length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const averageScore = assignments.evaluated.length > 0 
    ? Math.round(assignments.evaluated.reduce((sum, item) => sum + item.marks, 0) / assignments.evaluated.length) 
    : 0;
  
  // Find overdue assignments
  const overdueCount = assignments.pending.filter(
    item => new Date(item.duedate) < new Date()
  ).length;

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <BookOpen className="mr-2 h-5 w-5 text-primary" />
          Assignment Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <div className="text-blue-600 text-xl font-semibold">{total}</div>
            <div className="text-xs text-blue-700 mt-1">Total Assignments</div>
          </div>
          <div className="bg-amber-50 p-3 rounded-lg text-center">
            <div className="text-amber-600 text-xl font-semibold">{assignments.pending.length}</div>
            <div className="text-xs text-amber-700 mt-1">Pending</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg text-center">
            <div className="text-purple-600 text-xl font-semibold">{assignments.submitted.length}</div>
            <div className="text-xs text-purple-700 mt-1">Submitted</div>
          </div>
          <div className="bg-emerald-50 p-3 rounded-lg text-center">
            <div className="text-emerald-600 text-xl font-semibold">{completionRate}%</div>
            <div className="text-xs text-emerald-700 mt-1">Completion Rate</div>
          </div>
        </div>
        
        {overdueCount > 0 && (
          <div className="flex items-center mt-4 p-2 rounded-md bg-rose-50 text-rose-700 text-sm">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span><strong>{overdueCount}</strong> assignment{overdueCount > 1 ? 's are' : ' is'} past due date</span>
          </div>
        )}
        
        {assignments.evaluated.length > 0 && (
          <div className="mt-4">
            <div className="text-sm font-medium mb-1 flex justify-between">
              <span>Average Score</span>
              <span>{averageScore}%</span>
            </div>
            <Progress 
              value={averageScore} 
              className="h-2" 
              indicatorClassName={`${
                averageScore >= 80 ? "bg-emerald-500" : 
                averageScore >= 60 ? "bg-amber-500" : "bg-rose-500"
              }`}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function UserAssignment({ id, userid }) {
  const [activeTab, setActiveTab] = useState("all");
  const [allAssignments, setAllAssignments] = useState([]);
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const [evaluatedAssignments, setEvaluatedAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);

  const fetchAllAssignment = async() => {
    setLoading(true)
    try {
      const res = await fetch(`/api/assignment?id=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "token": localStorage.getItem("dilmsadmintoken")
        }
      })
      const data = await res.json()
      
      if (data.success) {
        setAllAssignments(data.data)
        fetchAllSubmittedAssignment(data.data)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("Failed to fetch assignments")
    }
  }
  
  const fetchAllSubmittedAssignment = async(pendingData) => {
    try {
      const res = await fetch(`/api/submitassignment?crid=${id}&&userid=${userid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "token": localStorage.getItem("dilmstoken")
        }
      })
      const data = await res.json()
      
      if (data.success) {
        const submitted = data.data?.filter((item) => item.status === "submitted") || []
        const evaluated = data.data?.filter((item) => item.status === "evaluated") || []
        
        // Filter pending assignments to exclude ones that have been submitted or evaluated
        const pending = pendingData?.filter(item => 
          !submitted.find(subItem => subItem.asid._id === item._id) && 
          !evaluated.find(evalItem => evalItem.asid._id === item._id)
        ) || []
        
        setAllAssignments(pending)
        setSubmittedAssignments(submitted)
        setEvaluatedAssignments(evaluated)
      }
    } catch (error) {
      toast.error("Failed to fetch submitted assignments")
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchAllAssignment();
  }, [userid, id])
  
  const openFeedbackDialog = (assignment) => {
    setSelectedAssignment(assignment);
    setFeedbackDialogOpen(true);
  }

  return (
    <>
      <Toaster position="top-center" richColors />
      
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold  ">
              Assignment Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Track and manage your course assignments</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Avatar className="h-10 w-10 border">
              <AvatarFallback className="bg-primary/10 text-primary">
                {userid?.slice(0, 2)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Course ID: {id?.slice(0, 8)}</p>
              <p className="text-xs text-muted-foreground">User ID: {userid?.slice(0, 8)}</p>
            </div>
          </div>
        </div>
        
        <AssignmentsSummaryCard 
          assignments={{
            pending: allAssignments,
            submitted: submittedAssignments,
            evaluated: evaluatedAssignments
          }}
        />
        
        <Tabs 
          defaultValue="all" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="mb-6"
        >
          <div className="flex justify-between items-center mb-4">
            <TabsList className="bg-muted/60">
              <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                All
              </TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
                Pending ({allAssignments.length})
              </TabsTrigger>
              <TabsTrigger value="submitted" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                Submitted ({submittedAssignments.length})
              </TabsTrigger>
              <TabsTrigger value="evaluated" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
                Evaluated ({evaluatedAssignments.length})
              </TabsTrigger>
            </TabsList>
          </div>
          
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <>
              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allAssignments.map((assignment) => (
                    <AssignmentCard 
                      key={assignment._id} 
                      assignment={assignment}
                      type="pending"
                    />
                  ))}
                  
                  {submittedAssignments.map((assignment) => (
                    <AssignmentCard 
                      key={assignment._id} 
                      assignment={assignment}
                      type="submitted"
                    />
                  ))}
                  
                  {evaluatedAssignments.map((assignment) => (
                    <AssignmentCard 
                      key={assignment._id} 
                      assignment={assignment}
                      type="evaluated"
                      onClick={() => openFeedbackDialog(assignment)}
                    />
                  ))}
                  
                  {allAssignments.length === 0 && submittedAssignments.length === 0 && evaluatedAssignments.length === 0 && (
                    <div className="col-span-full">
                      <EmptyState type="pending" />
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="pending" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allAssignments.map((assignment) => (
                    <AssignmentCard 
                      key={assignment._id} 
                      assignment={assignment}
                      type="pending"
                    />
                  ))}
                  
                  {allAssignments.length === 0 && (
                    <div className="col-span-full">
                      <EmptyState type="pending" />
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="submitted" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {submittedAssignments.map((assignment) => (
                    <AssignmentCard 
                      key={assignment._id} 
                      assignment={assignment}
                      type="submitted"
                    />
                  ))}
                  
                  {submittedAssignments.length === 0 && (
                    <div className="col-span-full">
                      <EmptyState type="submitted" />
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="evaluated" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {evaluatedAssignments.map((assignment) => (
                    <AssignmentCard 
                      key={assignment._id} 
                      assignment={assignment}
                      type="evaluated"
                      onClick={() => openFeedbackDialog(assignment)}
                    />
                  ))}
                  
                  {evaluatedAssignments.length === 0 && (
                    <div className="col-span-full">
                      <EmptyState type="evaluated" />
                    </div>
                  )}
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
      
      <FeedbackDialog 
        isOpen={feedbackDialogOpen}
        onClose={() => setFeedbackDialogOpen(false)}
        assignment={selectedAssignment}
      />
    </>
  )
}