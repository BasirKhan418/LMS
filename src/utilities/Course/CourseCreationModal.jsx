'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusCircle, Upload, Copy, BookOpen, Users, Code } from 'lucide-react'
import { Loader2 } from 'lucide-react'
import { Toaster, toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

export default function CourseCreationModal({ course, onSave, open, setOpen, id, setid, handleUpdate, batches, isCopying }) {
  const [loading, setLoading] = useState(false)
  
  // Domain options
  const domainOptions = [
    { value: 'Web Development', label: 'Software Development' },
    { value: 'Generative AI', label: 'Generative AI' },
    { value: 'Python Development', label: 'Python Development' },
    { value: 'Data Science & Machine Learning', label: 'Data Science & Machine Learning' },
    { value: 'Cyber Security', label: 'Cyber Security' },
    { value: 'UI/UX Design', label: 'UI/UX Design' },
    { value: 'Data Analytics', label: 'Data Analytics' },
    { value: 'IOT (Internet of Things)', label: 'IOT (Internet of Things)' },
  ]
  
  const [courseData, setCourseData] = useState({
    title: '',
    desc: '',
    skills: '',
    price: 0,
    img: '',
    grouplink: '',
    seats: 0,
    duration: '',
    isopen: true,
    discount: 0,
    feature: '',
    ytvideo: '',
    startdate: '',
    batch: '',
    domain: '', // New field for domain selection
    courseType: 'recording',
    content: []
  })

  // Update courseData when course prop changes or when modal opens
  useEffect(() => {
    if (course && open) {
      setCourseData(prevData => ({
        ...prevData,
        ...course,
        batch: course.batch || '',
        domain: course.domain || '', // Set domain from existing course
        courseType: course.coursetype || 'recording'
      }))
    } else if (!open && !course) {
      // Reset form when closing without a course
      setCourseData({
        title: '',
        desc: '',
        skills: '',
        price: 0,
        img: '',
        grouplink: '',
        seats: 0,
        duration: '',
        isopen: true,
        discount: 0,
        feature: '',
        ytvideo: '',
        startdate: '',
        batch: '',
        domain: '',
        courseType: 'recording',
        content: []
      })
    }
  }, [course, open])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCourseData(prev => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked) => {
    setCourseData(prev => ({ ...prev, isopen: checked }))
  }

  const handleBatchChange = (value) => {
    setCourseData(prev => ({ ...prev, batch: value }))
  }

  const handleDomainChange = (value) => {
    setCourseData(prev => ({ ...prev, domain: value }))
  }

  const handleCourseTypeChange = (value) => {
    setCourseData(prev => ({ 
      ...prev, 
      courseType: value,
      // Clear batch if switching to recording type
      batch: value === 'recording' ? '' : prev.batch,
      // Clear domain if switching to live type
      domain: value === 'live' ? '' : prev.domain
    }))
  }

  const handleImageUpload = async(e) => {
    const file = e.target.files?.[0]
    if (!file) return
        
    setLoading(true);
    const data = new FormData();
    data.append("image", file);
    try {
      const res = await fetch("/api/uploadpic", {
        method: "POST",
        body: data,
        headers: {
          "token": localStorage.getItem("dilmsadmintoken")
        }
      });
      const result = await res.json();
      if (result.success) {
        setCourseData(prev => ({ ...prev, img: result.url }))
        toast.success("Image uploaded successfully")
      } else {
        toast.error("Image upload failed")
      }
    } catch (error) {
      toast.error("Error uploading image")
      console.error(error)
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = () => {
    onSave(courseData)
  }

  const handleCancelClick = () => {
    setOpen(false)
    setid("")
  }

  return (
    <>
    <Toaster richColors/>
    <Dialog open={open} onOpenChange={(openState) => {
      if (!openState) {
        handleCancelClick()
      }
      setOpen(openState)
    }}>
      <Button onClick={() => setOpen(true)} className="bg-blue-600 hover:bg-blue-700">
        <PlusCircle className="mr-2 h-4 w-4" />
        Create Course
      </Button>
      <DialogContent className="sm:max-w-[90vw] w-full max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isCopying ? (
              <div className="flex items-center">
                <Copy className="mr-2 h-5 w-5" />
                Copy Course
              </div>
            ) : id ? 'Edit Course' : 'Create New Course'}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="details">Course Details</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
          <ScrollArea className="max-h-[70vh] pr-4" style={{ height: '60vh' }}>
              <div className="grid gap-6 py-4">
                {/* Course Type Selection */}
                <div className="grid gap-2">
                  <Label htmlFor="courseType">Course Type</Label>
                  <Select 
                    value={courseData.courseType} 
                    onValueChange={handleCourseTypeChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Course Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recording">
                        <div className="flex items-center">
                          <BookOpen className="mr-2 h-4 w-4" />
                          Recording
                        </div>
                      </SelectItem>
                      <SelectItem value="live">
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4" />
                          Live Meeting
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={courseData.title}
                      onChange={handleInputChange}
                      placeholder="Course Title"
                      className="focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      type="number"
                      id="price"
                      name="price"
                      value={courseData.price}
                      onChange={handleInputChange}
                      placeholder="Course Price"
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="desc">Description</Label>
                  <Textarea
                    id="desc"
                    name="desc"
                    value={courseData.desc}
                    onChange={handleInputChange}
                    placeholder="Course Description"
                    rows={4}
                  />
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="skills">Skills</Label>
                    <Input
                      id="skills"
                      name="skills"
                      value={courseData.skills}
                      onChange={handleInputChange}
                      placeholder="Required Skills"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      name="duration"
                      value={courseData.duration}
                      onChange={handleInputChange}
                      placeholder="Course Duration"
                    />
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="seats">Seats</Label>
                    <Input
                      type="number"
                      id="seats"
                      name="seats"
                      value={courseData.seats}
                      onChange={handleInputChange}
                      placeholder="Number of Seats"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="discount">Discount</Label>
                    <Input
                      type="number"
                      id="discount"
                      name="discount"
                      value={courseData.discount}
                      onChange={handleInputChange}
                      placeholder="Discount Amount"
                    />
                  </div>
                </div>
                
                {/* Conditional rendering based on course type */}
                {courseData.courseType === 'live' ? (
                  <div className="grid gap-2">
                    <Label htmlFor="batch">Batch</Label>
                    <Select 
                      value={courseData.batch} 
                      onValueChange={handleBatchChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Batch" />
                      </SelectTrigger>
                      <SelectContent>
                        {batches && batches.map((data) => (
                          <SelectItem value={data._id} key={data._id}>{data.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    <Label htmlFor="domain">Domain</Label>
                    <Select 
                      value={courseData.domain} 
                      onValueChange={handleDomainChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Domain" />
                      </SelectTrigger>
                      <SelectContent>
                        {domainOptions.map((domain) => (
                          <SelectItem value={domain.value} key={domain.value}>
                            <div className="flex items-center">
                              <Code className="mr-2 h-4 w-4" />
                              {domain.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="grid gap-2">
                  <Label htmlFor="grouplink">Group Link</Label>
                  <Input
                    id="grouplink"
                    name="grouplink"
                    value={courseData.grouplink}
                    onChange={handleInputChange}
                    placeholder="Group Link"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="feature">Feature</Label>
                  <Input
                    id="feature"
                    name="feature"
                    value={courseData.feature}
                    onChange={handleInputChange}
                    placeholder="Feature"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="ytvideo">YouTube Video URL</Label>
                  <Input
                    id="ytvideo"
                    name="ytvideo"
                    value={courseData.ytvideo}
                    onChange={handleInputChange}
                    placeholder="YouTube Video URL"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="startdate">Start Date</Label>
                  <Input
                    type="date"
                    id="startdate"
                    name="startdate"
                    value={courseData.startdate}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isopen"
                    checked={courseData.isopen}
                    onCheckedChange={handleSwitchChange}
                  />
                  <Label htmlFor="isopen">Open for Enrollment</Label>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="image">Course Image</Label>
                  <div className="flex gap-4 items-center">
                    <Input
                      type="file"
                      id="image"
                      onChange={handleImageUpload}
                      accept="image/*"
                    />
                    {loading && 
                      <div className='flex items-center'>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                        <span>Uploading...</span>
                      </div>
                    }
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="preview">
          <ScrollArea className="h-[60vh]" style={{ height: '60vh' }}>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {courseData.img && (
                      <div className="flex-shrink-0">
                        <img 
                          src={courseData.img} 
                          alt="Course Preview" 
                          className="w-full md:w-64 h-auto object-cover rounded-lg shadow-md" 
                        />
                      </div>
                    )}
                    <div className="flex-grow">
                      <h2 className="text-2xl font-bold mb-2">{courseData.title || 'Course Title'}</h2>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {courseData.courseType === 'recording' ? 'Recording' : 'Live Meeting'}
                        </span>
                        {courseData.isopen && (
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            Open for Enrollment
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-4">{courseData.desc || 'Course description will appear here'}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Price</h3>
                          <p className="font-semibold">{courseData.price ? `₹${courseData.price}` : 'Not set'}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Duration</h3>
                          <p className="font-semibold">{courseData.duration || 'Not set'}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Start Date</h3>
                          <p className="font-semibold">{courseData.startdate || 'Not set'}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Seats</h3>
                          <p className="font-semibold">{courseData.seats || 'Not set'}</p>
                        </div>
                      </div>
                      
                      {courseData.courseType === 'live' ? (
                        <div className="mb-4">
                          <h3 className="text-sm font-medium text-gray-500">Batch</h3>
                          <p className="font-semibold">{courseData.batch ? 'Selected' : 'Not selected'}</p>
                        </div>
                      ) : (
                        <div className="mb-4">
                          <h3 className="text-sm font-medium text-gray-500">Domain</h3>
                          <p className="font-semibold">
                            {courseData.domain ? 
                              domainOptions.find(d => d.value === courseData.domain)?.label || 'Selected' 
                              : 'Not selected'}
                          </p>
                        </div>
                      )}
                      
                      {courseData.skills && (
                        <div className="mb-4">
                          <h3 className="text-sm font-medium text-gray-500">Skills</h3>
                          <p>{courseData.skills}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollArea>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={handleCancelClick}>
            Cancel
          </Button>
          
          {isCopying ? (
            <Button type="submit" onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              <Copy className="mr-2 h-4 w-4" />
              Create Copy
            </Button>
          ) : id === "" ? (
            <Button type="submit" onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
              Create Course
            </Button>
          ) : (
            <Button type="submit" onClick={() => handleUpdate(courseData, id)} className="bg-amber-600 hover:bg-amber-700">
              Update Course
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}