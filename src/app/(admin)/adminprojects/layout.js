import React from 'react'
export const metadata = {
  title: "Add Project - DevSomeWare | Learn DevSomeWare",
  description:
    "Admins can add tech projects for students on DevSomeWare. Create real-world challenges and help students apply their learning to build impactful solutions.",
  keywords: [
    "Add Project",
    "Project-Based Learning",
    "Tech Projects for Students",
    "Project Creation",
    "Learning Platform Projects",
    "Admin Add Project",
    "Programming Projects",
    "Admin Add Challenge",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Add Project - DevSomeWare | Learn DevSomeWare",
    description:
      "Create and manage tech projects on DevSomeWare. Add challenges, instructions, and resources for students to build real-world solutions.",
    url: "https://learn.devsomeware.com/adminprojects",
    type: "website",
    images: [
      {
        url: "/alogo.png",
        width: 1200,
        height: 630,
        alt: "Add Project - Admin Panel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@DevSomeware",
    title: "Add Project - DevSomeWare | Learn DevSomeWare",
    description:
      "Create and manage tech projects for students on DevSomeWare. Help students apply their skills to solve real-world problems with hands-on projects.",
    images: "/alogo.png",
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://learn.devsomeware.com/adminprojects",
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
