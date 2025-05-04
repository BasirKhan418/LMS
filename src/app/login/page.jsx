import React from 'react'
import { Login } from '@/utilities/Auth/Login'
export const metadata = {
  title: "Login - Infotact Learning",
  description:
    "Login to your Infotact Learning Platform account to access personalized courses, track progress, and connect with the community. Start your learning journey today.",
  keywords: [
    "Infotact Login",
    "Learning Platform Login",
    "LMS Login",
    "Online Learning Access",
    "Developer Learning Platform",
    "Tech Courses Login",
    "Infotact Account",
    "Access Infotact",
    "Login to LMS",
    "Learning Dashboard Login",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Login - Infotact Learning",
    description:
      "Log in to your Infotact account and unlock your learning dashboard. Access courses, track your progress, and connect with mentors and peers.",
    url: "https://infotactlearning.in/login",
    type: "website",
    images: [
      {
        url: "/infotactlearning.gif",
        width: 1200,
        height: 630,
        alt: "Infotact Login Page",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Infotact",
    title: "Login - Learn Infotact",
    description:
      "Login to Infotact to access a personalized learning experience. Track your courses, connect with experts, and enhance your skills.",
    images: "/infotactlearning.gif",
  },
  robots: "noindex, nofollow", // Login page usually shouldn’t be indexed by search engines.
  alternates: {
    canonical: "https://infotactlearning.in/login",
  },
};

const Page = () => {
  return (
    <div>
      <Login />
    </div>
  )
}

export default Page
