
import { NextResponse } from "next/server";
import ConnectDb from "../../../../middleware/db";
import { headers } from "next/headers";
import AuthorizeMd from "../../../../middleware/AuthorizeMd";
import Result from "../../../../models/Result";
export const POST = async (req)=>{
    try{
        const headerlist = await headers()
        const token = headerlist.get("authorization")
        const auth = await AuthorizeMd(token)
        if(!auth.status){
            return NextResponse.json({success:false,message:"Unauthorized"})
        }
        await ConnectDb()
        const {batchid,userid,duration} = await req.json()
       
        const findresult = await Result.findOne({batchid:batchid,duration:duration,status:"published"});
        
        if(!findresult){
            return NextResponse.json({success:false,message:"Result not found"})
        }
        
        const actualresult = findresult.results.find((result)=>result._id.toString()===userid.toString());
        
        if(!actualresult){
            return NextResponse.json({success:false,message:"Result not found"})
        }

        return NextResponse.json({success:true,message:"Result fetched successfully",result:actualresult,data:findresult})
    }
    catch(err){
        
        return NextResponse.json({success:false,message:"Something went wrong while fetching result . Please try again later"})
    }
}