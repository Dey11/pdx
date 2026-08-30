"use client";

import { Merriweather } from "next/font/google";
import Image from "next/image";
import { useState } from "react";

import { MousePointerClick } from "lucide-react";

import { cn } from "@/lib/utils";

import { H2 } from "../typography/h2";
import { H3 } from "../typography/h3";
import { Para } from "../typography/para";

const merriweather = Merriweather({ weight: "400", subsets: ["latin"] });

const FeaturesSection = () => {
  const [currFeat, setCurrFeat] = useState<number>(1);

  return (
    <div>
      <div className="flex w-full flex-col items-center justify-center">
        <div className="pb-12">
          <H2
            className={`${merriweather.className} text-center text-brand-heading`}
          >
            Your Learning. Your Way.
          </H2>

          <Para className="max-w-4xl text-center">
            Connect an OpenAI-compatible provider, choose the level and exam,
            and review the topic plan before PDX generates your PDF.
          </Para>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-5 pt-16 sm:p-5">
          <div className="flex flex-col gap-6">
            <Para className="flex gap-2 text-center sm:text-left">
              <span>
                <MousePointerClick />
              </span>
              Click each step to see how it works:
            </Para>
            {Features.map((feature) => (
              <div className="flex" key={feature.id}>
                <div
                  className={cn(
                    "m-2.5 size-3 flex-shrink-0 rounded-full",
                    feature.id === currFeat ? "bg-brand-blue" : "bg-[#424242]"
                  )}
                />
                <div className="flex flex-col">
                  <H3
                    className={cn(
                      "cursor-pointer text-center sm:text-left",
                      feature.id === currFeat
                        ? ""
                        : "text-[#828080] transition-colors duration-300 hover:text-white"
                    )}
                    onClick={() => {
                      setCurrFeat(feature.id);
                    }}
                  >
                    {feature.title}
                  </H3>
                  <Para
                    className={cn(
                      "max-w-xl text-center text-base font-extralight opacity-80 sm:text-left",
                      currFeat === feature.id ? "block" : "hidden"
                    )}
                  >
                    {feature.description}
                  </Para>
                </div>
              </div>
            ))}
          </div>
          <div>
            <Image
              src={Features[currFeat - 1].image}
              width={600}
              height={337}
              alt="features"
              className="transform duration-1000 ease-in-out"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;

type FeatureType = {
  id: number;
  title: string;
  description: string;
  image: string;
};

const Features: FeatureType[] = [
  {
    id: 1,
    title: "Start with your course syllabus",
    description:
      "Paste your syllabus text. More detail gives your provider better context for the topic plan and final material.",
    image: "/home/feature_1.png",
  },
  {
    id: 2,
    title: "Customize your study material",
    description:
      "Choose the complexity, subject, exam, course, and language before generation starts.",
    image: "/home/feature_2.png",
  },
  {
    id: 3,
    title: "Preview generated content",
    description:
      "Review the proposed topics, then add, remove, or reorder them before creating the final material.",
    image: "/home/feature_3.png",
  },
  {
    id: 4,
    title: "Your PDF is ready in minutes",
    description:
      "PDX generates each topic in the background, combines the completed sections, and adds the PDF to your materials page.",
    image: "/home/feature_4.png",
  },
];
