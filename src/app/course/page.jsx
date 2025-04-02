"use client"
import React, { useEffect, useState } from 'react'
import Card from '@/utilities/Course/Card'
import Link from 'next/link'
import HomePageSkl from '@/utilities/skeleton/HomePageSkl'
import { NotEnrolled } from '@/utilities/Course/NotEnrolled'
const Page = () => {
  const [data,setData] = useState(null);
  const [loading,setLoading] = useState(false);
 const [user,setUser] = useState(null);
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
        setData(res.data);
        setUser(res.user)
       
        }
        else{
          console.log(res.message)
        }
     }
     catch(err){
       setLoading(false);
       
     }
   
  }
  useEffect(()=>{
 validatefun();
  },[])
  //get course completion progress//
  const UpdateandGetProgress = async(id,crid)=>{
    try{
      const res = await fetch(`/api/progress?id=${id}&&crid=${crid}`,{
        method:"GET",
        headers:{
          "Content-Type":"application/json",
          "token":localStorage.getItem("dilmstoken")
        }
      })
      const result = await res.json();
    }
    catch(err){
      console.log(err)
    }
  }
  //end
  //useEffect
  useEffect(()=>{
    if(data&&data[0]){
      if(data.length==1){
        UpdateandGetProgress(user._id,data[0].courseid._id)
      }
      else{
        data.map((item)=>{
          UpdateandGetProgress(user._id,item.courseid._id)
        })
      }
     
    }
  },[data])
  return (
    <>
   { loading?<HomePageSkl/>:<div className='flex justify-start items-center flex-wrap '>
    {data&&data.map((item)=>(
        <Link href={`/course/detail/${item.courseid._id}`} key={item._id}><Card title={item.courseid.title} description={item.courseid.desc} duration={item.courseid.duration} validity={"1"} img={item.courseid.img} skills={item.courseid.skills} isadmin={false} progress={item.progress&&item.progress==null?0:item.progress}/></Link>
      ))}
     
      
    </div>}
    {data&&data.length===0&&<div className='w-full text-center'><NotEnrolled/></div>}
    </>
  )
}

export default Page
