
import Home from "@/utilities/Home";

export const metadata = {
  title: "Learn - Infotact | Infotact Learning Platform",
  description:
    "Infotact's Learning Platform offers a comprehensive online learning experience. Explore a wide range of courses, build your skills, and collaborate with expert mentors in various fields.",
  keywords: [
    "Infotact Learning Platform",
    "Online Learning",
    "LMS Platform",
    "Learn Infotact",
    "Tech Courses Online",
    "Skill Development",
    "Developer Learning",
    "Course Platform",
    "Education for Developers",
    "Online Learning Platform",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Learn - Infotact | Infotact Learning Platform",
    description:
      "Join Infotact's Learning Platform to enhance your skills with curated courses. Learn from industry experts, collaborate with peers, and boost your career with quality online education.",
    url: "https://infotactlearning.in",
    type: "website",
    images: [
      {
        url: "/infotactlearning.gif",
        width: 1200,
        height: 630,
        alt: "Infotact Learning Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Infotact",
    title: "Learn - Infotact | Infotact Learning Platform",
    description:
      "Explore Infotact's LMS to start your learning journey. Access expert-led courses, build skills, and advance your career in tech.",
    images: "/infotactlearning.gif",
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://infotactlearning.in",
  },
};


export default function Page() {
  return (
   <Home/>
  // <Login/>
  );
}
