import { NextResponse,NextRequest } from "next/server";
import ConnectDb from "../../../../../middleware/db";
import Admin from "../../../../../models/Admin";
import { headers } from "next/headers";
import AuthorizeMd from "../../../../../middleware/AuthorizeMd";
import nodemailer from "nodemailer";
//getting all admins
export const GET = async (req) => {
    try{
    await ConnectDb()
    const headersList = await headers()
    const token = headersList.get("authorization")
    const auth = await AuthorizeMd(token)
    if(!auth.status){
        return NextResponse.json({message:"Unauthorized",success:false},{status:401})
    }
    const admins = await Admin.find({}).sort({createdAt:1})
    if(!admins){
        return NextResponse.json({message:"No admins found",success:false},{status:404})
    }
    return NextResponse.json({admins,success:true},{status:200})
    }
    catch(err){
        return NextResponse.json({message:err.message,success:false},{status:500})
    }
}

//creating an admin

export const POST = async(req) => {
    try{
     await ConnectDb()
        const headersList = await headers()
        const token = headersList.get("authorization")
        const auth = await AuthorizeMd(token)
        if(!auth.status){
            return NextResponse.json({message:"Unauthorized",success:false},{status:401})
        }
        const body = await req.json()
        const {username,email,name} = body
        if(!username || !email || !name ){
            return NextResponse.json({message:"Please fill all the fields",success:false},{status:400})
        }
        let newAdmin = new Admin({
            username,
            email,
            name,
            password: "12345678",
        })
        await newAdmin.save()
        SendEmail(email,name)
        return NextResponse.json({message:"Admin created successfully",success:true},{status:201})
    }
catch(err){
        return NextResponse.json({message:err.message,success:false},{status:500})
    }
}
//updating an admin

export const PUT = async(req) => {
    try{
await ConnectDb()
        const headersList = await headers()
        const token = headersList.get("authorization")
        const auth = await AuthorizeMd(token)
        if(!auth.status){
            return NextResponse.json({message:"Unauthorized",success:false},{status:401})
        }
        const body = await req.json()
        const {username,email,name,id} = body
        if(!username || !email || !name || !id){
            return NextResponse.json({message:"Please fill all the fields",success:false},{status:400})
        }
        let updatedAdmin = await Admin.findByIdAndUpdate(id,{
            username,
            email,
            name,
        })
        if(!updatedAdmin){
            return NextResponse.json({message:"Admin not found",success:false},{status:404})
        }
        return NextResponse.json({message:"Admin updated successfully",success:true},{status:200})
    }
    catch(err){
        return NextResponse.json({message:err.message,success:false},{status:500})
    }
}
//delete an admin

export const DELETE = async(req) => {
    try{
        await ConnectDb()
        const headersList = await headers()
        const token = headersList.get("authorization")
        const auth = await AuthorizeMd(token)
        if(!auth){
            return NextResponse.json({message:"Unauthorized",success:false},{status:401})
        }
        const body = await req.json()
        const {id} = body
        if(!id){
            return NextResponse.json({message:"Please provide an id",success:false},{status:400})
        }
        let deletedAdmin = await Admin.findByIdAndDelete(id)
        if(!deletedAdmin){
            return NextResponse.json({message:"Admin not found",success:false},{status:404})
        }
        return NextResponse.json({message:"Admin deleted successfully",success:true},{status:200})
    }
    catch(err){
        return NextResponse.json({message:err.message,success:false},{status:500})
    }
}

//send email code

const SendEmail = async (email, name) => {
    try {
      const transporter = await nodemailer.createTransport({
        host: process.env.NEXT_PUBLIC_EMAIL_HOST,
        port: 587,
        secure: false,
        auth: {
          user: process.env.NEXT_PUBLIC_EMAIL_USER_NAME,
          pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD,
        },
      });
  
      const info = await transporter.sendMail({
        from: '"Infotact LMS Credentials" <account@infotactlearning.in>',
        to: `${email}`,
        subject: `🔐 Admin Access Granted | ${process.env.BRAND} LMS Login Details`,
        text: `${process.env.BRAND} LMS - You’ve been granted admin access. Login using the provided link and secure OTP.`,
        html: `
          <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: auto; font-family: 'Segoe UI', sans-serif; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
              <div style="background-color: #dc3545; padding: 30px 20px; text-align: center; color: white;">
                <h2 style="margin: 0;">🔐 Admin Access Granted</h2>
                <p style="margin: 5px 0 0;">Welcome to the Control Panel</p>
              </div>
              <div style="padding: 30px; color: #333;">
                <p>Hi <strong>${name}</strong>,</p>
                <p>We’re excited to let you know that you have been <strong>granted Admin Access to the ${process.env.BRAND} LMS Platform</strong>.</p>
  
                <p>You now have full administrative privileges within <strong>${process.env.BRAND}</strong>.</p>
  
                <p>To proceed, click the button below to login. Use your email address (<strong>${email}</strong>) and a secure One-Time Password (OTP) will be sent to you to complete the login process.</p>
  
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.ADMIN_LOGIN_URL || 'https://infotactlearning.in/login'}" target="_blank" style="background-color: #0d6efd; color: white; padding: 14px 28px; text-decoration: none; font-weight: 600; border-radius: 6px; display: inline-block;">Login to Admin Panel</a>
                </div>
  
                <p><strong>Security Note:</strong> An OTP will be sent to your email every time you log in. The OTP is valid for 10 minutes. Please do not share this with anyone.</p>
  
                <p style="margin-top: 30px;">We’re glad to have you onboard as an administrator.<br/>- ${process.env.BRAND} LMS Team</p>
              </div>
  
              <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 13px; color: #999;">
                <p>&copy; 2025 ${process.env.DOMAIN}. All rights reserved.</p>
                <p>Need help? Contact us at <a href="mailto:${process.env.SUPPORT_EMAIL}" style="color: #0d6efd; text-decoration: none;">${process.env.SUPPORT_EMAIL}</a></p>
              </div>
            </div>
          </body>
        `,
      });
  
      
    } catch (err) {
      console.log(err);
    }
  };
  