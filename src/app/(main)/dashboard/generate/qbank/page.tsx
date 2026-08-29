"use client";

import { useState } from "react";

import BetaBanner from "@/components/beta-banner";
import { GeneratingMessage } from "@/components/generate/qbank/generating-message";
import { SyllabusEditor } from "@/components/generate/qbank/syllabus-editor";
import { TopicEditor } from "@/components/generate/qbank/topic-editor";
import StepUI from "@/components/generate/step-ui";
import { TopicsType } from "@/lib/types/topics";

const Page = () => {
  const [steps, setSteps] = useState(1);
  const [topics, setTopics] = useState<TopicsType>();
  const [generatingMaterialId, setGeneratingMaterialId] = useState<string>();

  return (
    <div className="container mx-auto max-w-[1400px] px-5">
      <StepUI step={steps} />

      <BetaBanner />

      {steps === 1 && (
        <SyllabusEditor setSteps={setSteps} setTopics={setTopics} />
      )}
      {steps === 2 && (
        <TopicEditor
          topics={topics!}
          setSteps={setSteps}
          setGeneratingMaterialId={setGeneratingMaterialId}
        />
      )}

      {steps === 3 && (
        <GeneratingMessage generatingMaterialId={generatingMaterialId!} />
      )}
    </div>
  );
};

export default Page;
