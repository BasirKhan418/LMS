"use client"
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/utilities/Sidebar";
import { usePathname } from "next/navigation";
import NextTopLoader from 'nextjs-toploader';
import AdminSidebar from "@/utilities/Admin/AdminSidebar";
const inter = Inter({ subsets: ["latin"] });
import Chat from "@/utilities/Ai/Chat";
import { useState } from "react";
import TrainerSidebar from "@/utilities/Trainer/TrainerSidebar";

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
      {pathname === "/adminlogin" || pathname === "/trainerlogin" || pathname.startsWith("/trainerviewcourse/detail") || pathname.startsWith("/adminviewcourse/detail") ?(
        children
      ) : pathname.startsWith("/admin") ? (
        <AdminSidebar>{children}</AdminSidebar>
      ) : pathname.startsWith("/trainer") ? (
        <TrainerSidebar>{children}</TrainerSidebar>
      ) : pathname === "/login" || pathname.startsWith("/course/detail")  ? (
        children
      ) : (
        // Optionally handle other paths if needed
        <Sidebar>
          {children}
          <button 
            className="flex items-center justify-center fixed bottom-6 right-6 rounded-full w-16 h-16 shadow-lg bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
            onClick={() => setaiopen(true)}
          >
            <div className="absolute inset-0 rounded-full bg-white opacity-20 animate-pulse"></div>
            <MessageCircleIcon className="h-6 w-6 text-white" />
          </button>
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