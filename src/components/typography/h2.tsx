import { DM_Serif_Text } from "next/font/google";

import { cn } from "@/lib/utils";

const dmSerif = DM_Serif_Text({
  weight: "400",
  subsets: ["latin", "latin-ext"],
});

export function H2({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        `scroll-m-20 text-4xl font-semibold tracking-tight first:mt-0 lg:text-5xl ${dmSerif.className}`,
        className
      )}
    >
      {children}
    </h2>
  );
}
