import React from 'react'
export const metadata = {
  title: "Trainer Profile - Infotact | Learn Infotact ",
  description:
    "View and manage your admin profile on Infotact . Update your personal information, change settings, and oversee your platform activity to ensure smooth administration of the learning platform.",
  keywords: [
    "Admin Profile",
    "Infotact  Admin",
    "Admin Dashboard Profile",
    "Admin Profile Management",
    "LMS Admin Profile",
    "Manage Admin Profile",
    "Infotact  Admin Settings",
    "Admin Settings",
    "Learning Platform Admin",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Admin Profile - Infotact  | Learn Infotact ",
    description:
      "Manage and update your admin profile on Infotact . View your platform activity, adjust admin settings, and personalize your learning platform management experience.",
    url: "https://infotactlearning.in/trainerprofile",
    type: "website",
    images: [
      {
        url: "/infotactlearning.gif",
        width: 1200,
        height: 630,
        alt: "Trainer Profile - Infotact ",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Infotact ",
    title: "Admin Profile - Infotact  | Learn Infotact ",
    description:
      "Access and manage your profile as an admin on Infotact . Update personal details, modify settings, and ensure smooth platform management.",
    images: "/infotactlearning.gif",
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://infotactlearning.in/trainerprofile",
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
