import { NextResponse } from "next/server";
import InAppNotification from "../../../../../models/InAppNotification";
import ConnectDb from "../../../../../middleware/db";
import AuthorizeMd from "../../../../../middleware/AuthorizeMd";
import { headers } from "next/headers";

export const GET = async () => {
try{
await ConnectDb()
const headersList = await headers();
const authToken = headersList.get('authorization'); // Get the authorization header
const admin = await AuthorizeMd(authToken)
if(!admin.status){
    return NextResponse.json({message:"Unauthorized",success:false})
}
const notifications = await InAppNotification.find({}).populate("batch").sort({createdAt:-1})
if(!notifications){
    return NextResponse.json({message:"No Notifications Found",success:false})
}
return NextResponse.json({message:"Notifications Found",success:true,data:notifications})
}
catch(err){
    console.log(err)
    return NextResponse.json({message:"Internal Server Error",success:false})
}
}

//post request
export const POST = async (req) => {
    try{
        await ConnectDb()
        const headersList = await headers();
        const authToken = headersList.get('authorization'); // Get the authorization header
        const admin = await AuthorizeMd(authToken)
        if(!admin.status){
            return NextResponse.json({message:"Unauthorized",success:false})
        }
        const {title,description,category,batch,sentTime} = await req.json()
        if(!title || !description || !category || !batch|| !sentTime){
            return NextResponse.json({message:"Please fill all the fields",success:false})
        }
        const notification = new InAppNotification({
            title,
            description,
            category,
            batch,
            sentTime
        })
        await notification.save()
        //send toother server and push it to the queue
        //mandatory for sending this notification to the users
        return NextResponse.json({message:"Notification Created",success:true})
    }
    catch(err){
        console.log(err)
        return NextResponse.json({message:"Internal Server Error",success:false})
    }
        
}