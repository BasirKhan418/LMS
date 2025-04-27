import SubmittedProject from "../../../../../models/SubmittedProject";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import AuthorizeMd from "../../../../../middleware/AuthorizeMd";
import ConnectDb from "../../../../../middleware/db";
 export const POST = async (req, res) => {
    try{
       await ConnectDb()
         const headerlist = await headers()
        const token = headerlist.get("token")
        const status = AuthorizeMd(token)
        if(status.status==false){
            return NextResponse.json({message:"Unauthorized route cant handle request",status: "401" });
        }
        const reqdata = await req.json();
        const {title,desc,link,link2,crid,pid,userid} = reqdata
        if(!title || !desc || !link || !link2 || !crid || !pid|| !userid){
            return NextResponse.json({message:"Please fill all the fields",status: "401" });
        }
        const check = await SubmittedProject.findOne({crid:crid,pid:pid,userid:userid});
        if(check){
            return NextResponse.json({message:"You have already submitted your project",status: "401" });
        }
        const addData = new SubmittedProject({
            title:title,
            desc:desc,
            link:link,
            link2:link2,
            crid:crid,
            pid:pid,
            userid:userid
        });
        await addData.save();
        return NextResponse.json({message:"Project submitted successfully",status: "200" });
    }
    catch(err){
        return NextResponse.json({message:"Some thing went wrong please try again after some time",status: "401" });
    }
 }