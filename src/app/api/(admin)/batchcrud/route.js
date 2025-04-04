import { NextRequest,NextResponse } from "next/server";
import AuthorizeMd from "../../../../../middleware/AuthorizeMd";
import Batch from "../../../../../models/Batch";
import { headers } from "next/headers";
import ConnectDb from "../../../../../middleware/db";
export const GET = async()=>{
    try{
        await ConnectDb();
     const headerlist = await headers();
        let data = AuthorizeMd(headerlist.get("token"));
        if(!data){
            return NextResponse.json({message:"You are not authorized to access this route",status:401,success:false})
        }
        let batch = await Batch.find({}).sort({createdAt:-1});
        if(batch.length==0){
            return NextResponse.json({message:"No batch found",status:404,success:false})
        }
        return NextResponse.json({message:"Batch fetched successfully",status:200,success:true,batch})
    }
    catch(err){
        return NextResponse.json({success:false,message:"Something went wrong please try again later"})
    }
}
export const POST = async(req,res)=>{
    try{
        await ConnectDb();
    const headerlist = await headers();
        let data = AuthorizeMd(headerlist.get("token"));
        if(!data){
            return NextResponse.json({message:"You are not authorized to access this route",status:401,success:false})
        }
        const reqdata = await req.json();
        let batch = new Batch({
            name:reqdata.name,
            domain:reqdata.domain,
            date:reqdata.date
        })
        await batch.save();
        return NextResponse.json({message:"Batch created successfully",status:200,success:true})
    }
    catch(error){
        console.log(error);
        return NextResponse.json({success:false,message:"Something went wrong please try again later"})
    }
}

export const PUT = async(req,res)=>{
    try{
        await ConnectDb();
        const headerlist = await headers();
        let data = AuthorizeMd(headerlist.get("token"));
        if(!data){
            return NextResponse.json({message:"You are not authorized to access this route",status:401,success:false})
        }
        const reqdata = await req.json();
        console.log(reqdata);
        let batch = await Batch.findByIdAndUpdate(reqdata._id,{
            name:reqdata.name,
            domain:reqdata.domain,
            date:reqdata.date
        })
        return NextResponse.json({message:"Batch updated successfully",status:200,success:true})
    }
    catch(error){
        console.log(error);
        return NextResponse.json({success:false,message:"Something went wrong please try again later"})
    }
}

export const DELETE = async(req,res)=>{
    try{
        await ConnectDb();
        const headerlist = await headers();
        let data = AuthorizeMd(headerlist.get("token"));
        if(!data){
            return NextResponse.json({message:"You are not authorized to access this route",status:401,success:false})
        }
        const reqdata = await req.json();
        let batch = await Batch.findByIdAndDelete(reqdata.id);
        return NextResponse.json({message:"Batch deleted successfully",status:200,success:true})
    }
    catch(error){
        console.log(error);
        return NextResponse.json({success:false,message:"Something went wrong please try again later"})
    }
}