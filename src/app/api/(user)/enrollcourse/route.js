import { NextResponse,NextRequest } from "next/server";
import ConnectDb from "../../../../../middleware/db";
import Enrollc from "../../../../../models/Enrollc";
import AuthorizeMd from "../../../../../middleware/AuthorizeMd";
import { headers } from "next/headers";
import ConnectRedis from "../../../../../middleware/ConnectRedis";
import nodemailer from "nodemailer";
import Courses from "../../../../../models/Courses";
import User from "../../../../../models/User";
export const POST = async (req,res) => {
    try{
        //connect to database
        await ConnectDb();
        let redis = await ConnectRedis();
        const headerlist = await headers();
        //authorize user
        let data = AuthorizeMd(headerlist.get("token"));
        if(!data.status){
            return NextResponse.json({message:"You are not authorized to access this route",status:401,success:false});
        }
        //get request data
        let reqdata = await req.json();
        //check if user is already enrolled
        let checkenroll = await Enrollc.findOne({courseid:reqdata.courseid,userid:reqdata.id});
        if(checkenroll!=null){
            return NextResponse.json({message:"You are already enrolled in this course",success:false});
        }
        //create new enrollment
        let newenroll = new Enrollc({
            courseid:reqdata.courseid,
            userid:reqdata.id,
            email:data.email,
        });
        await newenroll.save();
        let course = await Courses.findOne({_id:reqdata.courseid});
        let user = await User.findOne({_id:reqdata.id});
        //get course data
        sendMail(user,course);
        await redis.del(`user:${reqdata.email}:homeauth`);
        await redis.del(`cr:${reqdata.email}:homeauth`);
        return NextResponse.json({message:`Enrollment Successful! You have been successfully enrolled in the course: ${reqdata.title}`,success:true});

    }catch(err){
        
        return NextResponse.json({error:"Internal server error",success:false});
    }
}

//const handle send mail to user that you are enrolled in this course

const sendMail = async (user,course) => {
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
        from: '"Infotact LMS" <account@infotactlearning.in>',
        to: `${user.email}`,
        subject: `Welcome to ${process.env.BRAND}: Your Course Enrollment is Confirmed!`,
        text: `Hi ${user.name}, you're successfully enrolled in ${course.title}. Start learning today.`,
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Course Enrollment</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              background: #f1f5f9;
              font-family: 'Poppins', 'Helvetica Neue', Helvetica, Arial, sans-serif;
              color: #1f2937;
            }
            .container {
              max-width: 600px;
              margin: 30px auto;
              background: rgba(255, 255, 255, 0.9);
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
              backdrop-filter: blur(5px);
              animation: fadeIn 1s ease-in-out;
            }
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .header {
              background: linear-gradient(135deg, #6366f1, #8b5cf6);
              color: #fff;
              text-align: center;
              padding: 40px 20px 20px;
            }
            .header h1 {
              margin: 0;
              font-size: 26px;
            }
            .header p {
              margin-top: 10px;
              font-size: 16px;
            }
            .course-image {
              width: 100%;
              height: auto;
              display: block;
              border-radius: 12px;
              margin: 20px auto 0;
            }
            .content {
              padding: 30px 25px;
            }
            .content h2 {
              font-size: 22px;
              margin: 20px 0 10px;
              text-align: center;
              color: #111827;
            }
            .content p {
              font-size: 16px;
              color: #4b5563;
              line-height: 1.6;
              text-align: center;
              margin-bottom: 20px;
            }
            .user-info {
              margin: 30px 0 0;
              padding: 20px;
              background: #f9fafb;
              border-radius: 10px;
              font-size: 14px;
              color: #374151;
            }
            .user-info p {
              margin: 8px 0;
            }
            .cta {
              text-align: center;
              margin-top: 30px;
            }
            .cta a {
              display: inline-block;
              background: #4f46e5;
              color: white;
              padding: 12px 30px;
              border-radius: 8px;
              text-decoration: none;
              font-weight: 600;
              font-size: 16px;
            }
            .footer {
              text-align: center;
              padding: 20px;
              font-size: 12px;
              color: #9ca3af;
              margin-top: 30px;
            }
            @media (max-width: 600px) {
              .header h1 {
                font-size: 22px;
              }
              .content h2 {
                font-size: 20px;
              }
              .content p, .user-info p {
                font-size: 14px;
              }
              .cta a {
                width: 100%;
                box-sizing: border-box;
                margin-top: 15px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome, ${user.name}!</h1>
              <p>You're officially enrolled 🚀</p>
            </div>
    
            <img class="course-image" src="${course.img}" alt="Course Image">
    
            <div class="content">
              <h2>${course.title}</h2>
              <p>${course.desc|| "Get ready to dive deep into learning and unlock new opportunities!"}</p>
    
              <div class="user-info">
                <p><strong>Name:</strong> ${user.name}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Enrollment Date:</strong> ${new Date().toLocaleDateString()}</p>
              </div>
    
              <div class="cta">
                <a href="${process.env.PLATFORM_URL}/course">Start Learning</a>
              </div>
            </div>
    
            <div class="footer">
              &copy; ${new Date().getFullYear()} ${process.env.BRAND}. All rights reserved.
            </div>
          </div>
        </body>
        </html>
        `,
    });
    
    }
    catch(err){
        console.log(err);
    }
}