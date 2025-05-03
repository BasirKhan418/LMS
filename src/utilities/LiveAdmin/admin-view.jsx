"use client"

import { useState, useEffect, useCallback } from "react"
import { ClassTimer } from "./class-timer"
import { LiveStreamView } from "./live-stream-view"
import { RTMPInfo } from "./rtmp-info"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Toaster, toast } from "sonner"
import { useRef } from "react"
import { io } from "socket.io-client"

export default function AdminView({ content, data }) {
  const [isLive, setIsLive] = useState(false)
  const [isChatEnabled, setIsChatEnabled] = useState(true)
  const [activeView, setActiveView] = useState("dashboard")
  const socketRef = useRef(null)
  const [isConnected, setIsConnected] = useState(false)
  const [playerLoaded, setPlayerLoaded] = useState(false)
  const chatTogglingRef = useRef(false) // Prevent multiple rapid toggles
  
  // Initialize class info only once
  const [classInfo] = useState({
    title: content?.description || "Advanced React Patterns & Performance Optimization",
    startTime: content?.date && content?.time 
      ? new Date(`${content.date}T${content.time}`).toISOString() 
      : new Date(Date.now() + 1000 * 60 * 2).toISOString(), // 2 minutes from now as fallback
    instructor: content?.name || "Dr. Sarah Johnson",
    category: content?.type || "Web Development",
    attendees: 42,
    streamSettings: {
      rtmpUrl: content?.rtmpurl || "",
      streamId: content?.streamid || "",
      playbackId: content?.playbackid || "",
      rtmpKey: content?.rtmpkey || ""
    },
    link: content?.link || ""
  })

  // Simulate class going live after timer ends
  useEffect(() => {
    const checkTime = () => {
      const now = new Date()
      const startTime = new Date(classInfo.startTime)
      if (now >= startTime && !isLive) {
        setIsLive(true)
        toast.success("Class is now live! You can now start streaming.")
      }
    }

    const interval = setInterval(checkTime, 1000)
    checkTime() // Check immediately on mount

    return () => clearInterval(interval)
  }, [classInfo.startTime, isLive])

  // Socket connection - only initialize once
  useEffect(() => {
    // Early return if required data is missing
    if (!process.env.NEXT_PUBLIC_WEBSOCKET_URL) {
      console.error("WebSocket URL environment variable is not set");
      toast.error("Configuration error: Missing WebSocket URL");
      return;
    }

    const streamId = content?.streamid;
    const userId = data?._id;
    const userName = data?.name;

    if (!streamId || !userId || !userName) {
      console.error("Missing required data for live stream connection", { streamId, userId, userName });
      toast.error("Missing information needed to join the live stream");
      return;
    }

    // Return early if socket is already initialized
    if (socketRef.current) {
      console.log("Socket already initialized, skipping");
      return;
    }

    console.log("Initializing socket connection");
    
    // Initialize socket connection
    try {
      socketRef.current = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL);
      
      // Handle connection events
      socketRef.current.on("connect", () => {
        console.log("Socket connected successfully");
        setIsConnected(true);
        
        // Join the live stream after successful connection
        socketRef.current.emit("joinLiveStream", {
          streamId,
          userId,
          userName,
          isStreamAdmin: true,
        });
        
        console.log("Sent joinLiveStream event with data:", {
          streamId, userId, userName, isStreamAdmin: true
        });
      });
      
      socketRef.current.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        toast.error("Failed to connect to the live stream server");
        setIsConnected(false);
      });
      
      socketRef.current.on("disconnect", () => {
        console.log("Socket disconnected");
        setIsConnected(false);
      });
      
      // Handle stream events
      socketRef.current.on("streamUserJoined", (data) => {
        console.log("User joined stream:", data);
        // Only show toast for other users, not ourselves
        if (data.userId !== userId) {
          toast.success(`${data.userName} has joined the stream`);
        }
      });
    } catch (error) {
      console.error("Error initializing socket:", error);
      toast.error("Failed to initialize live stream connection");
      setIsConnected(false);
    }

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        console.log("Cleaning up socket connection...");
        if (isConnected) {
          // Properly leave the stream before disconnecting
          socketRef.current.emit("leaveLiveStream", {
            streamId,
            userId
          });
        }
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []); // Empty dependency array to ensure socket setup runs only once

  const handleCompleteClass = () => {
    toast.success("Class has ended successfully!")
    setIsLive(false)
    setPlayerLoaded(false)
    // In a real app, you would handle ending the stream here
  }

  // Using useCallback to prevent recreation of this function on each render
  const toggleChatEnabled = useCallback((enabled) => {
    // Prevent multiple rapid toggles
    if (chatTogglingRef.current) {
      console.log("Toggle already in progress, ignoring");
      return;
    }
    
    // Set toggle lock
    chatTogglingRef.current = true;
    
    // Update local state
    setIsChatEnabled(enabled);
    
    // Emit chat toggle event if socket is connected
    if (socketRef.current && isConnected) {
      console.log(`Emitting toggleStreamChat event: ${enabled}`);
      socketRef.current.emit("toggleStreamChat", {
        streamId: classInfo.streamSettings.streamId,
        enabled: enabled
      });
    }
    
    // Release toggle lock after a short delay
    setTimeout(() => {
      chatTogglingRef.current = false;
    }, 500);
  }, [isConnected, classInfo.streamSettings.streamId]);

  // Handle player load state
  const handlePlayerLoad = useCallback(() => {
    setPlayerLoaded(true);
  }, []);

  return (
    <>
      <Toaster position="top-right" richColors closeButton={false} />
      <div className="container mx-auto p-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{classInfo.title}</h1>
              <p className="text-muted-foreground">Instructor: {classInfo.instructor}</p>
            </div>

            <div className="flex items-center gap-4">
            

              <Button
                variant="destructive"
                onClick={handleCompleteClass}
                disabled={!isLive}
                className="bg-red-600 hover:bg-red-700"
              >
                End Class
              </Button>
            </div>
          </div>

          {!isLive ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card rounded-xl shadow-lg p-6 border border-border/50">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-orange-500 animate-pulse"></span>
                  Class starts in:
                </h2>
                <ClassTimer targetDate={classInfo.startTime} onComplete={() => setIsLive(true)} compact />
              </div>

              <RTMPInfo 
                disabled={true} 
                rtmpUrl={classInfo.streamSettings.rtmpUrl}
                streamKey={classInfo.streamSettings.rtmpKey}
                streamId={classInfo.streamSettings.streamId}
                playbackId={classInfo.streamSettings.playbackId}
              />
            </div>
          ) : (
            <div className="mb-6">
              <RTMPInfo 
                disabled={false} 
                rtmpUrl={classInfo.streamSettings.rtmpUrl}
                streamKey={classInfo.streamSettings.rtmpKey}
                streamId={classInfo.streamSettings.streamId}
                playbackId={classInfo.streamSettings.playbackId}
              />
            </div>
          )}

          {isLive && socketRef.current && (
            <LiveStreamView
              isAdmin={true}
              classInfo={classInfo}
              isChatEnabled={isChatEnabled}
              setIsChatEnabled={toggleChatEnabled}
              socket={socketRef.current}
              userData={data}
              onPlayerLoad={handlePlayerLoad}
              playerLoaded={playerLoaded}
            />
          )}
        </div>
      </div>
    </>
  )
}