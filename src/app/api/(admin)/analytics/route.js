import { NextResponse,NextRequest } from "next/server";
import User from "../../../../../models/User";
import { headers } from "next/headers";
import Courses from "../../../../../models/Courses";
import AuthorizeMd from "../../../../../middleware/AuthorizeMd";
import ConnectDb from "../../../../../middleware/db";
import Enrollc from "../../../../../models/Enrollc";
export const GET = async(req, res) => {
    try {
        await ConnectDb();
        const headerlist = await headers();
        let data = AuthorizeMd(headerlist.get("dilmsadmintoken"));
        if(!data) {
            return NextResponse.json({
                message: "You are not authorized to access this route",
                status: 401,
                success: false
            });
        }
        
        let month = new Date().getMonth();
        let year = new Date().getFullYear();
        
        // Calculate the first day of the current month
        let firstDayOfMonth = new Date(year, month, 1);
        
        let courses = await Courses.find({}).sort({createdAt: -1}).countDocuments();
        let users = await User.find({ispaid: true}).sort({createdAt: -1}).countDocuments();
        let newsignupthismonth = await User.find({
            ispaid: true,
            createdAt: { $gte: firstDayOfMonth }
        }).countDocuments();
        let totalenrollments = await Enrollc.find({}).countDocuments();
        
        return NextResponse.json({
            success: true,
            courses,
            users,
            newsignupthismonth,
            totalenrollments,
        });
    }
    catch(err) {
        return NextResponse.json({
            success: false,
            message: "Something went wrong please try again later"
        });
    }
}