import ConnectDb from "../../../../../middleware/db"
import { NextResponse } from "next/server"
import Assignments from "../../../../../models/Assignments"
import { headers } from "next/headers"
import AuthorizeMd from "../../../../../middleware/AuthorizeMd"
import ConnectRedis from "../../../../../middleware/ConnectRedis"
export const GET = async (req, res) => {
    await ConnectDb()
    let client = await ConnectRedis();
    let headerlist = await headers()
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
try{
let a = AuthorizeMd(headerlist.get("token"));
if(!a){
    return NextResponse.json({message:"Unauthorized route cant handle request",status: "401",success:false });
}
let assdata= await client.get(`assignment:${id}`);
if(assdata){
    let data = JSON.parse(assdata);
    return NextResponse.json({message:"Successfully assignment fetched",status: "200",data:data ,success:true});
}
let assignment = await Assignments.find({_id:id});
await client.set(`assignment:${id}`,JSON.stringify(assignment),{EX:300});
return NextResponse.json({message:"Successfully assignment fetched",status: "200",data:assignment ,success:true});
}
catch(err){
    return NextResponse.json({message:"Some thing went wrong please try again after some time",status: "401",success:false });
}
}
export const POST = async (req, res) => {
    await ConnectDb()
    let client = await ConnectRedis();
    let headerlist = await headers();
try{
let a = AuthorizeMd(headerlist.get("token"));
if(!a){
    return NextResponse.json({message:"Unauthorized route cant handle request",status: "401",success:false });
}
let assdata = client.get(`assignment:${id}`);
if(assdata){
    let data = JSON.parse(assdata);
    return NextResponse.json({message:"Successfully assignment fetched",status: "200",data:data ,success:true});
}
let assignment = await Assignments.find({_id:id});
await client.set(`assignment:${id}`,JSON.stringify(assignment),{EX:600});
return NextResponse.json({message:"Successfully assignment fetched",status: "200",data:assignment ,success:true});
}
catch(err){
    return NextResponse.json({message:"Some thing went wrong please try again after some time",status: "401",success:false });
}
}