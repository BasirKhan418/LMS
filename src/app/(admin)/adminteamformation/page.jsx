"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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

// Sample data for teams
const initialTeams = [
  { id: 1, batchName: "Batch A", domain: "Web Development", date: "2025-04-01", created: false, icon: "🌐" },
  { id: 2, batchName: "Batch B", domain: "Mobile Development", date: "2025-04-05", created: false, icon: "📱" },
  { id: 3, batchName: "Batch C", domain: "Data Science", date: "2025-04-10", created: false, icon: "📊" },
  { id: 4, batchName: "Batch D", domain: "UI/UX Design", date: "2025-04-15", created: true, icon: "🎨" },
  { id: 5, batchName: "Batch E", domain: "DevOps", date: "2025-04-20", created: true, icon: "⚙️" },
  { id: 6, batchName: "Batch F", domain: "Blockchain", date: "2025-04-25", created: true, icon: "🔗" },
]

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
  const [teams, setTeams] = useState(initialTeams)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [maxTeamSize, setMaxTeamSize] = useState(5)
  const [currentTeamId, setCurrentTeamId] = useState(null)
  const [expandedTeam, setExpandedTeam] = useState(null)
  const [selectedMember, setSelectedMember] = useState(null)
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [isTeamLeader, setIsTeamLeader] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleCreateTeam = (teamId) => {
    setCurrentTeamId(teamId)
    setIsCreateModalOpen(true)
  }

  const confirmCreateTeam = () => {
    if (currentTeamId) {
      setTeams(teams.map((team) => (team.id === currentTeamId ? { ...team, created: true } : team)))
      setIsCreateModalOpen(false)
    }
  }

  const handleViewTeam = (teamId) => {
    setCurrentTeamId(teamId)
    setIsViewModalOpen(true)
  }

  const toggleTeamView = (teamId) => {
    setExpandedTeam(expandedTeam === teamId ? null : teamId)
  }

  const exportTeam = (teamId) => {
    // In a real application, this would generate and download a file
    alert(`Exporting team data for Batch ${teams.find((t) => t.id === teamId)?.batchName}`)
  }

  const handleUpdateMember = (teamId, member) => {
    setSelectedMember(member)
    setSelectedTeam(teamId.toString())
    setIsTeamLeader(member.isLeader)
    setIsUpdateModalOpen(true)
  }

  const saveUpdatedMember = () => {
    // In a real application, this would update the member in the database
    setIsUpdateModalOpen(false)
    alert(`Member ${selectedMember.name} updated to team ${selectedTeam} with leader status: ${isTeamLeader}`)
  }

  const filteredTeams = teams.filter(
    (team) =>
      team.batchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.domain.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      

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
          <TabsContent value="not-created" className="space-y-4">
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
                      {filteredTeams
                        .filter((team) => !team.created)
                        .map((team) => (
                          <TableRow key={team.id} className="hover:bg-muted/50">
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-lg">
                                  {team.icon}
                                </div>
                                {team.batchName}
                              </div>
                            </TableCell>
                            <TableCell>{team.domain}</TableCell>
                            <TableCell>{team.date}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-muted">
                                Not Created
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleCreateTeam(team.id)}
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
          </TabsContent>

          {/* Created Teams */}
          <TabsContent value="created" className="space-y-4">
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
                      {filteredTeams
                        .filter((team) => team.created)
                        .map((team) => (
                          <TableRow key={team.id} className="hover:bg-muted/50">
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-lg">
                                  {team.icon}
                                </div>
                                {team.batchName}
                              </div>
                            </TableCell>
                            <TableCell>{team.domain}</TableCell>
                            <TableCell>{team.date}</TableCell>
                            <TableCell>
                              <Badge variant="success" className="bg-green-500 hover:bg-green-600">
                                Yes
                              </Badge>
                            </TableCell>
                            <TableCell className="space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewTeam(team.id)}
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
          </TabsContent>
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
                <div className="text-5xl">{teams.find((t) => t.id === currentTeamId)?.icon || "👥"}</div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="max-team-size">Maximum Team Size</Label>
                <Input
                  id="max-team-size"
                  type="number"
                  value={maxTeamSize}
                  onChange={(e) => setMaxTeamSize(Number.parseInt(e.target.value))}
                  min={1}
                  max={10}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={confirmCreateTeam}>Create Team</Button>
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
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {teams
                  .filter((team) => team.created)
                  .map((team) => (
                    <Collapsible key={team.id} className="border rounded-md overflow-hidden shadow-sm">
                      <CollapsibleTrigger className="flex items-center justify-between p-4 w-full text-left hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-xl">
                            {team.icon}
                          </div>
                          <div>
                            <h3 className="text-lg font-medium">{team.batchName}</h3>
                            <p className="text-sm text-muted-foreground">{team.domain}</p>
                          </div>
                        </div>
                        {expandedTeam === team.id ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="space-y-2 p-4 border-t bg-muted/20">
                          {teamMembers[team.id]?.map((member) => (
                            <div
                              key={member.id}
                              className="flex items-center justify-between p-3 border rounded-md bg-background hover:bg-muted/30 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage
                                    src={`/placeholder.svg?height=40&width=40&text=${member.avatar}`}
                                    alt={member.name}
                                  />
                                  <AvatarFallback>{member.avatar}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium">{member.name}</p>
                                    {member.isLeader && (
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
                          .filter((team) => team.created)
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
