import { NextRequest,NextResponse } from "next/server";
import ConnectDb from "../../../../../middleware/db";
import Courses from "../../../../../models/Courses";
import Admin from "../../../../../models/Admin";
import AuthorizeMd from "../../../../../middleware/AuthorizeMd";
import Enrollc from "../../../../../models/Enrollc";
import { headers } from "next/headers";
export const POST = async (req, res) => {
    try{
        await ConnectDb();

   const reqdata = await req.json();
   console.log("reqdata is",reqdata);
   console.log(reqdata);
   const headerlist = await headers();
   let data = AuthorizeMd(headerlist.get("token"));
   console.log(data);
    if(!data){
     return NextResponse.json({message:"You are not authorized to access this route",status:401,success:false})
    }
    console.log(data.email)
    let admin = await Admin.findOne({email:data.email});
    if(admin==null){
        return NextResponse.json({message:"You are not authorized to access this route",status:401,success:false})
    }
    let cr = await Courses.findByIdAndDelete({_id:reqdata});
    let dl = await Enrollc.deleteMany({courseid:reqdata});
    return NextResponse.json({message:"Course deleted successfully",success:true});

    }
    catch(err){
        console.log(err);
        return NextResponse(500).json({error:"Internal server error",success:false});
    }
}