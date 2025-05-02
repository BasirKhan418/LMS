"use client"

import { useState, useEffect } from "react"
import { Heart, ThumbsUp, Laugh, PlayIcon as Clap, PartyPopperIcon as Party } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ReactionBar() {
  const [reactions, setReactions] = useState([])

  // Clean up reactions that have faded out
  useEffect(() => {
    const interval = setInterval(() => {
      setReactions((prev) => prev.filter((r) => r.opacity > 0))
    }, 100)

    return () => clearInterval(interval)
  }, [])

  // Animate reactions
  useEffect(() => {
    const interval = setInterval(() => {
      setReactions((prev) =>
        prev.map((reaction) => ({
          ...reaction,
          position: {
            x: reaction.position.x + (Math.random() * 2 - 1) * 0.5,
            y: reaction.position.y - 1,
          },
          opacity: reaction.opacity - 0.01,
        })),
      )
    }, 50)

    return () => clearInterval(interval)
  }, [])

  const sendReaction = (emoji) => {
    const newReaction = {
      id: Date.now().toString(),
      emoji,
      position: {
        x: Math.random() * 80 + 10, // Random position between 10% and 90%
        y: 100, // Start from bottom
      },
      opacity: 1,
    }

    setReactions([...reactions, newReaction])
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-1">
        <ReactionButton
          emoji={<ThumbsUp className="h-4 w-4" />}
          onClick={() => sendReaction(<ThumbsUp className="h-6 w-6 text-blue-500" />)}
        />
        <ReactionButton
          emoji={<Heart className="h-4 w-4" />}
          onClick={() => sendReaction(<Heart className="h-6 w-6 text-red-500" />)}
        />
        <ReactionButton
          emoji={<Laugh className="h-4 w-4" />}
          onClick={() => sendReaction(<Laugh className="h-6 w-6 text-yellow-500" />)}
        />
        <ReactionButton
          emoji={<Clap className="h-4 w-4" />}
          onClick={() => sendReaction(<Clap className="h-6 w-6 text-green-500" />)}
        />
        <ReactionButton
          emoji={<Party className="h-4 w-4" />}
          onClick={() => sendReaction(<Party className="h-6 w-6 text-purple-500" />)}
        />
      </div>

      {/* Floating reactions */}
      <div className="fixed bottom-0 left-0 right-0 h-screen pointer-events-none overflow-hidden">
        {reactions.map((reaction) => (
          <div
            key={reaction.id}
            className="absolute transition-all duration-100 ease-out"
            style={{
              left: `${reaction.position.x}%`,
              bottom: `${reaction.position.y}%`,
              opacity: reaction.opacity,
            }}
          >
            {reaction.emoji}
          </div>
        ))}
      </div>
    </div>
  )
}

function ReactionButton({ emoji, onClick }) {
  return (
    <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={onClick}>
      {emoji}
    </Button>
  )
}
