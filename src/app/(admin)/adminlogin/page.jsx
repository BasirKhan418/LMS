import React from 'react'
import { AdminLogin } from '@/utilities/Auth/AdminLogin'
export const metadata = {
  title: "Admin Login - DevSomeWare | Learn DevSomeWare",
  description:
    "Securely log in to the DevSomeWare Admin Panel to manage courses, assignments, projects, and users. Admins can access the full suite of management tools.",
  keywords: [
    "Admin Login",
    "Admin Panel Login",
    "Login to DevSomeWare",
    "Admin Access",
    "Secure Admin Login",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Admin Login - DevSomeWare | Learn DevSomeWare",
    description:
      "Login to the DevSomeWare Admin Panel. Manage courses, assignments, users, and more to maintain the learning platform.",
    url: "https://learn.devsomeware.com/adminlogin",
    type: "website",
    images: [
      {
        url: "/alogo.png",
        width: 1200,
        height: 630,
        alt: "DevSomeWare Admin Login",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@DevSomeware",
    title: "Admin Login - DevSomeWare | Learn DevSomeWare",
    description:
      "Access the admin panel of DevSomeWare to manage platform content, courses, projects, and users securely.",
    images: "/alogo.png",
  },
  robots: "noindex, nofollow",
  alternates: {
    canonical: "https://learn.devsomeware.com/adminlogin",
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
