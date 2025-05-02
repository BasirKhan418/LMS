"use client"

import { useState } from "react"
import { VideoPlayer } from "./video-player"
import { ChatSidebar } from "./chat-sidebar"
import { ReactionBar } from "./reaction-bar"
import { PollView } from "./poll-view"
import { MembersSidebar } from "./members-sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export function LiveStreamView({ isAdmin, classInfo, isChatEnabled = true, setIsChatEnabled }) {
  const [activeTab, setActiveTab] = useState("chat")
  const [showPoll, setShowPoll] = useState(false)

  // Mock data
  const totalMembers = 42

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 flex flex-col gap-4">
          <VideoPlayer />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-2xl font-bold">{classInfo.title}</h1>

            <ReactionBar />
          </div>

          {showPoll && (
            <div className="mt-4">
              <PollView isAdmin={isAdmin} onClose={() => setShowPoll(false)} />
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="chat">Chat</TabsTrigger>
                {isAdmin && <TabsTrigger value="members">Members ({totalMembers})</TabsTrigger>}
              </TabsList>

              {isAdmin && !showPoll && (
                <Button variant="outline" size="sm" onClick={() => setShowPoll(true)} className="ml-2">
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Poll
                </Button>
              )}
            </div>

            <TabsContent value="chat" className="m-0">
              <ChatSidebar isAdmin={isAdmin} isChatEnabled={isChatEnabled} setIsChatEnabled={setIsChatEnabled} />
            </TabsContent>

            {isAdmin && (
              <TabsContent value="members" className="m-0">
                <MembersSidebar totalMembers={totalMembers} />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  )
}
