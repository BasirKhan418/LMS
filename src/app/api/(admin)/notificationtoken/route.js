import { NextResponse } from "next/server";
import ConnectDb from "../../../../../middleware/db";
import NotificationToken from "../../../../../models/NotificationToken";
import { headers } from "next/headers";
import AuthorizeMd from "../../../../../middleware/AuthorizeMd";

export const GET = async (req, res) => {
  await ConnectDb();
  const headerList = await headers();
  try {
    let a = AuthorizeMd(headerList.get("token"));
    if (!a) {
      return NextResponse.json({ message: "Unauthorized access not allowed", status: false });
    }
    
    let data = await NotificationToken.find({});
    return NextResponse.json({ data: data, success: true, message: "Notification token fetched successfully" });
  } catch (err) {
    return NextResponse.json({ message: "Error in fetching notification token", status: false });
  }
};

export const POST = async (req, res) => {
  await ConnectDb();
  const headerList = await headers();
  const reqdata = await req.json();
    try {
        let a = AuthorizeMd(headerList.get("token"));
        if (!a) {
          return NextResponse.json({ message: "Unauthorized access not allowed", success: false });
        }
      
        const existingData = await NotificationToken.findOne({ crid: reqdata.crid });
      
        if (existingData) {
          if (!existingData.token.includes(reqdata.token)) {
            existingData.token.push(reqdata.token);
            // Ensure no duplicates by converting to Set and back to array
            existingData.token = Array.from(new Set(existingData.token));
            await existingData.save();
          }
          return NextResponse.json({ data: existingData, success: true, message: "Notification token updated successfully" });
        } else {
          let data = new NotificationToken(reqdata);
          // Ensure no duplicates in the new data
          data.token = Array.from(new Set(data.token));
          await data.save();
          return NextResponse.json({ data: data, success: true, message: "Notification token saved successfully" });
        }
      } catch (err) {
        return NextResponse.json({ message: "Error in saving notification token", success: false, err: err });
      }    
};
