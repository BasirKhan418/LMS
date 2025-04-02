const CourseData = async()=>{
    try{
    const response = await fetch(`/api/allcourses`,{
        method:"GET",
        headers:{
          "content-type":"application/json",
          "token":localStorage.getItem("dilmsadmintoken")
        
        }
       })
      const res = await response.json();
      return res;
    }
    catch(err){
        return [{message:"Something went wrong!",success:false}]
    }
}
export {CourseData}