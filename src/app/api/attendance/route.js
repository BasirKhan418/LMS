import { NextResponse } from "next/server";
import ConnectDb from "../../../../middleware/db";
import AuthorizeMd from "../../../../middleware/AuthorizeMd";
import { headers } from "next/headers";
import Attendance from "../../../../models/Attendance";

export const POST = async (req) => {
    try {
        await ConnectDb();
        const { batchid, duration } = await req.json();
        
        // Validate required parameters
        if (!batchid || !duration) {
            return NextResponse.json({ 
                message: "Missing required parameters", 
                success: false 
            });
        }

        const headersList = await headers();
        const auth = await AuthorizeMd(headersList.get('authorization'));
        
        if (!auth.status) {
            return NextResponse.json({ 
                message: "Unauthorized", 
                success: false 
            });
        }

        // Parse the duration number from the payload (e.g., "2 Month" -> 2)
        const monthNumber = parseInt(duration.split(' ')[0]) || 1;
        
        // Create an array of duration strings to fetch (e.g., ["1 Month", "2 Month"])
        const durationsToFetch = [];
        for (let i = 1; i <= Math.min(monthNumber, 4); i++) {
            durationsToFetch.push(`${i} Month`);
        }
        
        // Find attendance records that match the batch and any of the target durations
        const attendanceRecords = await Attendance.find({
            batchid: batchid,
            duration: { $in: durationsToFetch }
        }) // Populate user details if needed

        return NextResponse.json({
            message: "Attendance records fetched successfully",
            success: true,
            data: attendanceRecords,
            fetchedDurations: durationsToFetch
        });
    } catch (err) {
        console.error("Error in fetching attendance:", err);
        return NextResponse.json({
            message: "Error in fetching attendance records",
            success: false
        });
    }
}