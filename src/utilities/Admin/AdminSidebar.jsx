import Link from "next/link";
import { Fragment, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

// UI Components
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuItem 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Icons
import { 
  LayoutDashboard, 
  Users, 
  School, 
  BookOpen, 
  FileText, 
  FolderGit2, 
  BarChart3, 
  UserCog, 
  UserPlus, 
  ShieldCheck, 
  Bell, 
  Send, 
  Video, 
  ChevronRight, 
  Menu, 
  LogOut, 
  Settings, 
  User, 
  ChevronDown
} from "lucide-react";
import { RiTeamLine } from "react-icons/ri";

// Functions
import { ValidatesFunc } from "../../../functions/authfunc";
import Logout from "../dialog/Logout";
import { Toaster, toast } from "sonner";

export default function AdminSidebar({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  const validates = async (token) => {
    let data = await ValidatesFunc(token);
    if (data.success) {
      setData(data.data);
    } else {
      toast.error(data.message);
      if (data.ansession) {
        setTimeout(() => {
          router.push("/adminlogin");
        }, 2000);
      }
      setTimeout(() => {
        router.push("/adminlogin");
      }, 2000);
    }
  };

  useEffect(() => {
    validates(localStorage.getItem("dilmsadmintoken"));
  }, []);

  const isActive = (path) => {
    return pathname === path;
  };

  const navigationLinks = [
    { path: "/admin", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { path: "/adminbatch", label: "Manage Batches", icon: <Users size={20} /> },
    { path: "/adminteamformation", label: "Team Formation", icon: <RiTeamLine size={20} /> },
    { path: "/adminaddcourse", label: "Add Course", icon: <School size={20} /> },
    { path: "/admincourse", label: "Courses", icon: <BookOpen size={20} /> },
    { path: "/adminviewcourse", label: "View Courses", icon: <BookOpen size={20} /> },
    { path: "/adminassignment", label: "Assignments", icon: <FileText size={20} /> },
    { path: "/adminprojects", label: "Projects", icon: <FolderGit2 size={20} /> },
    { path: "/adminresults", label: "Manage Results", icon: <BarChart3 size={20} /> },
    { path: "/admintrainer", label: "Manage Trainers", icon: <UserCog size={20} /> },
    { path: "/adminuser", label: "Manage Users", icon: <UserPlus size={20} /> },
    { path: "/adminmanagement", label: "Manage Admins", icon: <ShieldCheck size={20} /> },
    { path: "/adminnotification", label: "Send Notification", icon: <Bell size={20} /> },
    { path: "/admininappnotification", label: "Manage Notifications", icon: <Send size={20} /> },
    { path: "/adminvideogallery", label: "Video Gallery", icon: <Video size={20} /> },
  ];

  // Group navigation links by category
  const navigationGroups = {
    "Main": ["/admin"],
    "User Management": ["/adminbatch", "/adminteamformation", "/admintrainer", "/adminuser", "/adminmanagement"],
    "Education": ["/adminaddcourse", "/admincourse", "/adminviewcourse", "/adminassignment", "/adminprojects", "/adminresults"],
    "Communication": ["/adminnotification", "/admininappnotification", "/adminvideogallery"]
  };

  // Function to determine which group a path belongs to
  const getGroupForPath = (path) => {
    for (const [group, paths] of Object.entries(navigationGroups)) {
      if (paths.includes(path)) {
        return group;
      }
    }
    return "Other";
  };

  // Organize links by group
  const organizedLinks = navigationLinks.reduce((acc, link) => {
    const group = getGroupForPath(link.path);
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(link);
    return acc;
  }, {});

  const renderLinks = (links, isMobile = false) => (
    <>
      {Object.entries(organizedLinks).map(([group, groupLinks]) => (
        <div key={group} className="mb-6">
          <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase">{group}</h3>
          <div className="space-y-1">
            {groupLinks.map((link) => (
              <TooltipProvider key={link.path}>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Link
                      href={link.path}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                        isActive(link.path) 
                          ? "bg-primary text-primary-foreground font-medium" 
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      } ${sidebarCollapsed && !isMobile ? "justify-center" : ""}`}
                      prefetch={false}
                    >
                      <span className={`${isActive(link.path) ? "text-primary-foreground" : "text-gray-500"}`}>
                        {link.icon}
                      </span>
                      {(!sidebarCollapsed || isMobile) && <span>{link.label}</span>}
                    </Link>
                  </TooltipTrigger>
                  {sidebarCollapsed && !isMobile && (
                    <TooltipContent side="right">
                      <p>{link.label}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </div>
      ))}
    </>
  );

  return (
    <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900">
      <Toaster richColors position="top-center" closeButton />
      
      {/* Desktop Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-40 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 ${
          sidebarCollapsed ? "w-[70px]" : "w-[260px]"
        } hidden md:block`}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4">
          {!sidebarCollapsed ? (
            <Link href="/admin" className="flex items-center gap-2 font-semibold">
              <Image 
                src="/9.png" 
                alt="LMS Logo"
                width={120}
                height={80}
              />
            </Link>
          ) : (
            <Link href="/admin" className="flex justify-center w-full">
              <Image 
                src="/9.png" 
                alt="LMS Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </Link>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden md:flex"
          >
            <ChevronRight className={`h-5 w-5 transition-transform duration-300 ${sidebarCollapsed ? "" : "rotate-180"}`} />
          </Button>
        </div>
        
        <div className={`flex flex-col h-[calc(100vh-64px)] ${!sidebarCollapsed ? "px-4" : "px-2"} py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600`}>
          {renderLinks(navigationLinks)}
          
          {!sidebarCollapsed && (
            <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={() => setIsOpen(true)}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </Button>
            </div>
          )}
          
          {sidebarCollapsed && (
            <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
              <TooltipProvider>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => setIsOpen(true)}
                    >
                      <LogOut size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Logout</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${
        sidebarCollapsed ? "md:ml-[70px]" : "md:ml-[260px]"
      }`}>
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 shadow-sm md:px-6">
          <div className="flex items-center gap-4">
            {/* Mobile menu trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0">
                <div className="flex h-16 items-center border-b border-gray-200 dark:border-gray-700 px-4">
                  <Link href="/admin" className="flex items-center gap-2 font-semibold">
                    <Image 
                      src="/9.png" 
                      alt="LMS Logo"
                      width={120}
                      height={80}
                    />
                  </Link>
                </div>
                <div className="px-4 py-6 overflow-y-auto h-[calc(100vh-64px)]">
                  {renderLinks(navigationLinks, true)}
                </div>
              </SheetContent>
            </Sheet>
            
            {/* Breadcrumb */}
            <div className="flex items-center text-lg font-semibold">
              <span className="text-primary">Dashboard</span>
              {pathname.split('/').filter(Boolean).map((item, index) => (
                <Fragment key={index}>
                  <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
                  <span className="hidden md:block text-gray-600 dark:text-gray-300 capitalize">
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </span>
                </Fragment>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                      {unreadNotifications}
                    </Badge>
                  )}
                  <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Notifications</span>
                  <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                    Mark all as read
                  </Button>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <div className="max-h-[300px] overflow-y-auto">
                  <DropdownMenuItem className="p-3 cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-800">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium">New Course Published</p>
                          <Badge variant="outline" className="h-5 text-xs">New</Badge>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem className="p-3 cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-800">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                        <Users className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium">New Student Enrolled</p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">1 day ago</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem className="p-3 cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-800">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-500">
                        <School className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium">New Instructor Joined</p>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">3 days ago</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                </div>
                
                <DropdownMenuSeparator />
                <Link href="/admininappnotification">
                <Button variant="ghost" className="w-full justify-center text-primary text-sm h-9">
                  View all notifications
                </Button>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2 h-9">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" alt="Profile" />
                    <AvatarFallback>{data && data[0]?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium leading-none">{data && data[0]?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500 hidden md:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-2 p-2 md:hidden">
                  <div className="flex-1">
                    <p className="font-medium">{data && data[0]?.name}</p>
                    <p className="text-xs text-gray-500">Administrator</p>
                  </div>
                </div>
                <DropdownMenuSeparator className="md:hidden" />
                
                <Link href="/adminprofile">
                  <DropdownMenuItem className="cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-800">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/adminprofile">
                <DropdownMenuItem className="cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-800">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                </Link>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem 
                  className="cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-800 text-red-500 focus:text-red-500"
                  onClick={() => setIsOpen(true)}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        
        {/* Main content */}
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
      
      <Logout isOpen={isOpen} setIsOpen={setIsOpen} type="admin" />
    </div>
  );
}