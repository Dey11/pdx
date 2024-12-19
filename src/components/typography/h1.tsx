import { cn } from "@/lib/utils";

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
        "scroll-m-20 text-4xl font-bold tracking-tight lg:text-6xl",
        className
      )}
    >
      {children}
    </h1>
  );
}
