"use client"

import { useState, useEffect } from "react"
import { VideoPlayer } from "./video-player"
import { ChatSidebar } from "./chat-sidebar"
import { ReactionBar } from "./reaction-bar"
import { PollView } from "./poll-view"
import { MembersSidebar } from "./members-sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PlusCircle, AlertCircle, RefreshCw, Users } from "lucide-react"
import MuxPlayer from '@mux/mux-player-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

export function LiveStreamView({ 
  isAdmin, 
  classInfo, 
  isChatEnabled = true, 
  setIsChatEnabled, 
  socket, 
  userData, 
  onPlayerLoad, 
  playerLoaded 
}) {
  const [activeTab, setActiveTab] = useState("chat")
  const [showPoll, setShowPoll] = useState(false)
  const [streamError, setStreamError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentMembers, setCurrentMembers] = useState(0)
  const [usersData, setUsersData] = useState([])
  // Reset error state when playbackId changes
  useEffect(() => {
    if (classInfo?.streamSettings?.playbackId) {
      setStreamError(false)
      setIsLoading(true)
    }
    
    // Only set up socket listeners if socket exists
    if (socket) {
      // Listen for chat state updates
      socket.on("streamChatState", (data) => {
        console.log("Stream chat state updated:", data);
        if (data.messagesEnabled !== undefined) {
          setIsChatEnabled(data.messagesEnabled);
        }
      });
      
      // Listen for users count updates
      socket.on("streamUsers", (data) => {
        console.log("Stream users updated:", data);
        if (data.users && Array.isArray(data.users)) {
          setCurrentMembers(data.users.length);
          console.log("Users data updated basir:", data.users);
          setUsersData(data.users);
        }
      });
      
      // Clean up event listener on unmount
      return () => {
        if (socket) {
          socket.off("streamChatState");
          socket.off("streamUsers");
        }
      };
    }
  }, [classInfo?.streamSettings?.playbackId, socket, setIsChatEnabled])

  const handleError = (error) => {
    console.error("Mux Player Error:", error);
    setStreamError(true)
    setIsLoading(false)
  }

  const handlePlaying = () => {
    setIsLoading(false)
    setStreamError(false)
    if (onPlayerLoad) onPlayerLoad();
  }

  const handleRetry = () => {
    setIsLoading(true)
    setStreamError(false)
  }

  // Add a new handler for when the player is loaded and ready
  const handleLoadedData = () => {
    setIsLoading(false)
    if (onPlayerLoad) onPlayerLoad();
  }

  // Add a new handler for when the player is canPlay
  const handleCanPlay = () => {
    setIsLoading(false)
    if (onPlayerLoad) onPlayerLoad();
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Video Player Section */}
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            {!streamError && classInfo?.streamSettings?.playbackId ? (
              <MuxPlayer
                streamType="on-demand"
                playbackId={classInfo?.streamSettings?.playbackId}
                metadataVideoTitle={classInfo?.instructor || ""}
                metadataViewerUserId={classInfo?.title || ""}
                primaryColor="#FFFFFF"
                secondaryColor="#000000"
                onError={handleError}
                onPlaying={handlePlaying}
                onLoadedData={handleLoadedData}
                onCanPlay={handleCanPlay}
                autoPlay
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Stream Not Available</h3>
                <p className="text-gray-400 mb-6">The live stream hasn't started yet or there was an error connecting.</p>
                <Button 
                  onClick={handleRetry} 
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Retry Connection
                </Button>
              </div>
            )}
            
            {isLoading && !streamError && !playerLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-2xl font-bold">{classInfo?.title || "Stream"}</h1>
            <ReactionBar />
          </div>

          {/* New buttons for notes and slides with logo */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-md y flex items-center justify-center text-white font-bold text-lg mr-3 bg-green-100">
                <img src="/11.png" alt="infotact logo" className="h-12 w-12" />
              </div>
              <span className="font-medium">{classInfo?.instructor || "Instructor"}</span>
            </div>
            <div className="flex-grow"></div>
            <div className="flex gap-3 mt-3 sm:mt-0">
              <Button variant="outline" className="flex items-center gap-2 px-4" onClick={()=>{
                if (!classInfo.notes) {
                  toast.error("No notes available for this class yet.")
                  return
                }

                window.open(classInfo.notes, "_blank")
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
                Notes
              </Button>
              <Button className="flex items-center gap-2 px-4" onClick={()=>{
                 if (!classInfo.notes) {
                  toast.error("No slides available for this class yet.")
                  return
                }
                window.open(classInfo.slides, "_blank")
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                Slides
              </Button>
            </div>
          </div>

          {isAdmin && streamError && (
            <Alert className="mt-4 border-amber-500">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Stream Status</AlertTitle>
              <AlertDescription>
                Your stream is currently not live. Viewers will see a waiting screen until you start the stream.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <div className="lg:col-span-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="chat" className="flex items-center gap-1">
                  Chat
                </TabsTrigger>
                <TabsTrigger value="members" className="flex items-center gap-1">
                  <Users className="h-4 w-4 mr-1" />
                  Members 
                  <Badge variant="outline" className="ml-1 bg-primary/10">{currentMembers}</Badge>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="chat" className="m-0">
              {socket ? (
                <ChatSidebar 
                  isAdmin={isAdmin} 
                  socket={socket} 
                  streamId={classInfo?.streamSettings?.streamId} 
                  userData={userData}
                  users={usersData}
                  participantCount={usersData.length} 
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-64 p-4 border rounded-md">
                  <AlertCircle className="h-8 w-8 text-amber-500 mb-2" />
                  <p className="text-center">Chat connection not available. Please refresh the page.</p>
                  <Button 
                    onClick={() => window.location.reload()} 
                    variant="outline" 
                    className="mt-4"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" /> Retry Connection
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="members" className="m-0">
              <MembersSidebar 
                socket={socket} 
                usersData={usersData}
                streamId={classInfo?.streamSettings?.streamId} 
                setUsersData={setUsersData}
                currentMembers={currentMembers}
                setCurrentMembers={setCurrentMembers}
                
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}