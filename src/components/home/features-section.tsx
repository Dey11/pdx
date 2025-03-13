"use client";

import { Merriweather } from "next/font/google";
import Image from "next/image";
import { useRef, useState } from "react";

import { useScroll, useTransform } from "framer-motion";
import { MousePointerClick } from "lucide-react";

import { cn } from "@/lib/utils";

import { H2 } from "../typography/h2";
import { H3 } from "../typography/h3";
import { Para } from "../typography/para";

const merriweather = Merriweather({ weight: "400", subsets: ["latin"] });

const FeaturesSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const [currFeat, setCurrFeat] = useState<number>(1);

  return (
    <div ref={containerRef}>
      <div className="flex w-full flex-col items-center justify-center">
        <div className="pb-12">
          <H2
            className={`${merriweather.className} text-center text-brand-heading`}
          >
            Your Learning. Your Way.
          </H2>

          <Para className="max-w-4xl text-center">
            The AI we use is built on top of the best models out there and
            needless to say, we'll keep increasing the quality of the study
            materials with time. Currently it focuses on generating exhaustive
            content so you don't have to look into others' papers when the exam
            has a trick question
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
      "Paste or upload your syllabus—detailed syllabi ensure precise, high-quality study materials. PDX efficiently structures content for complete subject coverage.",
    image: "/home/feature_1.png",
  },
  {
    id: 2,
    title: "Customize your study material",
    description:
      "Customize your study material according to your needs. Beginner or advanced, PDX has you covered. Preparing for a specific exam? Enter the exam name and PDX will generate study materials tailored to your exam needs.",
    image: "/home/feature_2.png",
  },
  {
    id: 3,
    title: "Preview generated content",
    description:
      "Add or remove content as needed. PDX generates content in a structured format, making it easy to navigate and understand. Preview the generated content and make changes as needed.",
    image: "/home/feature_3.png",
  },
  {
    id: 4,
    title: "Your PDF is ready in minutes",
    description:
      "PDF is ready in minutes. Download your study material in PDF format and start studying. PDX makes it easy to generate, customize, and download study materials.",
    image: "/home/feature_4.png",
  },
];
