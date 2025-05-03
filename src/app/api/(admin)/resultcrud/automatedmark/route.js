import { NextResponse } from "next/server";
import SocialMediaPost from "../../../../../../models/SocialMediaPost";
import ConnectDb from "../../../../../../middleware/db";
import AuthorizeMd from "../../../../../../middleware/AuthorizeMd";
import { headers } from "next/headers";

export const POST = async (req) => {
    try{
     const header = await headers()
     const token = header.get("token")
     const res = await AuthorizeMd(token);
     if(!res.status){
        return NextResponse.json({success:false,message:"Unauthorized"})
     }
     const data = await req.json()
     await ConnectDb()
    let findsocialmediapost = await SocialMediaPost.findOne({userid:data.userid})
    
    if(!findsocialmediapost){
        return NextResponse.json({success:true,socialmedia:0,attendance:4})
    }
    return NextResponse.json({success:true,socialmedia:4,attendance:4})
}
    catch(err){
        
        return NextResponse.json({success:false,message:"Internal Server Error"})
    }   
}