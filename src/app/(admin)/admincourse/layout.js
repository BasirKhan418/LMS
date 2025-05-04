import React from 'react'
export const metadata = {
  title: "Add Course Content - Infotact | Learn Infotact",
  description:
    "Admins can add detailed content to each course on Infotact. Upload videos, documents, and resources to enhance the student learning experience.",
  keywords: [
    "Add Course Content",
    "Course Content Management",
    "LMS Content Management",
    "Upload Course Materials",
    "Learning Platform Content",
    "Add Videos to Course",
    "Admin Content Upload",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Add Course Content - Infotact | Learn Infotact",
    description:
      "Admins can upload and manage course content including videos, articles, and assignments. Enhance the learning experience for students.",
    url: "https://infotactlearning.in/admincourse",
    type: "website",
    images: [
      {
        url: "/infotactlearning.gif",
        width: 1200,
        height: 630,
        alt: "Add Course Content - Admin Panel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Infotact",
    title: "Add Course Content - Infotact | Learn Infotact",
    description:
      "Upload and manage course content on Infotact. Admins can add videos, documents, and other resources to enrich the student learning experience.",
    images: "/infotactlearning.gif",
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://infotactlearning.in/admincourse",
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
