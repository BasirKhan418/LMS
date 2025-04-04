import { NextResponse,NextRequest } from "next/server";
import Batch from "../../../../../models/Batch";
import Trainer from "../../../../../models/Trainer";
import { headers } from "next/headers";
import ConnectDb from "../../../../../middleware/db";
import AuthorizeMd from "../../../../../middleware/AuthorizeMd";
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
        console.log(error);
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
            console.log(searchunique);
            if(searchunique!=null){
                return NextResponse.json({message:"Trainer already exists",status:400,success:false})
            }
        
            let trainers = new Trainer({
                name:reqdata.name,
                email:reqdata.email,
                phone:reqdata.phone,
                batches:reqdata.batches,
            })
            await trainers.save();
            return NextResponse.json({message:"Trainers created successfully",status:200,success:true})
    }
catch(error){
        console.log(error);
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
        console.log(reqdata);
        let trainers = await Trainer.findByIdAndUpdate(reqdata._id,{
            name:reqdata.name,
            email:reqdata.email,
            phone:reqdata.phone,
            batches:reqdata.batches,
        },{new:true});
        return NextResponse.json({message:"Trainers updated successfully",status:200,success:true})

    }
    catch(error){
        console.log(error);
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
        console.log(reqdata._id);   
        let trainers = await Trainer.findByIdAndDelete(reqdata._id);
        return NextResponse.json({message:"Trainers deleted successfully",status:200,success:true})
    }
    catch(err){
        console.log(err);
        return NextResponse.json({success:false,message:"Something went wrong please try again later"})
    }
}