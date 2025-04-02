import { NextResponse } from "next/server"
import AuthorizeMd from "../../../../../middleware/AuthorizeMd"
import ConnectDb from "../../../../../middleware/db"
import { headers } from "next/headers"
import Enrollc from "../../../../../models/Enrollc";
import Courses from "../../../../../models/Courses";
export const GET = async (req, res) => {
    await ConnectDb();
    const headerList = await headers();
    const { searchParams } = new URL(req.url);
const id = searchParams.get('id')
const crid = searchParams.get('crid')
try{
let a = AuthorizeMd(headerList.get("token"));
if(!a){
return NextResponse.json({success:false,message:"You are not authorized to access this route",status:401});
}
let userdata= await Enrollc.findOne({userid:id,courseid:crid});
let coursedata = await Courses.populate(userdata,{path:"courseid"});
if(coursedata==null){
    return NextResponse.json({success:false,message:"Data not found",status:404});
}
let contentlength =0;
coursedata.courseid.content.map((item)=>{
    contentlength+=item.content.length;
})
let crcmplength =coursedata.crcmp.length;
let progress = Math.floor((crcmplength/contentlength)*100);
let dataup = await Enrollc.findOneAndUpdate({userid:id,courseid:crid},{progress:progress},{new:true});
return NextResponse.json({success:true,message:"Data loaded successfully",status:200,progress:progress});

}
catch(err){
    return NextResponse.json({success:false,message:"Something went wrong! try again later",status:500});
}
}
//POST END POINT
export const POST = async (req, res) => {
    await ConnectDb();
    const headerList = await headers();
    const reqData = await req.json();
    console.log(reqData)
    try{
        let a = AuthorizeMd(headerList.get("token"));
        if(!a){
        return NextResponse.json({success:false,message:"You are not authorized to access this route",status:401});
        }
        const userdata = await Enrollc.findOne({userid: reqData.id, courseid: reqData.crid});

        if (userdata) {
          // Check if the object with the specified name exists in the crcmp array
          const exists = userdata.crcmp.some(item => item.name === reqData.data.name);
        
          if (!exists) {
            // If it doesn't exist, push the new data
            userdata.crcmp.push(reqData.data);
            await userdata.save();
            return NextResponse.json({success:true,message:"Your course progress has been updates successfully",status:200,data:userdata});
          }
          else{
            return NextResponse.json({success:true,message:"Your progress has not been updated. You are already finished this content",status:200,data:userdata});
          }
        }
        
        if(userdata==null){
            console.log("userdata is ",userdata);
            return NextResponse.json({success:false,message:"Course Progress Data not found",status:404});
        }
        return 
        

    }
    catch(err){
        return NextResponse.json({success:false,message:"Something went wrong! in updating course progress",status:500});
        
    }
}