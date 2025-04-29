import { NextResponse } from "next/server";
import User from "../../../../../models/User";
import Team from "../../../../../models/Team";
import ConnectDb from "../../../../../middleware/db";
import { headers } from "next/headers";
import AuthorizeMd from "../../../../../middleware/AuthorizeMd";
export const POST = async (req) => {
    try {
        await ConnectDb()
        let headerlist = await headers()
        let token = headerlist.get("authorization")
        let user = await AuthorizeMd(token)
        if (!user.status) {
            return NextResponse.json({
                message: "Unauthorized",
                success: false,
            })
        }
        const data = await req.json()
       
        let findbatch = await Team.find({batchid:data.batchid}).populate("teamleaderid").populate("team");
    
        if(findbatch==null){
            return NextResponse.json({
                message: "No batch found",
                success: false,
            })
        }
        const finddata = findbatch.find((team) => {
            return team.team.some((member) => member._id.toString() === data.userid.toString())
        })
        
        if(finddata==null){
            return NextResponse.json({
                message: "You are not any team",
                success: false,
            })
        }
     return NextResponse.json({
            message: "Your team found",
            success: true,
            data: finddata
        })
    }
    catch (err) {
        console.log(err)
        return NextResponse.json({
            message: "Error in finding your team",
            success: false,
        })
    }
}