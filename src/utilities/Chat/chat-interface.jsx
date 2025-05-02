"use client"

import { useState, useEffect } from "react"
import Sidebar from "./sidebar"
import ChatArea from "./chat-area"
import MessageInput from "./message-input"
import { Menu, X, Info, Phone, Video, PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

// Dummy data
const groupData = {
  name: "Project Brainstorm Team",
  description: "Group for discussing new project ideas",
  participants: [
    { id: 1, name: "Sarah Johnson", avatar: "/placeholder.svg?height=40&width=40", isOnline: true },
    { id: 2, name: "Michael Chen", avatar: "/placeholder.svg?height=40&width=40", isOnline: true },
    { id: 3, name: "Jessica Williams", avatar: "/placeholder.svg?height=40&width=40", isOnline: false },
    { id: 4, name: "David Rodriguez", avatar: "/placeholder.svg?height=40&width=40", isOnline: true },
    { id: 5, name: "Emily Thompson", avatar: "/placeholder.svg?height=40&width=40", isOnline: false },
    { id: 6, name: "James Wilson", avatar: "/placeholder.svg?height=40&width=40", isOnline: false },
    { id: 7, name: "Olivia Martinez", avatar: "/placeholder.svg?height=40&width=40", isOnline: true },
  ],
  messages: [
    {
      id: 1,
      sender: "Sarah Johnson",
      content: "Hey everyone! Welcome to our new group chat.",
      timestamp: "10:30 AM",
      isSelf: false,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      sender: "Michael Chen",
      content: "Thanks for setting this up, Sarah!",
      timestamp: "10:32 AM",
      isSelf: false,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      sender: "You",
      content: "I'm excited to start brainstorming ideas for the new project.",
      timestamp: "10:35 AM",
      isSelf: true,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      sender: "David Rodriguez",
      content: "Me too! I've been thinking about some potential features we could implement.",
      timestamp: "10:37 AM",
      isSelf: false,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 5,
      sender: "Olivia Martinez",
      content: "I've prepared some mockups that I'll share with everyone later today.",
      timestamp: "10:40 AM",
      isSelf: false,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 6,
      sender: "You",
      content: "That sounds great, Olivia! Looking forward to seeing them.",
      timestamp: "10:42 AM",
      isSelf: true,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 7,
      sender: "Michael Chen",
      content: "Should we schedule a video call to discuss everything in more detail?",
      timestamp: "10:45 AM",
      isSelf: false,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 8,
      sender: "Sarah Johnson",
      content: "Good idea. How about tomorrow at 2 PM?",
      timestamp: "10:47 AM",
      isSelf: false,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 9,
      sender: "David Rodriguez",
      content: "Works for me!",
      timestamp: "10:49 AM",
      isSelf: false,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 10,
      sender: "You",
      content: "I'll be there.",
      timestamp: "10:50 AM",
      isSelf: true,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ],
}

export default function ChatInterface() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

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

  const [messages, setMessages] = useState(groupData.messages)

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
          <Sidebar groupData={groupData} />
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
                  {groupData.name.charAt(0)}
                </div>
                <div className="ml-3">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{groupData.name}</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {groupData.participants.filter((p) => p.isOnline).length} online
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1">
             
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full"
              >
                <Info className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ChatArea messages={messages} />

          {/* Message Input */}
          <MessageInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  )
}