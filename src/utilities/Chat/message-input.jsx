"use client"

import { useState } from "react"
import { Send, Paperclip, Smile, Mic, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MessageInput({ onSendMessage }) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message)
      setMessage("")
    }
  }

  return (
    <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        

        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-full rounded-full border border-gray-300 dark:border-gray-600 py-2.5 px-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-600 transition-shadow"
          />
         
        </div>

        <div className="flex items-center gap-1">
         

          <Button
            type="submit"
            size="icon"
            className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-full h-10 w-10 shadow-md transition-all duration-200 hover:shadow-lg"
          >
            <Send className="h-5 w-5" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </form>
    </div>
  )
}
