import { NextResponse } from "next/server";
import ConnectDb from "../../../../../middleware/db";
import AuthorizeMd from "../../../../../middleware/AuthorizeMd";
import { headers } from "next/headers";
import Project from "../../../../../models/Project";
import SubmittedProject from "../../../../../models/SubmittedProject";
import User from "../../../../../models/User";
export const GET = async (req, res) => {
    try{
        await ConnectDb();
        const headerlist = await headers();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        const userid = searchParams.get('userid');
        console.log("id in project user route", id);
        
        let a = AuthorizeMd(headerlist.get("token"));
        if(!a.status) {
            return NextResponse.json({message:"Unauthorized route cant handle request", status: "401" });
        }
        
        let project = await Project.findOne({crid:id});
        let user = await User.findById(userid);
        if(!project) {
            return NextResponse.json({message:"Project not found", status: "404" });
        }
        
        
        return NextResponse.json({
            message: "Success fetched", 
            status: "200", 
            data: project, 
            user: user,
            success: true
        });
    }
    catch(err){
        return NextResponse.json({success:false,error:err.message,message:"An error occured while fetching data.Try again later."})
    }
}

export const POST = async (req, res) => {
    try{
        await ConnectDb();
        const headerlist = await headers();
        const reqdata = await req.json();
        console.log(reqdata)
        console.log("reqdata in project user route",reqdata);
        
        let a = AuthorizeMd(headerlist.get("token"));
        if(!a.status) {
            return NextResponse.json({message:"Unauthorized route cant handle request", status: "401" });
        }
        
        let find = await SubmittedProject.findOne({crid:reqdata.crid,userid:reqdata.userid});
        if(find!=null) {
            let findandupdate = await SubmittedProject.findByIdAndUpdate({_id:find._id},{$set:{title:reqdata.title,desc:reqdata.desc,link:reqdata.link,link2:reqdata.link2}},{new:true});
            return NextResponse.json({success:true,message:"Project updated successfully",status:200});
        }
        const {crid,userid,pid,title,desc,link,link2} = reqdata;
        
        const newProject = new SubmittedProject({
            crid,userid,title,desc,link,link2,pid
        });
        
        await newProject.save();
        
        return NextResponse.json({success:true,message:"Project submitted successfully",status:200});
    }
    catch(err){
        return NextResponse.json({success:false,error:err.message,message:"An error occured while fetching data.Try again later."})
    }
}