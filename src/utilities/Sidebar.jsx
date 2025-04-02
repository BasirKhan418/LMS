"use client"
import Link from "next/link"
import Image from "next/image"
import { PiBooksDuotone } from "react-icons/pi";
import { BiTask } from "react-icons/bi";
import { GrProjects } from "react-icons/gr";
import { GiArtificialIntelligence } from "react-icons/gi";
import { usePathname } from "next/navigation";
import {FolderGit2} from "lucide-react"
import { GoDiscussionClosed } from "react-icons/go";
import {
  Bell,
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  Users,
  BookOpenText,
  X,
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Logout from "./dialog/Logout";
import { useState } from "react";
import { useRouter } from "next/navigation";
export function Sidebar({children}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex min-h-screen w-full">
      <div className="sticky top-0 hidden h-screen w-[280px] lg:w-[350px] border-r bg-muted/40 md:block">
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <div>
                <Image 
                  src="https://res.cloudinary.com/db0x5vhbk/image/upload/v1733634184/x0vx8af6jmxfpp5tjjjk.png" 
                  alt="My Image"
                  width={30} // Specify the width of the image
                  height={30} // Specify the height of the image
                />
              </div>
              <span className="">Devsomeware</span>
            </Link>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/"
                className={`flex items-center gap-3 rounded-lg ${pathname=="/"?"bg-muted text-primary":" text-muted-foreground"} px-3 py-2  transition-all hover:text-primary`}
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/allcourses"
                className={`flex items-center gap-3 rounded-lg ${pathname=="/allcourses"?"bg-muted text-primary":"text-muted-foreground "} px-3 py-2  transition-all hover:text-primary`}
              >
                < BookOpenText className="h-5 w-5"/>
                All Courses
              </Link>
              <Link
                href="/course"
                className={`flex items-center gap-3 rounded-lg ${pathname=="/course"?"bg-muted text-primary":"text-muted-foreground "} px-3 py-2  transition-all hover:text-primary`}
              >
                < PiBooksDuotone className="h-5 w-5"/>
                My Courses
              </Link>
              <Link
                href="/assignment"
                className={`flex items-center gap-3 rounded-lg ${pathname=="/assignment"?"bg-muted text-primary":" text-muted-foreground"} px-3 py-2  transition-all hover:text-primary`}
              >
                <BiTask className="h-5 w-5" />
                Assignments{" "}
              </Link>
              <Link
                href="/project"
                className={`flex items-center gap-3 rounded-lg ${pathname=="project"?"bg-muted text-primary":" text-muted-foreground"} px-3 py-2  transition-all hover:text-primary`}
              >
                <FolderGit2  className="h-5 w-5" />
                Projects
              </Link>
              <Link
                href="/discussion"
                className={`flex items-center gap-3 rounded-lg ${pathname=="/diai"?"bg-muted text-primary":" text-muted-foreground"} px-3 py-2  transition-all hover:text-primary`}
              >
                <GoDiscussionClosed className="h-5 w-5" />
                Discussion Forum
              </Link>
            </nav>
          </div>
          <div className="mt-auto p-4">
            <Card x-chunk="dashboard-02-chunk-0">
              <CardHeader className="p-2 pt-0 md:p-4">
                <CardTitle>Explore Our Courses</CardTitle>
                <CardDescription>
                  Discover a variety of courses tailored to help you achieve your learning goals. Upgrade to Premium for unlimited access to all courses and exclusive content.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                <Button size="sm" className="w-full mb-2">
                  <Link href="/allcourses">
                    Browse Courses
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full z-30 ">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <Link href="/" className="flex items-center gap-2 font-semibold mx-2 mb-4">
              <div>
                <Image 
                  src="https://res.cloudinary.com/db0x5vhbk/image/upload/v1733634184/x0vx8af6jmxfpp5tjjjk.png" 
                  alt="My Image"
                  width={30} // Specify the width of the image
                  height={30} // Specify the height of the image
                />
              </div>
              <span className="">Devsomeware</span>
            </Link>
            
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden absolute right-2 top-2"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close navigation menu</span>
              </Button>
            </SheetTrigger>
            <Link
                href="/"
                className={`flex items-center gap-3 rounded-lg ${pathname=="/"?"bg-muted text-primary":" text-muted-foreground"} px-3 py-2  transition-all hover:text-primary`}
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/allcourses"
                className={`flex items-center gap-3 rounded-lg ${pathname=="/allcourses"?"bg-muted text-primary":"text-muted-foreground "} px-3 py-2  transition-all hover:text-primary`}
              >
                < BookOpenText className="h-5 w-5"/>
                All Courses
              </Link>
              <Link
                href="/course"
                className={`flex items-center gap-3 rounded-lg ${pathname=="/course"?"bg-muted text-primary":"text-muted-foreground "} px-3 py-2  transition-all hover:text-primary`}
              >
                < PiBooksDuotone className="h-5 w-5"/>
                My Courses
              </Link>
              <Link
                href="/assignment"
                className={`flex items-center gap-3 rounded-lg ${pathname=="/assignment"?"bg-muted text-primary":" text-muted-foreground"} px-3 py-2  transition-all hover:text-primary`}
              >
                <BiTask className="h-5 w-5" />
                Assignments{" "}
              </Link>
              <Link
                href="/project"
                className={`flex items-center gap-3 rounded-lg ${pathname=="project"?"bg-muted text-primary":" text-muted-foreground"} px-3 py-2  transition-all hover:text-primary`}
              >
                <FolderGit2  className="h-5 w-5" />
                Projects
              </Link>
              <Link
                href="/discussion"
                className={`flex items-center gap-3 rounded-lg ${pathname=="/diai"?"bg-muted text-primary":" text-muted-foreground"} px-3 py-2  transition-all hover:text-primary`}
              >
                <GoDiscussionClosed className="h-5 w-5" />
                Discussion Forum
              </Link>
            </nav>
              <div className="mt-auto">
                <Card x-chunk="dashboard-02-chunk-0">
                  <CardHeader className="p-2 pt-0 md:p-4 p-4">
                    <CardTitle>Explore Our Courses</CardTitle>
                    <CardDescription>
                      Discover a variety of courses tailored to help you achieve your learning goals. Upgrade to Premium for unlimited access to all courses and exclusive content.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-2 pt-0 md:p-4 md:pt-0 flex justify-center items-center">
                  <Button onClick={()=>{
                    router.push("/allcourses")
                  }} className="w-full">
                    Browse Courses
                  </Button>
                  </CardContent>
                </Card>
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href={"/profile"}><DropdownMenuItem>Profile</DropdownMenuItem></Link>
              <Link href={"https://www.devsomeware.com/contact"} target="_blank"> <DropdownMenuItem>Support</DropdownMenuItem></Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={()=>{
                setIsOpen(true)
              }}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <Logout isOpen={isOpen} setIsOpen={setIsOpen} type="user"/>
        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  )
}
