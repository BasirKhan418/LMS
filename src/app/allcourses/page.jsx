"use client"
import { useState,useEffect } from 'react'
import { Toaster,toast } from 'sonner';
import { GraduationCap } from 'lucide-react'
import { NoCoursesBanner } from '@/utilities/Course/NoCoursesBanner';
import { CourseCard } from '@/utilities/Course/CourseCard';
import HomePageSkl from '@/utilities/skeleton/HomePageSkl';
import { useRouter } from 'next/navigation';
const page = () => {
    const [courses,setCourses] = useState([]);
    const [loading,setLoading] = useState(false);
    const [user,setUser] = useState(null);
    const [data,setData] = useState(null);
    const router = useRouter();
 
  const validatefun = async()=>{
     try{
         setLoading(true);
         const response = await fetch("/api/homeauth",{
          method:"POST",
          headers:{
            "content-type":"application/json",
            "token":localStorage.getItem("dilmstoken")
          }
         })
        const res = await response.json();
          setLoading(false);
        if(res.success){
        setUser(res.user);
        setData(res.data);
        console.log(res.user);
        if(res.user==null){
        router.push("/login");
        }
       
        }
        else{
          console.log(res.message)
        }
     }
     catch(err){
       setLoading(false);
       
     }
   
  }
    //fetcheong all courses.
    const fetchCourses = async()=>{
        setLoading(true);
        let data = await fetch("/api/allcourses",{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "token":localStorage.getItem("dilmstoken")
            }
        })
        let response = await data.json();
        setLoading(false);
        console.log(response);
        if(response.success){
            setCourses(response.data);
        }
        else{
            toast.error(response.message);
        }
    }
    //useEffect to fetch courses on page load.
    useEffect(()=>{
      validatefun();
    fetchCourses();
    },[])
  return (
    <div>
        <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-12 mb-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center mb-4">
          <GraduationCap className="w-12 h-12 mr-4" />
          <h1 className="text-4xl font-bold">DevSomeware Skill Lab</h1>
        </div>
        <p className="text-center text-xl">Enhance your skills with courses provided by DevSomeware, an open-source community that fosters learning and growth.
        </p>
      </div>
    </header>
    {loading&&<HomePageSkl/>}
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    
    {courses.length>0?courses.map((course,index)=>(<CourseCard key={index} course={course} user={user} data={data}/>)):<div className=''><NoCoursesBanner/></div>}
    </div>

    </div>
  )
}

export default page
