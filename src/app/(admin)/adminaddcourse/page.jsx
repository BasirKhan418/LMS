'use client'

import { useEffect, useState } from 'react'
import { CourseAddCard } from '@/utilities/Course/CourseAddCard'
import CourseCreationModal from '@/utilities/Course/CourseCreationModal'
import { CourseData } from '../../../../functions/Coursedata'
import HomePageSkl from '@/utilities/skeleton/HomePageSkl'
import { Toaster,toast } from 'sonner'
export default function Home() {
  const [id,setid]=useState("");
  const [open,setOpen] = useState(false)
  const [courses, setCourses] = useState([
  ])
  const [loading,setLoading]=useState(false)

  const [editingCourse, setEditingCourse] = useState(undefined)

  const handleSaveCourse = async(course) => {
    if(course.title===""||course.desc===""||course.skills===""||course.price===""||course.img===""||course.grouplink===""||course.seats===""||course.duration===""||course.isopen===""||course.discount===""||course.feature===""||course.ytvideo===""||course.startdate===""||course.content===""){
      toast.error("please fill all fields")
      return;
    }
try{
  setLoading(true)
  setOpen(false);
let res = await fetch("/api/addcourse",{
  method:"POST",
  headers:{
    "Content-Type":"application/json",
     "token":localStorage.getItem("dilmsadmintoken")  
  },
  body:JSON.stringify(course)
  })
  let data = await res.json();
  setLoading(false)
  if(data.success){
    toast.success(data.message)
    setOpen(false);
    fetchallCourse();
  }
  else{
    toast.error(data.message)
  }
}
catch(err){
  setLoading(false)
  console.log(err);
  toast.error("something went wrong please try again"+err)
}
  }
  //handleupdatecourse
  const handleUpdate=async(course,id)=>{
    if(course.title===""||course.desc===""||course.skills===""||course.price===""||course.img===""||course.grouplink===""||course.seats===""||course.duration===""||course.isopen===""||course.discount===""||course.feature===""||course.ytvideo===""||course.startdate===""||course.content===""){
      toast.error("please fill all fields")
      return;
    }
try{
  setLoading(true)
  setOpen(false);
let res = await fetch("/api/updateaddcourse",{
  method:"POST",
  headers:{
    "Content-Type":"application/json",
     "token":localStorage.getItem("dilmsadmintoken")  
  },
  body:JSON.stringify(course)
  })
  let data = await res.json();
  setLoading(false)
  if(data.success){
    toast.success(data.message)
    setOpen(false);
    fetchallCourse();
  }
  else{
    toast.error(data.message)
  }
}
catch(err){
  setLoading(false)
  console.log(err);
  toast.error("something went wrong please try again"+err)
}
  }

  const handleEditCourse = (id) => {
    const courseToEdit = courses.find(course => course._id ===id)
    setEditingCourse(courseToEdit)
    setid(id);
    setOpen(true);
  }

  const handleDeleteCourse = async(id) => {
    let propmt = prompt("Type 'delete'+ course deletion pin to confirm");
    if(propmt!=`delete${process.env.NEXT_PUBLIC_COURSE_DELETION_PIN}`){
      toast.error("Invalid deletion pin")
      return;
    }
    try{
      setLoading(true)
      setOpen(false);
    let res = await fetch("/api/deletecourse",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
         "token":localStorage.getItem("dilmsadmintoken")  
      },
      body:JSON.stringify(id)
      })
      let data = await res.json();
      setLoading(false)
      if(data.success){
        toast.success(data.message)
        setOpen(false);
        fetchallCourse();
      }
      else{
        toast.error(data.message)
      }
    }
    catch(err){
      setLoading(false)
      console.log(err);
      toast.error("something went wrong please try again"+err)
    }
  }
  //fetchall courses
  const fetchallCourse = async()=>{
    setLoading(true)
     let data = await CourseData();
     setLoading(false)  
     setCourses(data.data)
    }
    useEffect(()=>{
    fetchallCourse();
    },[])

  return (
    <main className="container mx-auto py-8 px-4">
      <Toaster richColors/>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold">Course Management</h1>
        <CourseCreationModal onSave={handleSaveCourse}  open={open}
        setOpen={setOpen} id={id} setid={setid} handleUpdate={handleUpdate} />
      </div>
      {loading&&<HomePageSkl/>}
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
            onEdit={handleEditCourse}
            onDelete={handleDeleteCourse}
            open={open}
            setOpen={setOpen}
            
          />
        ))}
      </div>
      {editingCourse && (
        <CourseCreationModal course={editingCourse} onSave={handleSaveCourse} open={open}
        setOpen={setOpen} id={id} setid={setid} handleUpdate={handleUpdate}/>
      )}
    </main>
  )
}

