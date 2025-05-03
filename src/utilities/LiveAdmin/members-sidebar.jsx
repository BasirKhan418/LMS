"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function MembersSidebar({ socket, streamId,usersData,setUsersData,currentMembers ,
  setCurrentMembers }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [members, setMembers] = useState([])
  const [totalMembers, setTotalMembers] = useState(0)

  useEffect(() => {
    
    // Only set up socket listeners if socket exists
    if (socket) {
      
      
      // Listen for users count updates
      socket.on("streamUsers", (data) => {
        console.log("Stream users updated:", data);
        if (data.users && Array.isArray(data.users)) {
         
          console.log("Users data updated basir:", data.users);
          setUsersData(data.users);
          setCurrentMembers(data.users.length);
        }
      });
      
      // Clean up event listener on unmount
      return () => {
        if (socket) {
         
          socket.off("streamUsers");
        }
      };
    }
  }, [])
  
  return (
    <div className="flex flex-col h-[600px] border rounded-lg overflow-hidden">
      <div className="p-3 border-b">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-md font-medium">Participants</h3>
          <Badge variant="outline">{usersData&&usersData.length}</Badge>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search members..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Active ({usersData.length})
            </h3>
            <div className="space-y-2">
              {usersData.map((member,index) => (
                <MemberItem key={index} member={member} />
              ))}

              {usersData.length === 0 && (
                <p className="text-sm text-muted-foreground py-2">No active members found</p>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

function MemberItem({ member }) {
  return (
    <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={member.avatar || "/placeholder.svg"} />
          <AvatarFallback className={member.isAdmin ? "bg-primary text-primary-foreground" : ""}>
            {member.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{member.name}</p>
            {member.isAdmin && <Badge variant="outline" className="bg-primary/10 text-primary text-xs">Admin</Badge>}
          </div>
          <p className="text-xs text-muted-foreground">{member.email || member.role || "Joined " + formatJoinTime(member.joinedAt)}</p>
        </div>
      </div>

      <div className={`h-2 w-2 rounded-full ${member.isActive ? "bg-green-500" : "bg-muted"}`} />
    </div>
  )
}

function formatJoinTime(date) {
  if (!(date instanceof Date) || isNaN(date)) {
    return "recently"
  }

  const minutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60))

  if (minutes < 1) return "just now"
  if (minutes === 1) return "1 minute ago"
  if (minutes < 60) return `${minutes} minutes ago`

  const hours = Math.floor(minutes / 60)
  if (hours === 1) return "1 hour ago"
  return `${hours} hours ago`
}