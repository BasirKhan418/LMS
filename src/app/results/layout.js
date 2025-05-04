export const metadata = {
    title: "Course Results & Grades - Infotact | Learn Infotact",
    description:
      "Access your course results, assessments, grades and performance analytics on Infotact's Learning Platform. Track your educational progress and achievements in tech courses.",
    keywords: [
      "Course Results",
      "Student Grades",
      "Performance Analytics",
      "Infotact Results",
      "Learning Assessments",
      "Test Scores",
      "Educational Progress",
      "Certification Results",
      "Tech Course Grades",
      "Achievement Tracking",
    ],
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      title: "Course Results & Grades - Infotact | Learn Infotact",
      description:
        "View your comprehensive course results and performance analytics on Infotact. Track progress, review assessments, and celebrate your educational achievements.",
      url: "https://infotactlearning.in/results",
      type: "website",
      images: [
        {
          url: "/infotactlearning.gif",
          width: 1200,
          height: 630,
          alt: "Course Results Dashboard on Infotact",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@Infotact",
      title: "Course Results & Grades - Infotact | Learn Infotact",
      description:
        "Access detailed course results, performance analytics, and achievement records on Infotact's comprehensive learning platform.",
      images: "/infotactlearning.gif",
    },
    robots: "noindex, follow",  // Results pages are typically not indexed as they contain personal data
    alternates: {
      canonical: "https://infotactlearning.in/results",
    },
  };
  
  export default function ResultsPage({
    children,
  }) {
    return <>{children}</>;
  }