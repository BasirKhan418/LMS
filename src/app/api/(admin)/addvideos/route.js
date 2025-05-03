import { headers } from "next/headers";
import AuthorizeMd from "../../../../../middleware/AuthorizeMd";
import { NextResponse } from "next/server";
import Videos from "../../../../../models/Videos";
import ConnectDb from "../../../../../middleware/db";
import Admin from "../../../../../models/Admin";
export const GET = async (req, res) => {
  await ConnectDb();
  const headerlist = await headers();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  try {
    let data = AuthorizeMd(headerlist.get("token"));
    if (!data) {
      return NextResponse.json({
        message: "You are not authorized to access this route",
        status: 401,
        success: false,
      });
    }
    let admin = await Admin.findOne({ email: data.email });
    if (admin == null) {
      return NextResponse.json({
        message: "You are not authorized to access this route",
        status: 401,
        success: false,
      });
    }
    let videodata = await Videos.find({ folderid: id });
    return NextResponse.json({
      data: videodata,
      message: "Videos loaded successfully",
      success: true,
    });
  } catch (err) {
    return NextResponse.json({
      message: "Something went wrong! try again later" + err,
      success: false,
    });
  }
};
export const POST = async (req, res) => {
  await ConnectDb();
  const headerlist = await headers();
  const reqdata = await req.json();
  
  try {
    let data = AuthorizeMd(headerlist.get("token"));
    if (!data) {
      return NextResponse.json({
        message: "You are not authorized to access this route",
        status: 401,
        success: false,
      });
    }
    let videodata = await Videos.find({ folderid: reqdata.folderid });
    if (videodata.length > 0) {
      const newdata = await Videos.findOneAndUpdate(
        { folderid: reqdata.folderid },
        { $push: { content: reqdata.content } },
        { new: true }
      );
      return NextResponse.json({
        message: "Videos already added successfully",
        success: false,
      });
    } else {
      let newdata = new Videos({
        name: reqdata.name,
        folderid: reqdata.folderid,
        content: [reqdata.content], // Ensure content is an array
      });
      await newdata.save();
      return NextResponse.json({
        message: "Videos added successfully",
        success: true,
      });
    }
  } catch (err) {
    return NextResponse.json({
      message: "Something went wrong! try again later" + err,
      success: false,
    });
  }
};
