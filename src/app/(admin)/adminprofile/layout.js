import React from 'react'
export const metadata = {
  title: "Admin Profile - DevSomeWare | Learn DevSomeWare",
  description:
    "View and manage your admin profile on DevSomeWare. Update your personal information, change settings, and oversee your platform activity to ensure smooth administration of the learning platform.",
  keywords: [
    "Admin Profile",
    "DevSomeWare Admin",
    "Admin Dashboard Profile",
    "Admin Profile Management",
    "LMS Admin Profile",
    "Manage Admin Profile",
    "DevSomeWare Admin Settings",
    "Admin Settings",
    "Learning Platform Admin",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Admin Profile - DevSomeWare | Learn DevSomeWare",
    description:
      "Manage and update your admin profile on DevSomeWare. View your platform activity, adjust admin settings, and personalize your learning platform management experience.",
    url: "https://learn.devsomeware.com/adminprofile",
    type: "website",
    images: [
      {
        url: "/alogo.png",
        width: 1200,
        height: 630,
        alt: "Admin Profile - DevSomeWare",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@DevSomeware",
    title: "Admin Profile - DevSomeWare | Learn DevSomeWare",
    description:
      "Access and manage your profile as an admin on DevSomeWare. Update personal details, modify settings, and ensure smooth platform management.",
    images: "/alogo.png",
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://learn.devsomeware.com/adminprofile",
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
