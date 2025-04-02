
import { NextResponse } from "next/server"
import ConnectDb from "../../../../../middleware/db"
import Courses from "../../../../../models/Courses"
import AuthorizeMd from "../../../../../middleware/AuthorizeMd"
import { headers } from "next/headers";
import ConnectRedis from "../../../../../middleware/ConnectRedis";
import Admin from "../../../../../models/Admin";
export const GET = async(req)=>{
    const header = await headers()
    let redis = await ConnectRedis();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    console.log(id)

try{
    let res =  AuthorizeMd(header.get("token"));

    await ConnectDb();
    if(!res){
        return NextResponse.json({message:"You are not authorized to access this route",success:false})
    }
    let data = await redis.get(`course:${id}`);
    if(data){
        let Course = JSON.parse(data);
        return NextResponse.json({data:Course,success:true,message:"Course Loaded successfully"})
    }
    const Course = await Courses.findById({_id:id})
    await redis.set(`course:${id}`,JSON.stringify(Course),{EX:600});
    return NextResponse.json({data:Course,success:true,message:"Course Loaded successfully"})
}
catch(err){
    return NextResponse.json({message:"Something went wrong! try again later"+err,success:false})

}
}
export const POST = async (req, res) => {
    const header = await headers();
    const redis = await ConnectRedis();
    const reqdata = await req.json();
    console.log(reqdata);
    try {
        await ConnectDb();
        let res = AuthorizeMd(header.get("token"));
        if (!res) {
            return NextResponse.json({ message: "You are not authorized to access this route", success: false });
        } 
        let admin = await Admin.findOne({ email: res.email });
            if (admin == null) {
              return NextResponse.json({
                message: "You are not authorized to access this route",
                status: 401,
                success: false,
              });
            }
        
        else {
            let data = await Courses.findByIdAndUpdate(
                reqdata.id,
                { $set: { content: reqdata.content } },
                { new: true }
            );
            await redis.del(`course:${reqdata.id}`);
            return NextResponse.json({ message: "Course updated successfully", success: true, data: data });
        }
    } catch (err) {
        return NextResponse.json({ message: "Something went wrong! try again later: " + err, success: false });
    }
};
