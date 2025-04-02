import React from 'react'
export const metadata = {
  title: "Assignments - DevSomeWare | Learn DevSomeWare",
  description:
    "Submit and track your assignments on DevSomeWare's Learning Platform. Review your progress, get personalized feedback, and improve your skills through hands-on assignments and challenges.",
  keywords: [
    "DevSomeWare Assignments",
    "Assignments Submission",
    "Tech Assignments",
    "Online Assignments",
    "Learning Platform Assignments",
    "Assignment Tracker",
    "Programmer Assignments",
    "Submit Assignment Online",
    "Developer Challenges",
    "Tech Skill Assessment",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Assignments - DevSomeWare | Learn DevSomeWare",
    description:
      "Submit assignments, track progress, and get feedback on DevSomeWare. Enhance your skills by completing real-world challenges and receiving constructive reviews.",
    url: "https://learn.devsomeware.com/assignment",
    type: "website",
    images: [
      {
        url: "/alogo.png",
        width: 1200,
        height: 630,
        alt: "DevSomeWare Assignments Page",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@DevSomeware",
    title: "Assignments - DevSomeWare | Learn DevSomeWare",
    description:
      "Manage your assignments on DevSomeWare. Submit your work, get feedback, and track your learning progress with hands-on challenges in tech and development.",
    images: "/alogo.png",
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://learn.devsomeware.com/assignment",
  },
};
  
  
const layout = ({children}) => {
  return (
    <div>
      {children}
    </div>
  )
}

export default layout
