import React from 'react'
import { AdminLogin } from '@/utilities/Auth/AdminLogin'
export const metadata = {
  title: "Admin Login - Infotact | Infotact Admin Panel",
  description:
    "Securely log in to the Infotact Admin Panel to manage courses, assignments, projects, and users. Admins can access the full suite of management tools.",
  keywords: [
    "Admin Login",
    "Admin Panel Login",
    "Login to Infotact",
    "Admin Access",
    "Secure Admin Login",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Admin Login - Infotact | Learn Infotact",
    description:
      "Login to the Infotact Admin Panel. Manage courses, assignments, users, and more to maintain the learning platform.",
    url: "",
    type: "website",
    images: [
      {
        url: "/infotactlearning.gif",
        width: 1200,
        height: 630,
        alt: "Infotact Admin Login",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Infotact",
    title: "Admin Login - Infotact | Learn Infotact",
    description:
      "Access the admin panel of Infotact to manage platform content, courses, projects, and users securely.",
    images: "/infotactlearning.gif",
  },
  robots: "noindex, nofollow",
  alternates: {
    canonical: "https://infotactlearning.in/adminlogin",
  },
};

const page = () => {
  return (
    <div>
      <AdminLogin/>
    </div>
  )
}

export default page
