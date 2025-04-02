import { NextResponse } from "next/server"
import ConnectDb from "../../../../../middleware/db"
import AuthorizeMd from "../../../../../middleware/AuthorizeMd"
import { headers } from "next/headers"
import SubmittedAssignments from "../../../../../models/SubmittedAssignments"
import Enrollc from "../../../../../models/Enrollc"
import Assignments from "../../../../../models/Assignments"
export const GET = async (req, res) => {
await ConnectDb();
const headerList = await headers();
const { searchParams } = new URL(req.url);
const crid = searchParams.get('crid')
const userid = searchParams.get('userid')
try{
let a = AuthorizeMd(headerList.get("token"));
if(!a){
return NextResponse.json({success:false,message:"You are not authorized to access this route",status:401});
}
let asdata = await SubmittedAssignments.find({crid:crid,userid:userid});
let aspop = await Assignments.populate(asdata, { path: "asid" });
let realdata = await Enrollc.populate(aspop, { path: "userid" });

return NextResponse.json({success:true,message:"Data loaded successfully",status:200,data:realdata});
}
catch(err){
    return NextResponse.json({success:false,error:err.message,message:"An error occured while fetching data.Try again later."})
}
}
export const POST = async (req, res) => {
    await ConnectDb();
    const headerList = await headers();
    const reqdata = await req.json();
    try{
    let a = AuthorizeMd(headerList.get("token"));
    if(!a){
    return NextResponse.json({success:false,message:"You are not authorized to access this route",status:401});
    }
    
    const {asid,crid,userid,response} = reqdata;
    let findd = await SubmittedAssignments.find({asid:asid,crid:crid,userid:userid});
    if(findd.length>0){
        return NextResponse.json({success:false,message:"You have already submitted this assignment",status:400});
    }
    const newAssignment = new SubmittedAssignments({
        asid,crid,userid,response
    });
    await newAssignment.save();
    return NextResponse.json({success:true,message:"Assignment submitted successfully",status:200});
    }
    catch(err){
        return NextResponse.json({success:false,error:err.message,message:"An error occured while fetching data.Try again later."})
    }
}
