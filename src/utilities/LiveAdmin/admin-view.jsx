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
import CompleteLiveStream from "@/app/server/CompleteLiveStream"
export default function AdminView({ content, data,week,alldata }) {
  const [isLive, setIsLive] = useState(false)
  const [isChatEnabled, setIsChatEnabled] = useState(true)
  const [activeView, setActiveView] = useState("dashboard")
  const [usersData, setUsersData] = useState([])
  const socketRef = useRef(null)
  const [isConnected, setIsConnected] = useState(false)
  const [playerLoaded, setPlayerLoaded] = useState(false)
  const chatTogglingRef = useRef(false) // Prevent multiple rapid toggles
  const [showStreamInfo, setShowStreamInfo] = useState(false) // New state for admin early access
  const [attendanceLoader, setAttendanceLoader] = useState(false)
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

  // Check if it's within 5 minutes of start time
  useEffect(() => {
    const checkPreStartTime = () => {
      const now = new Date()
      const startTime = new Date(classInfo.startTime)
      const fiveMinutesBefore = new Date(startTime.getTime() - 5 * 60 * 1000)
      
      // Show stream info if we're within 5 minutes of start time
      if (now >= fiveMinutesBefore) {
        setShowStreamInfo(true)
      }
      
      // Additionally, auto-start the class when the actual start time arrives
      if (now >= startTime && !isLive) {
        setIsLive(true)
        toast.success("Class is now live! You can now start streaming.")
      }
    }

    const interval = setInterval(checkPreStartTime, 1000)
    checkPreStartTime() // Check immediately on mount

    return () => clearInterval(interval)
  }, [classInfo.startTime, isLive])

  // Socket connection - only initialize once
  useEffect(() => {
    // Early return if required data is missing
    if (!process.env.NEXT_PUBLIC_WEBSOCKET_URL) {
      toast.error("Configuration error: Missing WebSocket URL");
      return;
    }

    const streamId = content?.streamid;
    const userId = data?._id;
    const userName = data?.name;

    if (!streamId || !userId || !userName) {
      
      toast.error("Missing information needed to join the live stream");
      return;
    }

    // Return early if socket is already initialized
    if (socketRef.current) {
    
      return;
    }

   
    
    // Initialize socket connection
    try {
      socketRef.current = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL);
      
      // Handle connection events
      socketRef.current.on("connect", () => {
        
        setIsConnected(true);
        
        // Join the live stream after successful connection
        socketRef.current.emit("joinLiveStream", {
          streamId,
          userId,
          userName,
          isStreamAdmin: true,
        });
        
       
      });
      
      socketRef.current.on("connect_error", (error) => {
       
        toast.error("Failed to connect to the live stream server");
        setIsConnected(false);
      });
      
      socketRef.current.on("disconnect", () => {
        
        setIsConnected(false);
      });
      
      // Handle stream events
      socketRef.current.on("streamUserJoined", (data) => {
        
        // Only show toast for other users, not ourselves
        if (data.userId !== userId) {
          toast.success(`${data.userName} has joined the stream`);
        }
      });
    } catch (error) {
      
      toast.error("Failed to initialize live stream connection");
      setIsConnected(false);
    }

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        
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

  const handleStartClassEarly = () => {
    setIsLive(true)
    toast.success("Class has been started early!")
  }

  const handleCompleteClass = async() => {
    const data = await CompleteLiveStream(classInfo.streamSettings.streamId);
    
    setIsLive(false)
    socketRef.current.emit("completeLiveStream", {
      streamId: classInfo.streamSettings.streamId,
      userId: data._id,
      playbackId: data.playbackId
    });
    toast.success("Class has been completed!")
  }

  const toggleChatEnabled = useCallback((enabled) => {
    // Prevent multiple rapid toggles
    if (chatTogglingRef.current) {
      
      return;
    }
    
    // Set toggle lock
    chatTogglingRef.current = true;
    
    // Make sure we're working with a boolean value
    const newEnabledState = typeof enabled === 'boolean' ? enabled : !isChatEnabled;
    
    // Update local state
    setIsChatEnabled(newEnabledState);
    
    // Emit chat toggle event if socket is connected
    if (socketRef.current && isConnected) {
     
      socketRef.current.emit("toggleStreamChat", {
        streamId: classInfo.streamSettings.streamId,
        enabled: newEnabledState
      });
    }
    
    // Release toggle lock after a short delay
    setTimeout(() => {
      chatTogglingRef.current = false;
    }, 500);
  }, [isConnected, classInfo.streamSettings.streamId, isChatEnabled]);
  // Handle player load state
  const handlePlayerLoad = useCallback(() => {
    setPlayerLoaded(true);
  }, []);
 const handleTakeAttendance = async() => {
  const users = usersData.filter(user=>user.isAdmin==false)
  const usersarr = []
  users.map((user)=>{
    usersarr.push(user.id)
  })
 let duration = "";
 if(week==0||week==1||week==2||week==3){
  duration = "1 Month"
 }
  else if(week==4||week==5||week==6||week==7){
  duration = "2 Month"
  }
  else if(week==8||week==9||week==10||week==11){
  duration = "3 Month"
  }
  else{
  duration = "4 Month"
  }
 const attendanceData = {
  batchid:alldata.batch,
  courseid:alldata._id,
  classid:classInfo.streamSettings.streamId,
  users:usersarr,
  weekname:`${week+1} Week`,
  duration:duration 
 }


 //api call
 try{
  setAttendanceLoader(true)
const res = await fetch("/api/attendancecrud", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": localStorage.getItem("dilmsadmintoken")
  },
  body: JSON.stringify(attendanceData)
})
const result = await res.json()
setAttendanceLoader(false)
if(result.success){
  toast.success(result.message)
}
else{
  toast.error(result.message)
}
 }
 catch(err){

  toast.error("Something went wrong! Try again later: " + err);
 }

 }
  return (
    <>
      <div className="container mx-auto p-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{classInfo.title}</h1>
              <p className="text-muted-foreground">Instructor: {classInfo.instructor}</p>
            </div>

            <div className="flex items-center gap-4">
              {!isLive && showStreamInfo && (
                <Button
                  variant="primary"
                  onClick={handleStartClassEarly}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Start Class Early
                </Button>
              )}
               <Button
                  variant="primary"
                  onClick={handleTakeAttendance}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={!isLive||usersData.length==1||!alldata.batch||attendanceLoader}
                >
                  {attendanceLoader ? "Taking Attendance..." : "Take Attendance"}
                </Button>
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

              {/* Show RTMP info early to admins if within 5 minutes of start time */}
              {showStreamInfo && (
                <RTMPInfo 
                  disabled={false} 
                  rtmpUrl={classInfo.streamSettings.rtmpUrl}
                  streamKey={classInfo.streamSettings.rtmpKey}
                  streamId={classInfo.streamSettings.streamId}
                  playbackId={classInfo.streamSettings.playbackId}
                />
              )}
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
    setIsChatEnabled={typeof toggleChatEnabled === 'function' ? toggleChatEnabled : () => {
      console.warn("toggleChatEnabled is not available");
    }}
    socket={socketRef.current}
    userData={data}
    onPlayerLoad={handlePlayerLoad}
    playerLoaded={playerLoaded}
    usersData={usersData}
    setUsersData={setUsersData}
  />
)}
        </div>
      </div>
    </>
  )
}