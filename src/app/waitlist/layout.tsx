import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Join Waitlist | PDX",
  description:
    "Join the PDX waitlist to get early access and exclusive discounts. Transform your study experience with AI-powered PDF generation and tailored study materials.",
  openGraph: {
    title: "Join PDX Waitlist - Get Early Access & Exclusive Discounts",
    description:
      "Join the PDX waitlist to get early access and exclusive discounts. Transform your study experience with AI-powered PDF generation and tailored study materials.",
  },
  twitter: {
    title: "Join PDX Waitlist - Get Early Access & Exclusive Discounts",
    description:
      "Join the PDX waitlist to get early access and exclusive discounts. Transform your study experience with AI-powered PDF generation and tailored study materials.",
  },
};
export default function WaitlistLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative h-screen overflow-hidden">
      <Image
        className="absolute left-0 top-0"
        src="/waitlist/left-sq.svg"
        alt="bg-square"
        priority
        width={600}
        height={600}
      />
      <Image
        className="absolute bottom-0 right-0"
        src="/waitlist/right-sq.svg"
        alt="btm-square"
        priority
        width={500}
        height={500}
      />
      {children}
    </div>
  );
}
