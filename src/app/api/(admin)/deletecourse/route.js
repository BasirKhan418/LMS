import { NextRequest,NextResponse } from "next/server";
import ConnectDb from "../../../../../middleware/db";
import Courses from "../../../../../models/Courses";
import Admin from "../../../../../models/Admin";
import AuthorizeMd from "../../../../../middleware/AuthorizeMd";
import Enrollc from "../../../../../models/Enrollc";
import { headers } from "next/headers";
import ConnectRedis from "../../../../../middleware/ConnectRedis";
export const POST = async (req, res) => {
    try{
        await ConnectDb();
        let redis = await ConnectRedis();

   const reqdata = await req.json();
   
   console.log("reqdata",reqdata)
   const headerlist = await headers();
   let data = AuthorizeMd(headerlist.get("token"));
  
    if(!data){
     return NextResponse.json({message:"You are not authorized to access this route",status:401,success:false})
    }
    
    let admin = await Admin.findOne({email:data.email});
    if(admin==null){
        return NextResponse.json({message:"You are not authorized to access this route",status:401,success:false})
    }
    let dl = await Enrollc.deleteMany({courseid:reqdata.id});
    let cr = await Courses.findByIdAndDelete(reqdata.id);
    await redis.del(`allcourses`);
    console.log("cr",cr)
    
    console.log("dl",dl)
    return NextResponse.json({message:"Course deleted successfully",success:true});

    }
    catch(err){
        console.log(err);
        return NextResponse(500).json({error:"Internal server error",success:false});
    }
}