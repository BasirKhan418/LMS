"use client"

import { useState ,useEffect} from "react"
import {
  AlertCircle,
  Award,
  BookOpen,
  Calendar,
  ChevronRight,
  Download,
  GraduationCap,
  Medal,
  Share2,
  Trophy,
  User,
} from "lucide-react"
import Image from "next/image"
import { FaRegCalendarCheck } from "react-icons/fa6";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation";
import { Toaster,toast } from "sonner";
import { formatDate } from "date-fns";

export default function ResultsPage() {
  const [selectedBatch, setSelectedBatch] = useState("1 Month")
  const [resultData, setResultData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [user, setUser] = useState(null)
  const [data, setData] = useState(null)
  const [wholeresult, setWholeresult] = useState(null)
  const [batchdetails, setBatchdetails] = useState(null)
  const router = useRouter()

  const validateUser = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/homeauth", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "token": localStorage.getItem("dilmstoken")
        }
      })
      const res = await response.json()
      console.log("basir reg is ",res)
      setLoading(false)
      
      if (res.success) {
        setUser(res.user)
        setData(res.data)
        setBatchdetails(res.batch)
        if (res.user == null) {
          router.push("/login")
        }
      } else {
        toast.error(res.message || "Authentication failed")
      }
    } catch (err) {
      setLoading(false)
      toast.error("Error connecting to server")
    }
  }

  useEffect(() => {
    validateUser()
  }, [])

  const handleViewResult = async() => {
    setLoading(true)
    setResultData(null)
    try{
     const response = await fetch("/api/findresult", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "Authorization": localStorage.getItem("dilmstoken")
        },
        body: JSON.stringify({
          duration: selectedBatch,
          userid: user._id,
          batchid: batchdetails._id
        })
      })
      const res = await response.json()
      setLoading(false)
      if(res.success){
        setResultData(res.result)
        setWholeresult(res.data)
        setError(false)
      }
      else{
        toast.error(res.message || "Failed to fetch results")
      }
    }
    catch(err){
      toast.error("Something went wrong. Please try again later.")
    }
  }

  const calculatePercentage = (result) => {
    if (!result || !result.totalmarks) return 0
    const maxMarks = 60 // Updated max marks to 60
    return (Number.parseInt(result.totalmarks) / maxMarks) * 100
  }

  const isEligibleForStipend = (percentage) => {
    return percentage >= 80
  }

  const getGradeLabel = (percentage) => {
    if (percentage >= 90) return { label: "Outstanding", color: "text-emerald-500" }
    if (percentage >= 80) return { label: "Excellent", color: "text-green-500" }
    if (percentage >= 70) return { label: "Very Good", color: "text-blue-500" }
    if (percentage >= 60) return { label: "Good", color: "text-yellow-500" }
    if (percentage >= 50) return { label: "Satisfactory", color: "text-orange-500" }
    return { label: "Needs Improvement", color: "text-red-500" }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Toaster richColors position="top-center" closeButton />

      <main className="container mx-auto py-8 px-4 max-w-5xl">
        {/* Student Profile Summary */}
        <div className="mb-8 bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="bg-primary/10 p-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10">
              <GraduationCap className="h-48 w-48 text-primary" />
            </div>
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center relative z-10">
              <Avatar className="h-20 w-20 border-4 border-white shadow-md">
                <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Student" />
                <AvatarFallback className="text-2xl">{user&&user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h2 className="text-2xl font-bold">{user&&user.name}</h2>
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>ID: {user&&user._id.slice(9)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    <span>{user&&user.domain}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="bg-white/50">
                   {batchdetails&&batchdetails.name}
                  </Badge>
                  <Badge variant="outline" className="bg-white/50">
                    Remote Learning
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Batch Selection Card */}
        <Card className="mb-8 overflow-hidden border-none shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Select Your Batch
                </CardTitle>
                <CardDescription>Choose your batch duration to view your performance results</CardDescription>
              </div>
              <div className="hidden md:block opacity-70">
                <FaRegCalendarCheck
                    className="h-10 w-10 text-primary"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="1 Month" className="w-full" onValueChange={(value) => setSelectedBatch(value)}>
              <TabsList className="grid grid-cols-4 mb-6 p-1 bg-muted/50">
              {user&&user.month=="4 Months"&&<>
                {["1 Month", "2 Months", "3 Months", "4 Months"].map((batch) => (
                  <TabsTrigger
                    key={batch}
                    value={batch}
                    className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                  >
                    {batch}
                  </TabsTrigger>
                ))}
                </>}
                {user&&user.month=="3 Months"&&<>
                {["1 Month", "2 Months", "3 Months"].map((batch) => (
                  <TabsTrigger
                    key={batch}
                    value={batch}
                    className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                  >
                    {batch}
                  </TabsTrigger>
                ))}
                </>}
                {user&&user.month=="2 Months"&&<>
                {["1 Month", "2 Months"].map((batch) => (
                  <TabsTrigger
                    key={batch}
                    value={batch}
                    className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                  >
                    {batch}
                  </TabsTrigger>
                ))}
                </>}
                {user&&user.month=="1 Months"&&<>
                {["1 Month"].map((batch) => (
                  <TabsTrigger
                    key={batch}
                    value={batch}
                    className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                  >
                    {batch}
                  </TabsTrigger>
                ))}
                </>}
              </TabsList>

              <div className="flex justify-center mt-4">
                <Button
                  onClick={handleViewResult}
                  disabled={loading}
                  size="lg"
                  className="w-full md:w-auto px-8 rounded-full font-medium"
                >
                  {loading ? "Loading..." : "View Result"}
                </Button>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {resultData ? (
          <div className="space-y-8">
            {/* Result Summary Card */}
            <Card className="overflow-hidden border-none shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-white/70 text-primary">
                        {selectedBatch}
                      </Badge>
                      <Badge variant="outline" className="bg-white/70">
                        {batchdetails&&batchdetails.name}
                      </Badge>
                    </div>
                    <CardTitle className="mt-2">Performance Results</CardTitle>
                    <CardDescription>Published on {new Date(wholeresult.updatedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</CardDescription>
                  </div>
                  <div className="hidden md:flex items-center gap-2">
                    {/* <Button variant="outline" size="sm" className="bg-white/70">
                      <Download className="h-4 w-4 mr-1" /> Export
                    </Button> */}
                    <img src="/11.png" alt="Result" className="h-20 w-20" />
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="space-y-8">
                  {/* Overall Score */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-lg">Overall Performance</h3>
                        <div className="flex items-center">
                          <span className="text-2xl font-bold">{resultData.totalmarks}</span>
                          <span className="text-muted-foreground">/60</span>
                        </div>
                      </div>

                      <div className="relative pt-1">
                        <div className="h-2 bg-muted rounded-full">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-primary to-primary/80"
                            style={{ width: `${calculatePercentage(resultData)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                          <span>0</span>
                          <span>15</span>
                          <span>30</span>
                          <span>45</span>
                          <span>60</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 mt-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Result ID:</span>
                          <code className="text-xs bg-muted px-2 py-1 rounded">{resultData._id}</code>
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/20 rounded-xl p-4 flex flex-col items-center justify-center">
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground mb-1">Overall Grade</div>
                        <div className={`text-3xl font-bold ${getGradeLabel(calculatePercentage(resultData)).color}`}>
                          {getGradeLabel(calculatePercentage(resultData)).label}
                        </div>
                        <div className="flex justify-center mt-3">
                          {calculatePercentage(resultData) >= 80 && (
                            <div className="flex items-center gap-1 text-amber-500">
                              <Trophy className="h-4 w-4" />
                              <span className="text-sm font-medium">Stipend Eligible</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Detailed Scores */}
                  <div>
                    <h3 className="font-semibold text-lg mb-4">Detailed Assessment</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ScoreCard
                        title="Project Review"
                        score={resultData.projectreview}
                        maxScore="10"
                        icon={<BookOpen className="h-5 w-5 text-blue-500" />}
                        color="blue"
                      />
                      <ScoreCard
                        title="Viva"
                        score={resultData.viva}
                        maxScore="5"
                        icon={<User className="h-5 w-5 text-purple-500" />}
                        color="purple"
                      />
                      <ScoreCard
                        title="Final Project Review"
                        score={resultData.finalprojectreview}
                        maxScore="30"
                        icon={<Trophy className="h-5 w-5 text-amber-500" />}
                        color="amber"
                      />
                      <ScoreCard
                        title="Final Viva"
                        score={resultData.finalviva}
                        maxScore="5"
                        icon={<Medal className="h-5 w-5 text-emerald-500" />}
                        color="emerald"
                      />
                      <ScoreCard
                        title="Attendance"
                        score={resultData.attendance || "0"}
                        maxScore="5"
                        icon={<Calendar className="h-5 w-5 text-red-500" />}
                        color="red"
                      />
                      <ScoreCard
                        title="Social Media Sharing"
                        score={resultData.socialmediasharing || "0"}
                        maxScore="5"
                        icon={<Share2 className="h-5 w-5 text-indigo-500" />}
                        color="indigo"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stipend Eligibility Card */}
            {isEligibleForStipend(calculatePercentage(resultData)) && <StipendEligibilityCard url={wholeresult.url}/>}
          </div>
        ) : error ? (
          <Alert variant="destructive" className="shadow-md">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Failed to load your results. Please try again later.</AlertDescription>
          </Alert>
        ) : loading ? (
          <Card className="p-8 text-center border-none shadow-lg">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p>Loading your results...</p>
            </div>
          </Card>
        ) : (
          <Card className="border-none shadow-lg overflow-hidden">
            <div className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <div className="relative w-32 h-32">
                  <Image
                    src="/11.png"
                    width={128}
                    height={128}
                    alt="No results"
                    className="object-contain opacity-50"
                  />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">No Results Found</h3>
              <p className="text-muted-foreground mb-6">
                Result is not declared yet or published yet. Please check back later.
              </p>
              <Button variant="outline" onClick={()=>{
                toast.success("You will be notified when results are available")
              }}>Notify Me When Available</Button>
            </div>
          </Card>
        )}
      </main>
    </div>
  )
}

function ScoreCard({ title, score, maxScore, icon, color }) {
  const percentage = (Number.parseInt(score) / Number.parseInt(maxScore)) * 100
  const colorMap = {
    blue: "from-blue-500 to-blue-400",
    purple: "from-purple-500 to-purple-400",
    amber: "from-amber-500 to-amber-400",
    emerald: "from-emerald-500 to-emerald-400",
    red: "from-red-500 to-red-400",
    indigo: "from-indigo-500 to-indigo-400",
  }

  const gradientClass = colorMap[color] || "from-primary to-primary/80"

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            {icon}
            <h3 className="font-medium">{title}</h3>
          </div>
          <div className="text-lg font-bold">
            {score}
            <span className="text-sm text-muted-foreground">/{maxScore}</span>
          </div>
        </div>

        <div className="relative pt-1">
          <div className="h-1.5 bg-muted rounded-full">
            <div
              className={`h-1.5 rounded-full bg-gradient-to-r ${gradientClass}`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>

        <div className="mt-2 text-xs text-right text-muted-foreground">{percentage.toFixed(0)}% achieved</div>
      </div>
    </div>
  )
}

function StipendEligibilityCard({url}) {
  return (
    <Card className="border-none shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 relative">
        <div className="absolute right-0 top-0 opacity-10">
          <Award className="h-48 w-48 text-green-500" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white p-2 rounded-full shadow-sm">
              <Award className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-green-700">Congratulations!</h3>
              <p className="text-green-600">You are eligible for the stipend program</p>
            </div>
          </div>

          <div className="bg-white/70 rounded-lg p-4 mb-4 backdrop-blur-sm">
            <p className="text-sm text-green-700">
              Based on your excellent performance, you qualify for our stipend program. Complete the application to
              receive your benefits. The stipend amount will be determined based on your overall performance and
              attendance.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button className="bg-green-600 hover:bg-green-700 shadow-sm" onClick={()=>{
                window.open(`${url}`, "_blank");
                toast.success("Stipend application form opened in new tab")
            }}>
              Apply for Stipend <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
           
          </div>
        </div>
      </div>
    </Card>
  )
}