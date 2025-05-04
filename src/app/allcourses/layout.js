

export const metadata = {
  title: "All Courses - Infotact | Learn Infotact",
  description:
    "Explore a wide range of courses on Infotact's Learning Platform. Learn tech skills, advance your career, and access expert-led training in various fields like software development, cloud computing, and more.",
  keywords: [
    "All Courses Infotact",
    "Online Courses",
    "Tech Courses",
    "Learn Infotact",
    "Software Development Courses",
    "Cloud Computing Courses",
    "Programming Courses",
    "Learning Platform",
    "Online Learning Platform",
    "Courses for Developers",
  ],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "All Courses - Infotact | Learn Infotact",
    description:
      "Discover and browse through all available courses on Infotact. Start learning tech skills, programming, cloud computing, and more to boost your career.",
    url: "https://infotactlearning.in/allcourses",
    type: "website",
    images: [
      {
        url: "/infotactlearning.gif",
        width: 1200,
        height: 630,
        alt: "Browse All Courses on Infotact",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Infotact",
    title: "All Courses - Infotact | Learn Infotact",
    description:
      "Browse through all courses on Infotact. Learn new tech skills and enhance your career with expert-led courses in various subjects.",
    images: "infotactlearning.gif",
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://infotactlearning.in/allcourses",
  },
};

export default function AllCoursesPage({
  children,
}) {
  return <>{children}</>;
}
