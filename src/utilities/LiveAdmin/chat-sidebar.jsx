"use client"

import { useState, useRef, useEffect } from "react"
import { Send, AlertCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

export function ChatSidebar({ isAdmin, socket, streamId, userData,users ,participantCount,setCurrentMembers,setUsersData}) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [isChatEnabled, setIsChatEnabled] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  
  const messagesEndRef = useRef(null)

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Socket connection and event handlers
  useEffect(() => {
    if (!socket) {
      console.error("Socket instance not available for chat")
      return
    }

    // Check connection status
    setIsConnected(socket.connected)

    // Set up event listeners
    socket.on("connect", () => {
      console.log("Socket connected in ChatSidebar")
      setIsConnected(true)
    })

    socket.on("disconnect", () => {
      console.log("Socket disconnected in ChatSidebar")
      setIsConnected(false)
    })

    socket.on("streamUsers", (data) => {
      console.log("Stream users updated:", data);
      if (data.users && Array.isArray(data.users)) {
        setCurrentMembers(data.users.length);
        console.log("Users data updated basir:", data.users);
        setUsersData(data.users);
      }
    });

    // Chat message event
    socket.on("streamMessage", (data) => {
      console.log("Received stream message:", data)
      const newMessage = {
        id: data.timestamp || Date.now(),
        user: {
          name: data.userName,
          role: data.userId === userData?._id ? "user" : 
                data.isAdmin ? "admin" : "participant"
        },
        text: data.message,
        timestamp: new Date(data.timestamp || Date.now()),
        isCurrentUser: data.userId === userData?._id,
        isAdmin: data.isAdmin
      }
      
      setMessages(prev => [...prev, newMessage])
    })

    // Chat state event (enabled/disabled)
    socket.on("streamChatState", (data) => {
      console.log("Stream chat state updated:", data)
      setIsChatEnabled(data.messagesEnabled)
      
      if (data.updatedBy && data.messagesEnabled !== isChatEnabled) {
        const action = data.messagesEnabled ? "enabled" : "disabled"
        toast.info(`Chat has been ${action} by the instructor`)
      }
    })

    // Chat notice event (e.g., errors)
    socket.on("streamChatNotice", (data) => {
      console.log("Stream chat notice:", data)
      toast.info(data.message)
    })

    // Add initial welcome message if no messages yet
    if (messages.length === 0) {
      setMessages([{
        id: "system-welcome",
        user: { name: "System", role: "admin" },
        text: "Welcome to the live class chat! Feel free to ask questions.",
        timestamp: new Date(),
        isAdmin: true
      }])
    }

    // Clean up event listeners
    return () => {
      socket.off("streamMessage")
      socket.off("streamChatState")
      socket.off("streamChatNotice")
      socket.off("streamUsers")
    }
  }, [socket, userData?._id])

  // Handle sending messages
  const handleSendMessage = () => {
    if (!message.trim() || (!isChatEnabled && !isAdmin) || !socket || !isConnected) return

    console.log("Sending message:", message.trim())
    // Send message through socket
    socket.emit("streamMessage", {
      streamId: streamId,
      message: message.trim(),
      userId: userData?._id,
      userName: userData?.name,
      isAdmin: isAdmin
    })
    console.log("Message sent:", {
      streamId: streamId,
      message: message.trim(),
      userId: userData?._id,
      userName: userData?.name,
      isAdmin: isAdmin
    })

    // We don't add the message locally - we'll receive it back from the server
    setMessage("")
  }

  // Toggle chat enabled state (admin only)
  const handleToggleChatEnabled = () => {
    if (!isAdmin || !socket) return
    
    socket.emit("toggleStreamChat", {
      streamId: streamId,
      enabled: !isChatEnabled
    })
    setIsChatEnabled(!isChatEnabled);
    toast.info(`Chat has been ${!isChatEnabled ? "enabled" : "disabled"} by the instructor`)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-[600px] border rounded-lg overflow-hidden">
      {/* Chat header with status */}
      <div className="bg-card p-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-medium">Live Chat</h3>
          <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
          <Badge variant="outline" className="text-xs">
            {participantCount} {participantCount === 1 ? "participant" : "participants"}
          </Badge>
        </div>
        
        {isAdmin && (
          <Button 
            variant={isChatEnabled ? "outline" : "secondary"} 
            size="sm"
            onClick={handleToggleChatEnabled}
          >
            {isChatEnabled ? "Disable Chat" : "Enable Chat"}
          </Button>
        )}
      </div>

      {/* Chat disabled alert */}
      {!isChatEnabled && (
        <Alert variant="destructive" className="m-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {isAdmin 
              ? "Chat is disabled for participants. You can still send messages as admin."
              : "Chat has been disabled by the instructor"
            }
          </AlertDescription>
        </Alert>
      )}

      {/* Messages area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <ChatMessage 
              key={msg.id} 
              message={msg} 
              isCurrentUser={msg.isCurrentUser || msg.user.name === "You"} 
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input area */}
      <div className="p-3 border-t">
        <div className="flex gap-2">
          <Input
            placeholder={!isChatEnabled && !isAdmin ? "Chat is disabled" : "Type your message..."}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={(!isChatEnabled && !isAdmin) || !isConnected}
          />
          <Button 
            size="icon" 
            onClick={handleSendMessage} 
            disabled={(!isChatEnabled && !isAdmin) || !message.trim() || !isConnected}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {!isConnected && (
          <p className="text-xs text-red-500 mt-1">
            Disconnected from chat server. Trying to reconnect...
          </p>
        )}
      </div>
    </div>
  )
}

function ChatMessage({ message, isCurrentUser }) {
  const isAdmin = message.isAdmin || message.user.role === "admin"
  const isSystem = message.user.name === "System"

  return (
    <div className={`flex gap-3 ${isCurrentUser ? "justify-end" : ""}`}>
      {!isCurrentUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.user.avatar || "/placeholder.svg"} />
          <AvatarFallback className={
            isSystem ? "bg-blue-500 text-white" :
            isAdmin ? "bg-primary text-primary-foreground" : 
            "bg-secondary"
          }>
            {message.user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={`max-w-[80%] ${isCurrentUser ? "order-first" : ""}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-sm font-medium ${
            isSystem ? "text-blue-500" :
            isAdmin ? "text-primary" : ""
          }`}>
            {message.user.name}
          </span>
          {isAdmin && !isSystem && (
            <Badge variant="outline" className="bg-primary/10 text-primary text-xs">Admin</Badge>
          )}
          <span className="text-xs text-muted-foreground">
            {formatMessageTime(message.timestamp)}
          </span>
        </div>

        <div
          className={`p-3 rounded-lg ${
            isSystem ? "bg-blue-50 border border-blue-200 dark:bg-blue-950 dark:border-blue-900" :
            isAdmin ? "bg-primary/10 border border-primary/20 dark:bg-primary/20 dark:border-primary/30" :
            isCurrentUser ? "bg-primary text-primary-foreground" :
            "bg-muted"
          }`}
        >
          <p className="text-sm">{message.text}</p>
        </div>
      </div>
    </div>
  )
}

function formatMessageTime(date) {
  if (!(date instanceof Date) || isNaN(date)) {
    return "";
  }
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}