import { NextRequest, NextResponse } from "next/server";
import ConnectDb from "../../../../middleware/db";
import Courses from "../../../../models/Courses";
import { headers } from "next/headers";
import AuthorizeMd from "../../../../middleware/AuthorizeMd";
import ConnectRedis from "../../../../middleware/ConnectRedis";
export const GET = async (req) => {
  const headerlist = await headers();
  let redis = await ConnectRedis();
  try {
    await ConnectDb();
    let a = AuthorizeMd(headerlist.get("token"));
    if (!a) {
      return NextResponse.json({
        message: "You are not authorized to access this route",
        status: 401,
        success: false,
      });
    }
    //find from redis
    let bdata = await redis.get(`allcourses`);
    if(bdata){
      let data = JSON.parse(bdata);
      return NextResponse.json({data:data,message:"Courses loaded successfully",success:true})
    }
    //find from db
    let data = await Courses.find();
    await redis.set(`allcourses`, JSON.stringify(data), { EX: 600 });
    if (data == null) {
      return NextResponse.json({ message: "No data found", success: false });
    }
    return NextResponse.json({
      data: data,
      message: "Courses loaded successfully",
      success: true,
    });
  } catch (err) {
    return NextResponse.json({
      message: "Something went wrong! try again later" + err,
      success: false,
    });
  }
};
