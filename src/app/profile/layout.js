import React from 'react'
export const metadata = {
  title: "Profile - DevSomeWare | Learn DevSomeWare",
  description:
    "View and manage your profile on DevSomeWare's Learning Platform. Track your courses, achievements, and progress, and personalize your learning experience with DevSomeWare.",
  keywords: [
    "DevSomeWare Profile",
    "LMS Profile",
    "Track Learning Progress",
    "DevSomeWare Courses",
    "Learning Dashboard",
    "Personalized Learning",
    "Developer Profile",
    "Learn DevSomeWare",
    "Profile Management LMS",
    "Online Learning Progress",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Profile - DevSomeWare | Learn DevSomeWare",
    description:
      "Manage and personalize your learning journey on DevSomeWare. View your course progress, achievements, and unlock new learning opportunities with DevSomeWare.",
    url: "https://learn.devsomeware.com/profile",
    type: "website",
    images: [
      {
        url: "/alogo.png",
        width: 1200,
        height: 630,
        alt: "DevSomeWare Profile Page",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@DevSomeware",
    title: "Profile - DevSomeWare | Learn DevSomeWare",
    description:
      "Access your DevSomeWare profile to manage your learning progress, achievements, and courses. Enhance your learning journey on DevSomeWare.",
    images: "/alogo.png",
  },
  robots: "index, follow", // Indexing allowed for user profiles to help with personalized search results.
  alternates: {
    canonical: "https://learn.devsomeware.com/profile",
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
