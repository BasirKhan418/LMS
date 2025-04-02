"use client"
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/utilities/Sidebar";
import { usePathname } from "next/navigation";
import NextTopLoader from 'nextjs-toploader';
import AdminSidebar from "@/utilities/Admin/AdminSidebar";
const inter = Inter({ subsets: ["latin"] });
import Chat from "@/utilities/Ai/Chat";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Head from "next/head";

export default function RootLayout({ children }) {
  const [aiopen, setaiopen] = useState(false);
const pathname = usePathname();
console.log(pathname);
  return (
    <html lang="en">
      <body className={inter.className}>
      <NextTopLoader 
      color="#FF0000"
      showSpinner={false}
      />
      {pathname === "/adminlogin" ? (
  children
) : pathname.startsWith("/admin") ? (
  <AdminSidebar>{children}</AdminSidebar>
) : pathname === "/login" || pathname.startsWith("/course/detail") ? (
  children
) : (
  // Optionally handle other paths if needed
  
  <Sidebar>
    {children}
    <Button className="flex items-center gap-2 fixed lg:bottom-6 lg:right-6 md:bottom-4 md:right-4 bottom-2 right-2 rounded-full lg:py-8 md:py-8 py-8" size="lg" onClick={()=>{
      setaiopen(!aiopen)
    }}>
      <MessageCircleIcon className="h-5 w-5" />
      Chat with AI
    </Button>
    <Chat aiopen={aiopen} setaiopen={setaiopen}/>
  </Sidebar>
)}

        </body>
    </html>
  );
}
function MessageCircleIcon(props) {
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
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
    </svg>
  )
}