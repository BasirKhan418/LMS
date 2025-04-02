import { NextResponse } from "next/server"
import jwt from "jsonwebtoken";
import { headers } from "next/headers";
import ConnectDb from "../../../../middleware/db";
import Auth from "../../../../models/Auth";
import Enrollc from "../../../../models/Enrollc";
import Courses from "../../../../models/Courses";
import Users from "../../../../models/Users";
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
        if(Buser && Bcr){
            let user = JSON.parse(Buser);
            let cr = JSON.parse(Bcr);
            console.log("from redis");
            return NextResponse.json({message:"You are authorized to access this route",success:true,data:cr,user:user});
        }
        console.log("from db");
        let a = await Enrollc.find({email:verify.email});
        let user = await Users.findOne({email:verify.email},{password:0,token:0});
        let cr = await Courses.populate(a,{path:"courseid"});
        //CACHING ALL DATA IN REDIS
        await client.set(`user:${verify.email}:homeauth`,JSON.stringify(user),{EX:200});
        await client.set(`cr:${verify.email}:homeauth`,JSON.stringify(cr),{EX:200});
        return NextResponse.json({message:"You are authorized to access this route",success:true,data:cr,user:user});
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