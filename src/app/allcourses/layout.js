

export const metadata = {
  title: "All Courses - DevSomeWare | Learn DevSomeWare",
  description:
    "Explore a wide range of courses on DevSomeWare's Learning Platform. Learn tech skills, advance your career, and access expert-led training in various fields like software development, cloud computing, and more.",
  keywords: [
    "All Courses DevSomeWare",
    "Online Courses",
    "Tech Courses",
    "Learn DevSomeWare",
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
    title: "All Courses - DevSomeWare | Learn DevSomeWare",
    description:
      "Discover and browse through all available courses on DevSomeWare. Start learning tech skills, programming, cloud computing, and more to boost your career.",
    url: "https://learn.devsomeware.com/allcourses",
    type: "website",
    images: [
      {
        url: "/alogo.png",
        width: 1200,
        height: 630,
        alt: "Browse All Courses on DevSomeWare",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@DevSomeware",
    title: "All Courses - DevSomeWare | Learn DevSomeWare",
    description:
      "Browse through all courses on DevSomeWare. Learn new tech skills and enhance your career with expert-led courses in various subjects.",
    images: "/alogo.png",
  },
  robots: "index, follow",
  alternates: {
    canonical: "https://learn.devsomeware.com/allcourses",
  },
};

export default function AllCoursesPage({
  children,
}) {
  return <>{children}</>;
}
