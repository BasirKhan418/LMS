import React from 'react'
import Project from '@/utilities/Course/Project'
export const metadata = {
  title: "Discussion Forum - DevSomeWare | Learn DevSomeWare",
  description:
    "Join the DevSomeWare Discussion Forum to interact with peers, instructors, and experts. Share your thoughts, ask questions, and collaborate on various tech topics to enhance your learning experience.",
  keywords: [
    "DevSomeWare Forum",
    "Discussion Forum",
    "Tech Discussions",
    "Programming Forum",
    "Online Learning Forum",
    "Developer Community",
    "Collaborate with Developers",
    "Tech Community",
    "Learn DevSomeWare Discussions",
    "Ask Questions",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Discussion Forum - DevSomeWare | Learn DevSomeWare",
    description:
      "Engage with the DevSomeWare community in the discussion forum. Ask questions, share insights, and collaborate with fellow learners and experts in tech.",
    url: "https://learn.devsomeware.com/discussion",
    type: "website",
    images: [
      {
        url: "/alogo.png",
        width: 1200,
        height: 630,
        alt: "DevSomeWare Discussion Forum",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@DevSomeware",
    title: "Discussion Forum - DevSomeWare | Learn DevSomeWare",
    description:
      "Join the DevSomeWare Forum to discuss tech topics, ask questions, and engage with the learning community. Connect with fellow developers and mentors.",
    images: "/alogo.png",
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://learn.devsomeware.com/discussion",
  },
};
const page = () => {
  return (
    <div>
      <Project/>
    </div>
  )
}

export default page
