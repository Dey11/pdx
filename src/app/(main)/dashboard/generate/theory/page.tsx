"use client";

import { useEffect, useState } from "react";

import StepUI from "@/components/generate/step-ui";
import { GeneratingMessage } from "@/components/generate/theory/generating-message";
import { SyllabusEditor } from "@/components/generate/theory/syllabus-editor";
import { TopicEditor } from "@/components/generate/theory/topic-editor";
import { TopicsType } from "@/lib/types/topics";

const page = () => {
  const [steps, setSteps] = useState(1);
  const [topics, setTopics] = useState<TopicsType>();
  const [generatingMaterialId, setGeneratingMaterialId] = useState<string>();
  const [credits, setCredits] = useState<number>(0);
  const [userCredits, setUserCredits] = useState<number>(0);
  const [error, setError] = useState<string>("");

  const fetchUserCredits = async () => {
    try {
      setError("");
      const res = await fetch("/api/credits");
      const data = await res.json();
      if (data?.error) {
        setError(data.error);
        return;
      }
      setUserCredits(data.credits);
    } catch (err) {
      console.error(err);
      setError("Error fetching user credits");
    }
  };

  useEffect(() => {
    fetchUserCredits();
  }, []);

  return (
    <div className="container mx-auto max-w-[1400px] px-5">
      <StepUI step={steps} />

      {steps === 1 && (
        <SyllabusEditor
          setSteps={setSteps}
          setTopics={setTopics}
          setCredits={setCredits}
        />
      )}
      {steps === 2 && (
        <TopicEditor
          credits={credits}
          setCredits={setCredits}
          topics={topics!}
          setSteps={setSteps}
          setGeneratingMaterialId={setGeneratingMaterialId}
        />
      )}

      {steps === 3 && (
        <GeneratingMessage generatingMaterialId={generatingMaterialId!} />
      )}

      {error && <div className="text-center text-red-500">{error}</div>}
      {userCredits && (
        <div className="mt-1 w-full text-center text-brand-green">
          Current credits: {userCredits}
        </div>
      )}
    </div>
  );
};

export default page;
