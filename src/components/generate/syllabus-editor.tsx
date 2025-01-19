"use client";

import { useState } from "react";

import { Zap } from "lucide-react";

import { H2 } from "../typography/h2";
import { H3 } from "../typography/h3";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

type MaterialType = "theory" | "qna";
type ComplexityType = "beginner" | "intermediate" | "advanced";
type SyllabusEditorProps = {
  setSteps: (steps: number) => void;
  setTopics: (topics: string[]) => void;
};

export const SyllabusEditor = ({
  setSteps,
  setTopics,
}: SyllabusEditorProps) => {
  const [formData, setFormData] = useState({
    syllabus: "",
    complexity: "advanced" as ComplexityType,
    type: "theory" as MaterialType,
    subject: "",
    exam: "",
    course: "",
    language: "",
  });

  const handleSubmit = async (formData: FormData) => {
    const syllabus = formData.get("syllabus") as string;
    setSteps(2);
    setTopics(syllabus.split("\n"));
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
    <form className="mx-auto max-w-[870px] pt-10" action={handleSubmit}>
      <H2 className="text-center text-brand-green">
        Create Your Study Material
      </H2>

      <section className="mx-auto grid grid-cols-2 gap-5 pt-10">
        <div className="flex flex-col justify-between rounded-lg bg-brand-bg p-5">
          <H3>Syllabus Content</H3>

          <Textarea
            className="h-60 w-96 rounded-lg shadow-lg"
            placeholder="Place your syllabus here. Please copy and paste the content from your syllabus document."
            name="syllabus"
            value={formData.syllabus}
            onChange={handleChange}
          />

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
        </div>

        <div className="flex flex-col gap-2 rounded-lg bg-brand-bg p-5">
          <H3>Material Type</H3>
          <Select
            name="type"
            value={formData.type}
            onValueChange={(value) => handleSelectChange("type", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Material Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="theory">Theory</SelectItem>
              <SelectItem value="qna">QNA (Question Bank)</SelectItem>
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

      <Button
        variant={"glowy"}
        className="mt-4 flex w-full items-center justify-center gap-x-2 bg-brand-green text-brand-bg hover:bg-brand-green/80"
        disabled={
          !formData.subject ||
          !formData.exam ||
          !formData.course ||
          !formData.language ||
          !formData.type ||
          !formData.complexity
        }
      >
        <Zap />
        Generate Topics
      </Button>
    </form>
  );
};
