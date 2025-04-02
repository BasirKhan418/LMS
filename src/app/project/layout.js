import React from 'react'
export const metadata = {
  title: "Projects - DevSomeWare | Learn DevSomeWare",
  description:
    "Showcase your projects on DevSomeWare's Learning Platform. Collaborate with fellow learners, get feedback from instructors, and enhance your skills through real-world tech projects.",
  keywords: [
    "DevSomeWare Projects",
    "Tech Projects",
    "Collaborative Projects",
    "Online Projects",
    "Real-World Projects",
    "Project-Based Learning",
    "Developer Portfolio",
    "Programming Projects",
    "Learning by Doing",
    "Tech Skills Projects",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Projects - DevSomeWare | Learn DevSomeWare",
    description:
      "Explore and showcase tech projects on DevSomeWare. Work on real-world challenges, collaborate with others, and enhance your coding and development skills.",
    url: "https://learn.devsomeware.com/project",
    type: "website",
    images: [
      {
        url: "/alogo.png",
        width: 1200,
        height: 630,
        alt: "DevSomeWare Projects Page",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@DevSomeware",
    title: "Projects - DevSomeWare | Learn DevSomeWare",
    description:
      "Discover and submit tech projects on DevSomeWare. Collaborate, get feedback, and enhance your skills through hands-on experience with real-world projects.",
    images: "/alogo.png",
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://learn.devsomeware.com/project",
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
