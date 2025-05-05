import { NextResponse,NextRequest } from "next/server";
import Batch from "../../../../../models/Batch";
import Trainer from "../../../../../models/Trainer";
import { headers } from "next/headers";
import ConnectDb from "../../../../../middleware/db";
import AuthorizeMd from "../../../../../middleware/AuthorizeMd";
import nodemailer from "nodemailer";
export const GET = async()=>{
    try{
await ConnectDb();
        const headerlist = await headers();
        let data = AuthorizeMd(headerlist.get("Authorization"));
        if(!data){
            return NextResponse.json({message:"You are not authorized to access this route",status:401,success:false})
        }
        let trainers = await Trainer.find({}).sort({createdAt:-1});
        let batch = await Batch.find({}).sort({createdAt:-1});
        return NextResponse.json({message:"Trainers fetched successfully",status:200,success:true,trainers,batch})
    }
    catch(error){
        
        return NextResponse.json({success:false,message:"Something went wrong please try again later"})
    }
}
//create trainers

export const POST = async(req,res)=>{
    try{
  await ConnectDb();
  let headerlist = await headers();
    let data = AuthorizeMd(headerlist.get("Authorization"));
            if(!data){
                return NextResponse.json({message:"You are not authorized to access this route",status:401,success:false})
            }
            const reqdata = await req.json();
            const searchunique = await Trainer.findOne({email:reqdata.email});
            
            if(searchunique!=null){
                return NextResponse.json({message:"Trainer already exists",status:400,success:false})
            }
        
            let trainers = new Trainer({
                name:reqdata.name,
                email:reqdata.email,
                phone:reqdata.phone,
                batches:reqdata.batches,
                token:"sampletpken"
            })
            await trainers.save();
            SendEmail(reqdata.email,reqdata.name);
            return NextResponse.json({message:"Trainers created successfully",status:200,success:true})
    }
catch(error){
        
        return NextResponse.json({success:false,message:"Something went wrong please try again later"})
    }
}

//update trainer detrails
export const PUT = async(req,res)=>{
    try{
        await ConnectDb();
const headerlist = await headers();
const data = AuthorizeMd(headerlist.get("Authorization"));
        if(!data){
            return NextResponse.json({message:"You are not authorized to access this route",status:401,success:false})
        }
        const reqdata = await req.json();
      
        let trainers = await Trainer.findByIdAndUpdate(reqdata._id,{
            name:reqdata.name,
            email:reqdata.email,
            phone:reqdata.phone,
            batches:reqdata.batches,
        },{new:true});
        return NextResponse.json({message:"Trainers updated successfully",status:200,success:true})

    }
    catch(error){
        
        return NextResponse.json({success:false,message:"Something went wrong please try again later"})
    }
}
//delete trainer
export const DELETE = async(req,res)=>{
    try{
    await ConnectDb();
    const headerlist = await headers();
    const data = AuthorizeMd(headerlist.get("Authorization"));
        if(!data){
            return NextResponse.json({message:"You are not authorized to access this route",status:401,success:false})
        }
        const reqdata = await req.json();
          
        let trainers = await Trainer.findByIdAndDelete(reqdata._id);
        return NextResponse.json({message:"Trainers deleted successfully",status:200,success:true})
    }
    catch(err){
       
        return NextResponse.json({success:false,message:"Something went wrong please try again later"})
    }
}


const SendEmail = async(email,name)=>{
try{
const transporter = await nodemailer.createTransport({
      host: process.env.NEXT_PUBLIC_EMAIL_HOST,
      port: 587,
      secure: false,
      auth: {
          user: process.env.NEXT_PUBLIC_EMAIL_USER_NAME,
          pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD,
      }
    });
    const info = await transporter.sendMail({
        from: '"Infotact LMS Credentials" <account@infotactlearning.in>',
        to: `${email}`,
        subject: `🎉 Welcome Trainer | ${process.env.BRAND} LMS Login Access`,
        text: `${process.env.BRAND} LMS - You’ve been granted trainer access. Login using the link and OTP.`,
        html: `
        <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: auto; font-family: 'Segoe UI', sans-serif; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
            <div style="background-color: #198754; padding: 30px 20px; text-align: center; color: white;">
              <h2 style="margin: 0;">🎉 Congratulations!</h2>
              <p style="margin: 5px 0 0;">Trainer Access Granted</p>
            </div>
            <div style="padding: 30px; color: #333;">
              <p>Hi <strong>${name}</strong>,</p>
              <p>We’re excited to let you know that you have been <strong>granted access to the ${process.env.BRAND} LMS Training Panel</strong> by the admin.</p>
              
              <p>You are now officially a <strong>Trainer</strong> at <strong>${process.env.BRAND}</strong> 🎓</p>
      
              <p>To proceed, click the button below to login. Use this email (<strong>${email}</strong>) and you will receive a One-Time Password (OTP) to complete the secure login process.</p>
      
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.LOGIN_URL || 'https://infotactlearning.in/login'}" target="_blank" style="background-color: #0d6efd; color: white; padding: 14px 28px; text-decoration: none; font-weight: 600; border-radius: 6px; display: inline-block;">Login to Training Panel</a>
              </div>
      
              <p><strong>Note:</strong> An OTP will be sent to your email each time you log in. The OTP is valid for 10 minutes and should not be shared with anyone.</p>
      
              <p style="margin-top: 30px;">Welcome aboard, Trainer!<br/>- ${process.env.BRAND} LMS Team</p>
            </div>
      
            <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 13px; color: #999;">
              <p>&copy; 2025 ${process.env.DOMAIN}. All rights reserved.</p>
              <p>Need help? Contact us at <a href="mailto:${process.env.SUPPORT_EMAIL}" style="color: #0d6efd; text-decoration: none;">${process.env.SUPPORT_EMAIL}</a></p>
            </div>
          </div>
        </body>
        `,
      });
      
      console.log("Message sent: %s", info.messageId);
      
      
}
catch(err){
    console.log(err);
}
}