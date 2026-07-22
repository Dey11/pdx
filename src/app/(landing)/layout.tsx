import React from "react";

import Footer from "@/components/footer";
import Header from "@/components/header";

export const metadata = {
  title:
    "NoteFormula - AI Study Material Generator | Generate Study Notes from Syllabus | 100+ Page PDF Notes",
  description:
    "Generate comprehensive study materials instantly from any syllabus using AI. Create detailed 100+ page PDF notes with examples, summaries, and practice questions. Ideal for exam preparation, course materials, and self-study. Start with 75 free credits!",
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
    url: "https://noteformula.com",
    title: "NoteFormula - Generate Complete Study Materials from Any Syllabus",
    description:
      "Transform your syllabus into detailed study materials instantly. Generate comprehensive 100+ page PDF notes with our AI technology. Perfect for exam preparation and course materials.",
    images: [
      {
        url: "https://noteformula.com/logo.png",
        alt: "NoteFormula Study Material Generator Logo",
      },
    ],
  },
  twitter: {
    title: "NoteFormula - Generate Complete Study Materials from Any Syllabus",
    description:
      "Create comprehensive study materials instantly from any syllabus. Get 100+ page detailed PDF notes for better exam preparation.",
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
