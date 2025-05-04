export const metadata = {
    title: "Discussion Forums - Infotact | Learn Infotact",
    description:
      "Engage in meaningful discussions with peers and instructors on Infotact's Learning Platform. Share ideas, ask questions, and collaborate on projects in our interactive discussion forums.",
    keywords: [
      "Discussion Forums",
      "Online Learning Community",
      "Infotact Discussions",
      "Student Collaboration",
      "Peer Learning",
      "Educational Forums",
      "Tech Discussions",
      "Course Forums",
      "Knowledge Sharing",
      "Interactive Learning",
    ],
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      title: "Discussion Forums - Infotact | Learn Infotact",
      description:
        "Connect with fellow learners and instructors in Infotact's interactive discussion forums. Exchange ideas, solve problems together, and enhance your learning experience.",
      url: "https://infotactlearning.in/discussion",
      type: "website",
      images: [
        {
          url: "/infotactlearning.gif",
          width: 1200,
          height: 630,
          alt: "Interactive Discussion Forums on Infotact",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@Infotact",
      title: "Discussion Forums - Infotact | Learn Infotact",
      description:
        "Join vibrant discussion forums on Infotact where students and instructors collaborate, share resources, and deepen understanding through community learning.",
      images: "infotactlearning.gif",
    },
    robots: "index, follow",
    alternates: {
      canonical: "https://infotactlearning.in/discussion",
    },
  };
  
  export default function DiscussionPage({
    children,
  }) {
    return <>{children}</>;
  }