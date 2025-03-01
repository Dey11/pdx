import { DM_Serif_Text } from "next/font/google";

import { cn } from "@/lib/utils";

const dmSerif = DM_Serif_Text({ weight: "400", subsets: ["latin"] });

export function H1({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h1
      className={cn(
        `scroll-m-20 text-4xl font-bold tracking-tight lg:text-6xl ${dmSerif.className}`,
        className
      )}
    >
      {children}
    </h1>
  );
}
