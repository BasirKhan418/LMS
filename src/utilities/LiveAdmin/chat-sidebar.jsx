"use client"

import { useState, useRef, useEffect } from "react"
import { Send, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ChatSidebar({ isAdmin, isChatEnabled = true, setIsChatEnabled }) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    {
      id: "1",
      user: { name: "Instructor", role: "admin" },
      text: "Welcome to the class! Feel free to ask questions.",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      id: "2",
      user: { name: "Sarah", role: "user" },
      text: "Thanks for the session! Looking forward to learning more.",
      timestamp: new Date(Date.now() - 1000 * 60 * 3),
    },
    {
      id: "3",
      user: { name: "Mike", role: "user" },
      text: "Could you explain the concept of React hooks again?",
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
    },
    {
      id: "4",
      user: { name: "Instructor", role: "admin" },
      text: "Sure Mike! React hooks let you use state and other React features without writing a class component.",
      timestamp: new Date(Date.now() - 1000 * 60 * 1),
    },
  ])

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!message.trim() || !isChatEnabled) return

    const newMessage = {
      id: Date.now().toString(),
      user: {
        name: isAdmin ? "Instructor" : "You",
        role: isAdmin ? "admin" : "user",
      },
      text: message,
      timestamp: new Date(),
    }

    setMessages([...messages, newMessage])
    setMessage("")
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-[600px] border rounded-lg overflow-hidden">
      {!isChatEnabled && (
        <Alert variant="destructive" className="m-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Chat has been disabled by the instructor</AlertDescription>
        </Alert>
      )}

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} isCurrentUser={!isAdmin && msg.user.name === "You"} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-3 border-t">
        <div className="flex gap-2">
          <Input
            placeholder={isChatEnabled ? "Type your message..." : "Chat is disabled"}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!isChatEnabled}
          />
          <Button size="icon" onClick={handleSendMessage} disabled={!isChatEnabled || !message.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function ChatMessage({ message, isCurrentUser }) {
  const isAdmin = message.user.role === "admin"

  return (
    <div className={`flex gap-3 ${isCurrentUser ? "justify-end" : ""}`}>
      {!isCurrentUser && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.user.avatar || "/placeholder.svg"} />
          <AvatarFallback className={isAdmin ? "bg-primary text-primary-foreground" : ""}>
            {message.user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      )}

      <div className={`max-w-[80%] ${isCurrentUser ? "order-first" : ""}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-sm font-medium ${isAdmin ? "text-primary" : ""}`}>{message.user.name}</span>
          <span className="text-xs text-muted-foreground">{formatMessageTime(message.timestamp)}</span>
        </div>

        <div
          className={`p-3 rounded-lg ${
            isAdmin
              ? "bg-primary/10 border border-primary/20"
              : isCurrentUser
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
          }`}
        >
          <p className="text-sm">{message.text}</p>
        </div>
      </div>
    </div>
  )
}

function formatMessageTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}
