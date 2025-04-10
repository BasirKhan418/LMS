import { NextResponse,NextRequest } from "next/server";
import Batch from "../../../../../models/Batch";
import { headers } from "next/headers";
import AuthorizeMd from "../../../../../middleware/AuthorizeMd";

export const GET = async () => {
try{
let headersList = await headers();
let auth = headersList.get('authorization');
console.log(auth);
let data = await AuthorizeMd(auth);
console.log(data);
if(!data.status){
    return NextResponse.json({message:"You are not authorized",status:data.status,success:false});
}
let batch = await Batch.find({});
if(!batch){
    return NextResponse.json({message:"No Batch Found",status:404,success:false});
}
return NextResponse.json({message:"Batch Found",status:200,success:true,data:batch});
}
catch(err){
    return NextResponse.json({message:"Internal Server Error",status:500,success:false});
};
}