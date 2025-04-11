"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getRandomIcon } from "@/utilities/iconPool";
import { saveAs } from 'file-saver';
import excel from 'exceljs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  Plus,
  Pencil,
  Trash2,
  Users,
  Search,
  Moon,
  Sun,
  CheckCircle2,
} from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Toaster,toast } from "sonner"
import ProfilePageSkeleton from "@/utilities/skeleton/ProfilePageSkeleton"

export default function TeamManagement() {
  const [teams, setTeams] = useState([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [maxTeamSize, setMaxTeamSize] = useState(5)
  const [currentBatchId, setCurrentBatchId] = useState(null)
  const [expandedTeam, setExpandedTeam] = useState(null)
  const [selectedMember, setSelectedMember] = useState(null)
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [isTeamLeader, setIsTeamLeader] = useState(false)
 const [currentTeamleader, setCurrentTeamLeader] = useState(null)
 const [teamId, setTeamId] = useState(null)
  const [loading, setLoading] = useState(false);
  const [fetchedTeams, setFetchedTeams] = useState([])
//fetch all teams from the db
const fetchTeams = async () => {
  try{
    setLoading(true)
const res = await fetch("/api/teamformation", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `${localStorage.getItem("dilmsadmintoken")}`,
  },
})
const data = await res.json()
setLoading(false)
if (data.success) {
  setTeams(data.data)
}
else{
  toast.error(data.message)
}
  }
  catch(err){
    toast.error("Error fetching teams")
  }
}
useEffect(()=>{
fetchTeams()
},[])
//fetch all teams from the db function


  const handleCreateTeam = (teamId) => {
    setCurrentBatchId(teamId)
    setIsCreateModalOpen(true)
  }

  const confirmCreateTeam = async() => {
    setLoading(true);
    try{
      const res = await fetch("/api/teamformation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("dilmsadmintoken")}`,
        },
        body: JSON.stringify({ batchid: currentBatchId, teamSize: maxTeamSize }),
      })
      const data = await res.json()
      setLoading(false)
      if (data.success) {
        toast.success("Team created successfully")
        setIsCreateModalOpen(false)
        fetchTeams()
      } else {
        toast.error(data.message)
      }
     
    }
    catch(err){
      toast.error("Error creating team")
    }
  }

  const handleViewTeam = async(teamId) => {
   try{
    setLoading(true)
   const res = await fetch("/api/teamformation/view", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("dilmsadmintoken")}`,
    },
    body: JSON.stringify({ batchid: teamId }),
   })
    const data = await res.json();
    console.log(data)
    setLoading(false)
    if (data.success) {
      setIsViewModalOpen(true);
      setFetchedTeams(data.data);
    } else {
      toast.error(data.message)
    }

   }
   catch(err){
    setLoading(false) 
    toast.error("Error viewing team");
   }
  }

  const toggleTeamView = (teamId) => {
    setExpandedTeam(expandedTeam === teamId ? null : teamId)
  }

  const exportTeam = async(teamId) => {
    try{
      setLoading(true)
     const res = await fetch("/api/teamformation/view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("dilmsadmintoken")}`,
      },
      body: JSON.stringify({ batchid: teamId }),
     })
      const data = await res.json();
      console.log(data)
      setLoading(false)
      if (data.success) {
        const workbook = new excel.Workbook();
        const worksheet = workbook.addWorksheet("TeamsList");
        worksheet.columns = [
          { header: "Team Name", key: "name", width: 30 },
          { header: "Batch Name", key: "batchname", width: 30 },
          { header: "Domain", key: "domain", width: 30 },
          { header: "Duration", key: "duration", width: 30 },
          { header: "Team Leader Name", key: "leader", width: 30 },
          { header: "Members", key: "member", width: 60,height:200 },         
      ];
      data.data.forEach((team) => {
        worksheet.addRow({
          name: team.teamname,
          batchname: team.batchid.name,
          domain: team.batchid.domain,
          duration: team.month,
          leader: team.teamleaderid.name,
          member: team.team.map((member) => member.name).join("\n"),
        });
      });
      // Apply styling to all rows in the Members column
worksheet.eachRow((row, rowNumber) => {
  // Get the cell in the members column (column 6)
  const cell = row.getCell(6);
  
  // Apply text wrapping and alignment
  cell.alignment = {
    wrapText: true,
    vertical: 'top'
  };
  
  // Set row height to accommodate multiple lines (adjust as needed)
  if (rowNumber > 1) { // Skip header row
    row.height = 20 * Math.max(1, (cell.value?.split('\n').length || 1));
  }
});
      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true };
    });
    const buf = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buf]), `teamslist${new Date().toISOString().split('T')[0]}.xlsx`);

      } else {
        toast.error(data.message)
      }
  
     }
     catch(err){
      setLoading(false) 
      console.log(err)
      toast.error("Error exporting team");
     }
  }

  const handleUpdateMember = (teamId, member, teamlead) => {
    setSelectedMember(member);
    setTeamId(teamId);
    // Pre-select the current team
    setSelectedTeam(teamId);
    // Check if this member is the team leader
    setIsTeamLeader(member._id === teamlead._id);
    setCurrentTeamLeader(teamlead);
    setIsUpdateModalOpen(true);
  }

  const saveUpdatedMember = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/teamformation", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("dilmsadmintoken")}`,
        },
        body: JSON.stringify({ 
          teamId: selectedTeam, 
          memberId: selectedMember._id, 
          isTeamLeader: isTeamLeader 
        }),
      });
      
      const data = await res.json();
      setLoading(false);
      
      if (data.success) {
        toast.success("Member updated successfully");
        setIsUpdateModalOpen(false);
        setIsViewModalOpen(false);
      } else {
        toast.error(data.message || "Failed to update member");
      }
    } catch (err) {
      setLoading(false);
      toast.error("Error updating team member");
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <Toaster richColors={true} position="top-center" closeIcon={false} />

      <main className="container py-8">
        <div className="mb-8 space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Team Formation Dashboard</h2>
          <p className="text-muted-foreground">Create, view, and manage your teams in one place.</p>
        </div>

        <Tabs defaultValue="not-created" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
            <TabsTrigger value="not-created">Not Created Teams</TabsTrigger>
            <TabsTrigger value="created">Created Teams</TabsTrigger>
          </TabsList>

          {/* Not Created Teams */}
          <>
          
          {loading?<ProfilePageSkeleton/>:<TabsContent value="not-created" className="space-y-4">
            <Card className="overflow-hidden border-none shadow-md">
              <CardHeader className="bg-muted/50">
                <CardTitle>Not Created Teams</CardTitle>
                <CardDescription>Teams that have not been created yet</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Batch Name</TableHead>
                        <TableHead>Domain</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teams
                        .filter((team) => !team.isteamcreated)
                        .map((team) => (
                          <TableRow key={team._id} className="hover:bg-muted/50">
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-lg">
                                {getRandomIcon()}
                                </div>
                                {team.name}
                              </div>
                            </TableCell>
                            <TableCell>{team.domain}</TableCell>
                            <TableCell>
                              {new Date(team.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
                            }
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-muted">
                                Not Created
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleCreateTeam(team._id)}
                                className="transition-all hover:scale-105"
                              >
                                <Plus className="h-4 w-4 mr-1" /> Create Team
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>}
          </>

          {/* Created Teams */}
         { loading?<ProfilePageSkeleton/>:<TabsContent value="created" className="space-y-4">
            <Card className="overflow-hidden border-none shadow-md">
              <CardHeader className="bg-muted/50">
                <CardTitle>Created Teams</CardTitle>
                <CardDescription>Teams that have been created</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Batch Name</TableHead>
                        <TableHead>Domain</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {teams
                        .filter((team) => team.isteamcreated)
                        .map((team) => (
                          <TableRow key={team._id} className="hover:bg-muted/50">
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-lg">
                                  {getRandomIcon()}
                                </div>
                                {team.batchName}
                              </div>
                            </TableCell>
                            <TableCell>{team.domain}</TableCell>
                            <TableCell>{team.date}</TableCell>
                            <TableCell>
                              <Badge variant="success" className="bg-green-500 hover:bg-green-600 text-white">
                                Yes
                              </Badge>
                            </TableCell>
                            <TableCell className="space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewTeam(team._id)}
                                className="transition-all hover:scale-105"
                              >
                                <Eye className="h-4 w-4 mr-1" /> View Team
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => exportTeam(team._id)}
                                className="transition-all hover:scale-105"
                              >
                                <Download className="h-4 w-4 mr-1" /> Export
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>}
        </Tabs>

        {/* Create Team Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create Team</DialogTitle>
              <DialogDescription>Set the maximum team size and create your team.</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div className="flex items-center justify-center p-6 bg-muted/30 rounded-lg">
                <div className="text-5xl">{ "👥"}</div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-team-size">Maximum Team Size</Label>
                <Input
                  id="max-team-size"
                  type="number"
                  value={maxTeamSize}
                  onChange={(e) => setMaxTeamSize((e.target.value))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={confirmCreateTeam}>{loading?"Creating ...":"Create"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Teams Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Team Members</DialogTitle>
              <DialogDescription>View and manage team members</DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {fetchedTeams
                  .map((team) => (
                    <Collapsible key={team._id} className="border rounded-md overflow-hidden shadow-sm">
                      <CollapsibleTrigger className="flex items-center justify-between p-4 w-full text-left hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-xl">
                            {getRandomIcon()}
                          </div>
                          <div>
                            <h3 className="text-lg font-medium">{team.teamname}</h3>
                            <div className="">
                            <p className="text-sm text-muted-foreground">{team.batchid.domain}</p>
                            <p className="text-sm text-muted-foreground">{team.month}</p>
                            </div>
                            
                          </div>
                        </div>
                        {expandedTeam === team._id ? (
                          <ChevronUp className="h-5 w-5" onClick={()=>{toggleTeamView(team._id)}}/>
                        ) : (
                          <ChevronDown className="h-5 w-5" onClick={()=>{toggleTeamView(team._id)}}/>
                        )}
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="space-y-2 p-4 border-t bg-muted/20">
                          {team.team.map((member) => (
                            <div
                              key={member._id}
                              className="flex items-center justify-between p-3 border rounded-md bg-background hover:bg-muted/30 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage
                                    src={`/placeholder.svg?height=40&width=40&text=${member.avatar}`}
                                    alt={member.name}
                                  />
                                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium">{member.name}</p>
                                    {team.teamleaderid._id==member._id && (
                                      <Badge variant="outline" className="bg-primary/10 text-primary">
                                        Team Lead
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground">{member.email}</p>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleUpdateMember(team._id, member,team.teamleaderid)}
                                  className="transition-all hover:scale-105"
                                >
                                  <Pencil className="h-4 w-4 mr-1" /> Update
                                </Button>
                               
                              </div>
                            </div>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
              </div>
            </ScrollArea>
            <DialogFooter>
              <Button onClick={() => setIsViewModalOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Update Member Modal */}
        <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Update Team Member</DialogTitle>
            <DialogDescription>Change team assignment and role</DialogDescription>
          </DialogHeader>
          {selectedMember && (
            <div className="py-4 space-y-6">
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src={`/placeholder.svg?height=64&width=64&text=${selectedMember.avatar}`}
                    alt={selectedMember.name}
                  />
                  <AvatarFallback className="text-lg">{selectedMember.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-medium">{selectedMember.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedMember.email}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="team-select">Assign to Team</Label>
                  <Select 
                    value={selectedTeam} 
                    onValueChange={setSelectedTeam}
                    defaultValue={teamId}
                  >
                    <SelectTrigger id="team-select">
                      <SelectValue placeholder="Select a team" />
                    </SelectTrigger>
                    <SelectContent>
                      {fetchedTeams.map((team) => (
                        <SelectItem key={team._id} value={team._id}>
                          <div className="flex items-center gap-2">
                            <span>{getRandomIcon()}</span>
                            <span>{team.teamname}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="team-leader" className="flex items-center gap-2 cursor-pointer">
                    Make Team Leader
                    {isTeamLeader && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                  </Label>
                  <Switch 
                    id="team-leader" 
                    checked={isTeamLeader} 
                    onCheckedChange={setIsTeamLeader}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsUpdateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveUpdatedMember}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </main>

     
    </div>
  )
}
