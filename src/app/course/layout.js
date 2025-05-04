import React from 'react'
export const metadata = {
  title: "Enrolled Courses - Infotact | Learn Infotact",
  description:
    "View the courses you are enrolled in on Infotact's Learning Platform. Track your progress, access course materials, and engage with mentors and peers in your learning journey.",
  keywords: [
    "Enrolled Courses",
    "My Courses Infotact",
    "Learning Dashboard",
    "Course Progress",
    "Infotact LMS",
    "Track Courses",
    "Tech Courses",
    "Infotact Learning",
    "Online Learning Platform",
    "Personalized Learning",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Enrolled Courses - Infotact | Learn Infotact",
    description:
      "Access and manage your enrolled courses on Infotact. Track your learning journey and continue developing your tech skills with personalized course materials.",
    url: "https://infotactlearning.in/course",
    type: "website",
    images: [
      {
        url: "/infotactlearning.gif",
        width: 1200,
        height: 630,
        alt: "Your Enrolled Courses on Infotact",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Infotact",
    title: "Enrolled Courses - Infotact | Learn Infotact",
    description:
      "Manage your enrolled courses on Infotact. Track your progress and stay on top of your learning goals. Access course materials and connect with peers.",
    images: "/infotactlearning.gif",
  },
  robots: "index, follow", // Ensuring the user's enrolled courses can be indexed.
  alternates: {
    canonical: "https://infotactlearning.in/course",
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
