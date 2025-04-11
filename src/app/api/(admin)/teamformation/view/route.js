import { NextResponse,NextRequest } from "next/server";
import ConnectDb from "../../../../../../middleware/db";
import Team from "../../../../../../models/Team";
import AuthorizeMd from "../../../../../../middleware/AuthorizeMd";
import { headers } from "next/headers";
export const POST = async (req) => {
    try{
await ConnectDb();
let headersList = await headers();
let auth = headersList.get('authorization');
let data = await AuthorizeMd(auth);
if(!data.status){
    return NextResponse.json({message:"You are not authorized",status:data.status,success:false});
}
let reqdata = await req.json();
const fetchdata = await Team.find({batchid:reqdata.batchid}).populate("batchid").populate("teamleaderid").populate("team");
// Natural sort for team names with numbers
const sortedByTeamName = fetchdata.sort((a, b) => {
    // Extract the text and number parts
    const aMatch = a.teamname.match(/^(.*?)(\d*)$/);
    const bMatch = b.teamname.match(/^(.*?)(\d*)$/);
    
    if (!aMatch || !bMatch) return a.teamname.localeCompare(b.teamname);
    
    const [, aText, aNum] = aMatch;
    const [, bText, bNum] = bMatch;
    
    // Compare text parts first
    const textComparison = aText.localeCompare(bText);
    if (textComparison !== 0) return textComparison;
    return parseInt(aNum || 0) - parseInt(bNum || 0);
  });
if(!fetchdata){
    return NextResponse.json({message:"No Team Found",status:404,success:false});
}
return NextResponse.json({message:"Team Found",status:200,success:true,data:fetchdata});
    }
    catch(err){
        console.log(err);
        return NextResponse.json({message:"Internal Server Error",status:500,success:false});
    }
}