import { NextRequest,NextResponse } from "next/server";
import ConnectDb from "../../../../../middleware/db";
import Courses from "../../../../../models/Courses";
import Admin from "../../../../../models/Admin";
import AuthorizeMd from "../../../../../middleware/AuthorizeMd";
import ConnectRedis from "../../../../../middleware/ConnectRedis";
import { headers } from "next/headers";
export const POST = async (req, res) => {
    try{
        await ConnectDb();
        let redis = await ConnectRedis();
   const reqdata = await req.json();
   
   const headerlist = await headers();
   let data = AuthorizeMd(headerlist.get("token"));
   
    if(!data){
     return NextResponse.json({message:"You are not authorized to access this route",status:401,success:false})
    }
    
    let admin = await Admin.findOne({email:data.email});
    if(admin==null){
        return NextResponse.json({message:"You are not authorized to access this route",status:401,success:false})
    }

    if(reqdata.courseType=="recording"){
        let newCourse = await Courses.findByIdAndUpdate({_id:reqdata._id},{
            title:reqdata.title,desc:reqdata.desc,skills:reqdata.skills,price:reqdata.price,img:reqdata.img,grouplink:reqdata.grouplink,seats:reqdata.seats,duration:reqdata.duration,isopen:reqdata.isopen,discount:reqdata.discount,feature:reqdata.feature,ytvideo:reqdata.ytvideo,startdate:reqdata.startdate,content:reqdata.content,coursetype:reqdata.courseType,domain:reqdata.domain
        },{new:true});
        if(newCourse==null){
            return NextResponse.json({message:"Course not found",success:false});
        }
        await redis.del(`allcourses`);
        return NextResponse.json({message:"Course updated successfully",success:true});
    }
    else{
        let newCourse = await Courses.findByIdAndUpdate({_id:reqdata._id},{
            title:reqdata.title,desc:reqdata.desc,skills:reqdata.skills,price:reqdata.price,img:reqdata.img,grouplink:reqdata.grouplink,seats:reqdata.seats,duration:reqdata.duration,isopen:reqdata.isopen,discount:reqdata.discount,feature:reqdata.feature,ytvideo:reqdata.ytvideo,startdate:reqdata.startdate,content:reqdata.content,batch:reqdata.batch,coursetype:reqdata.courseType
        },{new:true});
        if(newCourse==null){
            return NextResponse.json({message:"Course not found",success:false});
        }
        await redis.del(`allcourses`);
        return NextResponse.json({message:"Course updated successfully",success:true});
    }
 

    }
    catch(err){
        
        return NextResponse(500).json({error:"Internal server error",success:false});
    }
}