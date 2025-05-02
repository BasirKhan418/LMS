"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

export function ClassTimer({ targetDate, onComplete, compact = false }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime()

      if (difference <= 0) {
        setIsComplete(true)
        onComplete?.()
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        }
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }

    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft()
      setTimeLeft(newTimeLeft)
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate, onComplete])

  if (compact) {
    return (
      <div className="flex items-center justify-center gap-3">
        <TimeUnit value={timeLeft.days} label="days" compact />
        <TimeUnit value={timeLeft.hours} label="hours" compact />
        <TimeUnit value={timeLeft.minutes} label="min" compact />
        <TimeUnit value={timeLeft.seconds} label="sec" compact />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-wrap justify-center gap-4 md:gap-6">
        <TimeUnit value={timeLeft.days} label="Days" />
        <TimeUnit value={timeLeft.hours} label="Hours" />
        <TimeUnit value={timeLeft.minutes} label="Minutes" />
        <TimeUnit value={timeLeft.seconds} label="Seconds" />
      </div>
    </div>
  )
}

function TimeUnit({ value, label, compact = false }) {
  if (compact) {
    return (
      <div className="flex items-center">
        <span className="font-mono font-medium text-lg">{value.toString().padStart(2, "0")}</span>
        <span className="text-xs text-muted-foreground ml-1">{label}</span>
      </div>
    )
  }

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity"></div>
      <Card className="relative p-4 w-24 md:w-28 flex flex-col items-center justify-center border-primary/20 bg-card/50 backdrop-blur-sm">
        <span className="text-4xl font-bold font-mono text-primary">{value.toString().padStart(2, "0")}</span>
        <span className="text-sm text-muted-foreground mt-1">{label}</span>
      </Card>
    </div>
  )
}
