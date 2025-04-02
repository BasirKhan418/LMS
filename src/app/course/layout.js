import React from 'react'
export const metadata = {
  title: "Enrolled Courses - DevSomeWare | Learn DevSomeWare",
  description:
    "View the courses you are enrolled in on DevSomeWare's Learning Platform. Track your progress, access course materials, and engage with mentors and peers in your learning journey.",
  keywords: [
    "Enrolled Courses",
    "My Courses DevSomeWare",
    "Learning Dashboard",
    "Course Progress",
    "DevSomeWare LMS",
    "Track Courses",
    "Tech Courses",
    "DevSomeWare Learning",
    "Online Learning Platform",
    "Personalized Learning",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Enrolled Courses - DevSomeWare | Learn DevSomeWare",
    description:
      "Access and manage your enrolled courses on DevSomeWare. Track your learning journey and continue developing your tech skills with personalized course materials.",
    url: "https://learn.devsomeware.com/course",
    type: "website",
    images: [
      {
        url: "/alogo.png",
        width: 1200,
        height: 630,
        alt: "Your Enrolled Courses on DevSomeWare",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@DevSomeware",
    title: "Enrolled Courses - DevSomeWare | Learn DevSomeWare",
    description:
      "Manage your enrolled courses on DevSomeWare. Track your progress and stay on top of your learning goals. Access course materials and connect with peers.",
    images: "/alogo.png",
  },
  robots: "index, follow", // Ensuring the user's enrolled courses can be indexed.
  alternates: {
    canonical: "https://learn.devsomeware.com/course",
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
