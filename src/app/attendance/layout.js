export const metadata = {
    title: "Attendance Management - Infotact | Learn Infotact",
    description:
      "Track and manage student attendance efficiently with Infotact's Learning Platform. Monitor participation, generate reports, and ensure engagement in online and offline courses.",
    keywords: [
      "Attendance Management",
      "Student Tracking",
      "Infotact Attendance",
      "Course Participation",
      "Attendance Reports",
      "Online Learning Attendance",
      "Student Engagement Tracking",
      "Educational Analytics",
      "Classroom Management",
      "Attendance Dashboard",
    ],
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      title: "Attendance Management - Infotact | Learn Infotact",
      description:
        "Efficiently track and manage student attendance on Infotact's Learning Platform. Access detailed reports and ensure optimal participation in your courses.",
      url: "https://infotactlearning.in/attendance",
      type: "website",
      images: [
        {
          url: "/infotactlearning.gif",
          width: 1200,
          height: 630,
          alt: "Attendance Management on Infotact",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@Infotact",
      title: "Attendance Management - Infotact | Learn Infotact",
      description:
        "Track student attendance, generate reports, and monitor engagement for online and offline courses with Infotact's powerful attendance tools.",
      images: "infotactlearning.gif",
    },
    robots: "index, follow",
    alternates: {
      canonical: "https://infotactlearning.in/attendance",
    },
  };
  
  export default function AttendancePage({
    children,
  }) {
    return <>{children}</>;
  }