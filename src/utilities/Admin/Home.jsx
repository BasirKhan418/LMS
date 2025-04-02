import React from 'react'
import Link from "next/link"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

const Home = ({name}) => {
  return (
    <div className="min-h-screen bg-gray-100">
     
      <main className="container mx-auto px-6 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Courses</CardTitle>
              <CardDescription>The total number of courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-500">142</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Active Students</CardTitle>
              <CardDescription>The number of active students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-500">3,456</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>New Signups</CardTitle>
              <CardDescription>The number of new signups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-orange-500">124</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Products</CardTitle>
              <CardDescription>The total products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-purple-500">42,356</div>
            </CardContent>
          </Card>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Manage Courses</CardTitle>
              <CardDescription>Add, edit, and delete courses</CardDescription>
            </CardHeader>
            <Link href={"/admincourse"}><CardContent>
              <div className="grid gap-4">
              <Button>Add New Course</Button>
                <Button variant="outline">View All Courses</Button>
              </div>
            </CardContent></Link> 
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Manage Assignments</CardTitle>
              <CardDescription>View and evaluate student</CardDescription>
            </CardHeader>
           <Link href={"/adminassignment"}><CardContent>
              <div className="grid gap-4">
                <Button>View Assignments List</Button>
                <Button variant="outline">Manage Assignments</Button>
              </div>
            </CardContent></Link> 
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Manage Projects</CardTitle>
              <CardDescription>View and manage projects and evaluate</CardDescription>
            </CardHeader>
            <Link href={"/adminprojects"}><CardContent>
              <div className="grid gap-4">
                <Button>View Projects List</Button>
                <Button variant="outline">Manage Project</Button>
              </div>
            </CardContent></Link>
          </Card>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3 lg:grid-cols-3">
  <div className="col-span-2 bg-white rounded-lg p-8 shadow-lg">
    <h2 className="text-3xl font-bold mb-4 text-gray-800">Welcome Back! {name}</h2>
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-blue-100 p-4 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-gray-700">New Courses</h3>
        <p className="text-gray-600">Check out the latest courses added to our platform.</p>
        <Button className="mt-4">View Courses</Button>
      </div>
      <div className="bg-green-100 p-4 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-gray-700">Student Progress</h3>
        <p className="text-gray-600">Track your progress and achievements.</p>
        <Button className="mt-4">View Progress</Button>
      </div>
      <div className="bg-yellow-100 p-4 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-gray-700">Upcoming Events</h3>
        <p className="text-gray-600">Stay updated with the latest events and webinars.</p>
        <Button className="mt-4">View Events</Button>
      </div>
      <div className="bg-purple-100 p-4 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold text-gray-700">Community Forum</h3>
        <p className="text-gray-600">Join discussions with peers and instructors.</p>
        <Button className="mt-4">Visit Forum</Button>
      </div>
    </div>
  </div>
  <div className="bg-white rounded-lg p-8 shadow-lg">
    <h2 className="text-3xl font-bold mb-4 text-gray-800">Recent Announcements</h2>
    <div className="space-y-4">
      <div className="border-b pb-4 shadow-lg p-4 rounded border-green-200 border-2 bg-yellow-100">
        <h3 className="text-xl font-semibold text-gray-700">New Course Released: Advanced JavaScript</h3>
        <p className="text-gray-600">Dive deep into JavaScript with our latest course.</p>
        <p className="text-sm text-gray-500 mt-2">Posted on June 30, 2024</p>
      </div>
      <div className="border-b pb-4 shadow-lg p-4 rounded bg-green-100">
        <h3 className="text-xl font-semibold text-gray-700">Webinar: Future of Online Learning</h3>
        <p className="text-gray-600">Join our webinar on the future trends in online learning.</p>
        <p className="text-sm text-gray-500 mt-2">Posted on June 25, 2024</p>
      </div>
      <div className='shadow-lg p-4 rounded bg-purple-100'>
        <h3 className="text-xl font-semibold text-gray-700 ">Student Spotlight: Achievements</h3>
        <p className="text-gray-600">Read about the achievements of our students.</p>
        <p className="text-sm text-gray-500 mt-2">Posted on June 20, 2024</p>
      </div>
    </div>
  </div>
</div>

      </main>
    </div>
  )
}

export default Home
