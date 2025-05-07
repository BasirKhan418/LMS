import Link from "next/link";
import { Fragment, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

// UI Components
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuItem 
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Toaster, toast } from "sonner";

// Icons
import { 
  LayoutDashboard, 
  BookOpen, 
  FolderGit2, 
  Bell, 
  Menu, 
  User, 
  LogOut, 
  Settings,
  Send,
  BarChart3,
  ChevronRight
} from "lucide-react";
import { MdOutlineAssignmentTurnedIn, MdMenuBook, MdOutlineLeaderboard } from "react-icons/md";
import { AiOutlineNotification } from "react-icons/ai";

// Functions
import { TrainerValidatesFunc } from "../../../functions/trainerauthfunc";
import Logout from "../dialog/Logout";

export default function TrainerSidebar({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Validate trainer session
  const validates = async (token) => {
    let data = await TrainerValidatesFunc(token);
    
    if (data.success) {
      setData(data.data);
    } else {
      toast.error(data.message);
      if (data.ansession) {
        setTimeout(() => {
          router.push("/trainerlogin");
        }, 4000);
      }
      setTimeout(() => {
        router.push("/trainerlogin");
      }, 3000);
    }
  };

  useEffect(() => {
    validates(localStorage.getItem("dilmsadmintoken"));
  }, []);

  // Navigation links configuration
  const navigationLinks = [
    {
      href: "/trainer",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />
    },
    {
      href: "/trainercourse",
      label: "Courses",
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      href: "/trainerviewcourse",
      label: "View Courses",
      icon: <MdMenuBook className="h-5 w-5" />
    },
    {
      href: "/trainerassignment",
      label: "Assignments",
      icon: <MdOutlineAssignmentTurnedIn className="h-5 w-5" />
    },
    {
      href: "/trainerprojects",
      label: "Projects",
      icon: <FolderGit2 className="h-5 w-5" />
    },
    {
      href: "/trainerresults",
      label: "Manage Results",
      icon: <MdOutlineLeaderboard className="h-5 w-5" />
    },
    {
      href: "/trainerinappnotification",
      label: "Manage Notifications",
      icon: <Send className="h-5 w-5" />
    }
  ];

  // Helper function to get current page title
  const getCurrentPageTitle = () => {
    const currentRoute = navigationLinks.find(link => link.href === pathname);
    if (currentRoute) return currentRoute.label;
    
    // Handle nested routes
    const path = pathname.split('/');
    if (path.length > 1) {
      return path[path.length - 1].charAt(0).toUpperCase() + path[path.length - 1].slice(1);
    }
    
    return "Dashboard";
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-50/30">
      <Toaster richColors position="top-center" closeButton />
      
      {/* Desktop Sidebar */}
      <aside className="fixed top-0 left-0 z-40 hidden h-screen w-64 shrink-0 border-r bg-white shadow-sm transition-all duration-300 md:block">
        {/* Logo Section */}
        <div className="flex h-16 items-center justify-center border-b px-4">
          <Link href="/trainer" className="flex items-center gap-2">
            <Image 
              src="/9.png" 
              alt="LMS Logo"
              width={120}
              height={80}
              className="object-contain"
            />
          </Link>
        </div>
        
        {/* Navigation Links */}
        <div className="flex flex-col px-3 py-6">
          <div className="mb-4 px-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Main</p>
          </div>
          
          <nav className="space-y-1.5">
            {navigationLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <TooltipProvider key={item.href} delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                          isActive 
                            ? "bg-primary/10 text-primary" 
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        prefetch={false}
                      >
                        <span className={isActive ? "text-primary" : "text-gray-500"}>
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                        {isActive && (
                          <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"></div>
                        )}
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="hidden lg:block">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </nav>
          
          {/* Profile Section */}
          {data && (
            <div className="mt-auto pt-6 px-3">
              <div className="rounded-lg border bg-gray-50/50 p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                    <AvatarImage src="https://github.com/shadcn.png" alt={data[0]?.name || "Trainer"} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {data[0]?.name?.charAt(0) || "T"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 truncate">
                    <p className="text-sm font-medium truncate">{data[0]?.name || "Trainer"}</p>
                    <p className="text-xs text-gray-500 truncate">Trainer</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsOpen(true)}
                    className="h-8 w-8 p-0 text-gray-500 hover:text-red-500"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="sr-only">Logout</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex flex-1 flex-col md:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center bg-white px-4 shadow-sm md:px-6">
          {/* Mobile Menu Button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-4 md:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="h-16 border-b px-4 flex items-center justify-center">
                <Image 
                  src="/9.png" 
                  alt="LMS Logo"
                  width={120}
                  height={80}
                  className="object-contain"
                />
              </SheetHeader>
              
              <div className="flex flex-col p-4">
                {data && (
                  <div className="mb-4">
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src="https://github.com/shadcn.png" alt={data[0]?.name || "User"} />
                        <AvatarFallback>{data[0]?.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{data[0]?.name || "User"}</p>
                        <p className="text-xs text-gray-500">Trainer</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <nav className="flex flex-col space-y-1">
                  {navigationLinks.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                          isActive 
                            ? "bg-primary/10 text-primary" 
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        prefetch={false}
                      >
                        <span className={isActive ? "text-primary" : "text-gray-500"}>
                          {item.icon}
                        </span>
                        {item.label}
                        {isActive && (
                          <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"></div>
                        )}
                      </Link>
                    );
                  })}
                </nav>
                
                <div className="mt-6 border-t pt-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => {
                      setIsOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Breadcrumb */}
          <div className="flex-1">
            <div className="flex items-center">
              <h1 className="text-lg font-semibold text-gray-800 hidden md:block">{getCurrentPageTitle()}</h1>
              {pathname !== "/trainer" && (
                <div className="flex items-center ml-2">
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                  <div className="breadcrumb-path ml-2 hidden md:flex">
                    {pathname.split('/').filter(Boolean).map((item, index, arr) => (
                      <Fragment key={index}>
                        {index > 0 && <ChevronRight className="mx-1 h-3 w-3 text-gray-400" />}
                        <span className="text-sm text-gray-500">
                          {item.charAt(0).toUpperCase() + item.slice(1)}
                        </span>
                      </Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-white flex items-center justify-center">
                    3
                  </span>
                  <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Notifications</span>
                  <Button variant="link" className="text-xs h-auto p-0">Mark all as read</Button>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <div className="max-h-[300px] overflow-y-auto">
                  {/* Notification Item */}
                  <DropdownMenuItem className="p-0">
                    <div className="flex items-start gap-3 p-3 cursor-pointer w-full hover:bg-gray-50">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New Course Published</p>
                        <p className="text-xs text-gray-500 line-clamp-1">Advanced JavaScript course is now live</p>
                        <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                      </div>
                      <div className="h-2 w-2 rounded-full bg-primary mt-1.5"></div>
                    </div>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem className="p-0">
                    <div className="flex items-start gap-3 p-3 cursor-pointer w-full hover:bg-gray-50">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">New Student Enrolled</p>
                        <p className="text-xs text-gray-500 line-clamp-1">John Smith enrolled in React Course</p>
                        <p className="text-xs text-gray-400 mt-1">1 day ago</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem className="p-0">
                    <div className="flex items-start gap-3 p-3 cursor-pointer w-full hover:bg-gray-50">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                        <MdOutlineAssignmentTurnedIn className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Assignment Submitted</p>
                        <p className="text-xs text-gray-500 line-clamp-1">5 new submissions for Web Design Assignment</p>
                        <p className="text-xs text-gray-400 mt-1">2 days ago</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                </div>
                
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/trainerinappnotification" className="text-sm text-center w-full text-primary hover:text-primary/90">
                    View all notifications
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>
                      {data ? data[0]?.name?.charAt(0) || "T" : "T"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-2 p-2">
                  <div className="rounded-full bg-primary/10 p-1">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium line-clamp-1">
                      {data && data[0]?.name || "Trainer"}
                    </p>
                    <p className="text-xs text-gray-500">Trainer</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/trainerprofile" className="cursor-pointer flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                 
                  <Link href="/trainerprofile" className="cursor-pointer flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => setIsOpen(true)}
                  className="cursor-pointer text-red-500 hover:text-red-600 focus:text-red-600 flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
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
      <Logout isOpen={isOpen} setIsOpen={setIsOpen} type="admin" />
    </div>
  );
}