import { NextResponse,NextRequest } from "next/server";
import { headers } from "next/headers";
import User from "../../../../../models/User";
import ConnectDb from "../../../../../middleware/db";
import AuthorizeMd from "../../../../../middleware/AuthorizeMd";
export const GET = async()=>{
    try{
     await ConnectDb();
        const headerlist = await headers();
        let data = AuthorizeMd(headerlist.get("Authorization"));
        if(!data){
            return NextResponse.json({message:"You are not authorized to access this route",status:401,success:false})
        }
        let users = await User.find({}).sort({createdAt:-1});
        return NextResponse.json({message:"Users fetched successfully",status:200,success:true,users})
    }
    catch(err){
        console.log(err);
        return NextResponse.json({success:false,message:"Something went wrong please try again later"})
    }
}
//post


export const PUT = async(req,res)=>{
    try{
     await ConnectDb();
        const headerlist = await headers();
        let data = AuthorizeMd(headerlist.get("Authorization"));
        if(!data){
            return NextResponse.json({message:"You are not authorized to access this route",status:401,success:false})
        }
        const reqdata = await req.json();
        let user = await User.findByIdAndUpdate(reqdata._id,reqdata,{new:true});
        return NextResponse.json({message:"User updated successfully",status:200,success:true,user})
    }
    catch(err){
        console.log(err);
        return NextResponse.json({success:false,message:"Something went wrong please try again later"})
    }
}

export const DELETE = async(req,res)=>{
    try{
     await ConnectDb();
        const headerlist = await headers();
        let data = AuthorizeMd(headerlist.get("Authorization"));
        if(!data){
            return NextResponse.json({message:"You are not authorized to access this route",status:401,success:false})
        }
        const reqdata = await req.json();
        let user = await User.findByIdAndDelete(reqdata._id);
        return NextResponse.json({message:"User deleted successfully",status:200,success:true})
    }
    catch(err){
        console.log(err);
        return NextResponse.json({success:false,message:"Something went wrong please try again later"})
    }
}