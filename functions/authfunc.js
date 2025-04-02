//validate function
const ValidatesFunc = async(token)=>{
    try{
   const response = await fetch("/api/adminhomeauth",{
    method:"POST",
    headers:{
      "content-type":"application/json",
      "token":token
    }
   })
  const res = await response.json();
  return res;
}
catch(err){
    retutn [{message:"Something went wrong!",success:false}]
}
  }
  export {ValidatesFunc}