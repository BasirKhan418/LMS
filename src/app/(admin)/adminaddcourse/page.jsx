'use client'

import { useEffect, useState } from 'react'
import { CourseAddCard } from '@/utilities/Course/CourseAddCard'
import CourseCreationModal from '@/utilities/Course/CourseCreationModal'
import { CourseData } from '../../../../functions/Coursedata'
import HomePageSkl from '@/utilities/skeleton/HomePageSkl'
import { Toaster, toast } from 'sonner'

export default function Home() {
  const [id, setid] = useState("");
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const handleSaveCourse = async(course) => {
    // Add batch field check to the validation
    if(course.title===""||course.desc===""||course.skills===""||course.price===""||course.img===""||
       course.grouplink===""||course.seats===""||course.duration===""||course.isopen===""||
       course.discount===""||course.feature===""||course.ytvideo===""||course.startdate===""||
       course.content===""||!course.batch){
      toast.error("Please fill all fields");
      return;
    }
    
    try {
      setLoading(true);
      setOpen(false);
      let res = await fetch("/api/addcourse", {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "token":localStorage.getItem("dilmsadmintoken")  
        },
        body:JSON.stringify(course)
      });
      
      let data = await res.json();
      setLoading(false);
      
      if(data.success){
        toast.success(data.message);
        fetchallCourse();
      } else {
        toast.error(data.message);
      }
    } catch(err) {
      setLoading(false);
      console.log(err);
      toast.error("Something went wrong please try again: " + err);
    }
  }
  
  // handleupdatecourse
  const handleUpdate = async(course, id) => {
    // Add batch field check to the validation
    if(course.title===""||course.desc===""||course.skills===""||course.price===""||course.img===""||
       course.grouplink===""||course.seats===""||course.duration===""||course.isopen===""||
       course.discount===""||course.feature===""||course.ytvideo===""||course.startdate===""||
       course.content===""||!course.batch){
      toast.error("Please fill all fields");
      return;
    }
    
    try {
      setLoading(true);
      setOpen(false);
      let res = await fetch("/api/updateaddcourse", {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "token":localStorage.getItem("dilmsadmintoken")  
        },
        body:JSON.stringify({...course, _id: id})
      });
      
      let data = await res.json();
      setLoading(false);
      
      if(data.success){
        toast.success(data.message);
        fetchallCourse();
        setEditingCourse(null);
        setid("");
      } else {
        toast.error(data.message);
      }
    } catch(err) {
      setLoading(false);
      console.log(err);
      toast.error("Something went wrong please try again: " + err);
    }
  }

  const handleEditCourse = (id) => {
    const courseToEdit = courses.find(course => course._id === id);
    if (courseToEdit) {
      setEditingCourse(courseToEdit);
      setid(id);
      setOpen(true);
    } else {
      toast.error("Course not found");
    }
  }

  const handleDeleteCourse = async(id) => {
    let prompt = window.prompt("Type 'delete'+ course deletion pin to confirm");
    if(prompt !== `delete${process.env.NEXT_PUBLIC_COURSE_DELETION_PIN}`){
      toast.error("Invalid deletion pin");
      return;
    }
    
    try {
      setLoading(true);
      let res = await fetch("/api/deletecourse", {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "token":localStorage.getItem("dilmsadmintoken")  
        },
        body:JSON.stringify({id})
      });
      
      let data = await res.json();
      setLoading(false);
      
      if(data.success){
        toast.success(data.message);
        fetchallCourse();
      } else {
        toast.error(data.message);
      }
    } catch(err) {
      setLoading(false);
      console.log(err);
      toast.error("Something went wrong please try again: " + err);
    }
  }
  
  // fetchall courses
  const fetchallCourse = async() => {
    setLoading(true);
    try {
      let data = await CourseData();
      setCourses(data.data);
    } catch (error) {
      toast.error("Failed to fetch courses");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  
  useEffect(() => {
    fetchallCourse();
  }, []);

  return (
    <main className="container mx-auto py-8 px-4">
      <Toaster richColors/>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold">Course Management</h1>
        <CourseCreationModal 
          course={editingCourse} 
          onSave={handleSaveCourse} 
          open={open}
          setOpen={setOpen} 
          id={id} 
          setid={setid} 
          handleUpdate={handleUpdate} 
        />
      </div>
      
      {loading && <HomePageSkl/>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <CourseAddCard
            key={course._id}
            id={course._id}
            title={course.title}
            description={course.desc}
            price={course.price}
            image={course.img}
            seats={course.seats}
            duration={course.duration}
            batch={course.batch || "Not specified"}
            onEdit={handleEditCourse}
            onDelete={handleDeleteCourse}
          />
        ))}
      </div>
    </main>
  )
}