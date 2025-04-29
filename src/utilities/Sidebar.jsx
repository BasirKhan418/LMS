"use client"
import Link from "next/link"
import Image from "next/image"
import { PiBooksDuotone } from "react-icons/pi"
import { BiTask } from "react-icons/bi"
import { GrProjects } from "react-icons/gr"
import { GoDiscussionClosed } from "react-icons/go"
import { usePathname } from "next/navigation"
import { FolderGit2 } from "lucide-react"
import {
  Bell,
  CircleUser,
  Home,
  Menu,
  Search,
  BookOpenText,
  X,
  Settings,
  LogOut,
  User,
  HelpCircle
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { 
  Sheet, 
  SheetContent, 
  SheetTitle, 
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet"
import Logout from "./dialog/Logout"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// Sample notification data - in a real app, this would come from an API
const sampleNotifications = [
  {
    id: 1,
    title: "Assignment Deadline",
    message: "Your React assignment is due tomorrow",
    time: "1 hour ago",
    read: false,
    type: "assignment"
  },
  {
    id: 2,
    title: "New Course Available",
    message: "Advanced JavaScript patterns course is now live",
    time: "3 hours ago",
    read: false,
    type: "course"
  },
  {
    id: 3,
    title: "Discussion Reply",
    message: "Sarah replied to your question about React hooks",
    time: "Yesterday",
    read: true,
    type: "discussion"
  },
  {
    id: 4,
    title: "Project Feedback",
    message: "Your instructor left feedback on your final project",
    time: "2 days ago",
    read: true,
    type: "project"
  }
];

// Notification component that will render each notification
const NotificationItem = ({ notification, onMarkAsRead }) => {
  const getIcon = () => {
    switch(notification.type) {
      case "assignment":
        return <BiTask className="h-4 w-4 text-blue-500" />;
      case "course":
        return <BookOpenText className="h-4 w-4 text-green-500" />;
      case "discussion":
        return <GoDiscussionClosed className="h-4 w-4 text-purple-500" />;
      case "project":
        return <FolderGit2 className="h-4 w-4 text-orange-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div 
      className={`flex items-start gap-3 p-3 border-b last:border-b-0 hover:bg-muted/50 cursor-pointer transition-colors ${notification.read ? 'opacity-70' : 'bg-muted/20'}`}
      onClick={() => onMarkAsRead(notification.id)}
    >
      <div className="mt-1 flex-shrink-0">
        {getIcon()}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex justify-between">
          <p className={`text-sm font-medium ${!notification.read ? 'text-primary' : ''}`}>
            {notification.title}
          </p>
          <span className="text-xs text-muted-foreground">{notification.time}</span>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {notification.message}
        </p>
      </div>
      {!notification.read && (
        <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1"></div>
      )}
    </div>
  );
};

// NotificationsPopover component to handle notifications state and UI
const NotificationsPopover = () => {
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [isOpen, setIsOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const handleMarkAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };
  
  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };
  
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between p-4 border-b">
          <DropdownMenuLabel className="text-base font-medium">Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-8 px-2 hover:bg-muted"
              onClick={handleMarkAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <NotificationItem 
                key={notification.id} 
                notification={notification} 
                onMarkAsRead={handleMarkAsRead} 
              />
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No notifications
            </div>
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="p-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => {
              setIsOpen(false);
              // In a real app, you would navigate to the notifications page
              // router.push("/notifications");
            }}
          >
            View all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export function Sidebar({children}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isMobileView, setIsMobileView] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  useEffect(() => {
    // Handle screen size detection
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768)
    }
    
    // Set initial value
    handleResize()
    
    // Add event listener
    window.addEventListener('resize', handleResize)
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const NavLinks = ({ onClick = () => {} }) => (
    <>
      <Link
        href="/"
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted ${
          pathname === "/" ? "bg-primary-foreground text-primary font-medium" : "text-muted-foreground"
        }`}
        onClick={onClick}
      >
        <Home className="h-4 w-4" />
        <span>Dashboard</span>
      </Link>
      <Link
        href="/allcourses"
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted ${
          pathname === "/allcourses" ? "bg-primary-foreground text-primary font-medium" : "text-muted-foreground"
        }`}
        onClick={onClick}
      >
        <BookOpenText className="h-4 w-4" />
        <span>All Courses</span>
      </Link>
      <Link
        href="/course"
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted ${
          pathname === "/course" ? "bg-primary-foreground text-primary font-medium" : "text-muted-foreground"
        }`}
        onClick={onClick}
      >
        <PiBooksDuotone className="h-4 w-4" />
        <span>My Courses</span>
      </Link>
      <Link
        href="/assignment"
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted ${
          pathname === "/assignment" ? "bg-primary-foreground text-primary font-medium" : "text-muted-foreground"
        }`}
        onClick={onClick}
      >
        <BiTask className="h-4 w-4" />
        <span>Assignments</span>
        {/* Optional: Add a badge for new assignments */}
        {/* <Badge variant="outline" className="ml-auto bg-primary text-primary-foreground">3</Badge> */}
      </Link>
      <Link
        href="/project"
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted ${
          pathname === "/project" ? "bg-primary-foreground text-primary font-medium" : "text-muted-foreground"
        }`}
        onClick={onClick}
      >
        <FolderGit2 className="h-4 w-4" />
        <span>Projects</span>
      </Link>
      <Link
        href="/discussion"
        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-muted ${
          pathname === "/discussion" ? "bg-primary-foreground text-primary font-medium" : "text-muted-foreground"
        }`}
        onClick={onClick}
      >
        <GoDiscussionClosed className="h-4 w-4" />
        <span>Discussion Forum</span>
      </Link>
    </>
  )

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop Sidebar */}
      <div className="sticky top-0 hidden h-screen border-r bg-card/30 md:block md:w-64 lg:w-72 transition-all duration-300">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b px-4">
            <Link href="/" className="flex items-center gap-2">
              <Image 
                src="/9.png" 
                alt="Learning Platform Logo" 
                width={120}
                height={36}
                className="transition-transform hover:scale-105"
              />
            </Link>
          </div>
          
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid gap-1 px-2 text-sm font-medium">
              <NavLinks />
            </nav>
          </div>
          
          <div className="border-t p-4">
            <Card className="bg-card/50 shadow-sm">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-base">Explore Our Courses</CardTitle>
                <CardDescription className="text-xs">
                  Discover courses tailored to help you achieve your learning goals.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <Button 
                  size="sm" 
                  className="w-full bg-primary hover:bg-primary/90 transition-colors"
                  onClick={() => router.push("/allcourses")}
                >
                  Browse Courses
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex flex-col w-full">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center gap-2">
            {/* Mobile Menu Trigger */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTitle className="hidden">Menu</SheetTitle>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              
              <SheetContent side="left" className="w-72 p-0">
                <div className="flex h-full flex-col">
                  <div className="flex h-16 items-center justify-between border-b px-4">
                    <Link href="/" className="flex items-center gap-2">
                      <Image 
                        src="/9.png" 
                        alt="Learning Platform Logo" 
                        width={120}
                        height={36}
                      />
                    </Link>
                    <SheetClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                      <X className="h-4 w-4" />
                      <span className="sr-only">Close</span>
                    </SheetClose>
                  </div>
                  
                  <div className="flex-1 overflow-auto py-2">
                    <nav className="grid gap-1 px-2 text-sm font-medium">
                      <NavLinks onClick={() => setIsSheetOpen(false)} />
                    </nav>
                  </div>
                  
                  <div className="border-t p-4">
                    <Card className="bg-card/50">
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-base">Explore Our Courses</CardTitle>
                        <CardDescription className="text-xs">
                          Discover courses tailored to help you achieve your learning goals.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <Button 
                          size="sm" 
                          className="w-full"
                          onClick={() => {
                            router.push("/allcourses")
                            setIsSheetOpen(false)
                          }}
                        >
                          Browse Courses
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Search - Full width on mobile, constrained on larger screens */}
            <div className="relative w-full md:w-64 lg:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search courses..."
                className="w-full bg-background pl-8 pr-4 shadow-none ring-offset-background focus-visible:ring-ring"
              />
            </div>
          </div>

          {/* Right side of header */}
          <div className="flex items-center gap-2">
            {/* Replaced the simple Bell button with the NotificationsPopover component */}
            <NotificationsPopover />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 overflow-hidden">
                  <CircleUser className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.open("https://www.devsomeware.com/contact", "_blank")}>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsOpen(true)}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </div>
      
      {/* Logout Dialog */}
      <Logout isOpen={isOpen} setIsOpen={setIsOpen} type="user" />
    </div>
  )
}