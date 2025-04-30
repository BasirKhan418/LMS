"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, Users, Clock, Share2 } from "lucide-react"
import SocialMediaModal from "./social-media-modal"
import SubmissionCard from "./submission-card"
import { Card, CardContent } from "@/components/ui/card"
import { Toaster,toast } from "sonner"

export default function SocialMediaDashboard({user,batch}) {
  const [submissions, setSubmissions] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const fetchSubmissions = async (id) => {
   try{
    const response = await fetch(`/api/socialmedia?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "token": localStorage.getItem("dilmstoken"),
      },
    })
    const data = await response.json()
    setIsLoading(false)
    if (data.success) {
      setSubmissions(data.data)
    } else {
      toast.error(data.message || "Failed to load submissions")
    }
   }
   catch(err){
    toast.error("Error fetching your submissions")
   }
  }
  useEffect(() => {
   if(user && user._id){
    fetchSubmissions(user._id)
   }
  }, [user])

  const handleSubmit = async (links) => {
    // Simulate API call
    setIsLoading(true)
  

    const newSubmission = {
      ...links,
    }
   try{
   const response = await fetch("/api/socialmedia", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "token": localStorage.getItem("dilmstoken"),
        },
        body: JSON.stringify({
        links: newSubmission,
        userid: user._id,
        batchid: batch._id,
        }),
   })
    const data = await response.json()
    setIsLoading(false)
    if(data.success){
    setIsModalOpen(false)
    fetchSubmissions(user._id)
      toast.success("Links submitted successfully")
    }
    else{
      toast.error(data.message)
    }
   }
   catch(err){
toast.error("Error submitting your links")
   }
  }

  return (
    <div className="space-y-8">
     <Toaster richColors position="top-center" closeButton={false} />

      <div className="flex justify-between items-center flex-wrap">
        <div>
          <h2 className="text-2xl font-bold">Your Submissions</h2>
          <p className="text-muted-foreground">Connect with others by sharing your profiles</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 my-4"
        >
          <PlusCircle className="h-4 w-4" />
          Add New Links
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-muted-foreground">Loading your submissions...</p>
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-16 border rounded-xl bg-muted/30">
          <div className="mb-4">
            <Share2 className="h-12 w-12 text-muted-foreground/50 mx-auto" />
          </div>
          <h3 className="text-xl font-medium mb-2">No submissions yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Share your social media profiles with your learning community to connect and collaborate.
          </p>
          <Button onClick={() => setIsModalOpen(true)} variant="outline">
            Add Your First Links
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 mt-6">
          {submissions.map((submission) => (
            <SubmissionCard key={submission._id} submission={submission} />
          ))}
        </div>
      )}

      <SocialMediaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit} />

      <div className="mt-12 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl p-6 text-center">
        <h3 className="text-xl font-semibold mb-2">Why Share Your Social Media?</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          Connecting with your learning community helps build relationships, opens collaboration opportunities, and
          expands your professional network.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <BenefitCard
            title="Networking"
            description="Connect with peers and instructors to build your professional network"
          />
          <BenefitCard title="Collaboration" description="Find partners for projects and study groups" />
          <BenefitCard title="Opportunities" description="Discover job openings and career advancement possibilities" />
        </div>
      </div>
    </div>
  )
}


function BenefitCard({ title, description }) {
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
      <h4 className="font-medium mb-2">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
