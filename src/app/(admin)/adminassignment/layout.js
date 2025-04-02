import React from 'react'
export const metadata = {
  title: "Add Assignment - DevSomeWare | Learn DevSomeWare",
  description:
    "Admins can add assignments to courses on DevSomeWare to evaluate student progress. Create custom assignments with deadlines, instructions, and submission formats.",
  keywords: [
    "Add Assignment",
    "Course Assignment Management",
    "Learning Platform Assignments",
    "Assignment Creation",
    "Admin Add Assignment",
    "Programming Assignments",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Add Assignment - DevSomeWare | Learn DevSomeWare",
    description:
      "Create and manage assignments for courses on DevSomeWare. Assignments help evaluate and reinforce student learning with deadlines and submission options.",
    url: "https://learn.devsomeware.com/adminassignment",
    type: "website",
    images: [
      {
        url: "/alogo.png",
        width: 1200,
        height: 630,
        alt: "Add Assignment - Admin Panel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@DevSomeware",
    title: "Add Assignment - DevSomeWare | Learn DevSomeWare",
    description:
      "Manage and add assignments to courses on DevSomeWare. Provide engaging and challenging tasks to students to assess their progress.",
    images: "/alogo.png",
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://learn.devsomeware.com/adminassignment",
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
