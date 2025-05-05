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
   
    if(!data.status){
     return NextResponse.json({message:"You are not authorized to access this route",status:401,success:false})
    }
    
    let admin = await Admin.findOne({email:data.email});
    if(admin==null){
        return NextResponse.json({message:"You are not authorized to access this route",status:401,success:false})
    }
    console.log("course type",reqdata.courseType)
    if(reqdata.courseType=="recording"){
        console.log("recording course")
        let course = new Courses({
            title:reqdata.title,desc:reqdata.desc,skills:reqdata.skills,price:reqdata.price,img:reqdata.img,grouplink:reqdata.grouplink,seats:reqdata.seats,duration:reqdata.duration,isopen:reqdata.isopen,discount:reqdata.discount,feature:reqdata.feature,ytvideo:reqdata.ytvideo,startdate:reqdata.startdate,content:reqdata.content,coursetype:reqdata.courseType,domain:reqdata.domain
        });
        await course.save();
        await redis.del(`allcourses`);
        return NextResponse.json({message:"Course added successfully",success:true});
    }
    else {
        console.log("live course")
        let course = new Courses({
            title:reqdata.title,desc:reqdata.desc,skills:reqdata.skills,price:reqdata.price,img:reqdata.img,grouplink:reqdata.grouplink,seats:reqdata.seats,duration:reqdata.duration,isopen:reqdata.isopen,discount:reqdata.discount,feature:reqdata.feature,ytvideo:reqdata.ytvideo,startdate:reqdata.startdate,content:reqdata.content,batch:reqdata.batch,coursetype:reqdata.courseType
        });
        await course.save();
        await redis.del(`allcourses`);
        return NextResponse.json({message:"Course added successfully",success:true});
    }

    }
    catch(err){
        console.log(err);
        return NextResponse(500).json({error:"Internal server error",success:false});
    }
}