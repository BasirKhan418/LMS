import React from 'react'
export const metadata = {
  title: "Trainer Profile - Infotact | Learn Infotact ",
  description:
    "View and manage your Trainer profile on Infotact . Update your personal information, change settings, and oversee your platform activity to ensure smooth Traineristration of the learning platform.",
  keywords: [
    "Trainer Profile",
    "Infotact  Trainer",
    "Trainer Dashboard Profile",
    "Trainer Profile Management",
    "LMS Trainer Profile",
    "Manage Trainer Profile",
    "Infotact  Trainer Settings",
    "Trainer Settings",
    "Learning Platform Trainer",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Trainer Profile - Infotact  | Learn Infotact ",
    description:
      "Manage and update your Trainer profile on Infotact . View your platform activity, adjust Trainer settings, and personalize your learning platform management experience.",
    url: "https://learn.Infotact .com/Trainerprofile",
    type: "website",
    images: [
      {
        url: "/alogo.png",
        width: 1200,
        height: 630,
        alt: "Trainer Profile - Infotact ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Infotact ",
    title: "Trainer Profile - Infotact  | Learn Infotact ",
    description:
      "Access and manage your profile as an Trainer on Infotact . Update personal details, modify settings, and ensure smooth platform management.",
    images: "/alogo.png",
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://learn.Infotact .com/Trainerprofile",
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
