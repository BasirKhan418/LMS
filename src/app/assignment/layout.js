import React from 'react'
export const metadata = {
  title: "Assignments - Infotact | Learn Infotact",
  description:
    "Submit and track your assignments on Infotact's Learning Platform. Review your progress, get personalized feedback, and improve your skills through hands-on assignments and challenges.",
  keywords: [
    "Infotact Assignments",
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
    title: "Assignments - Infotact | Learn Infotact",
    description:
      "Submit assignments, track progress, and get feedback on Infotact. Enhance your skills by completing real-world challenges and receiving constructive reviews.",
    url: "https://infotactlearning.in/assignment",
    type: "website",
    images: [
      {
        url: "/infotactlearning.gif",
        width: 1200,
        height: 630,
        alt: "Infotact Assignments Page",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Infotact",
    title: "Assignments - Infotact | Learn Infotact",
    description:
      "Manage your assignments on Infotact. Submit your work, get feedback, and track your learning progress with hands-on challenges in tech and development.",
    images: "/infotactlearning.gif",
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://infotactlearning.in/assignment",
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
