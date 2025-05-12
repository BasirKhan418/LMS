import { NextResponse } from "next/server";
import ConnectDb from "../../../../../middleware/db";
import AuthorizeMd from "../../../../../middleware/AuthorizeMd";
import { headers } from "next/headers";
import SubmittedAssignments from "../../../../../models/SubmittedAssignments";
import Enrollc from "../../../../../models/Enrollc";
import Assignments from "../../../../../models/Assignments";
import Admin from "../../../../../models/Admin";
export const GET = async (req, res) => {
  await ConnectDb();
  const headerList = await headers();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  try {
    let a = AuthorizeMd(headerList.get("token"));
    if (!a) {
      return NextResponse.json({ success: false, message: "You are not authorized to access this route", status: 401 });
    }

    let assdata = await SubmittedAssignments.find({ crid: id });
    if (!assdata) {
      return NextResponse.json({ success: false, message: "No data found", status: 404 });
    }

    let aspop = await Assignments.populate(assdata, { path: "asid" });
    let realdata = await Enrollc.populate(aspop, { path: "userid" });

    return NextResponse.json({ success: true, message: "Data loaded successfully", status: 200, data: realdata });
  } catch (err) {
    return NextResponse.json({ success: false, message: "Something went wrong! Try again later. " + err.message, status: 500 });
  }
};

export const POST = async (req, res) => {
    await ConnectDb();
    const headerList = await headers();
    let reqData = await req.json();
    try {
      let a = AuthorizeMd(headerList.get("token"));
      if (!a) {
        return NextResponse.json({ success: false, message: "You are not authorized to access this route", status: 401 });
      }
      let admin = await Admin.findOne({ email:a.email });
          if (admin == null) {
            return NextResponse.json({
              message: "You are not authorized to access this route",
              status: 401,
              success: false,
            });
          }
      let upadate = await SubmittedAssignments.findByIdAndUpdate({_id:reqData.id},{marks:reqData.marks,status:"evaluated"},{new:true});
        return NextResponse.json({ success: true, message: "Data Updated SuccessFully", status: 200, data: upadate });
    } catch (err) {
      
      return NextResponse.json({ success: false, message: "Something went wrong! Try again later. " + err.message, status: 500 });
    }
};
