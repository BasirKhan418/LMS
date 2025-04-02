import { NextResponse } from "next/server";
import ConnectDb from "../../../../middleware/db";
import Users from "../../../../models/Users";
import { headers } from "next/headers";
import AuthorizeMd from "../../../../middleware/AuthorizeMd";
export const POST = async (req) => {
  const header = await headers();
  await ConnectDb();
  const reqdata = await req.json();
  try {
    let res = AuthorizeMd(header.get("token"));
    //if jwt verified
    if (res) {
      const update = await Users.updateOne(
        { email: reqdata.email },
        {
          name: reqdata.name,
          github: reqdata.github,
          bio: reqdata.bio,
          linkedin: reqdata.linkedin,
        }
      );
      return NextResponse.json({
        success: true,
        message: "Profile updated successfully !",
      });
    }
    //else unauthorized access
    else {
      return NextResponse.json({
        success: false,
        message: "Unauthorized access not allowed for this endpoint dear user!",
      });
    }
   
  } catch (err) {
    return NextResponse.json({
      success: false,
      message: "Something went wrong please try again later !",
    });
  }
};
