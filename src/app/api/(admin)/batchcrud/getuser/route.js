import { NextResponse,NextRequest } from "next/server";
import Batch from "../../../../../../models/Batch";
import AuthorizeMd from "../../../../../../middleware/AuthorizeMd";
import { headers } from "next/headers";
import User from "../../../../../../models/User";
import ConnectDb from "../../../../../../middleware/db";
export const POST = async(req,res)=>{
    try{
        await ConnectDb();
    const headerlist = await headers();
    const token = headerlist.get("Authorization");
    let data = await AuthorizeMd(token);
        if(!data.status){
            return NextResponse.json({message:"You are not authorized to access this route",status:401,success:false})
        }
        const reqdata = await req.json();
        const findbatch = await Batch.findById(reqdata.batchid);
        if(!findbatch){
            return NextResponse.json({message:"Batch not found",status:404,success:false})
        }
        const startDate= new Date(findbatch.date);
       // Get the batch date and remove time component
               const batchDate = new Date(findbatch.date);
               batchDate.setHours(0, 0, 0, 0);
               
               // Query users with exactly matching startdate (only compare date, not time)
               const users = await User.aggregate([
                   {
                       $addFields: {
                           startdateWithoutTime: {
                               $dateToString: { format: "%Y-%m-%d", date: "$startdate" }
                           },
                           batchDateWithoutTime: {
                               $dateToString: { format: "%Y-%m-%d", date: batchDate }
                           }
                       }
                   },
                   {
                       $match: {
                           startdateWithoutTime: { $eq: batchDate.toISOString().split('T')[0] },
                           domain: findbatch.domain,
                           ispaid: true
                       }
                   },
                   {
                       $sort: { createdAt: -1 }
                   }
               ]);
        if(users.length==0){
            return NextResponse.json({message:"No users found",status:404,success:false})
        }
        return NextResponse.json({message:"Users fetched successfully",status:200,success:true,users})
    }
    catch(err){
        
        return NextResponse.json({success:false,message:"Something went wrong please try again later"})
    }
}