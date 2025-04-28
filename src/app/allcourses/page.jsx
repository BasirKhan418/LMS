"use client"
import { useState, useEffect } from 'react'
import { Toaster, toast } from 'sonner'
import { GraduationCap, BookOpen, Search, Filter, Star, Clock, TrendingUp, Award } from 'lucide-react'
import { NoCoursesBanner } from '@/utilities/Course/NoCoursesBanner'
import { CourseCard } from '@/utilities/Course/CourseCard'
import HomePageSkl from '@/utilities/skeleton/HomePageSkl'
import { useRouter } from 'next/navigation'
import RazorpayIntegration from '../../../hooks/razorpayint'

const Page = () => {
  const [courses, setCourses] = useState([])
  const [filteredCourses, setFilteredCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [data, setData] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all')
  const [batchdetails,setBatchdetails] = useState(null)
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

  const fetchCourses = async () => {
    setLoading(true)
    try {
      let data = await fetch("/api/allcourses", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "token": localStorage.getItem("dilmstoken")
        }
      })
      let response = await data.json()
      
      if (response.success) {
        setCourses(response.data)
        setFilteredCourses(response.data)
      } else {
        toast.error(response.message || "Failed to load courses")
      }
    } catch (error) {
      toast.error("Error fetching courses")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    validateUser()
    fetchCourses()
  }, [])

  useEffect(() => {
    if (courses.length > 0) {
      let results = courses
      
      // Apply search filter
      if (searchTerm) {
        results = results.filter(course => 
          course.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
          course.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      
      // Apply category filter
      if (filter !== 'all') {
        results = results.filter(course => course.category?.toLowerCase() === filter.toLowerCase())
      }
      
      setFilteredCourses(results)
    }
  }, [searchTerm, filter, courses])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleFilterChange = (e) => {
    setFilter(e.target.value)
  }



  return (
    <>
      <RazorpayIntegration>
    <div className=" bg-gray-50">
      <Toaster position="top-center" />
    
      {/* Hero Section with Better Gradient and Logo */}
      <header className="bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 text-white  relative overflow-hidden py-6 mb-10 rounded-lg">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="flex items-center mb-6">
              <div className="rounded-full mr-4 shadow-lg bg-gray-200">
                <img src="/11.png" alt="infotact learning logo" className='h-20 w-20'/>
              </div>
              <h1 className="text-5xl font-bold tracking-tight">Infotact Learning</h1>
            </div>
            <p className="text-center text-xl max-w-2xl mx-auto mb-8">
              Discover, learn, and master new skills with our expertly crafted courses. 
              Elevate your career with knowledge that matters.
            </p>
            
            {/* Search bar */}
            <div className="w-full max-w-2xl relative">
              <input
                type="text"
                placeholder="Search for courses..."
                className="w-full py-3 px-5 pl-12 rounded-full text-gray-800 border-none shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={handleSearch}
              />
              <Search className="absolute left-4 top-3 text-gray-500 w-5 h-5" />
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-8">
            <div className="text-center">
              <p className="text-3xl font-bold">{courses.length}+</p>
              <p className="text-indigo-100">Courses</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">24/7</p>
              <p className="text-indigo-100">Support</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">100%</p>
              <p className="text-indigo-100">Satisfaction</p>
            </div>
          </div>
        </div>
      </header>
      
      
      
      {/* Main Content */}
      <div className="container mx-auto px-4 mb-16">
        {/* Filters */}
      
        
        {/* Loading state */}
        {loading ? (
          <HomePageSkl />
        ) : (
          <div>
            {/* Course cards grid */}
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCourses.map((course, index) => (
                  <CourseCard key={index} course={course} user={user} data={data} batchdetails={batchdetails}/>
                ))}
              </div>
            ) : (
              <div className="my-12">
                <NoCoursesBanner />
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Call to Action */}
      <div className="bg-indigo-700 text-white py-12 rounded-lg">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start learning?</h2>
          <p className="mb-8 max-w-2xl mx-auto">Join thousands of students who are already advancing their careers with our courses.</p>
          <button 
            onClick={() => router.push('/allcourses')} 
            className="bg-white text-indigo-700 font-bold py-3 px-8 rounded-full hover:bg-indigo-50 transition-all shadow-lg"
          >
            Explore All Courses
          </button>
        </div>
      </div>
      
      
    </div>
    </RazorpayIntegration>
    </>
  )
}

export default Page