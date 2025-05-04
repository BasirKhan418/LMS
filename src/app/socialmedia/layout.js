export const metadata = {
    title: "Social Learning Community - Infotact | Learn Infotact",
    description:
      "Connect with fellow learners in Infotact's social learning community. Share achievements, join study groups, collaborate on projects, and enhance your educational experience through peer interaction.",
    keywords: [
      "Social Learning",
      "Learning Community",
      "Infotact Social",
      "Tech Learning Network",
      "Educational Social Platform",
      "Peer Collaboration",
      "Student Networking",
      "Knowledge Sharing",
      "Social Media for Learning",
      "Community-based Education",
    ],
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      title: "Social Learning Community - Infotact | Learn Infotact",
      description:
        "Join Infotact's vibrant social learning community where tech enthusiasts connect, collaborate, and grow together while enhancing their educational journey.",
      url: "https://infotactlearning.in/social",
      type: "website",
      images: [
        {
          url: "/infotactlearning.gif",
          width: 1200,
          height: 630,
          alt: "Infotact Social Learning Community",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@Infotact",
      title: "Social Learning Community - Infotact | Learn Infotact",
      description:
        "Experience the power of community learning with Infotact's social platform. Connect with peers, share resources, and build your professional network.",
      images: "/infotactlearning.gif",
    },
    robots: "index, follow",
    alternates: {
      canonical: "https://infotactlearning.in/social",
    },
  };
  
  export default function SocialMediaLayoutPage({
    children,
  }) {
    return <>{children}</>;
  }