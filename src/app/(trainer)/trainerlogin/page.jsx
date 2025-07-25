import React from 'react'
import { TrainerLogin } from '@/utilities/Auth/TrainerLogin';
export const metadata = {
  title: "Trainer Login - Infotact | Infotact Admin Panel",
  description:
    "Securely log in to the Infotact Trainer Panel to manage courses, assignments, projects, and users. Trainer can access the full suite of management tools.",
  keywords: [
    "Trainer Login",
    "Trainer Panel Login",
    "Login to Infotact",
    "Admin Access",
    "Secure Trainer Login",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Trainer Login - Infotact | Learn Infotact",
    description:
      "Login to the Infotact Trainer  Panel. Manage courses, assignments, users, and more to maintain the learning platform.",
    url: "",
    type: "website",
    images: [
      {
        url: "/infotactlearning.gif",
        width: 1200,
        height: 630,
        alt: "Infotact Trainer Login",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Infotact",
    title: "Trainer Login - Infotact | Learn Infotact",
    description:
      "Access the trainer panel of Infotact to manage platform content, courses, projects, and users securely.",
    images: "/infotactlearning.gif",
  },
  robots: "noindex, nofollow",
  alternates: {
    canonical: "https://infotactlearning.in/trainerlogin",
  },
};

const page = () => {
  return (
    <div>
      <TrainerLogin/>
    </div>
  )
}

export default page
