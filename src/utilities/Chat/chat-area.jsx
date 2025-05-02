"use client"

import { useEffect, useRef } from "react"

export default function ChatArea({ messages }) {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Group messages by sender to create message bubbles
  const groupedMessages = messages.reduce((acc, message, index) => {
    const prevMessage = messages[index - 1]
    const isSameSender = prevMessage && prevMessage.sender === message.sender

    if (isSameSender) {
      acc[acc.length - 1].messages.push(message)
    } else {
      acc.push({
        sender: message.sender,
        avatar: message.avatar,
        isSelf: message.isSelf,
        messages: [message],
      })
    }

    return acc
  }, [])

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
      <div className="space-y-6 py-3">
        {groupedMessages.map((group, groupIndex) => (
          <div key={groupIndex} className={`flex ${group.isSelf ? "justify-end" : "justify-start"}`}>
            {!group.isSelf && (
              <img
                src={group.avatar || "/placeholder.svg"}
                alt={group.sender}
                className="h-8 w-8 rounded-full mr-2 self-end mb-1"
              />
            )}

            <div className={`flex flex-col ${group.isSelf ? "items-end" : "items-start"} max-w-[75%]`}>
              {!group.isSelf && (
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">{group.sender}</span>
              )}

              <div className="space-y-1">
                {group.messages.map((message, messageIndex) => (
                  <div
                    key={message.id}
                    className={`rounded-2xl px-4 py-2 ${
                      group.isSelf
                        ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white"
                        : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 shadow-sm"
                    } ${
                      messageIndex === 0
                        ? group.isSelf
                          ? "rounded-br-sm"
                          : "rounded-bl-sm"
                        : messageIndex === group.messages.length - 1
                          ? group.isSelf
                            ? "rounded-tr-sm"
                            : "rounded-tl-sm"
                          : group.isSelf
                            ? "rounded-r-sm"
                            : "rounded-l-sm"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    {messageIndex === group.messages.length - 1 && (
                      <p
                        className={`text-xs mt-1 ${
                          group.isSelf ? "text-purple-200" : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {message.timestamp}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {group.isSelf && (
              <img
                src={group.avatar || "/placeholder.svg"}
                alt={group.sender}
                className="h-8 w-8 rounded-full ml-2 self-end mb-1"
              />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
