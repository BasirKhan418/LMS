"use client"

import { useState, useEffect } from "react"
import Sidebar from "./sidebar"
import ChatArea from "./chat-area"
import MessageInput from "./message-input"
import { Menu, X, Info, Phone, Video, PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Toaster ,toast } from "sonner"

export default function ChatInterface({user,team}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [messages, setMessages] = useState([]);

  // Set initial state and detect mobile screens
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024
      setIsMobile(mobile)
      
      // Only auto-close on initial load for mobile
      if (mobile && !isMobile) {
        setIsSidebarOpen(false)
      }
    }

    // Set initial state
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [isMobile])

  const handleSendMessage = (message) => {
    if (message.trim() === "") return

    const newMessage = {
      id: messages.length + 1,
      sender: "You",
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isSelf: true,
      avatar: "/placeholder.svg?height=40&width=40",
    }

    setMessages([...messages, newMessage])
    
    // Auto-close sidebar on mobile when sending a message
    if (isMobile) {
      setIsSidebarOpen(false)
    }
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }


  return (
    <div className="flex flex-col h-screen overflow-hidden lg:p-4">
      <div className="flex flex-1 overflow-hidden rounded-none lg:rounded-2xl shadow-lg bg-white dark:bg-gray-800">
        {/* Sidebar - Mobile Overlay */}
        <div
          className={`${isSidebarOpen && isMobile ? "fixed inset-0 z-40 bg-black/50 lg:hidden" : "hidden"}`}
          onClick={toggleSidebar}
        />

        {/* Sidebar */}
        <div
          className={`
            ${isMobile 
              ? isSidebarOpen
                ? "fixed inset-y-0 left-0 z-50 w-80 transform translate-x-0"
                : "fixed inset-y-0 left-0 z-50 w-80 transform -translate-x-full"
              : isSidebarOpen
                ? "relative z-10 w-80 lg:w-96"
                : "w-0 overflow-hidden"
            } 
            transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full
          `}
        >
          {isMobile && (
            <div className="absolute right-2 top-2">
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-gray-500">
                <X className="h-5 w-5" />
              </Button>
            </div>
          )}
          <Sidebar team={team&&team} />
        </div>

        {/* Main Chat Area */}
        <div className="flex flex-col flex-1 h-full w-full">
          {/* Chat Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center">
              {isMobile ? (
                <Button variant="ghost" size="icon" className="mr-2" onClick={toggleSidebar}>
                  <Menu className="h-5 w-5" />
                </Button>
              ) : (
                <Button variant="ghost" size="icon" className="mr-2" onClick={toggleSidebar}>
                  {isSidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
                </Button>
              )}

              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg shadow-md">
                  {team&&team.teamname.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{team&&team.teamname}</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    4 online
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1">
             
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full"
                onClick={()=>{
                    toast.success(`You are connecting to ${team&&team.teamname} discussion group`)
                }}
              >
                <Info className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ChatArea messages={messages} team={team}/>

          {/* Message Input */}
          <MessageInput onSendMessage={handleSendMessage} team={team}/>
        </div>
      </div>
    </div>
  )
}