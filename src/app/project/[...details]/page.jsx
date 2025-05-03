"use client"
import React, { use, useEffect, useState } from 'react'
import { Toaster, toast } from 'sonner'
import { motion } from 'framer-motion'
import { Calendar, Clock, Laptop, Link, FileText, Send, X, CheckCircle, Loader2, FolderX, PlusCircle } from 'lucide-react'

const ProjectPage = (props) => {
  const params = use(props.params)
  const [projectData, setProjectData] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [isEligible, setIsEligible] = useState(false) 
  const [submission, setSubmission] = useState({
    title:"",
    projectUrl: '',
    repositoryUrl: '',
    description: '',
  })
  //find submit date

  function findSubmitdate(startDate, months) {
    // Parse the start date
    const start = new Date(startDate);
    
    // Parse the months (handling both "2 Months" string format and number)
    let monthCount;
    if (typeof months === 'string') {
      monthCount = parseInt(months);
    } else {
      monthCount = months;
    }
    
    // Calculate the end date (start date + months)
    const endDate = new Date(start);
    endDate.setMonth(start.getMonth() + monthCount);
    
    // Get current date (remove time component)
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    // Reset time portion for accurate date comparison
    endDate.setHours(0, 0, 0, 0);
    
    
    return currentDate >= endDate;
  }
  const [submitted, setSubmitted] = useState(false)

  const fetchProject = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/projectuser/?id=${params.details[0]}&&userid=${params.details[1]}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Token': `${localStorage.getItem("dilmstoken")}`
        }
      })
      const data = await res.json()
     
      if (data.success) {
        setProjectData(data.data)
        setUserData(data.userdata)
        const result = findSubmitdate(data.user.startdate, data.user.month) ? setIsEligible(false) : setIsEligible(true)
        
        if (data.submission) {
          setSubmission(data.submission)
          setSubmitted(true)
        } else {
          setSubmitted(false)
        }
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      
      toast.error("Something went wrong, please try again later")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmissionChange = (e) => {
    const { name, value } = e.target
    setSubmission(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    // Simulate API call
    try {
      const res = await fetch(`/api/projectuser`,{
        method:"POST",
        headers:{
          "Content-Type":"application/json",

          "token":localStorage.getItem("dilmstoken")
        },
        body:JSON.stringify({crid:params.details[0],pid:projectData._id,userid:params.details[1],title:submission.title,desc:submission.description,link:submission.repositoryUrl,link2:submission.projectUrl})
      })
      const result = await res.json();
      setSubmitting(false)
      if(result.success){
        toast.success(result.message)
        setSubmission({
          title:"",
          description:"",
          repositoryUrl:"",
          projectUrl:""
        })
        setSubmissionModalOpen(false)
      }
      else{
        toast.error(result.message)
      }
      
    } catch (error) {
      toast.error("Failed to submit project. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    fetchProject()
  }, [])

  const project = projectData 

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Loading project data...</h3>
        </div>
      </div>
    )
  }

  // No Project Found State
  if (!projectData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg w-full bg-white shadow-xl rounded-2xl overflow-hidden"
        >
          <div className="bg-blue-600 h-3 w-full"></div>
          <div className="p-8 text-center">
            <div className="bg-blue-50 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-6">
              <FolderX className="h-12 w-12 text-blue-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Project Found</h2>
            <p className="text-gray-600 mb-8">
            We couldn't locate the project you are looking for. It may have been removed, you might not have access to it, or you may not have been assigned to it yet.
            </p>
            
            <div className="space-y-4">
              <a 
                href="/" 
                className="block w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition duration-200 shadow-md hover:shadow-lg"
              >
                Return to Dashboard
              </a>
              
              <a 
                href="/project" 
                className="block w-full py-3 px-4 rounded-lg border border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-700 font-medium transition duration-200"
              >
                View All Projects
              </a>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <PlusCircle className="h-4 w-4" />
                <span>Need help? Contact <a href="mailto:support@infotact.in" className="text-blue-600 hover:underline">support@infotact.in</a></span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    
      <div className="min-h-screen bg-gray-50">
      
      
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative bg-blue-700 text-white py-16 px-4 sm:px-6 lg:px-8 overflow-hidden rounded"
      >
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-800 to-indigo-900 mix-blend-multiply" />
          <div className="absolute right-0 top-0 transform translate-x-1/4 -translate-y-1/4">
            <svg width="404" height="784" fill="none" viewBox="0 0 404 784">
              <defs>
                <pattern id="pattern-squares" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect x="0" y="0" width="4" height="4" fill="rgba(255, 255, 255, 0.1)" />
                </pattern>
              </defs>
              <rect width="404" height="784" fill="url(#pattern-squares)" />
            </svg>
          </div>
        </div>
        <div className="relative max-w-7xl mx-auto">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              {project.title}
            </h1>
            <p className="mt-6 text-xl max-w-3xl mx-auto">
              {project.desc}
            </p>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-8 flex justify-center"
          >
            {!isEligible&&<button 
              onClick={() => setSubmissionModalOpen(true)}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              <Send className="mr-2 h-5 w-5" />
              Submit Project
            </button>}
          </motion.div>
        </div>
      </motion.div>

      {/* Project Details */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Left Column - Project Details */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="col-span-2"
          >
            <div className="bg-white shadow-lg rounded-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Details</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                      <FileText className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Description</h3>
                    <p className="mt-2 text-gray-600">{project.desc}</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                      <Link className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Project Links</h3>
                    <div className="mt-2 space-y-2">
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center">
                        <span>Project Documentation</span>
                        <svg className="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                        </svg>
                      </a>
                      {project.link2 && (
                        <a href={project.link2} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 flex items-center">
                          <span>Supporting Materials</span>
                          <svg className="ml-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                      <Calendar className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Timeline</h3>
                    <div className="mt-2 text-gray-600">
                      <p>Created: {new Date(project.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      <p>Last Updated: {new Date(project.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                      <Laptop className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Project ID</h3>
                    <p className="mt-2 text-gray-600 bg-gray-100 p-2 rounded font-mono text-sm">{project.crid}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white shadow-lg rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Suggested Approach</h2>
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h3 className="font-medium text-lg text-gray-900">1. Analysis Phase</h3>
                  <p className="text-gray-600 mt-1">Start by thoroughly analyzing the project requirements and identifying key components.</p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h3 className="font-medium text-lg text-gray-900">2. Design Phase</h3>
                  <p className="text-gray-600 mt-1">Create wireframes and mockups for the user interface before diving into development.</p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h3 className="font-medium text-lg text-gray-900">3. Development Phase</h3>
                  <p className="text-gray-600 mt-1">Build the core functionality using the provided links as reference. Focus on clean, modular code.</p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4 py-2">
                  <h3 className="font-medium text-lg text-gray-900">4. Testing Phase</h3>
                  <p className="text-gray-600 mt-1">Thoroughly test all features and fix any issues before submission.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Mockup and Resources */}
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="col-span-1"
          >
            {!isEligible&&<div className="bg-white shadow-lg rounded-2xl p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Infotact Learning</h2>
              <div className="relative rounded-lg overflow-hidden shadow-xl bg-gray-100">
                <div className="w-full h-56 bg-gray-200 flex items-center justify-center">
                  <img src="/11.png" alt="Project Mockup" className="max-w-full max-h-full" />
                </div>
                <div className="p-4 bg-white">
                  <h3 className="font-medium text-gray-900">{project.title}</h3>
                  <p className="text-gray-500 text-sm">Infotact Central Submit</p>
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <button 
                  onClick={() => setSubmissionModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  Submit Your Project
                </button>
              </div>
            </div>}

           { !isEligible&&<div className="bg-white shadow-lg rounded-2xl p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Submission Status</h2>
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="text-yellow-700 font-medium">Pending Submission</span>
                </div>
                <div className="text-sm text-yellow-600">
                  Due in 5 days
                </div>
              </div>
            </div>}

            <div className="bg-white shadow-lg rounded-2xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Resources</h2>
              <ul className="space-y-3">
                <li>
                  <a href="/course" className="flex items-center p-3 text-base font-medium text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow" target='_blank'>
                    <svg className="h-5 w-5 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="/course" className="flex items-center p-3 text-base font-medium text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow" target='_blank'>
                    <svg className="h-5 w-5 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Tutorial Videos
                  </a>
                </li>
                <li>
                  <a href="mailto:support@infotact.in" className="flex items-center p-3 text-base font-medium text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 group hover:shadow" target='_blank'>
                    <svg className="h-5 w-5 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    FAQ & Support
                  </a>
                </li>
              </ul>
              {isEligible&&<div className='mt-4 text-sm text-gray-500 bg-red-100 p-2 rounded'>
                Note: Submit button will be visible on end date of your course/Internship. Please check your course duration and start date.
              </div>}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Submission Modal */}
      {submissionModalOpen && (
        <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={() => !submitting && !submitted && setSubmissionModalOpen(false)}></div>
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-4 relative z-10"
          >
            {!submitted ? (
              <>
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-2xl font-bold text-gray-900">Submit Project</h3>
                  <button 
                    onClick={() => !submitting && setSubmissionModalOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                    disabled={submitting}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                  <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        value={submission.title}
                        onChange={handleSubmissionChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Your Project Title"
                      />
                    </div>
                    <div>
                      <label htmlFor="projectUrl" className="block text-sm font-medium text-gray-700">Project URL</label>
                      <input
                        type="url"
                        name="projectUrl"
                        id="projectUrl"
                        value={submission.projectUrl}
                        onChange={handleSubmissionChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://your-project-url.com"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="repositoryUrl" className="block text-sm font-medium text-gray-700">Repository URL</label>
                      <input
                        type="url"
                        name="repositoryUrl"
                        id="repositoryUrl"
                        value={submission.repositoryUrl}
                        onChange={handleSubmissionChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://github.com/yourusername/project"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        name="description"
                        id="description"
                        rows={4}
                        value={submission.description}
                        onChange={handleSubmissionChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Describe your implementation and any notable features..."
                      />
                    </div>
                    
                   
                  </div>
                  
                  <div className="mt-6">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Submit Project
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="mt-3 text-lg font-medium text-gray-900">Submission Successful!</h3>
                <p className="mt-2 text-sm text-gray-500">Your project has been submitted successfully. You'll receive feedback soon.</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
    
  )
}

export default ProjectPage