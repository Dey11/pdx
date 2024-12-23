import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Suspense } from "react";

import NextTopLoader from "nextjs-toploader";

import Providers from "@/components/providers";

import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://usepdx.tech"),
  title: {
    default: "PDX - Transform Your Study Experience",
    template: "%s | PDX",
  },
  description:
    "Transform your syllabus into perfectly designed PDFs with PDX—your personal AI-powered learning solution. Get tailored study materials in minutes.",
  keywords: [
    "study materials",
    "AI learning",
    "AI education",
    "AI Agents",
    "PDF generation",
    "education",
    "syllabus",
    "study guide",
    "learning platform",
  ],
  authors: [{ name: "PDX Team" }],
  creator: "PDX Team",
  publisher: "PDX",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://usepdx.tech",
    siteName: "PDX",
    title: "PDX - Transform Your Study Experience",
    description:
      "Transform your syllabus into perfectly designed PDFs with PDX—your personal AI-powered learning solution. Get tailored study materials in minutes.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PDX - Transform Your Study Experience",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDX - Transform Your Study Experience",
    description:
      "Transform your syllabus into perfectly designed PDFs with PDX—your personal AI-powered learning solution. Get tailored study materials in minutes.",
    images: ["/og-image.png"],
    creator: "@pdxstudios",
    site: "@pdxstudios",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  // viewport: {
  //   width: "device-width",
  //   initialScale: 1,
  //   maximumScale: 1,
  // },
  // themeColor: "#04D31C",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en">
        <body
          className={`${poppins.className} dark bg-[#131212] tracking-wide antialiased`}
        >
          <NextTopLoader showSpinner={false} color="#04D31C" />
          {/* max-w-screen-xl */}
          <div className="mx-auto">
            <Suspense>{children}</Suspense>
          </div>
        </body>
      </html>
    </Providers>
  );
}
