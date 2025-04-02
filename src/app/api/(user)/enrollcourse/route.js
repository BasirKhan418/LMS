import { NextResponse,NextRequest } from "next/server";
import ConnectDb from "../../../../../middleware/db";
import Enrollc from "../../../../../models/Enrollc";
import AuthorizeMd from "../../../../../middleware/AuthorizeMd";
import { headers } from "next/headers";
import ConnectRedis from "../../../../../middleware/ConnectRedis";
export const POST = async (req,res) => {
    try{
        //connect to database
        await ConnectDb();
        let redis = await ConnectRedis();
        const headerlist = await headers();
        //authorize user
        let data = AuthorizeMd(headerlist.get("token"));
        if(!data.status){
            return NextResponse.json({message:"You are not authorized to access this route",status:401,success:false});
        }
        //get request data
        let reqdata = await req.json();
        //check if user is already enrolled
        let checkenroll = await Enrollc.findOne({courseid:reqdata.courseid,userid:reqdata.id});
        if(checkenroll!=null){
            return NextResponse.json({message:"You are already enrolled in this course",success:false});
        }
        //create new enrollment
        let newenroll = new Enrollc({
            courseid:reqdata.courseid,
            userid:reqdata.id,
            email:data.email,
        });
        await newenroll.save();
        await redis.del(`user:${reqdata.email}:homeauth`);
        await redis.del(`cr:${reqdata.email}:homeauth`);
        return NextResponse.json({message:`Enrollment Successful! You have been successfully enrolled in the course: ${reqdata.title}`,success:true});

    }catch(err){
        console.log(err);
        return NextResponse.json({error:"Internal server error",success:false});
    }
}