import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import localFont from "next/font/local";
import Image from "next/image";
import { Suspense } from "react";

import Footer from "@/components/footer";
import Header from "@/components/header";
import Providers from "@/components/providers";

import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const kyivType = localFont({
  src: "./fonts/KyivTypeSerif-Black.otf",
  variable: "--font-kyiv-type",
  weight: "100 900",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "PdX",
  description: "Transform the way you study",
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
          className={`${kyivType.style} dark bg-[#131212] tracking-wide antialiased`}
        >
          <Image
            src="/logo.png"
            alt="Logo"
            width={40}
            height={50}
            className="left-10 z-20 -mt-2 hidden md:fixed md:block"
          />

          <div className="relative">
            <div className="absolute -top-[15vh] left-1/2 right-1/2 -z-20 size-[40dvh] -translate-x-1/2 rounded-full bg-[#00FF1E]/60 blur-[100px] sm:-top-[60dvh] sm:size-[90dvh] sm:blur-[120px]" />
          </div>

          <Header />
          {/* max-w-screen-xl */}
          <main className="mx-auto">
            <Suspense>{children}</Suspense>
          </main>

          <Footer />
        </body>
      </html>
    </Providers>
  );
}
