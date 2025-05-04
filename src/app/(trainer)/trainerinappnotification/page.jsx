"use client"

import { useState ,useEffect} from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Bell, Calendar, AlertTriangle, Briefcase, Clock, Send, Users, Zap, CheckCircle } from "lucide-react"
import { format } from "date-fns"
import { Toaster,toast } from "sonner"
import ProfilePageSkeleton from "@/utilities/skeleton/ProfilePageSkeleton"
export default function NotificationPage() {
  const [loading, setLoading] = useState(false);
    //fetch all batches from api
    const [batches, setBatches] = useState([
      ])
      const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    //fetch all batches from api
    const fetchBatches = async () => {
      setBatches([])
      try{
        setIsLoading(true)
     const data = await fetch("/api/batchcrud", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${localStorage.getItem("dilmsadmintoken")}`,
        },
      })
      const res = await data.json()
    setIsLoading(false)
      if (res.success) {
        setBatches(res.batch)
      } else {
        toast.warning(res.message)
      }
      }
      catch(err){
       
        toast.error("Something went wrong while fetching batches")
      }
    }
    //update on all render
    useEffect(() => {
      fetchBatches()
    },[])
  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [sendTime, setSendTime] = useState("")
  const [category, setCategory] = useState("")
  const [batch, setBatch] = useState("")
  const [sendNow, setSendNow] = useState(false)

  // Previous sent notifications state
  const [sentNotifications, setSentNotifications] = useState([
    
  ])
//fetch previous notifications from api
const fetchNotifications = async () => {
  try{
    setIsLoading(true)
    const data = await fetch("/api/notificationcrud", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${localStorage.getItem("dilmsadmintoken")}`,
      },
    })
    const res = await data.json()
    setIsLoading(false)
    
    if (res.success) {
      setSentNotifications(res.data)
    } else {
      toast.warning(res.message)
    }
  }
  catch(err){
   
    toast.error("Something went wrong while fetching notifications")
  }
}
useEffect(()=>{
  fetchNotifications()
},[])
//scgedule notification function
  const handleSchedule = async(title,message,sendTime,category,batchid) => {
    try{
      setLoading(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/api/schedule/notification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `${localStorage.getItem("dilmsadmintoken")}`,
        },
        body: JSON.stringify({
          title,
          message,
          sendTime,
          category,
          batchid,
        }),
      })
      const data = await res.json()
      setLoading(false)
      console.log(data)
      if (data.success) {
        toast.success("Notification scheduled successfully")
      } else {
        toast.error(data.message)
      }
    }
    catch(err){
      toast.error("Something went wrong while scheduling notification"+err)
    }

  }
  //  send function
  const handleSend = async() => {
    if (!title || !description || (!sendNow && !sendTime) || !category || !batch) {
        toast.error("Please fill in all fields before sending.")
      return
    }
   setLoading(true);
    const currentTime = new Date().toISOString()

    const newNotification = {
      title,
      description,
      sentTime: sendNow ? currentTime : sendTime,
      category,
      batch,
    }
    await handleSchedule(title,description,sendNow ? currentTime : sendTime,category,batch)
    try{
   const res = await fetch("/api/notificationcrud", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${localStorage.getItem("dilmsadmintoken")}`,
      },
      body: JSON.stringify(newNotification),
   })
    const data = await res.json()
    setLoading(false)

    if(data.success){
      
      toast.success("Notification queued successfully")
      setTitle("")
      setDescription("")
      setSendTime("")
      setCategory("")
      setBatch("")
      fetchNotifications()
      setSendNow(false)
    }
    else{
      toast.error(data.message)
    }
    }
    catch(err){
      
      toast.error("Something went wrong while sending notification. Please contact to the developer")
    }

    
  }

  // Helper function to get category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case "Announcements":
        return <Bell className="h-4 w-4" />
      case "Schedule":
        return <Calendar className="h-4 w-4" />
      case "Warning":
        return <AlertTriangle className="h-4 w-4" />
      case "Project":
        return <Briefcase className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  // Helper function to get category color
  const getCategoryColor = (category) => {
    switch (category) {
      case "Announcements":
        return "bg-blue-500"
      case "Schedule":
        return "bg-green-500"
      case "Warning":
        return "bg-yellow-500"
      case "Project":
        return "bg-purple-500"
      default:
        return "bg-gray-500"
    }
  }
  if(isLoading){
    return <ProfilePageSkeleton/>
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <Toaster richColors position="top-right" closeButton={false} />
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="bg-primary p-2 rounded-lg mr-3">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Notification Center</h1>
          </div>
        </div>

        <Tabs defaultValue="send" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="send" className="text-base">
              <Send className="mr-2 h-4 w-4" /> Send Notification
            </TabsTrigger>
            <TabsTrigger value="previous" className="text-base">
              <Clock className="mr-2 h-4 w-4" /> Previous Sent
            </TabsTrigger>
          </TabsList>

          <TabsContent value="send">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b">
                  <CardTitle className="flex items-center">
                    <Send className="mr-2 h-5 w-5 text-primary" />
                    Create New Notification
                  </CardTitle>
                  <CardDescription>Fill in the details below to send a new notification to users.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title/Subject</Label>
                    <Input
                      id="title"
                      placeholder="Enter notification title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="border-slate-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter notification details"
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="border-slate-200"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger id="category" className="border-slate-200">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Announcements">
                            <div className="flex items-center">
                              <Bell className="mr-2 h-4 w-4 text-blue-500" />
                              Announcements
                            </div>
                          </SelectItem>
                          <SelectItem value="Schedule">
                            <div className="flex items-center">
                              <Calendar className="mr-2 h-4 w-4 text-green-500" />
                              Schedule
                            </div>
                          </SelectItem>
                          <SelectItem value="Warning">
                            <div className="flex items-center">
                              <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
                              Warning
                            </div>
                          </SelectItem>
                          <SelectItem value="Project">
                            <div className="flex items-center">
                              <Briefcase className="mr-2 h-4 w-4 text-purple-500" />
                              Project
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="batch">Recipient Batch</Label>
                      <Select value={batch} onValueChange={setBatch}>
                        <SelectTrigger id="batch" className="border-slate-200">
                          <SelectValue placeholder="Select batch" />
                        </SelectTrigger>
                        <SelectContent>
                         { batches&&batches.map((item)=>(<SelectItem value={item._id} key={item._id}>
                            <div className="flex items-center">
                              <Users className="mr-2 h-4 w-4" />
                                {item.name}
                            </div>
                          </SelectItem>))}
                         
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="send-now" className="flex items-center cursor-pointer">
                        <Zap className="mr-2 h-4 w-4 text-amber-500" />
                        Send Immediately
                      </Label>
                      <Switch id="send-now" checked={sendNow} onCheckedChange={setSendNow} />
                    </div>

                    {!sendNow && (
                      <div className="space-y-2">
                        <Label htmlFor="time">Schedule Time</Label>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <Input
                            id="time"
                            type="datetime-local"
                            value={sendTime}
                            onChange={(e) => setSendTime(e.target.value)}
                            className="border-slate-200"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="bg-slate-50 dark:bg-slate-800/50 border-t">
                  <Button onClick={handleSend} className="w-full md:w-auto">
                  { !loading&&<> <Send className="mr-2 h-4 w-4" /> {sendNow ? "Send Now" : "Schedule Notification"}</>}
                  { loading&&<> <Send className="mr-2 h-4 w-4" /> Processing .....</>}
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b">
                  <CardTitle>Notification Preview</CardTitle>
                  <CardDescription>How your notification will appear to recipients</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="border rounded-lg p-4 shadow-sm bg-white dark:bg-slate-800">
                    <div className="flex justify-between items-start mb-2">
                      <Badge className="mb-2" variant="outline">
                        {category ? (
                          <>
                            <span className={`mr-1 h-2 w-2 rounded-full ${getCategoryColor(category)}`} />
                            {category}
                          </>
                        ) : (
                          "Category"
                        )}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {sendNow
                          ? "Sending immediately"
                          : sendTime
                            ? format(new Date(sendTime), "MMM d, yyyy 'at' h:mm a")
                            : "Scheduled time"}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg">{title || "Notification Title"}</h3>
                    <p className="text-muted-foreground mt-2 text-sm">
                      {description || "Your notification description will appear here."}
                    </p>
                    <div className="mt-4 text-xs text-muted-foreground">Recipients: {batch || "Select a batch"}</div>
                  </div>

                  <div className="mt-6 bg-slate-100 dark:bg-slate-800 rounded-lg p-4">
                    <h4 className="font-medium text-sm mb-2 flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                      Notification Tips
                    </h4>
                    <ul className="text-xs space-y-2 text-muted-foreground">
                      <li>• Keep titles concise and clear</li>
                      <li>• Include all necessary details in the description</li>
                      <li>• Choose the appropriate category for better organization</li>
                      <li>• Schedule notifications during business hours when possible</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="previous">
            <Card>
              <CardHeader className="bg-slate-50 dark:bg-slate-800/50 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="flex items-center">
                    <Clock className="mr-2 h-5 w-5 text-primary" />
                    Previous Notifications
                  </CardTitle>
                  <CardDescription>View all previously sent notifications.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src="/11.png"
                    alt="Notification Icon"
                    className="h-10 w-10 rounded-full border p-1"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <div className="space-y-6">
                  {sentNotifications.length > 0 ? (
                    sentNotifications.map((notification) => (
                      <div
                        key={notification._id}
                        className="border rounded-lg p-4 shadow-sm bg-white dark:bg-slate-800 hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                          <div className="flex items-center">
                            <Badge className="mr-2" variant="outline">
                              <span
                                className={`mr-1 h-2 w-2 rounded-full ${getCategoryColor(notification.category)}`}
                              />
                              {notification.category}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              <Users className="h-3 w-3 mr-1" />
                              {notification.batch.name}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {format(new Date(notification.sentTime), "MMM d, yyyy 'at' h:mm a")}
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg flex items-center">
                          {getCategoryIcon(notification.category)}
                          <span className="ml-2">{notification.title}</span>
                        </h3>
                        <p className="text-muted-foreground mt-2">{notification.description}</p>
                        
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                        <Bell className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium mb-1">No notifications yet</h3>
                      <p className="text-muted-foreground">No notifications have been sent yet.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
