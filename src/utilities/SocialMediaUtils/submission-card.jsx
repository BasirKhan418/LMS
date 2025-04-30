import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Youtube,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Github,
  ExternalLink,
  Twitch,
  Dribbble,
  Globe,
  AtSign,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TwitterIcon as TikTok } from "lucide-react"

export default function SubmissionCard({ submission }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  // Count the number of social links
  const linkCount = Object.keys(submission.links[0]).filter(
    (key) =>
      [
        "youtube",
        "linkedin",
        "twitter",
        "facebook",
        "instagram",
        "github",
        "tiktok",
        "twitch",
        "dribbble",
        "behance",
        "website",
        "email",
      ].includes(key) && [key],
  ).length

  return (
    <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 pb-2 flex flex-row items-center">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={submission.avatar || "/placeholder.svg"} alt={submission.userid.name} />
            <AvatarFallback>{submission.userid.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{submission.name}</h3>
            <p className="text-xs text-muted-foreground">Shared {formatDate(submission.createdAt)}</p>
          </div>
        </div>
        <Badge variant="outline" className="ml-auto">
          {linkCount} {linkCount === 1 ? "link" : "links"}
        </Badge>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {submission.links.map((item,index)=>(<div key={index} className="flex  items-center gap-2 justify-between w-full flex-col lg:flex-row md:flex-row">
          {item.youtube && (
            <SocialLink
              platform="YouTube"
              url={item.youtube}
              icon={<Youtube className="h-4 w-4 text-red-500" />}
              bgColor="bg-red-50 dark:bg-red-950/30"
              textColor="text-red-600 dark:text-red-400"
              borderColor="border-red-200 dark:border-red-800"
            />
          )}

          {item.linkedin && (
            <SocialLink
              platform="LinkedIn"
              url={item.linkedin}
              icon={<Linkedin className="h-4 w-4 text-blue-600" />}
              bgColor="bg-blue-50 dark:bg-blue-950/30"
              textColor="text-blue-600 dark:text-blue-400"
              borderColor="border-blue-200 dark:border-blue-800"
            />
          )}

          {item.twitter && (
            <SocialLink
              platform="Twitter"
              url={item.twitter }
              icon={<Twitter className="h-4 w-4 text-sky-500" />}
              bgColor="bg-sky-50 dark:bg-sky-950/30"
              textColor="text-sky-600 dark:text-sky-400"
              borderColor="border-sky-200 dark:border-sky-800"
            />
          )}

          {item.facebook && (
            <SocialLink
              platform="Facebook"
              url={item.facebook}
              icon={<Facebook className="h-4 w-4 text-blue-700" />}
              bgColor="bg-blue-50 dark:bg-blue-950/30"
              textColor="text-blue-700 dark:text-blue-400"
              borderColor="border-blue-200 dark:border-blue-800"
            />
          )}

          {item.instagram && (
            <SocialLink
              platform="Instagram"
              url={item.instagram}
              icon={<Instagram className="h-4 w-4 text-pink-600" />}
              bgColor="bg-pink-50 dark:bg-pink-950/30"
              textColor="text-pink-600 dark:text-pink-400"
              borderColor="border-pink-200 dark:border-pink-800"
            />
          )}

          {item.github && (
            <SocialLink
              platform="GitHub"
              url={item.github}
              icon={<Github className="h-4 w-4" />}
              bgColor="bg-gray-50 dark:bg-gray-900"
              textColor="text-gray-800 dark:text-gray-200"
              borderColor="border-gray-200 dark:border-gray-700"
            />
          )}

          {item.tiktok && (
            <SocialLink
              platform="TikTok"
              url={item.tiktok}
              icon={<TikTok className="h-4 w-4" />}
              bgColor="bg-gray-50 dark:bg-gray-900"
              textColor="text-gray-800 dark:text-gray-200"
              borderColor="border-gray-200 dark:border-gray-700"
            />
          )}

          {item.twitch && (
            <SocialLink
              platform="Twitch"
              url={item.twitch}
              icon={<Twitch className="h-4 w-4 text-purple-600" />}
              bgColor="bg-purple-50 dark:bg-purple-950/30"
              textColor="text-purple-600 dark:text-purple-400"
              borderColor="border-purple-200 dark:border-purple-800"
            />
          )}

          {item.dribbble && (
            <SocialLink
              platform="Dribbble"
              url={item.dribbble}
              icon={<Dribbble className="h-4 w-4 text-pink-500" />}
              bgColor="bg-pink-50 dark:bg-pink-950/30"
              textColor="text-pink-600 dark:text-pink-400"
              borderColor="border-pink-200 dark:border-pink-800"
            />
          )}

          {item.behance && (
            <SocialLink
              platform="Behance"
              url={item.behance}
              icon={<Dribbble className="h-4 w-4 text-blue-500" />}
              bgColor="bg-blue-50 dark:bg-blue-950/30"
              textColor="text-blue-600 dark:text-blue-400"
              borderColor="border-blue-200 dark:border-blue-800"
            />
          )}

          {item.website && (
            <SocialLink
              platform="Website"
              url={item.website}
              icon={<Globe className="h-4 w-4 text-green-500" />}
              bgColor="bg-green-50 dark:bg-green-950/30"
              textColor="text-green-600 dark:text-green-400"
              borderColor="border-green-200 dark:border-green-800"
            />
          )}

          {item.email && (
            <SocialLink
              platform="Email"
              url={`mailto:${item.email}`}
              icon={<AtSign className="h-4 w-4 text-orange-500" />}
              bgColor="bg-orange-50 dark:bg-orange-950/30"
              textColor="text-orange-600 dark:text-orange-400"
              borderColor="border-orange-200 dark:border-orange-800"
            />
          )}
          </div>))}
        </div>
      </CardContent>
    </Card>
  )
}

function SocialLink({ platform, url, icon, bgColor, textColor, borderColor }) {
  return (
    <Button
      variant="outline"
      className={`flex items-center justify-center gap-2 h-auto py-3 w-full ${bgColor} ${textColor} ${borderColor} hover:bg-opacity-80 transition-all duration-200`}
      asChild
    >
      <a href={url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center">
        <div className="flex items-center justify-center mb-1">{icon}</div>
        <span className="text-xs font-medium">{platform}</span>
        <ExternalLink className="h-3 w-3 mt-1 opacity-70" />
      </a>
    </Button>
  )
}
