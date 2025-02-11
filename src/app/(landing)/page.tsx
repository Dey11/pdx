import { DM_Serif_Text, Merriweather } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { ForwardRefExoticComponent, RefAttributes, Suspense } from "react";

import {
  BookOpenText,
  Clock7,
  FileDown,
  FlaskConical,
  GraduationCap,
  LucideProps,
  Pencil,
  PiggyBank,
  ScanEye,
  School,
  Send,
  Upload,
  Users,
} from "lucide-react";

import ComparisonTable from "@/components/comparison-table";
import { H1 } from "@/components/typography/h1";
import { H2 } from "@/components/typography/h2";
import { H3 } from "@/components/typography/h3";
import { Muted } from "@/components/typography/muted";
import { Para } from "@/components/typography/para";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import VideoPlayer from "@/components/video-player";

const merriweather = Merriweather({ weight: "400", subsets: ["latin"] });

const dmserif = DM_Serif_Text({
  weight: "400",
  subsets: ["latin", "latin-ext"],
});

export default function Home() {
  return (
    <main className="mx-auto px-3 pb-10">
      <section className="-my-12 flex min-h-screen flex-col items-center justify-center overflow-hidden px-2 text-center sm:gap-5">
        <div
          className="absolute -z-10 h-full w-full sm:hidden"
          style={{
            background: `repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0px, transparent 1px, transparent calc(5dvh), rgba(255,255,255,0.05) calc(5dvh + 1px)),
             repeating-linear-gradient(rgba(255,255,255,0.05) 0px, transparent 1px, transparent calc(5dvh), rgba(255,255,255,0.05) calc(5dvh + 1px))`,
          }}
        />
        <div
          className="-z-10 hidden h-full w-full sm:absolute sm:block"
          style={{
            background: `repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0px, transparent 1px, transparent calc(5dvw), rgba(255,255,255,0.05) calc(5dvw + 1px)),
             repeating-linear-gradient(rgba(255,255,255,0.05) 0px, transparent 1px, transparent calc(5dvw), rgba(255,255,255,0.05) calc(5dvw + 1px))`,
          }}
        />

        <div className="absolute -z-20 size-[15dvh] rounded-full bg-white blur-[20dvh]" />

        <H1 className="animate-fade-in relative text-brand-heading">
          The personalized study materials
          <div className="bg-brand-yellow absolute -top-1 right-0 h-3 w-1 rotate-[140deg] rounded-xl" />
          <div className="bg-brand-yellow absolute -right-3 -top-1.5 h-3 w-1 rotate-[200deg] rounded-xl" />
          <div className="bg-brand-yellow absolute -right-5 top-1 h-3 w-1 rotate-[80deg] rounded-xl" />
          <div className="bg-brand-yellow absolute -right-4 top-4 h-3 w-1 rotate-[140deg] rounded-xl" />
          {/* <div className="bg-brand-yellow absolute -top-3 right-0 h-3 w-1 rotate-[140deg] rounded-xl" />
          <div className="bg-brand-yellow absolute -right-3 -top-3 h-3 w-1 rotate-[200deg] rounded-xl" />
          <div className="bg-brand-yellow absolute -right-5 -top-1 h-3 w-1 rotate-[80deg] rounded-xl" />
          <div className="bg-brand-yellow absolute -right-4 top-2 h-3 w-1 rotate-[140deg] rounded-xl" /> */}
        </H1>
        <H1 className="animate-fade-in text-brand-heading underline underline-offset-4">
          you've been missing
        </H1>

        <Para className={`animate-fade-in max-w-lg text-center`}>
          <span className="italic">Drowning in prompts?</span> Upload your
          syllabus, and let
          <span className="text-brand-blue"> PDX</span> do the heavy
          lifting—custom study notes & exam papers in sleek PDFs, stress-free!
        </Para>

        <Button
          className={`${merriweather.className} bg-brand-yellow animate-fade-in hover:bg-brand-yellow/80 shadow-brand-yellow/70 group mt-10 flex items-center gap-2 rounded-lg font-semibold text-brand-btn shadow-md transition-all duration-200 hover:translate-y-0.5 hover:shadow-none sm:mt-0`}
        >
          Try for free{" "}
          <Send className="transition-all duration-150 group-hover:rotate-[30deg]" />
          {/* <span className="via-brand-yellow absolute inset-x-0 -bottom-1 h-2 bg-gradient-to-r from-transparent to-transparent" /> */}
        </Button>
      </section>

      <section className="flex flex-wrap items-center justify-center gap-10 pt-10">
        <VideoPlayer />

        <div className="max-w-lg text-center xl:text-left">
          <H2 className="text-brand-heading">Watch the magic</H2>
          <H2 className="pt-2 text-brand-heading">come to life</H2>

          <Para>
            This is where all the good stuff happens –{" "}
            <span className="font-semibold italic">The dashboard</span>. Whether
            you're a valedictorian or a backbencher, we’ve got your back.
            Generate <span className="font-semibold">study materials</span> and{" "}
            <span className="font-semibold">question papers</span> tailored to
            your syllabus and learning needs.
          </Para>

          <Para>
            <span className="font-semibold italic">The best part?</span> You get
            it all in beautiful <span className="font-semibold">PDFs</span>,
            ready to{" "}
            <span className="font-semibold italic">download and share</span>{" "}
            with your friends.
          </Para>
        </div>
      </section>

      <section className="px-5 pt-40">
        <H2
          className={`text-brand-yellow mx-auto mb-12 w-fit text-center ${dmserif.className}`}
        >
          FAQs
        </H2>
        <Accordion
          type="single"
          collapsible
          className={`mx-auto max-w-3xl ${merriweather.className}`}
        >
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>
                <Para>{faq.answer}</Para>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </main>
  );
}

const faqs = [
  {
    question: "How does PDX generate study materials from my syllabus?",
    answer:
      "Our advanced AI analyzes your syllabus and generates comprehensive study materials including detailed explanations, examples, and key concepts. Each study guide is tailored to your specific course content and learning requirements.",
  },
  {
    question: "What's included in the generated study materials?",
    answer:
      "Our AI generates comprehensive study materials (50-150+ pages) including detailed topic explanations, key concepts, examples, summaries, and important points for each section of your syllabus.",
  },
  {
    question: "Can I edit the generated content?",
    answer:
      "Not at the moment but we are working to add this feature! Expect this in the coming weeks.",
  },
  {
    question: "What formats are supported for syllabus upload?",
    answer:
      "We support only copy-pasting your syllabus directly for now. We are working to add support for PDFs and other formats.",
  },
];
