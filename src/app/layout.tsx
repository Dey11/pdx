import { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Suspense } from "react";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
    default: "PDX - AI Study Material Generator | Custom Syllabus to PDF",
    template: "%s | PDX",
  },
  description:
    "Transform your syllabus into in-depth, 100+ page study materials using AI. Customize and generate comprehensive PDFs tailored for your academic success.",
  keywords: [
    "AI study materials",
    "custom study guides",
    "syllabus to PDF",
    "educational AI",
    "exam preparation",
    "academic PDF generator",
    "AI notes",
    "AI study guides",
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
    title: "PDX - AI Study Material Generator | Custom Syllabus to PDF",
    description:
      "Transform your syllabus into in-depth, 100+ page study materials using AI. Customize and generate comprehensive PDFs tailored for your academic success.",
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
    title: "PDX - AI Study Material Generator | Custom Syllabus to PDF",
    description:
      "Transform your syllabus into in-depth, 100+ page study materials using AI. Customize and generate comprehensive PDFs tailored for your academic success.",
    images: ["/og-image.png"],
    creator: "@usepdx_",
    site: "@usepdx_",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en">
        <head>
          <script
            defer
            src="https://cloud.umami.is/script.js"
            data-website-id="fb33721b-90b2-4217-952c-b071a05d1d5e"
          ></script>
        </head>
        <body
          className={`${poppins.className} dark bg-[#131212] tracking-wide antialiased`}
        >
          <NextTopLoader showSpinner={false} color="#FFC947" />
          {/* max-w-screen-xl */}
          <Analytics />
          <SpeedInsights />
          <div className="mx-auto">
            <Suspense>{children}</Suspense>
          </div>
        </body>
      </html>
    </Providers>
  );
}
