import { NextResponse } from "next/server";
import SubmittedProject from "../../../../../../models/SubmittedProject";
import User from "../../../../../../models/User"; // Make sure User is imported
import { headers } from "next/headers";
import AuthorizeMd from "../../../../../../middleware/AuthorizeMd";
import ConnectDb from "../../../../../../middleware/db";

export const GET = async (req, res) => {
    await ConnectDb();
    let headerlist = await headers();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    try {
        let a = AuthorizeMd(headerlist.get("token"));
        console.log(a);
        if(!a) {
            return NextResponse.json({message:"Unauthorized route cant handle request", status: "401" });
        }
        
        // First, find the submissions without populate
        let assignments = await SubmittedProject.find({crid:id});
        
        if(assignments.length === 0) {
            console.log("No project submission found");
            return NextResponse.json({message:"No project submission found", status: "401", success:false});
        }
        
        // Then manually populate the user data
        const populatedAssignments = await Promise.all(assignments.map(async (assignment) => {
            const user = await User.findById(assignment.userid);
            const assignmentObj = assignment.toObject();
            assignmentObj.userid = user;
            return assignmentObj;
        }));
        
        return NextResponse.json({
            message: "Success fetched", 
            status: "200", 
            data: populatedAssignments, 
            success: true
        });
    } catch(err) {
        console.log(err);
        return NextResponse.json({message:"Some thing went wrong please try again after some time", status: "401" });
    }
}