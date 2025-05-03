import { NextResponse } from "next/server";
import AuthorizeMd from "../../../../../middleware/AuthorizeMd";
import { headers } from "next/headers";
import Attendance from "../../../../../models/Attendance";
import ConnectDb from "../../../../../middleware/db";
import ConnectRedis from "../../../../../middleware/ConnectRedis";
export const POST = async (req) => {
    try {

        await ConnectDb();
        let redis = await ConnectRedis();
        const { batchid, duration, userid } = await req.json();
        
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
        let result = await redis.get(`attendance:${batchid}:${userid}`);
        if (result) {
            return NextResponse.json({
                message: "Attendance records fetched successfully",
                success: true,
                data: JSON.parse(result).attendanceRecords,
                fetchedDurations: JSON.parse(result).durationsToFetch,
                userAttendance: JSON.parse(result).userAttendanceData
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
        });

        // Calculate user attendance percentage if userid is provided
        let userAttendanceData = null;
        if (userid) {
            // Count total classes
            const totalClasses = attendanceRecords.length;
            
            // Count classes where user was present
            const attendedClasses = attendanceRecords.filter(record => 
                record.users.some(id => id.toString() === userid)
            ).length;
            
            // Calculate attendance percentage
            const attendancePercentage = totalClasses > 0 
                ? (attendedClasses / totalClasses) * 100 
                : 0;
            
            // Create user attendance data object
            userAttendanceData = {
                userId: userid,
                totalClasses,
                attendedClasses,
                attendancePercentage: Math.round(attendancePercentage * 100) / 100, // Round to 2 decimal places
                attendanceByMonth: {}
            };
            
            // Calculate attendance per month (duration)
            durationsToFetch.forEach(duration => {
                const durationRecords = attendanceRecords.filter(record => record.duration === duration);
                const durationTotal = durationRecords.length;
                const durationAttended = durationRecords.filter(record => 
                    record.users.some(id => id.toString() === userid)
                ).length;
                const durationPercentage = durationTotal > 0 
                    ? (durationAttended / durationTotal) * 100 
                    : 0;
                
                userAttendanceData.attendanceByMonth[duration] = {
                    totalClasses: durationTotal,
                    attendedClasses: durationAttended,
                    attendancePercentage: Math.round(durationPercentage * 100) / 100
                };
            });
        }
        
        let newObj = {
            attendanceRecords: attendanceRecords,
            userAttendanceData: userAttendanceData,
            durationsToFetch: durationsToFetch
        }
        await redis.set(`attendance:${batchid}:${userid}`, JSON.stringify(newObj), {
            EX: 60 * 60 * 24 // Cache for 24 hours
        });

        return NextResponse.json({
            message: "Attendance records fetched successfully",
            success: true,
            data: attendanceRecords,
            fetchedDurations: durationsToFetch,
            userAttendance: userAttendanceData
        });
    } catch (err) {
        console.error("Error in fetching attendance:", err);
        return NextResponse.json({
            message: "Error in fetching attendance records",
            success: false,
            error: err.message
        });
    }
}