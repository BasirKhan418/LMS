
"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import Chat from "@/utilities/Ai/Chat"
import { Toaster,toast } from "sonner"
export default function Page() {
  const [activeTab, setActiveTab] = useState("sent")
  const [aiopen,setaiopen] = useState(false);
  const [allData,setAllData] = useState([]);
  const [loading,setLoading] = useState(false)
  const FetchNotification = async () => {
    const res = await fetch("/api/notificationtoken",{
      method:"GET",
      headers:{
        "Content-Type":"application/json",
        "token":localStorage.getItem("dilmsadmintoken")
      }
    })
    const result = await res.json();
    if(result.success){
    setAllData(result.data)
    console.log(result.data)
    }
  }
  useEffect(()=>{
    FetchNotification()
  },[])
  //Notidicationdata
const [notificationData,setNotificationData] = useState({
  title:"",
  desc:"",
  link:"",
  id:"",
})
const handleChange = (e) => {
  setNotificationData({
    ...notificationData,
    [e.target.name]:e.target.value
  })
}
const handleSubmit = async (e) => {
  console.log(notificationData)
  e.preventDefault()
  const arr = [];
  arr.push(notificationData.token)
  console.log(arr)
  setLoading(true)
  const res = await fetch("/api/send-notification",{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      id:notificationData.id,
      title:notificationData.title,
      message:notificationData.desc,
      link:notificationData.link
    })
  })
  const result = await res.json();
  setLoading(false)
  if(result.success){
    toast.success(result.message)
  }
  else{
    toast.error(result.message)
  }
}
  return (
    <section className="w-full max-w-4xl mx-auto py-12 md:py-16 lg:py-20">
      <div className="px-4 md:px-6">
        <div className="space-y-4 mb-8">
          <h1 className="text-3xl font-bold">Send Notification</h1>
          <p className="text-muted-foreground">Craft and send notifications to your students.</p>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList>
            <TabsTrigger value="sent">Sent</TabsTrigger>
            <TabsTrigger value="previouslySent">Previously Sent</TabsTrigger>
          </TabsList>
          <TabsContent value="sent">
            <Card>
              <CardContent className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="Enter notification Title" name="title" value={notificationData.title} onChange={handleChange}/>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subject">Link</Label>
                  <Input id="subject" placeholder="https://example.com" name="link" value={notificationData.link} onChange={handleChange} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" name="desc" placeholder="Enter notification message" rows={5} onChange={handleChange} value={notificationData.desc} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="id">Recipients</Label>
                  <select id="id" name="id" onChange={handleChange} value={notificationData.id} className="border-2 border-gray-600 p-2 rounded">
                    <option value="">Select Recipient</option>
                     { allData&&allData.map((item)=>(<option value={item._id} key={item._id}>{item.title}</option>))}
                  </select>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" onClick={handleSubmit}>{loading?"Sending .....":"Send Notification"}</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="previouslySent">
            <Card className="w-full overflow-x-auto md:overflow-x-visible">
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Sent At</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>Upcoming Exam</TableCell>
                      <TableCell>Don't forget to study for the upcoming exam!</TableCell>
                      <TableCell>Student 1, Student 2, Student 3</TableCell>
                      <TableCell>2023-04-15 10:30 AM</TableCell>
                      <TableCell className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm">
                          Resend
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Class Cancellation</TableCell>
                      <TableCell>There will be no class tomorrow due to a holiday.</TableCell>
                      <TableCell>Student 2, Student 4, Student 5</TableCell>
                      <TableCell>2023-05-01 2:00 PM</TableCell>
                      <TableCell className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm">
                          Resend
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Homework Reminder</TableCell>
                      <TableCell>Don't forget to submit your homework by the end of the day.</TableCell>
                      <TableCell>Student 1, Student 3, Student 5</TableCell>
                      <TableCell>2023-06-10 8:00 AM</TableCell>
                      <TableCell className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm">
                          Resend
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Button className="flex items-center gap-2 fixed lg:bottom-4 lg:right-4 md:bottom-4 md:right-4 bottom-2 right-2 rounded-full lg:py-8 md:py-8 py-8 " size="lg" onClick={()=>{
      setaiopen(!aiopen)
    }}>
      <MessageCircleIcon className="h-5 w-5" />
      Chat with AI
    </Button>
   
<Chat aiopen={aiopen} setaiopen={setaiopen}/>
    </section>
  )
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
  )
}