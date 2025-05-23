"use client";

import { useState, useTransition } from "react";

import { Loader2, Zap } from "lucide-react";

import { TopicsType } from "@/lib/types/topics";
import { generateTopicsSchema } from "@/lib/zod";

import { H2 } from "../../typography/h2";
import { H3 } from "../../typography/h3";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Textarea } from "../../ui/textarea";

type MaterialType = "auto" | "short" | "medium" | "long";
type ComplexityType = "beginner" | "intermediate" | "advanced";
type SyllabusEditorProps = {
  setSteps: (steps: number) => void;
  setCredits: (credits: number) => void;
  setTopics: (topics: TopicsType) => void;
};

export const SyllabusEditor = ({
  setSteps,
  setTopics,
  setCredits,
}: SyllabusEditorProps) => {
  const [formData, setFormData] = useState({
    syllabus: "",
    complexity: "advanced" as ComplexityType,
    weightage: "auto" as MaterialType,
    subject: "",
    exam: "",
    course: "",
    language: "",
    type: "qbank",
  });
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      try {
        setError("");
        const res = generateTopicsSchema.safeParse(formData);
        if (!res.success) {
          setError(res.error.errors[0].message);
          console.error(res.error);
          return;
        }

        const data = await fetch("/api/generation/generate-topics", {
          method: "POST",
          body: JSON.stringify(formData),
          headers: { "Content-Type": "application/json" },
        });
        const topics = await data.json();

        if (topics.error) {
          setError(topics.error);
          return;
        }

        const stateData = {
          ...topics.data,
          weightage: formData.weightage,
          complexity: formData.complexity,
          course: formData.course,
          exam: formData.exam,
          subject: formData.subject,
          language: formData.language,
          type: "qbank",
        };
        setTopics(stateData);
        setCredits(topics.credits);
        setSteps(2);
      } catch (err) {
        setError("Something went wrong. Please try again.");
      }
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form className="mx-auto max-w-[870px] py-5" action={handleSubmit}>
      <H2 className="text-center text-brand-heading">
        Create Your Question Bank
      </H2>

      <section className="mx-auto grid grid-cols-1 gap-5 pt-10 md:grid-cols-2">
        <div className="flex flex-col justify-between rounded-lg bg-brand-bg p-5">
          <H3>Syllabus Content</H3>

          <Textarea
            className="h-60 w-full rounded-lg shadow-lg"
            placeholder="Place your syllabus here. Please copy and paste the content from your syllabus document."
            name="syllabus"
            value={formData.syllabus}
            onChange={handleChange}
          />
          <label>
            <span>Complexity</span>
            <Select
              name="complexity"
              value={formData.complexity}
              onValueChange={(value) => handleSelectChange("complexity", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Complexity Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
              </SelectContent>
            </Select>
          </label>
        </div>

        <div className="flex flex-col gap-2 rounded-lg bg-brand-bg p-5">
          <H3>Weightage</H3>
          <Select
            name="weightage"
            value={formData.weightage}
            onValueChange={(value) => handleSelectChange("weightage", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Weightage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Let AI decide</SelectItem>
              <SelectItem value="short">Heavy short qns</SelectItem>
              <SelectItem value="medium">Medium qns</SelectItem>
              <SelectItem value="long">Heavy long qns</SelectItem>
            </SelectContent>
          </Select>

          <label>
            <span>Subject</span>
            <Input
              name="subject"
              placeholder="Object Oriented Programming"
              value={formData.subject}
              onChange={handleChange}
            />
          </label>

          <label>
            <span>Exam</span>
            <Input
              name="exam"
              placeholder="Semester Exam"
              value={formData.exam}
              onChange={handleChange}
            />
          </label>

          <label>
            <span>Course/Standard</span>
            <Input
              name="course"
              placeholder="B.Tech"
              value={formData.course}
              onChange={handleChange}
            />
          </label>

          <label>
            <span>Language of the material</span>
            <Input
              name="language"
              placeholder="English"
              value={formData.language}
              onChange={handleChange}
            />
          </label>
        </div>
      </section>

      {!isPending ? (
        <Button
          variant={"glowy"}
          className="mt-4 flex w-full items-center justify-center gap-x-2 bg-brand-yellow text-brand-bg hover:bg-brand-yellow/80"
          disabled={
            !formData.syllabus ||
            !formData.subject ||
            !formData.weightage ||
            !formData.complexity
          }
        >
          <Zap />
          Generate Topics
        </Button>
      ) : (
        <Button
          variant={"glowy"}
          className="mt-4 flex w-full items-center justify-center gap-x-2 bg-brand-yellow text-brand-bg hover:bg-brand-yellow/80"
          disabled
        >
          <Loader2 className="animate-spin" />
          Generating Topics...
        </Button>
      )}

      {error && <p className="mt-4 text-center text-red-500">{error}</p>}
    </form>
  );
};
