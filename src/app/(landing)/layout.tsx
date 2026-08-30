import React from "react";

import Footer from "@/components/footer";
import Header from "@/components/header";

export const metadata = {
  title: "PDX - Generate PDF Study Materials with Your Own AI Provider",
  description:
    "Generate comprehensive study materials from any syllabus with your own OpenAI-compatible provider. Create detailed PDF notes, summaries, and practice questions with no PDX subscription.",
  keywords: [
    "generate study materials",
    "syllabus to study notes",
    "AI study notes generator",
    "exam preparation PDFs",
    "study material creator",
    "comprehensive study guides",
    "custom course materials",
    "digital study notes",
    "automated study material",
    "PDF study material",
    "academic notes generator",
    "instant study guides",
    "exam preparation tool",
    "educational resource generator",
    "AI learning materials",
  ],
  openGraph: {
    type: "website",
    url: "https://pdx.sdey.me",
    title: "PDX - Generate Study Materials with Your Own AI Provider",
    description:
      "Paste your syllabus, connect an OpenAI-compatible provider, and generate detailed PDF notes for your course or exam.",
    images: [
      {
        url: "https://pdx.sdey.me/logo.png",
        alt: "PDX Study Material Generator Logo",
      },
    ],
  },
  twitter: {
    title: "PDX - Generate Study Materials with Your Own AI Provider",
    description:
      "Paste your syllabus, connect an OpenAI-compatible provider, and generate detailed PDF notes for your course or exam.",
  },
};

const Layout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div>
      <Header />

      {children}

      <Footer />
    </div>
  );
};

export default Layout;
