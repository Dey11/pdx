import { Merriweather } from "next/font/google";

import { cn } from "@/lib/utils";

const merriweather = Merriweather({ weight: "400", subsets: ["latin"] });

export function Para({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        `${merriweather.className} leading-7 [&:not(:first-child)]:mt-6`,
        className
      )}
    >
      {children}
    </p>
  );
}
