import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Waitlist | Pdx",
  description:
    "Join the waitlist to get early access and exclusive discounts to PDX",
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
