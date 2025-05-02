"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import ChatInterface from '@/utilities/Chat/chat-interface';
import ProfilePageSkeleton from '@/utilities/skeleton/ProfilePageSkeleton';
const page = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [team, setTeam] = useState(null);
  const router = useRouter();
  //find users team details
    const findYourTeam = async (batchid, userid) => {
      try {
        const res = await fetch("/api/findyourteam", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("dilmstoken"),
          },
          body: JSON.stringify({
            batchid: batchid,
            userid: userid,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setTeam(data.data);
          console.log("team", data.data);
        } else {
          toast.error(data.message);
        }
      } catch (err) {
        toast.error("Error in finding your team");
        console.log(err);
      }
    };

    // Validate user with home auth
      const validatesFunc = async (token) => {
        setLoading(true);
        const response = await fetch("/api/homeauth", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            token: token,
          },
        });
        const res = await response.json();
        setLoading(false);
    
        if (res.success) {
          setData(res.data);
          console.log(res);
          findYourTeam(res.batch._id, res.user._id);
          setUser(res.user);
          // fetchAllAssignment(res.data && res.data[0].courseid._id, res.user._id);
        } else {
          toast.error(res.message);
          if (res.ansession) {
           
            setTimeout(() => {
              router.push("/login");
            }, 1000);
          }
          router.push("/login");
        }
      };
      useEffect(() => {
        const token = localStorage.getItem("dilmstoken");
        if (token) {
          validatesFunc(token);
        } else {
          router.push("/login");
        }
      },[])
  return (
    <div>
      {loading ? (
        <ProfilePageSkeleton />
      ) : (
        <div className="">
         
            <ChatInterface user={user} team={team} />
          
        </div>
      )}
    </div>
  )
}

export default page
