import { cn } from "@/lib/utils";

export default function StepUI({ step }: { step: number }) {
  return (
    <div className="mx-auto flex w-full items-center justify-between gap-x-5 py-5 text-center sm:w-[40dvw]">
      <div className="flex flex-col items-center justify-center">
        <div
          className={
            "flex size-12 items-center justify-center rounded-full border-2 border-brand-yellow text-brand-yellow"
          }
        >
          1
        </div>
        <div className="pt-2 text-xs text-brand-yellow sm:text-sm">
          Enter syllabus
        </div>
      </div>
      <div
        className={cn(
          "h-[2px] w-full rounded-xl bg-muted-foreground",
          step > 1 && "bg-brand-yellow"
        )}
      />
      <div className="flex flex-col items-center justify-center">
        <div
          className={cn(
            "flex size-12 items-center justify-center rounded-full border-2 border-brand-yellow border-muted-foreground text-muted-foreground",
            step >= 2 && "border-brand-yellow text-brand-yellow"
          )}
        >
          2
        </div>
        <div
          className={cn(
            "pt-2 text-xs text-muted-foreground sm:text-sm",
            step > 1 && "text-brand-yellow"
          )}
        >
          Edit Topics
        </div>
      </div>
      <div
        className={cn(
          "h-[2px] w-full rounded-xl bg-muted-foreground",
          step === 3 && "bg-brand-yellow"
        )}
      />
      <div className="flex flex-col items-center justify-center">
        <div
          className={cn(
            "flex size-12 items-center justify-center rounded-full border-2 border-brand-yellow border-muted-foreground text-muted-foreground",
            step === 3 && "border-brand-yellow text-brand-yellow"
          )}
        >
          3
        </div>
        <div
          className={cn(
            "pt-2 text-xs text-muted-foreground sm:text-sm",
            step > 2 && "text-brand-yellow"
          )}
        >
          Generate Material
        </div>
      </div>
    </div>
  );
}
