'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusCircle, Upload, Copy } from 'lucide-react'
import { Loader2 } from 'lucide-react'
import { Toaster, toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CourseCreationModal({ course, onSave, open, setOpen, id, setid, handleUpdate, batches, isCopying }) {
  const [loading, setLoading] = useState(false)
  
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
    content: []
  })

  // Update courseData when course prop changes or when modal opens
  useEffect(() => {
    if (course && open) {
      setCourseData(prevData => ({
        ...prevData,
        ...course,
        batch: course.batch || '' // Ensure batch has a default value if not present
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
      <Button onClick={() => setOpen(true)}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Create Course
      </Button>
      <DialogContent className="sm:max-w-[90vw] w-full max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {isCopying ? (
              <div className="flex items-center">
                <Copy className="mr-2 h-5 w-5" />
                Copy Course
              </div>
            ) : id ? 'Edit Course' : 'Create New Course'}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[75vh] overflow-y-auto pr-4">
          <div className="grid gap-6 py-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={courseData.title}
                  onChange={handleInputChange}
                  placeholder="Course Title"
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
            <div className="grid gap-4 sm:grid-cols-2">
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
            <div className="grid gap-4 sm:grid-cols-2">
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
              <Input
                type="file"
                id="image"
                onChange={handleImageUpload}
                accept="image/*"
              />
              {loading && <div className='flex justify-center items-center mx-2'>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading.....
                </div>}
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Preview</h3>
              <div className="border p-4 rounded-md">
                <h4 className="text-xl font-bold mb-2">{courseData.title || 'Course Title'}</h4>
                {courseData.img && (
                  <img src={courseData.img} alt="Course Preview" className="w-96 h-auto object-cover rounded-md mb-2" />
                )}
                <p className="text-sm text-gray-600">{courseData.desc || 'Course description will appear here'}</p>
                <p className="text-sm text-gray-600 mt-2">Batch: {courseData.batch ? 'Selected' : 'Not selected'}</p>
              </div>
            </div>
          </div>
        </ScrollArea>
        <div className="mt-4 flex justify-end">
          <Button variant="destructive" onClick={handleCancelClick} className="mx-2">Cancel</Button>
          {isCopying ? (
            <Button type="submit" onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              <Copy className="mr-2 h-4 w-4" />
              Create Copy
            </Button>
          ) : id === "" ? (
            <Button type="submit" onClick={handleSubmit}>Create Course</Button>
          ) : (
            <Button type="submit" onClick={() => handleUpdate(courseData, id)}>Update Course</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
    </>
  )
}