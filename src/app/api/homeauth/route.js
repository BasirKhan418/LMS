import { NextResponse } from "next/server"
import jwt from "jsonwebtoken";
import { headers } from "next/headers";
import ConnectDb from "../../../../middleware/db";
import Auth from "../../../../models/Auth";
import Enrollc from "../../../../models/Enrollc";
import Courses from "../../../../models/Courses";
import User from "../../../../models/User";
import Batch from "../../../../models/Batch";
import ConnectRedis from "../../../../middleware/ConnectRedis";
export const POST = async(req,res)=>{
    await ConnectDb();
    let client = await ConnectRedis();
    //getting reqdata
    let headerlist = await headers();
    let reqdata = headerlist.get("token");

try{
let verify  = jwt.verify(reqdata,process.env.JWT_SECRET);
console.log(verify);
//if token is verified
if(verify!=null){
    //checking if the user is login in single device or not
    let verifym2 = await Auth.findOne({email:verify.email});
    if(verifym2.token === reqdata){
        //FETCHING FROM REDIS
        let Buser = await client.get(`user:${verify.email}:homeauth`);
        let Bcr = await client.get(`cr:${verify.email}:homeauth`);
        let Bbatch = await client.get(`batch:${verify.email}:homeauth`);
        if(Buser && Bcr&& Bbatch){
            let user = JSON.parse(Buser);
            let cr = JSON.parse(Bcr);
            let batch = JSON.parse(Bbatch);
            console.log("from redis");
            return NextResponse.json({message:"You are authorized to access this route",success:true,data:cr,user:user,batch:batch});
        }
        console.log("from db");
        let a = await Enrollc.find({email:verify.email});
        let user = await User.findOne({email:verify.email},{password:0,token:0});
        let cr = await Courses.populate(a,{path:"courseid"});

// Get user's startdate as a Date object
const userStartDate = new Date(user.startdate);

// Create date-only strings in YYYY-MM-DD format
const dateString = userStartDate.toISOString().split('T')[0];

// Create range boundaries using this date string to ensure timezone consistency
const startOfDay = new Date(`${dateString}T00:00:00.000Z`);
const endOfDay = new Date(`${dateString}T23:59:59.999Z`);


// Find batches
let batch = await Batch.findOne({
  date: {
    $gte: startOfDay,
    $lte: endOfDay
  },
  domain: user.domain
});
console.log("Found batches:", batch);
        //CACHING ALL DATA IN REDIS
        await client.set(`user:${verify.email}:homeauth`,JSON.stringify(user),{EX:200});
        await client.set(`cr:${verify.email}:homeauth`,JSON.stringify(cr),{EX:200});
        await client.set(`batch:${verify.email}:homeauth`,JSON.stringify(batch),{EX:200});
        return NextResponse.json({message:"You are authorized to access this route",success:true,data:cr,user:user,batch:batch});
    }
    else{
        return NextResponse.json({message:"Another session is detected from another device .Please Login again",success:false,ansession:true});
    }    
}
else{
    return NextResponse.json({message:"You are not authorized to access this route",success:false});
}
}
catch(err){
    console.log(err);
    return NextResponse.json({message:"You are not authorized to access this route",success:false});
    
}
}