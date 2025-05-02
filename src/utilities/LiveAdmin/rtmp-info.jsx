"use client"

import { useState } from "react"
import { Copy, Check, Video } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function RTMPInfo({ disabled = false }) {
  const [copied, setCopied] = useState({
    key: false,
    url: false,
  })

  // Mock RTMP data
  const rtmpUrl = "rtmp://live.example.com/stream"
  const rtmpKey = "live_123456789_abcdefghijklmnopqrstuvwxyz"

  const handleCopy = (type, value) => {
    navigator.clipboard.writeText(value)

    setCopied({
      ...copied,
      [type]: true,
    })

    setTimeout(() => {
      setCopied({
        ...copied,
        [type]: false,
      })
    }, 2000)
  }

  return (
    <Card className={`${disabled ? "opacity-70" : ""} border border-border/50`}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-full ${disabled ? "bg-muted" : "bg-primary/10"}`}>
            <Video className={`h-5 w-5 ${disabled ? "text-muted-foreground" : "text-primary"}`} />
          </div>
          <div>
            <CardTitle>Stream Information</CardTitle>
            <CardDescription>
              {disabled
                ? "Stream information will be available when the class starts"
                : "Use these details to set up your streaming software"}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="rtmp-url">RTMP URL</Label>
          <div className="flex gap-2">
            <Input id="rtmp-url" value={rtmpUrl} readOnly disabled={disabled} className="font-mono text-sm" />
            <Button
              variant="outline"
              size="icon"
              disabled={disabled}
              onClick={() => handleCopy("url", rtmpUrl)}
              className={copied.url ? "bg-green-500/10 text-green-500 border-green-500/20" : ""}
            >
              {copied.url ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="rtmp-key">Stream Key</Label>
          <div className="flex gap-2">
            <Input
              id="rtmp-key"
              value={rtmpKey}
              type="password"
              readOnly
              disabled={disabled}
              className="font-mono text-sm"
            />
            <Button
              variant="outline"
              size="icon"
              disabled={disabled}
              onClick={() => handleCopy("key", rtmpKey)}
              className={copied.key ? "bg-green-500/10 text-green-500 border-green-500/20" : ""}
            >
              {copied.key ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
