"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function MembersSidebar({ totalMembers }) {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data
  const members = [
    { id: "1", name: "Sarah Johnson", isActive: true, joinedAt: new Date(Date.now() - 1000 * 60 * 30) },
    { id: "2", name: "Mike Peterson", isActive: true, joinedAt: new Date(Date.now() - 1000 * 60 * 25) },
    { id: "3", name: "Emma Wilson", isActive: true, joinedAt: new Date(Date.now() - 1000 * 60 * 20) },
    { id: "4", name: "David Lee", isActive: true, joinedAt: new Date(Date.now() - 1000 * 60 * 15) },
    { id: "5", name: "Alex Chen", isActive: false, joinedAt: new Date(Date.now() - 1000 * 60 * 10) },
    { id: "6", name: "Jessica Taylor", isActive: true, joinedAt: new Date(Date.now() - 1000 * 60 * 5) },
    { id: "7", name: "Ryan Garcia", isActive: true, joinedAt: new Date(Date.now() - 1000 * 60 * 5) },
    { id: "7", name: "Ryan Garcia", isActive: true, joinedAt: new Date(Date.now() - 1000 * 60 * 4) },
    { id: "8", name: "Olivia Brown", isActive: true, joinedAt: new Date(Date.now() - 1000 * 60 * 3) },
    { id: "9", name: "Daniel Smith", isActive: false, joinedAt: new Date(Date.now() - 1000 * 60 * 2) },
    { id: "10", name: "Sophia Martinez", isActive: true, joinedAt: new Date(Date.now() - 1000 * 60 * 1) },
  ]

  const filteredMembers = members.filter((member) => member.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const activeMembers = filteredMembers.filter((member) => member.isActive)
  const inactiveMembers = filteredMembers.filter((member) => !member.isActive)

  return (
    <div className="flex flex-col h-[600px] border rounded-lg overflow-hidden">
      <div className="p-3 border-b">
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
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Active ({activeMembers.length})</h3>
            <div className="space-y-2">
              {activeMembers.map((member) => (
                <MemberItem key={member.id} member={member} />
              ))}

              {activeMembers.length === 0 && (
                <p className="text-sm text-muted-foreground py-2">No active members found</p>
              )}
            </div>
          </div>

          {inactiveMembers.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Inactive ({inactiveMembers.length})</h3>
              <div className="space-y-2">
                {inactiveMembers.map((member) => (
                  <MemberItem key={member.id} member={member} />
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

function MemberItem({ member }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={member.avatar || "/placeholder.svg"} />
          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{member.name}</p>
          <p className="text-xs text-muted-foreground">Joined {formatJoinTime(member.joinedAt)}</p>
        </div>
      </div>

      <div className={`h-2 w-2 rounded-full ${member.isActive ? "bg-green-500" : "bg-muted"}`} />
    </div>
  )
}

function formatJoinTime(date) {
  const minutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60))

  if (minutes < 1) return "just now"
  if (minutes === 1) return "1 minute ago"
  if (minutes < 60) return `${minutes} minutes ago`

  const hours = Math.floor(minutes / 60)
  if (hours === 1) return "1 hour ago"
  return `${hours} hours ago`
}
