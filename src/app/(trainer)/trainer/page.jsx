"use client"
import React, { useEffect, useState } from 'react'
import TrainerHome from '@/utilities/Trainer/TrainerHome'
import SessionDetected from '@/utilities/Auth/SessionDetected'
import HomePageSkl from '@/utilities/skeleton/HomePageSkl'
import { Toaster,toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { TrainerValidatesFunc } from '../../../../functions/trainerauthfunc'
const Page = () => {
    const router = useRouter();
    const [isansession,setisansession]=useState(false);
    const [data,setData]=useState(null);
    const [analytics,setAnalytics]=useState(null);
    const [loading,setLoading] = useState(false)
    const [sentNotifications,setSentNotifications] = useState([])
    const validates = async(token)=>{
      setLoading(true);
      let data =  await TrainerValidatesFunc(token);
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
            router.push("/trainerlogin");
          },2000)
        }
        setTimeout(()=>{
          router.push("/trainerlogin");
        },2000)
      }
    }
    //get all analytics details
    const getAnalytics = async()=>{
      setLoading(true);
      const res = await fetch("/api/analytics",{
        method:"GET",
        headers:{
          "Content-Type":"application/json",
          "dilmsadmintoken":localStorage.getItem("dilmsadmintoken")
        }
      });
      const data = await res.json();
      setLoading(false);
      if(data.success){
        setAnalytics(data);
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
    //fetching recent notification
    const fetchNotifications = async () => {
      try{
        setLoading(true)
        const data = await fetch("/api/notificationcrud", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `${localStorage.getItem("dilmsadmintoken")}`,
          },
        })
        const res = await data.json()
        setLoading(false)
        console.log("fetched res is ",res)
        if (res.success) {
          setSentNotifications(res.data)
        } else {
          toast.warning(res.message)
        }
      }
      catch(err){
        console.log(err)
        toast.error("Something went wrong while fetching notifications")
      }
    }
      useEffect(()=>{
    validates(localStorage.getItem("dilmsadmintoken"))
    getAnalytics();
    fetchNotifications();
      },[])
  return (
    <div>
        <Toaster position='top-center' expand={false}/>
       { loading?<HomePageSkl/>:<>
        {isansession&&<SessionDetected/>}
     { !isansession&&<TrainerHome name={data&&data[0].name} analytics={analytics} sentNotifications={sentNotifications}/>}
   
    </>}
    </div>
  )
}

export default Page
