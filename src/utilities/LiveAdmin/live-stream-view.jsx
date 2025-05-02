"use client"

import { useState, useEffect } from "react"
import { VideoPlayer } from "./video-player"
import { ChatSidebar } from "./chat-sidebar"
import { ReactionBar } from "./reaction-bar"
import { PollView } from "./poll-view"
import { MembersSidebar } from "./members-sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PlusCircle, AlertCircle, RefreshCw } from "lucide-react"
import MuxPlayer from '@mux/mux-player-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function LiveStreamView({ isAdmin, classInfo, isChatEnabled = true, setIsChatEnabled }) {
  const [activeTab, setActiveTab] = useState("chat")
  const [showPoll, setShowPoll] = useState(false)
  const [streamError, setStreamError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [playerReady, setPlayerReady] = useState(false)

  // Mock data
  const totalMembers = 42

  // Reset error state when playbackId changes
  useEffect(() => {
    if (classInfo?.streamSettings?.playbackId) {
      setStreamError(false)
      setIsLoading(true)
      setPlayerReady(false)
    }
  }, [classInfo?.streamSettings?.playbackId])

  const handleError = (error) => {
    console.error("Mux Player Error:", error);
    setStreamError(true)
    setIsLoading(false)
  }

  const handlePlaying = () => {
    setIsLoading(false)
    setStreamError(false)
  }

  const handleRetry = () => {
    setIsLoading(true)
    setStreamError(false)
    setPlayerReady(false)
  }

  // Add a new handler for when the player is loaded and ready
  const handleLoadedData = () => {
    setPlayerReady(true)
    setIsLoading(false)
  }

  // Add a new handler for when the player is canPlay
  const handleCanPlay = () => {
    setPlayerReady(true)
    setIsLoading(false)
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
            
            {isLoading && !streamError && !playerReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="text-2xl font-bold">{classInfo?.title || "Stream"}</h1>
            <ReactionBar />
          </div>

          {showPoll && (
            <div className="mt-4">
              <PollView isAdmin={isAdmin} onClose={() => setShowPoll(false)} />
            </div>
          )}

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