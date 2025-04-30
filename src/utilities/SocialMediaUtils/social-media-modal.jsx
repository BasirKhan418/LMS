"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Youtube,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Github,
  Twitch,
  Dribbble,
  DribbbleIcon as Behance,
  Globe,
  AtSign,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InstagramIcon as TiktokIcon } from "lucide-react"

export default function SocialMediaModal({ isOpen, onClose, onSubmit }) {
  const [links, setLinks] = useState({
    youtube: "",
    linkedin: "",
    twitter: "",
    facebook: "",
    instagram: "",
    github: "",
    tiktok: "",
    twitch: "",
    dribbble: "",
    behance: "",
    website: "",
    email: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("social")

  const handleChange = (platform) => (e) => {
    setLinks({ ...links, [platform]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Filter out empty links
    const filteredLinks = Object.fromEntries(Object.entries(links).filter(([_, value]) => value.trim() !== ""))

    await onSubmit(filteredLinks)

    // Reset form
    setLinks({
      youtube: "",
      linkedin: "",
      twitter: "",
      facebook: "",
      instagram: "",
      github: "",
      tiktok: "",
      twitch: "",
      dribbble: "",
      behance: "",
      website: "",
      email: "",
    })

    setIsSubmitting(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Add Your Social Media Links</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="social" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <TabsContent value="social" className="space-y-4 mt-0">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <Youtube className="h-4 w-4 text-red-500" />
                    <Label htmlFor="youtube">YouTube</Label>
                  </div>
                  <Input
                    id="youtube"
                    placeholder="https://youtube.com/channel/..."
                    value={links.youtube}
                    onChange={handleChange("youtube")}
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <Twitter className="h-4 w-4 text-sky-500" />
                    <Label htmlFor="twitter">Twitter</Label>
                  </div>
                  <Input
                    id="twitter"
                    placeholder="https://twitter.com/..."
                    value={links.twitter}
                    onChange={handleChange("twitter")}
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <Facebook className="h-4 w-4 text-blue-700" />
                    <Label htmlFor="facebook">Facebook</Label>
                  </div>
                  <Input
                    id="facebook"
                    placeholder="https://facebook.com/..."
                    value={links.facebook}
                    onChange={handleChange("facebook")}
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <Instagram className="h-4 w-4 text-pink-600" />
                    <Label htmlFor="instagram">Instagram</Label>
                  </div>
                  <Input
                    id="instagram"
                    placeholder="https://instagram.com/..."
                    value={links.instagram}
                    onChange={handleChange("instagram")}
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <TiktokIcon className="h-4 w-4 text-black dark:text-white" />
                    <Label htmlFor="tiktok">TikTok</Label>
                  </div>
                  <Input
                    id="tiktok"
                    placeholder="https://tiktok.com/@..."
                    value={links.tiktok}
                    onChange={handleChange("tiktok")}
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <Twitch className="h-4 w-4 text-purple-600" />
                    <Label htmlFor="twitch">Twitch</Label>
                  </div>
                  <Input
                    id="twitch"
                    placeholder="https://twitch.tv/..."
                    value={links.twitch}
                    onChange={handleChange("twitch")}
                  />
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setActiveTab("professional")}>
                  Next: Professional
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="professional" className="space-y-4 mt-0">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4 text-blue-600" />
                    <Label htmlFor="linkedin">LinkedIn</Label>
                  </div>
                  <Input
                    id="linkedin"
                    placeholder="https://linkedin.com/in/..."
                    value={links.linkedin}
                    onChange={handleChange("linkedin")}
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    <Label htmlFor="github">GitHub</Label>
                  </div>
                  <Input
                    id="github"
                    placeholder="https://github.com/..."
                    value={links.github}
                    onChange={handleChange("github")}
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <Dribbble className="h-4 w-4 text-pink-500" />
                    <Label htmlFor="dribbble">Dribbble</Label>
                  </div>
                  <Input
                    id="dribbble"
                    placeholder="https://dribbble.com/..."
                    value={links.dribbble}
                    onChange={handleChange("dribbble")}
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <Behance className="h-4 w-4 text-blue-500" />
                    <Label htmlFor="behance">Behance</Label>
                  </div>
                  <Input
                    id="behance"
                    placeholder="https://behance.net/..."
                    value={links.behance}
                    onChange={handleChange("behance")}
                  />
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setActiveTab("social")}>
                  Back: Social Media
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setActiveTab("other")}>
                  Next: Other
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="other" className="space-y-4 mt-0">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-green-500" />
                    <Label htmlFor="website">Website</Label>
                  </div>
                  <Input
                    id="website"
                    placeholder="https://yourwebsite.com"
                    value={links.website}
                    onChange={handleChange("website")}
                  />
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <AtSign className="h-4 w-4 text-orange-500" />
                    <Label htmlFor="email">Email</Label>
                  </div>
                  <Input
                    id="email"
                    placeholder="you@example.com"
                    value={links.email}
                    onChange={handleChange("email")}
                  />
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setActiveTab("professional")}>
                  Back: Professional
                </Button>
              </div>
            </TabsContent>

            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
