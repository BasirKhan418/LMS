import { NextResponse } from "next/server";
import SocialMediaPost from "../../../../../../models/SocialMediaPost";
import ConnectDb from "../../../../../../middleware/db";
import AuthorizeMd from "../../../../../../middleware/AuthorizeMd";
import { headers } from "next/headers";
import axios from "axios"; // Import axios for API call

export const POST = async (req) => {
    try {
        const header = await headers();
        const token = header.get("token");
        const res = await AuthorizeMd(token);
     
        if (!res.status) {
            return NextResponse.json({ success: false, message: "Unauthorized" });
        }
        
        const data = await req.json();
        await ConnectDb();
        console.log("data is",data)
        
        // Get social media posts data
        let findsocialmediapost = await SocialMediaPost.findOne({ userid: data.userid });
        
        // Calculate social media score (default 0 if not found, 4 if found)
        const socialMediaScore = findsocialmediapost ? 4 : 0;
        
        // Fetch attendance data
        let attendanceScore = 0;
        try {
            // Get the attendance data using the parameters provided
            const attendanceResponse = await axios.post(`${process.env.PLATFORM_URL}/api/attendance`, {
                batchid: data.batchid,
                duration: data.duration,
                userid: data.userid
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token // Using the same token from the request
                }
            });
            // console.log("Attendance Response:", attendanceResponse);
            // Extract attendance percentage from response
            if (attendanceResponse.data.success) {
                const attendancePercentage = attendanceResponse.data.userAttendance.attendancePercentage;
                console.log("Attendance Percentage:", attendancePercentage);    
                
                // Calculate attendance score out of 5 based on percentage
                // Assuming a linear scale where 100% = 5 points
                attendanceScore = Math.round((attendancePercentage / 100) * 5);
            }
        } catch (err) {
            console.error("Error fetching attendance:", err);
            // Default to 4 as in your original code if there's an error
            attendanceScore = 4;
        }
        
        return NextResponse.json({ 
            success: true, 
            socialmedia: socialMediaScore, 
            attendance: attendanceScore 
        });
    } catch (err) {
        console.error("Server error:", err);
        return NextResponse.json({ success: false, message: "Internal Server Error" });
    }
}