"use client"
import React, { useEffect, useState, use } from 'react';
import { Toaster, toast } from 'sonner';
import HomePageSkl from '@/utilities/skeleton/HomePageSkl';
import TrainerCourseSidebar from '@/utilities/Trainer/TrainerCourseSidebar';
import { CourseData } from '../../../../../../functions/Coursedata';
import { ValidatesFunc } from '../../../../../../functions/authfunc';
// You need to either import the CourseData function
// import { CourseData } from '@/services/api'; // Add proper path to your API service

const Page = props => {
  const params = use(props.params);
  const [loading, setLoading] = useState(false);
  const [weeksdata, setWeeksdata] = useState([]);
  const [alldata, setAlldata] = useState([]);
  const [allcoursedata, setallCoursetdata] = useState([]);
  const [data, setData] = useState([]);
  const fetchallcoursedata = async() => {
    try {
      setLoading(true);
      const res = await fetch(`/api/contentcrud?id=${params.course}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "token": localStorage.getItem("dilmsadmintoken")
        }
      });
      const result = await res.json();
      setLoading(false);
      setWeeksdata(result.data.content);
      setAlldata(result.data);
      toast.success(result.message);
    } catch(err) {
      setLoading(false);
      toast.error("Something went wrong! Try again later: " + err);
    }
  };

    const setAllcourseData = async()=>{
      let res = await CourseData();
      if(res.data!=null){
        let all  = res.data&&res.data.filter((item)=>item._id != params.course)
        setallCoursetdata(all)
      }
  
    }

    const validates = async(token)=>{
      setLoading(true);
      let data =  await ValidatesFunc(token);
      setLoading(false);
    
      if(data.success){
        setData(data.data[0])
        
      }
      else{
        toast.error(data.message);
       
    }
  }

  useEffect(() => {
    fetchallcoursedata();
    setAllcourseData();
    validates(localStorage.getItem("dilmsadmintoken"));
  }, []);

  return (
    <div>
      <Toaster position='top-center' expand={false} />
      {loading ? 
        <HomePageSkl /> : 
        <TrainerCourseSidebar 
          weeksdata={weeksdata} 
          alldata={alldata} 
          allcoursedata={allcoursedata} 
          crid={params.course} 
          isadmin={true}
          data={data}
        />
      }
    </div>
  );
};

export default Page;