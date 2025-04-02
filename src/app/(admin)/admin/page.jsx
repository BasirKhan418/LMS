"use client"
import React, { useEffect, useState } from 'react'
import Home from '@/utilities/Admin/Home'
import SessionDetected from '@/utilities/Auth/SessionDetected'
import HomePageSkl from '@/utilities/skeleton/HomePageSkl'
import { Toaster,toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { ValidatesFunc } from '../../../../functions/authfunc'
const Page = () => {
    const router = useRouter();
    const [isansession,setisansession]=useState(false);
    const [data,setData]=useState(null);
    const [loading,setLoading] = useState(false)
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
      },[])
  return (
    <div>
        <Toaster position='top-center' expand={false}/>
       { loading?<HomePageSkl/>:<>
        {isansession&&<SessionDetected/>}
     { !isansession&&<Home name={data&&data[0].name}/>}
   
    </>}
    </div>
  )
}

export default Page
