import React from 'react'
export const metadata = {
  title: "Projects - Infotact | Learn Infotact",
  description:
    "Showcase your projects on Infotact's Learning Platform. Collaborate with fellow learners, get feedback from instructors, and enhance your skills through real-world tech projects.",
  keywords: [
    "Infotact Projects",
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
    title: "Projects - Infotact | Learn Infotact",
    description:
      "Explore and showcase tech projects on Infotact. Work on real-world challenges, collaborate with others, and enhance your coding and development skills.",
    url: "https://infotactlearning.in/project",
    type: "website",
    images: [
      {
        url: "/infotactlearning.gif",
        width: 1200,
        height: 630,
        alt: "Infotact Projects Page",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Infotact",
    title: "Projects - Infotact | Learn Infotact",
    description:
      "Discover and submit tech projects on Infotact. Collaborate, get feedback, and enhance your skills through hands-on experience with real-world projects.",
    images: "/infotactlearning.gif",
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://infotactlearning.in/project",
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
