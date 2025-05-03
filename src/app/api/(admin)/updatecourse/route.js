import { NextRequest,NextResponse } from "next/server";
import ConnectDb from "../../../../../middleware/db";
import Courses from "../../../../../models/Courses";
import Admin from "../../../../../models/Admin";
import AuthorizeMd from "../../../../../middleware/AuthorizeMd";
import { headers } from "next/headers";
export const POST = async (req, res) => {
    try{
        await ConnectDb();

   const {title,desc,skills,price,img,grouplink,seats,duration,isopen,discount,feature,ytvideo,startdate,content,id} = await req.json();
   const headerlist = await headers();
   let data = AuthorizeMd(headerlist.get("token"));
    if(!data){
     return NextResponse.json({message:"You are not authorized to access this route",status:401,success:false})
    }
    let admin = await Admin.findOne({email:data.email});
    if(admin==null){
        return NextResponse.json({message:"You are not authorized to access this route",status:401,success:false})
    }
    let updatecourse = await Courses.findOneAndUpdate({_id:id},{
        title,desc,skills,price,img,grouplink,seats,duration,isopen,discount,feature,ytvideo,startdate,content
    });
    if(updatecourse==null){
        return NextResponse.json({message:"Course not found",success:false});
    }

    return NextResponse.json({message:"Course updated successfully",success:true});

    }
    catch(err){
       
        return res.status(500).json({error:"Internal server error",success:false});
    }
}