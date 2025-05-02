import React from 'react'
import ChatInterface from '@/utilities/Chat/chat-interface';
export const metadata = {
  title: "Discussion Forum - Infotact | Learn Infotact",
  description:
    "Join the Infotact Discussion Forum to interact with peers, instructors, and experts. Share your thoughts, ask questions, and collaborate on various tech topics to enhance your learning experience.",
  keywords: [
    "Infotact Forum",
    "Discussion Forum",
    "Tech Discussions",
    "Programming Forum",
    "Online Learning Forum",
    "Developer Community",
    "Collaborate with Developers",
    "Tech Community",
    "Learn Infotact Discussions",
    "Ask Questions",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Discussion Forum - Infotact | Learn Infotact",
    description:
      "Engage with the Infotact community in the discussion forum. Ask questions, share insights, and collaborate with fellow learners and experts in tech.",
    url: "https://learn.Infotact.com/discussion",
    type: "website",
    images: [
      {
        url: "/alogo.png",
        width: 1200,
        height: 630,
        alt: "Infotact Discussion Forum",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Infotact",
    title: "Discussion Forum - Infotact | Learn Infotact",
    description:
      "Join the Infotact Forum to discuss tech topics, ask questions, and engage with the learning community. Connect with fellow developers and mentors.",
    images: "/alogo.png",
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://learn.Infotact.com/discussion",
  },
};
const page = () => {
  return (
    <div>
      <ChatInterface/>
    </div>
  )
}

export default page
