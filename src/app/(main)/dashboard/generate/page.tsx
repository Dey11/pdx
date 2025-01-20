"use client";

import { useState } from "react";

import { GeneratingMessage } from "@/components/generate/generating-message";
import { SyllabusEditor } from "@/components/generate/syllabus-editor";
import { TopicEditor } from "@/components/generate/topic-editor";
import { TopicsType } from "@/lib/types/topics";
import { cn } from "@/lib/utils";

const page = () => {
  const [steps, setSteps] = useState(1);
  const [topics, setTopics] = useState<TopicsType>();

  return (
    <div className="container mx-auto max-w-[1400px] px-5">
      <StepUI step={steps} />

      {steps === 1 && (
        <SyllabusEditor setSteps={setSteps} setTopics={setTopics} />
      )}
      {steps === 2 && (
        <TopicEditor
          topics={topics!}
          setTopics={setTopics}
          setSteps={setSteps}
        />
      )}

      {steps === 3 && <GeneratingMessage />}
    </div>
  );
};

export default page;

const StepUI = ({ step }: { step: number }) => {
  return (
    <div className="mx-auto flex w-full items-center justify-between gap-x-5 py-5 text-center sm:w-[40dvw]">
      <div className="flex flex-col items-center justify-center">
        <div
          className={
            "flex size-12 items-center justify-center rounded-full border-2 border-brand-green text-brand-green"
          }
        >
          1
        </div>
        <div className="pt-2 text-xs text-brand-green sm:text-sm">
          Enter syllabus
        </div>
      </div>
      <div
        className={cn(
          "h-[2px] w-full rounded-xl bg-muted-foreground",
          step > 1 && "bg-brand-green"
        )}
      />
      <div className="flex flex-col items-center justify-center">
        <div
          className={cn(
            "flex size-12 items-center justify-center rounded-full border-2 border-brand-green border-muted-foreground text-muted-foreground",
            step >= 2 && "border-brand-green text-brand-green"
          )}
        >
          2
        </div>
        <div
          className={cn(
            "pt-2 text-xs text-muted-foreground sm:text-sm",
            step > 1 && "text-brand-green"
          )}
        >
          Edit Topics
        </div>
      </div>
      <div
        className={cn(
          "h-[2px] w-full rounded-xl bg-muted-foreground",
          step === 3 && "bg-brand-green"
        )}
      />
      <div className="flex flex-col items-center justify-center">
        <div
          className={cn(
            "flex size-12 items-center justify-center rounded-full border-2 border-muted-foreground",
            step === 3 && "border-brand-green text-brand-green"
          )}
        >
          3
        </div>
        <div
          className={cn(
            "pt-2 text-xs text-muted-foreground sm:text-sm",
            step > 2 && "text-brand-green"
          )}
        >
          Generate Material
        </div>
      </div>
    </div>
  );
};
