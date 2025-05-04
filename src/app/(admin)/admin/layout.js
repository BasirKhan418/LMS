import React from 'react'
export const metadata = {
  title: "Admin Panel - Infotact | Learn Infotact",
  description:
    "Manage and oversee all activities on Infotact's Learning Platform from the Admin Panel. Admins can manage courses, assignments, projects, users, and content with ease to ensure smooth platform operations.",
  keywords: [
    "Admin Panel Infotact",
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
    title: "Admin Panel - Infotact | Learn Infotact",
    description:
      "The central hub for platform administrators to manage courses, assignments, users, and notifications. Ensure smooth platform operation and enhance the learning experience for students.",
    url: "https://infotactlearning.in/admin",
    type: "website",
    images: [
      {
        url: "/infotactlearning.gif",
        width: 1200,
        height: 630,
        alt: "Infotact Admin Panel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Infotact",
    title: "Admin Panel - Infotact | Learn Infotact",
    description:
      "Access the Infotact Admin Panel to manage users, courses, assignments, and notifications, ensuring smooth operation of the learning platform.",
    images: "/infotactlearning.gif",
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://infotactlearning.in/admin",
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
