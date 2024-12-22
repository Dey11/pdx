import { DM_Serif_Text } from "next/font/google";

import { cn } from "@/lib/utils";

const dmSerif = DM_Serif_Text({ weight: "400", subsets: ["latin"] });

export function H3({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        ` ${dmSerif.className} scroll-m-20 text-2xl font-semibold tracking-tight`,
        className
      )}
    >
      {children}
    </h3>
  );
}
