"use client"
import React, { useEffect, useState } from 'react'
import SessionDetected from '@/utilities/Auth/SessionDetected'
import { TrainerValidatesFunc } from '../../../../functions/trainerauthfunc'
import HomePageSkl from '@/utilities/skeleton/HomePageSkl'
import { Toaster,toast } from 'sonner'
import { CourseData } from '../../../../functions/Coursedata'
import Link from 'next/link'
import Card from '@/utilities/Course/Card'
import { useRouter } from 'next/navigation'
const Page = () => {
    const router = useRouter();
    const [data,setData] = useState(null)
    const [coursesData,setCoursesData] = useState(null)
    const [loading,setLoading] = useState(false)
    const [isansession,setisansession]=useState(false);
    //fetching all courses
    const fetchallCourse = async(batch)=>{
    setLoading(true)
     let data = await CourseData();
     console.log("course data from trainer",data)
     setLoading(false)  
     const filteredData = data.data.filter((item) => batch.includes(item.batch));
     setCoursesData(filteredData);
    }
    //validates correct admin or not
    const validates = async(token)=>{
        setLoading(true);
        let data =  await TrainerValidatesFunc(token);
        setLoading(false);
        console.log(data)
        if(data.success){
          setData(data.data)
            fetchallCourse(data.data[0].batches);
        }
        else{
          toast.error(data.message);
          if(data.ansession){
            setisansession(true);
            setTimeout(()=>{
              router.push("/trainerlogin");
            },2000)
          }
          setTimeout(()=>{
            router.push("/trainerlogin");
          },2000)
        }
      }
        useEffect(()=>{
      validates(localStorage.getItem("dilmsadmintoken"))
      
        },[])
        console.log(coursesData)
  return (
    <>
    <Toaster position='top-center' expand={false}/>
        {isansession&&<SessionDetected/>}
   { loading?<HomePageSkl/>:<div className='flex flex-wrap'>
       
    {coursesData&&coursesData.map((item)=>(
        <Link href={`/trainerviewcourse/detail/${item._id}`} key={item._id} className='mx-2 my-2'><Card title={item.title} description={item.desc} duration={item.duration} validity={"1"} progress={20} img={item.img} skills={item.skills} isadmin={true} isBestseller={item.coursetype=="live"?false:true} course={{coursetype:item.coursetype}} view={true}/></Link>
      ))}
    </div>}
    </>
  )
}

export default Page
