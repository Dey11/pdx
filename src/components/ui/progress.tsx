import * as React from "react";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  className?: string;
  indicatorClassName?: string;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, indicatorClassName, value, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`relative h-2 w-full overflow-hidden rounded-full ${className}`}
        {...props}
      >
        <div
          className={`h-full w-full transition-all ${indicatorClassName}`}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </div>
    );
  }
);
Progress.displayName = "Progress";

export { Progress };
