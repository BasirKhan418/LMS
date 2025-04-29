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

export const PUT = async (req) => {
    try {
        await ConnectDb();
        let headersList = await headers();
        let auth = headersList.get('authorization');
        let data = await AuthorizeMd(auth);
        
        if (!data.status) {
            return NextResponse.json({
                message: "You are not authorized", 
                status: data.status, 
                success: false
            });
        }

        // Get request data
        const reqData = await req.json();
        const { teamId, memberId, isTeamLeader, originalTeamId, swapMemberId } = reqData;
        
        if (!teamId || !memberId) {
            return NextResponse.json({
                message: "Team ID and Member ID are required", 
                status: 400, 
                success: false
            });
        }

        // Find the original team where the member exists
        const oldTeam = await Team.findById(originalTeamId);
        if (!oldTeam) {
            return NextResponse.json({
                message: "Original team not found", 
                status: 404, 
                success: false
            });
        }

        // Find the target team
        const newTeam = await Team.findById(teamId);
        if (!newTeam) {
            return NextResponse.json({
                message: "Target team not found", 
                status: 404, 
                success: false
            });
        }

        // If moving to a different team
        if (originalTeamId.toString() !== teamId.toString()) {
            // 1. Remove the moving member from old team
            oldTeam.team = oldTeam.team.filter(member => 
                member.toString() !== memberId.toString()
            );
            
            // 2. Handle the swap if a specific member was selected
            if (swapMemberId) {
                // Remove the selected swap member from the new team
                newTeam.team = newTeam.team.filter(member => 
                    member.toString() !== swapMemberId.toString()
                );
                
                // Add the swap member to the old team
                oldTeam.team.push(swapMemberId);
                
                // If the swap member was the team leader of the new team, assign a new leader
                if (newTeam.teamleaderid.toString() === swapMemberId.toString()) {
                    // If there are remaining members, pick one as the new leader
                    if (newTeam.team.length > 0) {
                        const randomIndex = Math.floor(Math.random() * newTeam.team.length);
                        newTeam.teamleaderid = newTeam.team[randomIndex];
                    } else {
                        // If no members left (unlikely), the moving member will become leader
                        newTeam.teamleaderid = memberId;
                    }
                }
            }
            
            // 3. If the moving member was team leader of old team, assign a new leader
            if (oldTeam.teamleaderid.toString() === memberId.toString() && oldTeam.team.length > 0) {
                // Pick a random member from the remaining team to be the new leader
                const randomIndex = Math.floor(Math.random() * oldTeam.team.length);
                oldTeam.teamleaderid = oldTeam.team[randomIndex];
            }
            
            // 4. Add the moving member to new team
            newTeam.team.push(memberId);
            
            // If old team becomes empty, delete it
            if (oldTeam.team.length === 0) {
                await Team.findByIdAndDelete(oldTeam._id);
            } else {
                await oldTeam.save();
            }
        }

        // Handle team leader status in the new/current team
        if (isTeamLeader) {
            // If this member will be the new team leader
            newTeam.teamleaderid = memberId;
        } else if (newTeam.teamleaderid.toString() === memberId.toString()) {
            // If this member is currently the team leader but should no longer be
            // We need to assign a new team leader
            if (newTeam.team.length > 1) {
                // Get all members except the current one
                const otherMembers = newTeam.team.filter(member => 
                    member.toString() !== memberId.toString()
                );
                
                // Pick a random member to be the new leader
                const randomIndex = Math.floor(Math.random() * otherMembers.length);
                newTeam.teamleaderid = otherMembers[randomIndex];
            } else {
                return NextResponse.json({
                    message: "Cannot remove team leader status from the only team member", 
                    status: 400, 
                    success: false
                });
            }
        }

        // Save changes to the new/current team
        await newTeam.save();

        return NextResponse.json({
            message: "Team member updated successfully",
            status: 200,
            success: true
        });
        
    } catch (err) {
        console.error(err);
        return NextResponse.json({
            message: "Internal Server Error", 
            status: 500, 
            success: false
        });
    }
}