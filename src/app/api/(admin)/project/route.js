import { NextResponse } from "next/server";
import Project from "../../../../../models/Project";
import { headers } from "next/headers";
import AuthorizeMd from "../../../../../middleware/AuthorizeMd";
import ConnectDb from "../../../../../middleware/db";
import Admin from "../../../../../models/Admin";
export const GET = async (req, res) => {
    await ConnectDb()
    
    let headerlist = await headers()
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
try{
let a  = AuthorizeMd(headerlist.get("token"));

if(!a){
    return NextResponse.json({message:"Unauthorized route cant handle request",status: "401" });
}
let assignment = await Project.find({crid:id});
if(assignment.length==0){
    
    return NextResponse.json({message:"No project found",status: "401",success:false});
}

return NextResponse.json({message:"Success fetched",status: "200",data:assignment ,success:true});
}
catch(err){
return NextResponse.json({message:"Some thing went wrong please try again after some time",status: "401" });
}
}
export const POST = async (req, res) => {
    await ConnectDb()
    const headerlist = await headers()
    const reqdata = await req.json();
    try{
        let a  = AuthorizeMd(headerlist.get("token"));
        
        if(!a){
            return NextResponse.json({message:"Unauthorized route cant handle request",status: "401" ,success:false});
        }
        let admin = await Admin.findOne({ email: a.email });
            if (admin == null) {
              return NextResponse.json({
                message: "You are not authorized to access this route",
                status: 401,
                success: false,
              });
            }

            let check = await Project.findOne({crid:reqdata.crid});
            if(check==null){

        let addData = new Project({
            title:reqdata.title,
            desc:reqdata.desc,
            link:reqdata.link,
            link2:reqdata.link2,
            crid:reqdata.crid
        });
        await addData.save();
        return NextResponse.json({message:"Project added successfully",status: "200",success:true});
    }
    else{
        let data = await Project.findByIdAndUpdate({_id:check._id},reqdata,{new:true});
        return NextResponse.json({message:"Project updated successfully",status: "200",success:true});
    }

        
        }
        catch(err){
           
        return NextResponse.json({message:"Some thing went wrong please try again after some time",status: "401" ,success:false});
        }
}

