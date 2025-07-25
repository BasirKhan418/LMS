import { Users } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function Sidebar({ team, onlineUsers = [],user }) {
  // If onlineUsers is not provided, default to empty array
  const onlineUsersSet = new Set(onlineUsers.map(user => user._id || user.userid));
  
  // Count online users
  const onlineCount = onlineUsersSet.size;
  
  return (
    <div className="flex flex-col h-full">
      {/* Group Info */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">{team?.teamname}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{team?.description || `${team?.team?.length || 0} participants`}</p>
      </div>

      {/* Participants */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Participants ({team?.team?.length || 0})
              </h3>
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              {onlineCount} online
            </span>
          </div>

          {/* Online participants */}
          <div className="mb-6">
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Online
            </h4>
            <div className="space-y-3">
              {team?.team
                ?.filter(participant => onlineUsersSet.has(participant._id))
                .map((participant) => (
                  <div
                    key={participant._id}
                    className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="relative">
                      <Avatar
                        src={participant.profilepic || "/placeholder.svg"}
                        alt={participant.name}
                        className="h-8 w-8 rounded-full"
                      >
                        <AvatarFallback className="h-8 w-8 rounded-full" delayMs={600}>
                          {participant.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-800"></span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user._id==participant._id?"You":participant.name}</p>
                      <p className="text-xs text-green-600 dark:text-green-400">Active now</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Offline participants */}
          <div>
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Offline
            </h4>
            <div className="space-y-3">
              {team?.team
                ?.filter(participant => !onlineUsersSet.has(participant._id))
                .map((participant) => (
                  <div
                    key={participant._id}
                    className="flex items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="relative">
                      <Avatar
                        src={participant.profilepic || "/placeholder.svg"}
                        alt={participant.name}
                        className="h-8 w-8 rounded-full opacity-70"
                      >
                        <AvatarFallback className="h-8 w-8 rounded-full opacity-70" delayMs={600}>
                          {participant.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-gray-300 border-2 border-white dark:border-gray-800"></span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{participant.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Last active 2h ago</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}