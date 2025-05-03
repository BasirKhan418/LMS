import { NextResponse } from "next/server";
import ConnectDb from "../../../../../middleware/db";
import { headers } from "next/headers";
import AuthorizeMd from "../../../../../middleware/AuthorizeMd";
import Attendance from "../../../../../models/Attendance";
export const POST = async (req) => {
    try{
     await ConnectDb()
     const {users,weekname,duration,batchid,courseid,classid} = await req.json()
     const headerslist = await headers()
        const auth = await AuthorizeMd(headerslist.get('authorization'))
        if(!auth.status){
            return NextResponse.json({message:"Unauthorized",success:false})
        }
        let findthisattendance = await Attendance.findOne({batchid:batchid,courseid:courseid,classid:classid})
        if(findthisattendance){
            await Attendance.findByIdAndUpdate(findthisattendance._id,{
                $set:{
                    users:users
                }
            })
            return NextResponse.json({message:"Attendance updated successfully",success:true})
        }
        let attendance = new Attendance({
            weekname:weekname,
            duration:duration,
            batchid:batchid,
            users:users,
            courseid:courseid,
            classid:classid
        })
        await attendance.save()
        return NextResponse.json({message:"Attendance taken successfully",success:true})

    }
    catch(err){
        console.log(err)
        return NextResponse.json({message:"Error in Attendance taking",success:false})
    }
}