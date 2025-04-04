import { NextResponse,NextRequest } from "next/server";
import Batch from "../../../../../../models/Batch";
import AuthorizeMd from "../../../../../../middleware/AuthorizeMd";
import { headers } from "next/headers";
import User from "../../../../../../models/User";
import ConnectDb from "../../../../../../middleware/db";
export const POST = async(req,res)=>{
    try{
        await ConnectDb();
    const headerlist = await headers();
    const token = headerlist.get("dilmsadmintoken");
    let data = await AuthorizeMd(token);
        if(!data){
            return NextResponse.json({message:"You are not authorized to access this route",status:401,success:false})
        }
        const reqdata = await req.json();
        const findbatch = await Batch.findById(reqdata.batchid);
        if(!findbatch){
            return NextResponse.json({message:"Batch not found",status:404,success:false})
        }
        const startDate= new Date(findbatch.date);
        const users = await User.find({startdate:{$gte:startDate},domain:findbatch.domain,ispaid:true}).sort({createdAt:-1}); 
        if(users.length==0){
            return NextResponse.json({message:"No users found",status:404,success:false})
        }
        return NextResponse.json({message:"Users fetched successfully",status:200,success:true,users})
    }
    catch(err){
        return NextResponse.json({success:false,message:"Something went wrong please try again later"})
    }
}