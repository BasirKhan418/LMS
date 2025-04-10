import { NextResponse,NextRequest } from "next/server";
import Batch from "../../../../../models/Batch";
import { headers } from "next/headers";
import AuthorizeMd from "../../../../../middleware/AuthorizeMd";
import ConnectDb from "../../../../../middleware/db";
import User from "../../../../../models/User";
import Team from "../../../../../models/Team";
export const GET = async () => {
try{
    await ConnectDb();
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

//post request create team formation
export const POST = async (req) => {
    try {
        await ConnectDb();
        let headersList = await headers();
        let auth = headersList.get('authorization');
        let data = await AuthorizeMd(auth);
        if (!data.status) {
            return NextResponse.json({message: "You are not authorized", status: data.status, success: false});
        }

        const reqdata = await req.json();
        const findbatch = await Batch.findById(reqdata.batchid);
        if (!findbatch) {
            return NextResponse.json({message: "Batch not found", status: 404, success: false});
        }

        const startDate = new Date(findbatch.date);
        const users = await User.find({
            startdate: {$gte: startDate},
            domain: findbatch.domain,
            ispaid: true
        }).sort({createdAt: -1});

        if (users.length == 0) {
            return NextResponse.json({message: "No users found", status: 404, success: false});
        }

        // Separate users by month duration
        const oneMonth = users.filter(user => user.month == "1 Month");
        const twoMonth = users.filter(user => user.month == "2 Months");
        const threeMonth = users.filter(user => user.month == "3 Months");
        const fourMonth = users.filter(user => user.month == "4 Months");

        const teamSize = reqdata.teamSize;
        const allTeams = [];
        let teamCount = 1;

        // Function to create teams for a specific month group
        const createTeamsForMonthGroup = (monthUsers, monthLabel) => {
            const numTeams = Math.floor(monthUsers.length / teamSize);
            
            // Create complete teams
            for (let i = 0; i < numTeams; i++) {
                const teamMembers = monthUsers.slice(i * teamSize, (i + 1) * teamSize);
                const memberIds = teamMembers.map(user => user._id);
                
                const team = {
                    teamname: `${findbatch.name} Team ${teamCount}`,
                    batchid: findbatch._id,
                    teamleaderid: teamMembers[0]._id,
                    team: memberIds,
                    month: monthLabel
                };
                
                allTeams.push(team);
                teamCount++;
            }
            
            // Handle leftover users
            const leftoverCount = monthUsers.length % teamSize;
            if (leftoverCount > 0) {
                const leftoverUsers = monthUsers.slice(numTeams * teamSize);
                const leftoverIds = leftoverUsers.map(user => user._id);
                
                const team = {
                    teamname: `${findbatch.name} Team ${teamCount}`,
                    batchid: findbatch._id,
                    teamleaderid: leftoverUsers[0]._id,
                    team: leftoverIds,
                    month: monthLabel
                };
                
                allTeams.push(team);
                teamCount++;
            }
        };

        // Create teams for each month duration group
        if (oneMonth.length > 0) {
            createTeamsForMonthGroup(oneMonth, "1 Month");
        }
        
        if (twoMonth.length > 0) {
            createTeamsForMonthGroup(twoMonth, "2 Months");
        }
        
        if (threeMonth.length > 0) {
            createTeamsForMonthGroup(threeMonth, "3 Months");
        }
        
        if (fourMonth.length > 0) {
            createTeamsForMonthGroup(fourMonth, "4 Months");
        }
        let createTeam = await Team.insertMany(allTeams);
        if (!createTeam) {
            return NextResponse.json({message: "Team Creation Failed", status: 400, success: false});
        }
        const updateBatch = await Batch.findByIdAndUpdate(findbatch._id, {isteamcreated:true});
        return NextResponse.json({
            message: "Team Created Successfully",
            status: 200,
            success: true,
        });
       
        
    } catch (err) {
        console.log(err);
        return NextResponse.json({message: "Internal Server Error", status: 500, success: false});
    }
}