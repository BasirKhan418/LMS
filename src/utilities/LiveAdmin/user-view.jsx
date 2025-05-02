"use client"

import { useState, useEffect } from "react"
import { ClassTimer } from "./class-timer"
import { LiveStreamView } from "./live-stream-view"
import { Toaster, toast } from "sonner"
import { BookOpen, Calendar, Users, Clock, GraduationCap } from "lucide-react"

export function UserView({ content }) {
  const [isLive, setIsLive] = useState(false)
  const [classInfo, setClassInfo] = useState({
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
      if (now >= startTime) {
        setIsLive(true)
        // toast.success("Class is now live!")
      }
    }

    const interval = setInterval(checkTime, 1000)
    checkTime() // Check immediately on mount

    return () => clearInterval(interval)
  }, [classInfo.startTime])

  return (
    <div className="bg-gradient-to-b from-background to-background/80">
      <Toaster position="top-right" richColors closeButton={false} />
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

            {/* Animated waiting message */}
            <div className="text-center animate-pulse">
              <p className="text-muted-foreground">Waiting for {classInfo.instructor} to start the session...</p>
            </div>
          </div>
        </div>
      ) : (
        <LiveStreamView 
          isAdmin={false} 
          classInfo={classInfo} 
        />
      )}
    </div>
  )
}