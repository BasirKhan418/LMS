const { NextResponse } = require("next/server")
import ConnectDb from "../../../../../middleware/db";
import Otp from "../../../../../models/Otp";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import Admin from "../../../../../models/Admin";
export const POST= async(req,res)=>{
  let reqdata = await req.json();
  //if type is send then send otp to email
  if(reqdata.type=="send"){
   try{
    const transporter = await nodemailer.createTransport({
      host:  process.env.NEXT_PUBLIC_EMAIL_HOST,
      port: 587,
      secure: false,
      auth: {
          user: process.env.NEXT_PUBLIC_EMAIL_USER_NAME,
          pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD,
      }
    });
    //connecting middleware for database
    await ConnectDb();
    //getting userdata from request
   
    //checking if user is registered or not
    let data = await Admin.find({email:reqdata.email});
   
    //if user is registered then send otp to email
    if(data.length>0){
      //deleting previous otp if exists
    await Otp.deleteOne({email:reqdata.email});
    //generating otp
    let otp = Math.floor(100000 + Math.random() * 900000);
    //sending otp to email
    await Otp.create({email:reqdata.email,otp:otp});
    //sending otp to email
    const info = await transporter.sendMail({
      from: '"Infotact Lms Admin Login" <account@infotactlearning.in>',
      to: `${reqdata.email}`, // list of receivers
      subject: `Your ${process.env.BRAND} Lms Admin Login OTP: Secure Access Code Inside`, // Subject line
      text: process.env.BRAND, // plain text body
      html: `
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); overflow: hidden;">
              <div style="background-color: #007bff; color: #ffffff; padding: 20px; text-align: center;">
                  <h1 style="margin: 0;">Admin Login Verification</h1>
              </div>
              <div style="padding: 20px;">
                  <p>Dear ${data[0].name},</p>
                  <p>Thank you for using our LMS. To complete your login, please use the following One-Time Password (OTP):</p>
                  <div style="font-size: 24px; font-weight: bold; color: #333333; text-align: center; margin: 20px 0;">${otp}</div>
                  <p>This OTP is valid for the next 10 minutes. Please do not share this OTP with anyone for security reasons.</p>
                  <p>If you did not request this OTP, please ignore this email.</p>
                  <p>Best regards,<br/>${process.env.BRAND} Lms Team</p>
              </div>
              <div style="background-color: #f4f4f4; color: #888888; padding: 20px; text-align: center; font-size: 14px;">
                  <p>© 2024 ${process.env.DOMAIN}, All rights reserved.</p>
                  <p>If you have any questions, contact us at <a href="mailto:${process.env.SUPPORT_EMAIL}" style="color: #007bff; text-decoration: none;">${process.env.SUPPORT_EMAIL}</a>.</p>
              </div>
          </div>
      </body>
      `,
  });
  
    
    return NextResponse.json({message:"otp sent to your email",success:true});
    }
    //if user is not registered then send message user not found
    else{
      return NextResponse.json({message:"Admin not found",success:false});
    }
    
   }
   catch(err){
    console.log(err);
    return NextResponse.json({message:"something went wrong"+err,success:false});
    
   }
  }
  //if type is verify then verify otp
  else{
   try{
    console.log(reqdata)
    let otpdata = await Otp.findOne({email:reqdata.email})
    if(otpdata==null){
      return NextResponse.json({success:false,message:"Admin not found."})
    }
    if(otpdata.otp==reqdata.otp){
      //geeting user data
      let data = await Admin.find({email:reqdata.email});
      //creating token
      let token  = jwt.sign({email:reqdata.email,id:data[0]._id,name:data[0].name},process.env.JWT_SECRET);
      //storing the token in admin
      let tokemstore = await Admin.findOneAndUpdate({email:reqdata.email},{token:token})
      return NextResponse.json({success:true,message:"Otp Validated,Login successfully...",token:token})
    }
    //if not correct
    else{
      return NextResponse.json({success:false,message:"Invalid Otp"})
    }
   }
   catch(err){
    console.log(err)
    return NextResponse.json({success:false,message:"Something went wrong please try again after sometime"})
   }
  }
    
}