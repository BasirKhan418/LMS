import InAppNotification from "../../../../../models/InAppNotification";
import ConnectDb from "../../../../../middleware/db";
import { headers } from "next/headers";
import AuthorizeMd from "../../../../../middleware/AuthorizeMd";
import { NextResponse } from "next/server";
export const POST = async (req) => {
    try{
        await ConnectDb()
        const headersList = await headers();
        const authToken = headersList.get('authorization'); // Get the authorization header
        const user = await AuthorizeMd(authToken)
        if(!user.status){
            return NextResponse.json({message:"Unauthorized",success:false})
        }
        const {batchid} = await req.json()
        if(!batchid){
            return NextResponse.json({message:"Please give a batchid for fetching",success:false})
        }
        const notifications = await InAppNotification.find({batch:batchid}).populate("batch").sort({createdAt:-1})
        if(!notifications){
            return NextResponse.json({message:"No Notifications Found",success:false})
        }
        return NextResponse.json({message:"Notifications Found",success:true,data:notifications})
    }catch(err){
        console.log(err)
        return NextResponse.json({message:"Internal Server Error",success:false})
    }
}
