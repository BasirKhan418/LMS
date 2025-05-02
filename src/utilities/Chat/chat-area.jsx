"use client"

import { useEffect, useRef } from "react"

export default function ChatArea({ messages, team, user }) {
  const messagesEndRef = useRef(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Group messages by date for better readability
  const groupMessagesByDate = () => {
    const grouped = {}
    
    messages.forEach(msg => {
      const date = msg.timestamp 
        ? new Date(msg.timestamp).toLocaleDateString() 
        : 'Unknown Date'
      
      if (!grouped[date]) {
        grouped[date] = []
      }
      
      grouped[date].push(msg)
    })
    
    return grouped
  }

  const groupedMessages = groupMessagesByDate()

  // Format timestamp to readable time
  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  
  // Check if a message is from the current user
  const isCurrentUser = (sender) => {
    return user && user._id === sender
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-violet-500 dark:text-violet-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No messages yet</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Be the first to send a message in this team!
            </p>
          </div>
        </div>
      ) : (
        Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date} className="space-y-4">
            <div className="flex justify-center">
              <div className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400">
                {date}
              </div>
            </div>
            
            <div className="space-y-3">
              {dateMessages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${isCurrentUser(message.sender) ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] md:max-w-[70%] rounded-2xl p-3 ${
                      isCurrentUser(message.sender)
                        ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-br-none"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none"
                    }`}
                  >
                    {!isCurrentUser(message.sender) && (
                      <div className="text-xs font-medium text-violet-600 dark:text-violet-400 mb-1">
                        {message.name}
                      </div>
                    )}
                    <div className="whitespace-pre-wrap break-words text-sm">
                      {message.message}
                    </div>
                    <div
                      className={`text-[10px] mt-1 text-right ${
                        isCurrentUser(message.sender) ? "text-white/70" : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}