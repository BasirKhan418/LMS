import React from 'react'
export const metadata = {
  title: "Admin Video Gallery - DevSomeWare | Learn DevSomeWare",
  description:
    "Manage and view all video content in the DevSomeWare Video Gallery. Upload, organize, and update educational videos for your LMS platform to enhance learning experience.",
  keywords: [
    "Admin Video Gallery",
    "DevSomeWare Video Gallery",
    "Manage Video Content",
    "Video Upload Admin",
    "Educational Videos",
    "LMS Video Gallery",
    "Learning Platform Video Gallery",
    "Video Content Management",
    "Admin Panel Video Management",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Admin Video Gallery - DevSomeWare | Learn DevSomeWare",
    description:
      "Upload, organize, and manage your educational video content through the DevSomeWare Admin Video Gallery. Enhance the learning experience with seamless video management.",
    url: "https://learn.devsomeware.com/adminvideogallery",
    type: "website",
    images: [
      {
        url: "/alogo.png",
        width: 1200,
        height: 630,
        alt: "Admin Video Gallery - DevSomeWare",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@DevSomeware",
    title: "Admin Video Gallery - DevSomeWare | Learn DevSomeWare",
    description:
      "View and manage all educational video content in your DevSomeWare Video Gallery. Upload and organize videos to enhance the learning experience.",
    images: "/alogo.png",
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://learn.devsomeware.com/adminvideo-gallery",
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
