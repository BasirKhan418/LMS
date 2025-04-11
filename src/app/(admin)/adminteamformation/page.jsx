"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getRandomIcon } from "@/utilities/iconPool"
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

// Sample data for team members
const teamMembers = {
  4: [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Team Lead", avatar: "JD", isLeader: true },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Developer", avatar: "JS", isLeader: false },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "Designer", avatar: "MJ", isLeader: false },
    { id: 4, name: "Sarah Williams", email: "sarah@example.com", role: "QA Engineer", avatar: "SW", isLeader: false },
    { id: 5, name: "David Brown", email: "david@example.com", role: "Product Manager", avatar: "DB", isLeader: false },
  ],
  5: [
    { id: 6, name: "Alex Turner", email: "alex@example.com", role: "Team Lead", avatar: "AT", isLeader: true },
    { id: 7, name: "Emily Clark", email: "emily@example.com", role: "Developer", avatar: "EC", isLeader: false },
    { id: 8, name: "Ryan Lewis", email: "ryan@example.com", role: "Designer", avatar: "RL", isLeader: false },
    { id: 9, name: "Olivia Martin", email: "olivia@example.com", role: "QA Engineer", avatar: "OM", isLeader: false },
    {
      id: 10,
      name: "Daniel Wilson",
      email: "daniel@example.com",
      role: "Product Manager",
      avatar: "DW",
      isLeader: false,
    },
  ],
  6: [
    { id: 11, name: "Sophie Taylor", email: "sophie@example.com", role: "Team Lead", avatar: "ST", isLeader: true },
    { id: 12, name: "James Anderson", email: "james@example.com", role: "Developer", avatar: "JA", isLeader: false },
    { id: 13, name: "Emma Davis", email: "emma@example.com", role: "Designer", avatar: "ED", isLeader: false },
    { id: 14, name: "Lucas Moore", email: "lucas@example.com", role: "QA Engineer", avatar: "LM", isLeader: false },
    { id: 15, name: "Ava Robinson", email: "ava@example.com", role: "Product Manager", avatar: "AR", isLeader: false },
  ],
}

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
  const [searchQuery, setSearchQuery] = useState("")
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

  const exportTeam = (teamId) => {
    // In a real application, this would generate and download a file
    alert(`Exporting team data for Batch ${teams.find((t) => t.id === teamId)?.batchName}`)
  }

  const handleUpdateMember = (teamId, member) => {
   
  }

  const saveUpdatedMember = () => {
    // In a real application, this would update the member in the database
    setIsUpdateModalOpen(false)
    alert(`Member ${selectedMember.name} updated to team ${selectedTeam} with leader status: ${isTeamLeader}`)
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
                                onClick={() => exportTeam(team.id)}
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
                                  onClick={() => handleUpdateMember(team.id, member)}
                                  className="transition-all hover:scale-105"
                                >
                                  <Pencil className="h-4 w-4 mr-1" /> Update
                                </Button>
                                <Button variant="destructive" size="sm" className="transition-all hover:scale-105">
                                  <Trash2 className="h-4 w-4 mr-1" /> Delete
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
                    <AvatarFallback className="text-lg">{selectedMember.avatar}</AvatarFallback>
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
                    <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                      <SelectTrigger id="team-select">
                        <SelectValue placeholder="Select a team" />
                      </SelectTrigger>
                      <SelectContent>
                        {teams
                          .filter((team) => team.isteamcreated)
                          .map((team) => (
                            <SelectItem key={team.id} value={team.id.toString()}>
                              <div className="flex items-center gap-2">
                                <span>{team.icon}</span>
                                <span>{team.batchName}</span>
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
                    <Switch id="team-leader" checked={isTeamLeader} onCheckedChange={setIsTeamLeader} />
                  </div>
                </div>
              </div>
            )}
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setIsUpdateModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={saveUpdatedMember}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>

     
    </div>
  )
}
