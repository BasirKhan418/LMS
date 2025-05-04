import React from 'react'
export const metadata = {
  title: "Admin Video Gallery - Infotact | Learn Infotact",
  description:
    "Manage and view all video content in the Infotact Video Gallery. Upload, organize, and update educational videos for your LMS platform to enhance learning experience.",
  keywords: [
    "Admin Video Gallery",
    "Infotact Video Gallery",
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
    title: "Admin Video Gallery - Infotact | Learn Infotact",
    description:
      "Upload, organize, and manage your educational video content through the Infotact Admin Video Gallery. Enhance the learning experience with seamless video management.",
    url: "https://infotactlearning.in/adminvideogallery",
    type: "website",
    images: [
      {
        url: "/infotactlearning.gif",
        width: 1200,
        height: 630,
        alt: "Admin Video Gallery - Infotact",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Infotact",
    title: "Admin Video Gallery - Infotact | Learn Infotact",
    description:
      "View and manage all educational video content in your Infotact Video Gallery. Upload and organize videos to enhance the learning experience.",
    images: "/infotactlearning.gif",
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://infotactlearning.in/adminvideogallery",
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
