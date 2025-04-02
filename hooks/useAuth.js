import React, { useEffect, useState } from 'react'

const useAuth = () => {
 const [data,setData] = useState(null);
 const [loading,setLoading] = useState(false);

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
       setData(res.user);
      
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

export default useAuth
