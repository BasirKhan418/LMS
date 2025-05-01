import User from "../../../../../models/User";
import ConnectDb from "../../../../../middleware/db";
import { headers } from "next/headers";
import Result from "../../../../../models/Result";
import AuthorizeMd from "../../../../../middleware/AuthorizeMd";
import { NextResponse } from "next/server";
import Batch from "../../../../../models/Batch";
export const GET = async()=>{
    try{
     const headerlist = await headers()
        const token = headerlist.get("authorization")
        const auth = await AuthorizeMd(token)
        if(!auth.status){
            return NextResponse.json({success:false,message:"Unauthorized"})
        }
        await ConnectDb()
        const results = await Result.find({}).populate("batchid").populate("users")
        console.log(results)
        if(results.length==0){
            console.log("No results found")
            return NextResponse.json({success:false,message:"No results found"})
        }
        console.log("Results fetched successfully")
        return NextResponse.json({success:true,results:results})
    }
    catch(err){
        return NextResponse.json({success:false,message:"Something went wrong"})
    }
}

//post for creating results

export const POST = async(req)=>{
    try{
        const headerlist = await headers()
        const token = headerlist.get("authorization")
        const auth = await AuthorizeMd(token)
        if(!auth.status){
            return NextResponse.json({success:false,message:"Unauthorized"})
        }
        await ConnectDb()
        const {batchid} = await req.json()
        const findbatch = await Batch.findById(batchid);
        if(!findbatch){
            return NextResponse.json({success:false,message:"Batch not found"})
        }
        const findduration = await Result.find({batchid:batchid}).sort({createdAt:-1})
       const startDate= new Date(findbatch.date);
              // Get the batch date and remove time component
                      const batchDate = new Date(findbatch.date);
                      batchDate.setHours(0, 0, 0, 0);
                      
                      // Query users with exactly matching startdate (only compare date, not time)
                      const users = await User.aggregate([
                          {
                              $addFields: {
                                  startdateWithoutTime: {
                                      $dateToString: { format: "%Y-%m-%d", date: "$startdate" }
                                  },
                                  batchDateWithoutTime: {
                                      $dateToString: { format: "%Y-%m-%d", date: batchDate }
                                  }
                              }
                          },
                          {
                              $match: {
                                  startdateWithoutTime: { $eq: batchDate.toISOString().split('T')[0] },
                                  domain: findbatch.domain,
                                  ispaid: true
                              }
                          },
                          {
                              $sort: { createdAt: -1 }
                          }
                      ]);
                      console.log(users[0]);
        if(users.length==0){
            return NextResponse.json({success:false,message:"No users found"})
        }
        // Function to extract the numeric part from the month string
function extractMonthNumber(monthStr) {
    // Extract the first numeric value from the string
    const match = monthStr.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }
  
  // Sort the array based on the month parameter
  const sortedArr = users.sort((a, b) => {
    const monthA = extractMonthNumber(a.month);
    const monthB = extractMonthNumber(b.month);
    
    return monthA - monthB; // For ascending order (1 Month, 2 Months, 3 Months)
  });
  const newarr = [];
  //filter users based on month and duration
  if(findduration.length==0){
    sortedArr.map((item)=>{
        newarr.push(item._id)
       })
  }
  else if (findduration.length==1){
    let filter = sortedArr.filter((item)=>{
        return item.month!=findduration[0].duration
    })
    filter.map((item)=>{
        newarr.push(item._id)
       })
  }
  else if (findduration.length==2){
    let filter = sortedArr.filter((item)=>{
        return item.month!=findduration[0].duration && item.month!=findduration[1].duration
    })
    filter.map((item)=>{
        newarr.push(item._id)
       })
  }
  else if (findduration.length==3){
    let filter = sortedArr.filter((item)=>{
        return item.month!=findduration[0].duration && item.month!=findduration[1].duration && item.month!=findduration[2].duration
    })
    filter.map((item)=>{
        newarr.push(item._id)
       })
  }
  else{
    return NextResponse.json({success:false,message:"You have already created results for this batch maximum 3 times. Please contact developer for more information"})
  }
  
  console.log(sortedArr);
        
        
        const result =new Result({
            batchid:batchid,
            status:"pending",
            duration:findduration.length==0?"1 Month":`${findduration.length+1} Months`,
            users:newarr,
        })
        await result.save()

        return NextResponse.json({success:true,message:"Result created successfully"})
        
    }
    catch(err){
        console.log(err)
        return NextResponse.json({success:false,message:"Something went wrong"})
    }
}

