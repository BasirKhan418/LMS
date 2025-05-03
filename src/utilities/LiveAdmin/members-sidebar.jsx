"use client"

import { useState, useEffect, useMemo } from "react"
import { Search, X, UserPlus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function MembersSidebar({ socket, streamId, usersData, setUsersData, currentMembers, setCurrentMembers }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)

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

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return usersData;
    
    return usersData.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.role && user.role.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [usersData, searchQuery]);

  // Group users by admin status
  const { admins, regularUsers } = useMemo(() => {
    const admins = filteredUsers.filter(user => user.isAdmin);
    const regularUsers = filteredUsers.filter(user => !user.isAdmin);
    return { admins, regularUsers };
  }, [filteredUsers]);
  
  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden bg-background shadow-sm">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium">Participants</h3>
          <Badge variant="secondary" className="bg-primary/10 text-primary font-medium">{currentMembers}</Badge>
        </div>
        <div className="relative">
          <Search className={`absolute left-3 top-2.5 h-4 w-4 ${isSearchFocused ? 'text-primary' : 'text-muted-foreground'}`} />
          <Input
            placeholder="Search members..."
            className={`pl-10 pr-10 transition-all ${isSearchFocused ? 'ring-2 ring-primary/20' : ''} ${searchQuery ? 'pr-8' : ''}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          {searchQuery && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-2 top-2 h-5 w-5 text-muted-foreground hover:text-foreground"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {/* Show search results info if searching */}
          {searchQuery && (
            <div className="mb-2 text-sm text-muted-foreground">
              Found {filteredUsers.length} {filteredUsers.length === 1 ? 'result' : 'results'}
            </div>
          )}

          {/* Show admins first if they exist */}
          {admins.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
                Admins ({admins.length})
              </h3>
              <div className="space-y-1">
                {admins.map((member, index) => (
                  <MemberItem key={`admin-${index}`} member={member} />
                ))}
              </div>
            </div>
          )}

          {/* Show regular members */}
          <div className="mb-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center">
              {!searchQuery ? `Members (${regularUsers.length})` : `Regular Members (${regularUsers.length})`}
            </h3>
            <div className="space-y-1">
              {regularUsers.map((member, index) => (
                <MemberItem key={`regular-${index}`} member={member} />
              ))}

              {filteredUsers.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-medium">No members found</p>
                  <p className="text-xs mt-1">Try a different search term</p>
                </div>
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
    <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors group">
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8 border-2 border-background shadow-sm">
          <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
          <AvatarFallback className={member.isAdmin ? "bg-primary text-primary-foreground" : "bg-secondary"}>
            {member.name.charAt(0).toUpperCase()}
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

      <div className="flex items-center">
        <div className={`h-2 w-2 rounded-full ${member.isActive ? "bg-green-500" : "bg-muted"}`} />
      </div>
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