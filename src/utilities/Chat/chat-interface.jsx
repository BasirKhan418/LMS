"use client"

import { useState, useEffect, useRef } from "react"
import Sidebar from "./sidebar"
import ChatArea from "./chat-area"
import MessageInput from "./message-input"
import { Menu, X, Info, PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { io } from "socket.io-client"

export default function ChatInterface({user, team}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [messages, setMessages] = useState([])
  const [onlineUsers, setOnlineUsers] = useState([])
  const [typingUsers, setTypingUsers] = useState([])
  const socketRef = useRef(null)

  // Initialize socket connection once
  useEffect(() => {
    // Create socket connection
    socketRef.current = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL)
    
    // Handle connection event
    socketRef.current.on("connect", () => {
      
      
      // Join the team room with user information
      if (team && team._id && user && user._id) {
        socketRef.current.emit("join", { 
          teamid: team._id,
          userid: user._id,
          userName: user.name
        })
      }
    })

    // Handle online users count update
    socketRef.current.on("onlineUsers", (data) => {
      
      if (data.teamid === team?._id) {
        setOnlineUsers(data.users || []) // Store the actual users array, not just count
      }
    })
    
    // Handle typing users update
    socketRef.current.on("typingUsers", (data) => {
      
      if (data.teamid === team?._id) {
        setTypingUsers(data.users)
      }
    })
    
    // Handle incoming messages
    socketRef.current.on("message", (data) => {
      
      setMessages(prevMessages => [...prevMessages, data])
    })

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [team?._id, user?._id, user?.name])

  // Fetch existing messages on initial load
  const fetchAllMessages = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}/api/chat/get`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("dilmstoken")
        },
        body: JSON.stringify({
          groupid: team?._id
        })
      })
      
      const data = await res.json()
      
      
      if (data.success) {
        setMessages(data.data)
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      
      toast.error("Error in fetching messages")
    }
  }

  // Set initial state, detect mobile screens, and fetch messages
  useEffect(() => {
    if (team?._id) {
      fetchAllMessages()
    }
    
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
  }, [team?._id, isMobile])

  const handleSendMessage = (message) => {
    if (message.trim() === "" || !user || !team) return

    const newMessage = {
      name: user.name,
      message: message,
      groupid: team._id,
      sender: user._id,
      timestamp: new Date().toISOString()
    }

    // Emit the message to the server
    socketRef.current.emit("message", newMessage)
    
    // Auto-close sidebar on mobile when sending a message
    if (isMobile) {
      setIsSidebarOpen(false)
    }
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }
  
  // Format typing users message
  const getTypingText = () => {
    if (!typingUsers || typingUsers.length === 0) return "";
    
    // Filter out current user
    const filteredUsers = typingUsers.filter(name => name !== user?.name);
    
    if (filteredUsers.length === 0) return "";
    if (filteredUsers.length === 1) return `${filteredUsers[0]} is typing...`;
    if (filteredUsers.length === 2) return `${filteredUsers[0]} and ${filteredUsers[1]} are typing...`;
    if (filteredUsers.length > 2) return `${filteredUsers[0]} and ${filteredUsers.length - 1} others are typing...`;
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
          <Sidebar team={team} onlineUsers={onlineUsers} user={user}/>
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
                  {team?.teamname?.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{team?.teamname}</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {onlineUsers.length} online
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full"
                onClick={() => {
                  toast.success(`You are connected to ${team?.teamname} discussion group`)
                }}
              >
                <Info className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ChatArea messages={messages} team={team} user={user} />
          
          {/* Typing Indicator */}
          {getTypingText() && (
            <div className="px-4 py-1 text-xs text-gray-500 italic animate-pulse">
              {getTypingText()}
            </div>
          )}

          {/* Message Input */}
          <MessageInput 
            onSendMessage={handleSendMessage} 
            team={team} 
            socket={socketRef.current}
            user={user}
          />
        </div>
      </div>
    </div>
  )
}