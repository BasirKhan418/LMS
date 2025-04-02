import React from 'react'
export const metadata = {
  title: "Send Notification - DevSomeWare | Learn DevSomeWare",
  description:
    "Send important notifications to users on DevSomeWare. Admins can notify students about course updates, deadlines, events, and more.",
  keywords: [
    "Send Notification",
    "Admin Notifications",
    "LMS Notification System",
    "Admin Panel Notifications",
    "Platform Notifications",
    "Course Notifications",
    "Admin Alerts",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Send Notification - DevSomeWare | Learn DevSomeWare",
    description:
      "Admins can send platform-wide notifications to users on DevSomeWare. Keep students informed about courses, deadlines, and more.",
    url: "https://learn.devsomeware.com/adminotification",
    type: "website",
    images: [
      {
        url: "/alogo.png",
        width: 1200,
        height: 630,
        alt: "Send Notification - Admin Panel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@DevSomeware",
    title: "Send Notification - DevSomeWare | Learn DevSomeWare",
    description:
      "Manage notifications for students and instructors. Send alerts and reminders about courses, assignments, and other platform events.",
    images: "/alogo.png",
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://learn.devsomeware.com/adminnotification",
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
