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
  title: "Pdx",
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
