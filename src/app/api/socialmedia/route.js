import { NextResponse } from "next/server";
import SocialMediaPost from "../../../../models/SocialMediaPost";
import ConnectDb from "../../../../middleware/db";
import { headers } from "next/headers";
import AuthorizeMd from "../../../../middleware/AuthorizeMd";
export const GET = async (req) => {
    try {
        const headerlist = await headers();
        const auth = headerlist.get("token");
        const authres = await AuthorizeMd(auth);
        if (!authres.status) {
            return NextResponse.json({ success: false, message: "Unauthorized" });
        }
        const { searchParams } = new URL(req.url);
        const userid = searchParams.get("id");
       
        await ConnectDb();
        const data = await SocialMediaPost.find({ userid: userid }).populate("userid").sort({ createdAt: -1 });
        
        return NextResponse.json({ success: true, data: data });
    } catch (err) {
        
        return NextResponse.json({ success: false, message: "Error fetching data" });
    }
}

export const POST = async (req) => {
    try{
        const headerlist = await headers();
        const auth = headerlist.get("token");
        const authres = await AuthorizeMd(auth);
        if (!authres.status) {
            return NextResponse.json({ success: false, message: "Unauthorized" });
        }
        const { userid, batchid, links } = await req.json();
        await ConnectDb();
        const data = new SocialMediaPost({
            userid: userid,
            batchid: batchid,
            links: links
        });
        await data.save();
        return NextResponse.json({ success: true, message: "Social Media Post created successfully" });
    }
    catch(err){
        
        return NextResponse.json({success:false,message:"Error creating post"})
    }
}