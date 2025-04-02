import React, { useEffect, useState } from 'react'

const useAdminAuth = () => {
 const [data,setData] = useState(null);
 const [loading,setLoading] = useState(false);
 const validatefun = async()=>{
    try{
        setLoading(true);
        const response = await fetch("/api/adminhomeauth",{
         method:"POST",
         headers:{
           "content-type":"application/json",
           "token":localStorage.getItem("dilmsadmintoken")
         }
        })
       const res = await response.json();
         setLoading(false);
       if(res.success){
       setData(res.data);
       }
       else{
         setData(null)
       }
    }
    catch(err){
      setLoading(false);
      setData(null)
    }
  
 }
 useEffect(()=>{
validatefun();
 },[])
 return [data,loading]
}

export default useAdminAuth
