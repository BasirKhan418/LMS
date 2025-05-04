import React from 'react'
export const metadata = {
  title: "Send Notification - Infotact | Learn Infotact",
  description:
    "Send important notifications to users on Infotact. Admins can notify students about course updates, deadlines, events, and more.",
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
    title: "Send Notification - Infotact | Learn Infotact",
    description:
      "Admins can send platform-wide notifications to users on Infotact. Keep students informed about courses, deadlines, and more.",
    url: "https://infotactlearning.in/adminotification",
    type: "website",
    images: [
      {
        url: "/infotactlearning.gif",
        width: 1200,
        height: 630,
        alt: "Send Notification - Admin Panel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Infotact",
    title: "Send Notification - Infotact | Learn Infotact",
    description:
      "Manage notifications for students and instructors. Send alerts and reminders about courses, assignments, and other platform events.",
    images: "/infotactlearning.gif",
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://infotactlearning.in/adminnotification",
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
