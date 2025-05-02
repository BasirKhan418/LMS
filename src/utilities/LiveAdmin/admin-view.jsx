"use client"

import { useState, useEffect } from "react"
import { ClassTimer } from "./class-timer"
import { LiveStreamView } from "./live-stream-view"
import { RTMPInfo } from "./rtmp-info"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Toaster, toast } from "sonner"

export default function AdminView() {
  const [isLive, setIsLive] = useState(false)
  const [isChatEnabled, setIsChatEnabled] = useState(true)
  const [activeView, setActiveView] = useState("dashboard")
  const [classInfo, setClassInfo] = useState({
    title: "Advanced React Patterns & Performance Optimization",
    startTime: new Date(Date.now() + 1000 * 60 * 2).toISOString(), // 2 minutes from now
    instructor: "Dr. Sarah Johnson",
    category: "Web Development",
    attendees: 42,
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

  const handleCompleteClass = () => {
    toast.success("Class has ended successfully!")
    setIsLive(false)
    // In a real app, you would handle ending the stream here
  }

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
              <div className="flex items-center space-x-2">
                <Switch id="chat-mode" checked={isChatEnabled} onCheckedChange={setIsChatEnabled} />
                <Label htmlFor="chat-mode">Chat {isChatEnabled ? "Enabled" : "Disabled"}</Label>
              </div>

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

              <RTMPInfo disabled={true} />
            </div>
          ) : (
            <div className="mb-6">
              <RTMPInfo disabled={false} />
            </div>
          )}

          {isLive && (
            <LiveStreamView
              isAdmin={true}
              classInfo={classInfo}
              isChatEnabled={isChatEnabled}
              setIsChatEnabled={setIsChatEnabled}
            />
          )}
        </div>
      </div>
    </>
  )
}