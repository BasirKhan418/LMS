"use client"

import { useState, useEffect, useRef } from "react"
import { ClassTimer } from "./class-timer"
import { LiveStreamView } from "./live-stream-view"
import { toast } from "sonner"
import { BookOpen, Calendar, Users, Clock, GraduationCap } from "lucide-react"
import { io } from "socket.io-client"

export function UserView({ content, userdata }) {
  const socketRef = useRef(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isLive, setIsLive] = useState(false)
  
  const [classInfo, setClassInfo] = useState({
    title: content?.description || "Advanced React Patterns & Performance Optimization",
    startTime: content?.date && content?.time 
      ? new Date(`${content.date}T${content.time}`).toISOString() 
      : new Date(Date.now() + 1000 * 60 * 2).toISOString(), // 2 minutes from now as fallback
    instructor: content?.name || "Dr. Sarah Johnson",
    category: content?.type || "Web Development",
    attendees: 42,
    notes: content?.videonotes,
    slide: content?.slide,
    streamSettings: {
      rtmpUrl: content?.rtmpurl || "",
      streamId: content?.streamid || "",
      playbackId: content?.playbackid || "",
      rtmpKey: content?.rtmpkey || ""
    },
    link: content?.link || ""
  })

  // Socket connection and event handling
  useEffect(() => {
    // Ensure we have the required data to connect
    if (!process.env.NEXT_PUBLIC_WEBSOCKET_URL) {
      console.error("WebSocket URL environment variable is not set");
      toast.error("Configuration error: Missing WebSocket URL");
      return;
    }

    const streamId = content?.streamid;
    const userId = userdata?._id;
    const userName = userdata?.name;

    if (!streamId || !userId || !userName) {
      console.error("Missing required data for live stream connection", { streamId, userId, userName });
      toast.error("Missing information needed to join the live stream");
      return;
    }

    // Initialize socket connection
    try {
      socketRef.current = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL);
      
      // Handle connection events
      socketRef.current.on("connect", () => {
        console.log("Socket connected successfully");
        setIsConnected(true);
        
        // Join the live stream after successful connection
        socketRef.current.emit("joinLiveStream", {
          streamId: streamId,
          userId: userId,
          userName: userName,
          isStreamAdmin: false,
        });
        
        console.log("Sent joinLiveStream event with data:", {
          streamId, userId, userName, isStreamAdmin: false
        });
      });
      
      socketRef.current.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        toast.error("Failed to connect to the live stream server");
      });
      
      // Handle stream events
      socketRef.current.on("streamUserJoined", (data) => {
        console.log("User joined stream:", data);
        if (data.userId !== userId) {

          toast.success(`${data.userName} has joined the stream`);
        }
        
      });
      
      socketRef.current.on("streamChatState", (data) => {
        console.log("Stream chat state updated:", data);
      });

      socketRef.current.on("completeLiveStreamMessage", (data) => {
        console.log("Live stream completed message:", data);
       if(data.status ==="completed"){
        console.log("Live stream completed:", data);
        toast.success("The live stream has been completed successfully.");
        setTimeout(()=>{
          toast.success("class has ended successfully. Recording will be available soon.");
        },3000)
       }
      })
      
      socketRef.current.on("streamMessage", (data) => {
        console.log("New stream message:", data);
      });
      
      socketRef.current.on("streamChatNotice", (data) => {
        console.log("Stream chat notice:", data);
        toast.info(data.message);
      });
    } catch (error) {
      console.error("Error initializing socket:", error);
      toast.error("Failed to initialize live stream connection");
    }

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        if (isConnected) {
          // Properly leave the stream before disconnecting
          socketRef.current.emit("leaveLiveStream", {
            streamId: content?.streamid,
            userId: userdata?._id
          });
        }
        socketRef.current.disconnect();
        console.log("Socket disconnected");
      }
    };
  }, [content?.streamid, userdata?._id, userdata?.name]);

  // Check if class is live based on start time
  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const startTime = new Date(classInfo.startTime);
      if (now >= startTime) {
        setIsLive(true);
        
      }
    };

    const interval = setInterval(checkTime, 1000);
    checkTime(); // Check immediately on mount

    return () => clearInterval(interval);
  }, [classInfo.startTime]);

  return (
    <div className="bg-gradient-to-b from-background to-background/80">
      {!isLive ? (
        <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen">
          <div className="w-full max-w-4xl">
            {/* Logo and header */}
            <div className="flex flex-col items-center mb-8">
              <div className="bg-green-100 rounded-full">
                <img src="/11.png" alt="infotact logo" className="h-28 w-28" />
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 my-2">
                Infotact Learning
              </h1>
              <p className="text-muted-foreground text-center">Your gateway to interactive learning</p>
            </div>

            {/* Class info card */}
            <div className="bg-card rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="bg-primary/10 p-6 border-b border-primary/20">
                <h2 className="text-2xl md:text-3xl font-bold">{classInfo.title}</h2>
                <p className="text-muted-foreground mt-2">with {classInfo.instructor}</p>
              </div>

              <div className="p-6 flex flex-col items-center justify-between">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p className="font-medium">{classInfo.category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">{new Date(classInfo.startTime).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-semibold">Class starts in:</h3>
                  </div>
                  <ClassTimer targetDate={classInfo.startTime} onComplete={() => setIsLive(true)} />
                </div>
              </div>
            </div>

            {/* Connection status */}
            <div className="text-center mb-4">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                isConnected ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
              }`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  isConnected ? "bg-green-500" : "bg-yellow-500"
                }`}></div>
                {isConnected ? "Connected to live stream" : "Connecting to live stream..."}
              </div>
            </div>

            {/* Animated waiting message */}
            <div className="text-center animate-pulse">
              <p className="text-muted-foreground">Waiting for instructor to start the session...</p>
            </div>
          </div>
        </div>
      ) : (
        <LiveStreamView 
          isAdmin={false} 
          classInfo={classInfo}
          socket={socketRef.current}
          userData={userdata}
        />
      )}
    </div>
  )
}