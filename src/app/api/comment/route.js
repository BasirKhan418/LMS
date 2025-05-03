import { NextResponse } from "next/server";
import ConnectDb from "../../../../middleware/db";
import AuthorizeMd from "../../../../middleware/AuthorizeMd";
import { headers } from "next/headers";
import Comment from "../../../../models/Comment";
import ConnectRedis from "../../../../middleware/ConnectRedis";
export const GET = async (req) => {
await ConnectDb();
let redis = await ConnectRedis();
const headerlist = await headers();
const { searchParams } = new URL(req.url);
const id = searchParams.get('id');
try{
let a  = AuthorizeMd(headerlist.get("token"));
if(!a){
return NextResponse.json({message:"You are not authorized to access this route",status:401,success:false})
}
//fetching conmmnets from redis
let cdata = await redis.get(`comment:${id}`);
if(cdata){
let data = JSON.parse(cdata);
return NextResponse.json({data:data,message:"Comment loaded successfully",success:true})
}
//fetching from db
let data = await Comment.findOne({name:id});
await redis.set(`comment:${id}`,JSON.stringify(data),{EX:300});
return NextResponse.json({data:data,message:"Comment loaded successfully",success:true})
}
catch(err){
return NextResponse.json({message:"Something went wrong! try again later",success:false})
}
}
export const POST = async (req) => {
await ConnectDb();
let redis = await ConnectRedis();
const headerlist = await headers();
const reqdata = await req.json();
try{
let a  = AuthorizeMd(headerlist.get("token"));
if(!a){
return NextResponse.json({message:"You are not authorized to access this route",status:401,success:false})

}
let data = await Comment.findOne({name:reqdata.name});
if(data!=null){
let newdata = await Comment.findOneAndUpdate({name:reqdata.name},{$push:{comment:reqdata.comment}},{new:true});
let val = await redis.get(`comment:${reqdata.name}`);
if(val){
await redis.del(`comment:${reqdata.name}`);
}
return NextResponse.json({message:"Comment added successfully",success:true,data:newdata})
}
else{
let newdata = new Comment({name:reqdata.name,comment:[reqdata.comment],img:reqdata.img});
await newdata.save();
return NextResponse.json({message:"Comment added successfully",success:true})
}
}
catch(err){
   
return NextResponse.json({message:"Something went wrong! try again later",success:false})
}
}