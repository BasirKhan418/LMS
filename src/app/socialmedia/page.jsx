"use client"

import { Suspense, useEffect, useState } from "react"
import SocialMediaDashboard from "@/utilities/SocialMediaUtils/social-media-dashboard"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
    const [user, setUser] = useState(null)
    const [data, setData] = useState(null)
    const [batchdetails, setBatchdetails] = useState(null)
    const [loading, setLoading] = useState(false)
    const validateUser = async () => {
        try {
          setLoading(true)
          const response = await fetch("/api/homeauth", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "token": localStorage.getItem("dilmstoken")
            }
          })
          const res = await response.json()
          console.log("basir reg is ",res)
          setLoading(false)
          
          if (res.success) {
            setUser(res.user)
            setData(res.data)
            setBatchdetails(res.batch)
            if (res.user == null) {
              router.push("/login")
            }
          } else {
            toast.error(res.message || "Authentication failed")
          }
        } catch (err) {
          setLoading(false)
          toast.error("Error connecting to server")
        }
      }
      useEffect(() => {
        validateUser()
      }, [])
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <main className="container mx-auto py-10 px-4 md:px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-3 bg-clip-text ">
            Social Media Post Management
            
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Share your social media profiles with your learning community. Connect, collaborate, and grow your network.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Suspense fallback={<DashboardSkeleton />}>
            <SocialMediaDashboard user={user} batch={batchdetails} />
          </Suspense>
        </div>
      </main>

      <footer className="border-t py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Infotactlearning.in. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid gap-6">
        {Array(3)
          .fill(null)
          .map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
      </div>
    </div>
  )
}
