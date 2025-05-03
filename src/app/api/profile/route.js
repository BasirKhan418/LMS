import { NextResponse } from "next/server";
import ConnectDb from "../../../../middleware/db";
import Users from "../../../../models/User";
import { headers } from "next/headers";
import AuthorizeMd from "../../../../middleware/AuthorizeMd";
export const POST = async (req) => {
  const header = await headers();
  await ConnectDb();
  const reqdata = await req.json();
  
  try {
    let res = AuthorizeMd(header.get("token"));
     if(!res.status){
        return NextResponse.json({success:false,message:"You are not authorized to access this route",status:401});
     }
     let user  = await Users.findOne({email:res.email});
     if(user==null){
        return NextResponse.json({success:false,message:"User not found",status:404});
     }
      //updating user data
      let updateduser = await Users.findOneAndUpdate({email:res.email},{$set:{name:reqdata.name,phone:reqdata.phone,github:reqdata.github,bio:reqdata.bio,linkedin:reqdata.linkedin,number:reqdata.number,clg:reqdata.clg,gender:reqdata.gender,projects:reqdata.projects,qualification:reqdata.qualification,ayear:reqdata.ayear,country:reqdata.country}}, { new: true });
      //checking if user is updated or not
      return NextResponse.json({
        success: true,
        message: "Profile updated successfully !",
      });
    
  
   
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: "Something went wrong please try again later !",
    });
  }
};

export const PUT = async (req) => {
  try{
await ConnectDb();
const header = await headers();
const reqdata = await req.json();

const res = AuthorizeMd(header.get("token"));
if(!res.status){
  return NextResponse.json({success:false,message:"You are not authorized to access this route",status:401});
}
let user = await Users.findOne({email:reqdata.email})
if(user==null){
  return NextResponse.json({success:false,message:"User not found",status:404});
}
//updating user data
let month = (Number(reqdata.month)+Number(user.month[0]))
await Users.findOneAndUpdate({email:res.email},{$set:{month:`${month} Months`}})
return NextResponse.json({message:"Internship duration updated successfully",status:200,success:true});
  }
  catch(err){
    
    return NextResponse.json({
      success: false,
      message: "Something went wrong please try again later !",
    });
  }
}
