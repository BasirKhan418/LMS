"use client"

import { useState, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

export function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(80)
  const [progress, setProgress] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Simulate video progress
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsPlaying(false)
          return 100
        }
        return prev + 0.1
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isPlaying])

  const togglePlay = () => setIsPlaying(!isPlaying)
  const toggleMute = () => setIsMuted(!isMuted)

  const handleVolumeChange = (value) => {
    setVolume(value[0])
    if (value[0] === 0) {
      setIsMuted(true)
    } else if (isMuted) {
      setIsMuted(false)
    }
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
      <div className="absolute inset-0 flex items-center justify-center">
        <img src="/placeholder.svg?height=720&width=1280" alt="Video stream" className="w-full h-full object-cover" />

        {!isPlaying && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute inset-0 m-auto bg-black/30 text-white rounded-full w-16 h-16 hover:bg-black/50"
            onClick={togglePlay}
          >
            <Play className="h-8 w-8" />
          </Button>
        )}
      </div>

      {/* Video controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex flex-col gap-2">
          <Slider value={[progress]} max={100} step={0.1} className="w-full" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-white" onClick={togglePlay}>
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-white" onClick={toggleMute}>
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>

                <Slider
                  value={[isMuted ? 0 : volume]}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  className="w-20"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-white text-sm">
                {formatTime(progress * 60)} / {formatTime(60 * 60)}
              </span>

              <Button variant="ghost" size="icon" className="text-white" onClick={toggleFullscreen}>
                <Maximize className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  return [
    hours > 0 ? hours.toString().padStart(2, "0") : null,
    minutes.toString().padStart(2, "0"),
    secs.toString().padStart(2, "0"),
  ]
    .filter(Boolean)
    .join(":")
}
