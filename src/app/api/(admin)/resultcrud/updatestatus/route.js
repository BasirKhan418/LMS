import { NextResponse } from "next/server";
import Result from "../../../../../../models/Result";
import ConnectDb from "../../../../../../middleware/db";
import { headers } from "next/headers";
import AuthorizeMd from "../../../../../../middleware/AuthorizeMd";

export const POST = async (req) => {
try{
 const headerlist = await headers()
    const token = headerlist.get("authorization")
    const auth = await AuthorizeMd(token)
    if(!auth.status){
        return NextResponse.json({success:false,message:"Unauthorized"})
    }
    await ConnectDb()
    const {resultid,status,url} = await req.json()
    console.log(resultid,status,url)
    const findresult = await Result.findById(resultid)
    if(!findresult){
        return NextResponse.json({success:false,message:"Result not found"})
    }
    const updatedresult = await Result.findByIdAndUpdate(resultid,{
        status:"published",
        url:url
    },{new:true})
    return NextResponse.json({success:true,message:"Result status updated successfully to published !",result:updatedresult})
}
catch(err){
    console.log(err)
    return NextResponse.json({success:false,message:"Something went wrong"})
}
}



export const PUT = async (req) => {
    try{
        const headerlist = await headers()
        const token = headerlist.get("authorization")
        const auth = await AuthorizeMd(token)
        if(!auth.status){
            return NextResponse.json({success:false,message:"Unauthorized"})
        }
        await ConnectDb()
        const {resultid,status,url} = await req.json()
        const findresult = await Result.findById(resultid)
        if(!findresult){
            return NextResponse.json({success:false,message:"Result not found"})
        }
        const updatedresult = await Result.findByIdAndUpdate(resultid,{
            status:status,
            url:url
        },{new:true})
        return NextResponse.json({success:true,message:"Result status updated successfully",result:updatedresult})
    }
    catch(err){
        console.log(err)
        return NextResponse.json({success:false,message:"Something went wrong"})
    }
}