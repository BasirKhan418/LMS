
import Link from "next/link"
import { Fragment } from "react"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { MdOutlineAssignmentTurnedIn } from "react-icons/md";
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { MdOutlineOndemandVideo } from "react-icons/md";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { MdNavigateNext } from "react-icons/md";
import { AiOutlineNotification } from "react-icons/ai";
import {FolderGit2,School,Users,UsersRound} from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import Image from "next/image"
import { useState ,useEffect} from "react"
import Logout from "../dialog/Logout"
import { usePathname } from "next/navigation"
import { ValidatesFunc } from "../../../functions/authfunc";
export default function AdminSidebar({children}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false)
  const [data,setData] = useState(null);
  const validates = async(token)=>{
    let data =  await ValidatesFunc(token);
    console.log(data)
    if(data.success){
      setData(data.data)
      console.log(data.data)
    }
    else{
      toast.error(data.message);
      if(data.ansession){
        setTimeout(()=>{
          router.push("/adminlogin");
        },4000)
      }
      setTimeout(()=>{
        router.push("/adminlogin");
      },3000)
    }
  }
    useEffect(()=>{
  validates(localStorage.getItem("dilmsadmintoken"))
    },[])
  return (
    <div className="flex min-h-screen w-full">
      <aside className="sticky top-0 hidden h-screen w-[280px] lg:w-[280px] shrink-0 border-r bg-background md:block">
        <div className="flex h-16 items-center justify-between border-b px-4">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
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
        </div>
        <nav className="flex flex-col space-y-1 px-4 py-6">
          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
            prefetch={false}
          >
            <LayoutGridIcon className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/adminbatch"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
            prefetch={false}
          >
            <Users className="h-5 w-5" />
            <span>Manage Batches</span>
          </Link>
          <Link
            href="/adminaddcourse"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
            prefetch={false}
          >
            <School className="h-5 w-5" />
            <span>Add Course</span>
          </Link>
          <Link
            href="/admincourse"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
            prefetch={false}
          >
            <BookIcon className="h-5 w-5" />
            <span>Courses</span>
          </Link>
          <Link
            href="/adminassignment"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
            prefetch={false}
          >
            <MdOutlineAssignmentTurnedIn className="h-5 w-5" />
            <span>Assignments</span>
          </Link>
          <Link
            href="/adminprojects"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
            prefetch={false}
          >
            <FolderGit2 className="h-5 w-5" />
            <span>Projects</span>
          </Link>
          <Link
            href="/admintrainer"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
            prefetch={false}
          >
            <UsersRound className="h-5 w-5" />
            <span>Manage Trainers</span>
          </Link>
          <Link
            href="/adminuser"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
            prefetch={false}
          >
            <UsersRound className="h-5 w-5" />
            <span>Manage Users</span>
          </Link>
          <Link
            href="/adminnotification"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
            prefetch={false}
          >
            <AiOutlineNotification className="h-5 w-5" />
            <span>Send Notification</span>
          </Link>
          
          <Link
            href="/adminvideogallery"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
            prefetch={false}
          >
            <MdOutlineOndemandVideo className="h-5 w-5" />
            <span>Video Gallery</span>
          </Link>
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center border-b bg-background px-4 shadow-sm md:px-6">
          <div className="mr-auto flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <MenuIcon className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="sm:max-w-xs">
                <nav className="grid gap-6 text-lg font-medium">
                <Link href="/" className="flex items-center gap-2 font-semibold mx-3">
              <div>
                <Image 
                  src="https://res.cloudinary.com/db0x5vhbk/image/upload/v1733634184/x0vx8af6jmxfpp5tjjjk.png" 
                  alt="My Image"
                  width={25} // Specify the width of the image
                  height={25} // Specify the height of the image
                />
              </div>
              <span className="">Devsomeware</span>
            </Link>
                  <Link
                    href="/admin"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    prefetch={false}
                  >
                    <LayoutGridIcon className="h-5 w-5" />
                    Dashboard
                  </Link>
                  <Link
            href="/adminaddcourse"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
            prefetch={false}
          >
            <School className="h-5 w-5" />
            <span>Add Course</span>
          </Link>
                  <Link
                    href="/admincourse"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    prefetch={false}
                  >
                    <BookIcon className="h-5 w-5" />
                    Courses
                  </Link>
                  <Link
                    href="/adminassignment"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    prefetch={false}
                  >
                    <MdOutlineAssignmentTurnedIn className="h-5 w-5" />
                    Assignments
                  </Link>
                  <Link
            href="/adminprojects"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
            prefetch={false}
          >
            <FolderGit2 className="h-5 w-5" />
            <span>Projects</span>
          </Link>
          <Link
            href="/adminvideogallery"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
            prefetch={false}
          >
            <MdOutlineOndemandVideo className="h-5 w-5" />
            <span>Video Gallery</span>
          </Link>
                  <Link
                    href="#"
                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    prefetch={false}
                  >
                    <SettingsIcon className="h-5 w-5" />
                    Settings
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
            <div className="text-lg font-semibold flex justify-center items-center ">
      Dashboard
      {pathname.split('/').map((item, index) => (
        item && (
          <Fragment key={index} >
            <MdNavigateNext className="text-lg text-gray-400 mx-2" />
            <h1 className="hidden md:block lg:block">{item.charAt(0).toUpperCase() + item.slice(1)}</h1>
          </Fragment>
        )
      ))}
    </div>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <BellIcon className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <BookIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">New Course Published</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-green-50">
                      <UsersIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">New Student Enrolled</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-yellow-50">
                      <SchoolIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">New Instructor Joined</p>
                      <p className="text-xs text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                <Avatar>
  <AvatarImage src="https://github.com/shadcn.png" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Logged in as {data&&data[0].name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href={"/adminprofile"}><DropdownMenuItem>Profile</DropdownMenuItem></Link>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={()=>setIsOpen(true)}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <Logout isOpen={isOpen} setIsOpen={setIsOpen} type="admin"/>
       {children}
      </div>
    </div>
  )
}

function BarChartIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  )
}


function BellIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )
}


function BookIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  )
}


function LayoutGridIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  )
}


function MenuIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}


function SchoolIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 22v-4a2 2 0 1 0-4 0v4" />
      <path d="m18 10 4 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8l4-2" />
      <path d="M18 5v17" />
      <path d="m4 6 8-4 8 4" />
      <path d="M6 5v17" />
      <circle cx="12" cy="9" r="2" />
    </svg>
  )
}


function SettingsIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}


function UsersIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}