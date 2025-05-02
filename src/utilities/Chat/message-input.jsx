"use client"

import { useState, useEffect, useRef } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MessageInput({ onSendMessage, team, socket, user }) {
  const [message, setMessage] = useState("")
  const typingTimeoutRef = useRef(null)
  const isTypingRef = useRef(false)

  // Handle typing indicator
  const handleTyping = (isTyping) => {
    // Only emit if the typing state has changed
    if (isTypingRef.current !== isTyping && socket && team?._id && user?._id) {
      isTypingRef.current = isTyping
      socket.emit("typing", {
        isTyping,
        teamid: team._id,
        userid: user._id
      })
    }
  }

  // Handle input change
  const handleInputChange = (e) => {
    setMessage(e.target.value)
    
    // Set typing indicator
    handleTyping(true)
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    
    // Set timeout to stop typing indicator after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      handleTyping(false)
    }, 2000)
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message)
      setMessage("")
      handleTyping(false)
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }

  // Clean up typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
        // Make sure to set typing to false when component unmounts
        handleTyping(false)
      }
    }
  }, [])

  return (
    <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="w-full rounded-full border border-gray-300 dark:border-gray-600 py-2.5 px-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-600 transition-shadow"
            readOnly={!team || team === {} || team === null}
          />
        </div>

        <div className="flex items-center gap-1">
          <Button
            type="submit"
            size="icon"
            className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-full h-10 w-10 shadow-md transition-all duration-200 hover:shadow-lg"
            disabled={!team || team === {} || team === null}
          >
            <Send className="h-5 w-5" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </form>
    </div>
  )
}