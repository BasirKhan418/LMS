"use client"
import React, { useEffect, useState } from 'react'
import SessionDetected from '@/utilities/Auth/SessionDetected'
import { ValidatesFunc } from '../../../../functions/authfunc'
import HomePageSkl from '@/utilities/skeleton/HomePageSkl'
import { Toaster,toast } from 'sonner'
import { CourseData } from '../../../../functions/Coursedata'
import Link from 'next/link'
import Card from '@/utilities/Course/Card'
const Page = () => {
    const [data,setData] = useState(null)
    const [coursesData,setCoursesData] = useState(null)
    const [loading,setLoading] = useState(false)
    const [isansession,setisansession]=useState(false);
    //fetching all courses
    const fetchallCourse = async()=>{
    setLoading(true)
     let data = await CourseData();
     setLoading(false)  
     setCoursesData(data.data);
    }
    //validates correct admin or not
    const validates = async(token)=>{
        setLoading(true);
        let data =  await ValidatesFunc(token);
        setLoading(false);
        console.log(data)
        if(data.success){
          setData(data.data)
        }
        else{
          toast.error(data.message);
          if(data.ansession){
            setisansession(true);
            setTimeout(()=>{
              router.push("/adminlogin");
            },4000)
          }
          setTimeout(()=>{
            router.push("/adminlogin");
          },3000)
        }
      }
        useEffect(()=>{
      validates(localStorage.getItem("dilmsadmintoken"))
      fetchallCourse();
        },[])
        console.log(coursesData)
  return (
    <>
    <Toaster position='top-center' expand={false}/>
        {isansession&&<SessionDetected/>}
   { loading?<HomePageSkl/>:<div className='flex flex-wrap'>
       
    {coursesData&&coursesData.map((item)=>(
        <Link href={`/adminprojects/${item._id}`} key={item._id}><Card title={item.title} description={item.desc} duration={item.duration} validity={"1"} progress={20} img={item.img} skills={item.skills} isadmin={true} /></Link>
      ))}
    </div>}
    </>
  )
}

export default Page
