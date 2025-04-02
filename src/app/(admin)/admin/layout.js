import React from 'react'
export const metadata = {
  title: "Admin Panel - DevSomeWare | Learn DevSomeWare",
  description:
    "Manage and oversee all activities on DevSomeWare's Learning Platform from the Admin Panel. Admins can manage courses, assignments, projects, users, and content with ease to ensure smooth platform operations.",
  keywords: [
    "Admin Panel DevSomeWare",
    "LMS Admin Panel",
    "Manage Courses",
    "Learning Platform Admin",
    "Course Management",
    "Admin Dashboard",
    "Online Learning Administration",
    "Admin Tools",
    "Manage Users",
    "Platform Administration",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Admin Panel - DevSomeWare | Learn DevSomeWare",
    description:
      "The central hub for platform administrators to manage courses, assignments, users, and notifications. Ensure smooth platform operation and enhance the learning experience for students.",
    url: "https://learn.devsomeware.com/admin",
    type: "website",
    images: [
      {
        url: "/alogo.png",
        width: 1200,
        height: 630,
        alt: "DevSomeWare Admin Panel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@DevSomeware",
    title: "Admin Panel - DevSomeWare | Learn DevSomeWare",
    description:
      "Access the DevSomeWare Admin Panel to manage users, courses, assignments, and notifications, ensuring smooth operation of the learning platform.",
    images: "/alogo.png",
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://learn.devsomeware.com/admin",
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
