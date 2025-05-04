import React from 'react'
export const metadata = {
  title: "Profile - Infotact | Learn Infotact",
  description:
    "View and manage your profile on Infotact's Learning Platform. Track your courses, achievements, and progress, and personalize your learning experience with Infotact.",
  keywords: [
    "Infotact Profile",
    "LMS Profile",
    "Track Learning Progress",
    "Infotact Courses",
    "Learning Dashboard",
    "Personalized Learning",
    "Developer Profile",
    "Learn Infotact",
    "Profile Management LMS",
    "Online Learning Progress",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Profile - Infotact | Learn Infotact",
    description:
      "Manage and personalize your learning journey on Infotact. View your course progress, achievements, and unlock new learning opportunities with Infotact.",
    url: "https://infotactlearning.in/profile",
    type: "website",
    images: [
      {
        url: "/infotactlearning.gif",
        width: 1200,
        height: 630,
        alt: "Infotact Profile Page",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Infotact",
    title: "Profile - Infotact | Learn Infotact",
    description:
      "Access your Infotact profile to manage your learning progress, achievements, and courses. Enhance your learning journey on Infotact.",
    images: "/infotactlearning.gif",
  },
  robots: "index, follow", // Indexing allowed for user profiles to help with personalized search results.
  alternates: {
    canonical: "https://infotactlearning.in/profile",
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
