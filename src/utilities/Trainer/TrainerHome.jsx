import React from 'react'
import Link from "next/link"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { formatDate } from 'date-fns'
import { BookOpen, BarChart2, Calendar, Bell } from 'lucide-react';
const TrainerHome = ({name, analytics, sentNotifications,batch}) => {
  const formatDateToIST = (isoString) => new Date(isoString).toLocaleString('en-GB', {day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true, timeZone: 'Asia/Kolkata'}).replace(',', '').replace(' at', '');
  
  return (
    <div className="min-h-screen bg-gray-100">
      
     
      <main className="container mx-auto px-4 py-8 lg:px-6  lg:mt-0">
        {/* Analytics Cards */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg sm:text-xl">Total Courses</CardTitle>
              <CardDescription className="text-sm">The total number of courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-500">{analytics && analytics.courses}</div>
            </CardContent>
          </Card>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg sm:text-xl">Total Batch Assigned</CardTitle>
              <CardDescription className="text-sm">The number of batch assigned</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-green-500">{batch&&batch.batches.length}</div>
            </CardContent>
          </Card>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg sm:text-xl">New Signups</CardTitle>
              <CardDescription className="text-sm">The number of new signups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-orange-500">{analytics && analytics.newsignupthismonth}</div>
            </CardContent>
          </Card>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg sm:text-xl">Total Notifications</CardTitle>
              <CardDescription className="text-sm">The total notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-500">{sentNotifications.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Management Cards */}
        <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg sm:text-xl">Manage Courses</CardTitle>
              <CardDescription className="text-sm">Add, edit, and delete courses</CardDescription>
            </CardHeader>
            <Link href="/trainercourse">
              <CardContent>
                <div className="grid gap-2 sm:gap-4">
                  <Button size="sm" className="w-full">Add New Course</Button>
                  <Button variant="outline" size="sm" className="w-full">View All Courses</Button>
                </div>
              </CardContent>
            </Link> 
          </Card>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg sm:text-xl">Manage Assignments</CardTitle>
              <CardDescription className="text-sm">View and evaluate student</CardDescription>
            </CardHeader>
            <Link href="/trainerassignment">
              <CardContent>
                <div className="grid gap-2 sm:gap-4">
                  <Button size="sm" className="w-full">View Assignments List</Button>
                  <Button variant="outline" size="sm" className="w-full">Manage Assignments</Button>
                </div>
              </CardContent>
            </Link> 
          </Card>
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg sm:text-xl">Manage Projects</CardTitle>
              <CardDescription className="text-sm">View and manage projects and evaluate</CardDescription>
            </CardHeader>
            <Link href="/trainerprojects">
              <CardContent>
                <div className="grid gap-2 sm:gap-4">
                  <Button size="sm" className="w-full">View Projects List</Button>
                  <Button variant="outline" size="sm" className="w-full">Manage Project</Button>
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* Welcome and Announcements Section */}
        <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-3">
      <div className="lg:col-span-2 bg-white rounded-lg p-4 sm:p-6 lg:p-8 shadow-lg">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 text-gray-800">Welcome Back! {name}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-blue-100 p-3 sm:p-4 rounded-lg shadow-sm transition-transform hover:scale-105">
            <div className="flex items-start mb-2">
              <BookOpen className="text-blue-600 mr-2" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-700">Courses</h3>
            </div>
            <p className="text-sm sm:text-base text-gray-600">View and manage courses currently in progress.</p>
            <Link href="/trainerviewcourse">
            <Button size="sm" className="mt-2 sm:mt-4 w-full sm:w-auto">View Courses</Button>
            </Link>
          </div>
          <div className="bg-green-100 p-3 sm:p-4 rounded-lg shadow-sm transition-transform hover:scale-105">
            <div className="flex items-start mb-2">
              <BarChart2 className="text-green-600 mr-2" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-700">Analytics</h3>
            </div>
            <p className="text-sm sm:text-base text-gray-600">Track student performance and learning outcomes.</p>
            <Link href="/trainerresults">
            <Button size="sm" className="mt-2 sm:mt-4 w-full sm:w-auto">Manage Student Results</Button>
            </Link>
          </div>
          <div className="bg-yellow-100 p-3 sm:p-4 rounded-lg shadow-sm transition-transform hover:scale-105">
            <div className="flex items-start mb-2">
              <Calendar className="text-yellow-600 mr-2" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-700">Projects</h3>
            </div>
            <p className="text-sm sm:text-base text-gray-600">Organize and track ongoing educational projects.</p>
            <Link href="/trainerprojects">
            <Button size="sm" className="mt-2 sm:mt-4 w-full sm:w-auto">Manage Projects</Button>
            </Link>
          </div>
          <div className="bg-purple-100 p-3 sm:p-4 rounded-lg shadow-sm transition-transform hover:scale-105">
            <div className="flex items-start mb-2">
              <Bell className="text-purple-600 mr-2" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-700">Notifications</h3>
            </div>
            <p className="text-sm sm:text-base text-gray-600">Stay updated with important announcements.</p>
            <Link href="/trainerinappnotification">
            <Button size="sm" className="mt-2 sm:mt-4 w-full sm:w-auto">Manage Notifications</Button>
            </Link>
          </div>
        </div>
      </div>
          <div className="bg-white rounded-lg p-4 sm:p-6 lg:p-8 shadow-lg">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 text-gray-800">Recent Announcements</h2>
            <div className="space-y-3 sm:space-y-4 max-h-96 overflow-y-auto">
              {sentNotifications && sentNotifications.slice(0, 3).map((item) => (
                <div 
                  className={`border-b pb-3 sm:pb-4 shadow-md p-3 sm:p-4 rounded border-2 
                    ${item.category === "Announcements" ? "bg-green-200 border-green-200" : ""} 
                    ${item.category === "Warning" ? "bg-red-200 border-red-200" : ""} 
                    ${item.category === "Schedule" ? "bg-blue-200 border-blue-200" : ""}
                    ${item.category === "Project" ? "bg-indigo-200 border-indigo-200" : ""}`
                  } 
                  key={item._id}
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-700">{item.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600">{item.description}</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">Posted on {formatDateToIST(item.sentTime)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default TrainerHome