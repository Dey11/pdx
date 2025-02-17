import { DM_Serif_Text, Merriweather } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import { Send } from "lucide-react";

import FeaturesSection from "@/components/home/features-section";
import { H1 } from "@/components/typography/h1";
import { H2 } from "@/components/typography/h2";
import { Para } from "@/components/typography/para";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import VideoPlayer from "@/components/video-player";
import { EMAIL } from "@/lib/constants";

const merriweather = Merriweather({
  weight: ["400", "700"],
  subsets: ["latin"],
});

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

        <div className="group">
          <H1 className="relative animate-fade-in text-brand-heading">
            The personalized study materials
            <div className="-top-1 right-0 hidden h-3 w-1 rotate-[140deg] rounded-xl bg-brand-yellow transition-all duration-100 group-hover:translate-x-[-3px] group-hover:translate-y-[-3px] sm:absolute sm:block" />
            <div className="-right-3 -top-1.5 hidden h-3 w-1 rotate-[200deg] rounded-xl bg-brand-yellow transition-all duration-100 group-hover:translate-x-[1px] group-hover:translate-y-[-4px] sm:absolute sm:block" />
            <div className="-right-5 top-1 hidden h-3 w-1 rotate-[80deg] rounded-xl bg-brand-yellow transition-all duration-100 group-hover:translate-x-[4px] group-hover:translate-y-[-1px] sm:absolute sm:block" />
            <div className="-right-4 top-4 hidden h-3 w-1 rotate-[140deg] rounded-xl bg-brand-yellow transition-all duration-100 group-hover:translate-x-[2px] group-hover:translate-y-[2px] sm:absolute sm:block" />
          </H1>
          <H1 className="animate-fade-in text-brand-heading underline underline-offset-4">
            you've been missing
          </H1>
        </div>

        <Para className={`max-w-lg animate-fade-in text-center`}>
          <span className="italic">Drowning in prompts?</span> Upload your
          syllabus, and let
          <span className="text-brand-blue"> PDX</span> do the heavy
          lifting—custom study notes & exam papers in sleek PDFs, stress-free!
        </Para>

        <Link href={"/dashboard"}>
          <Button
            className={`${merriweather.className} group mt-10 flex animate-fade-in items-center gap-2 rounded-lg bg-brand-yellow font-semibold text-brand-btn shadow-md shadow-brand-yellow/70 transition-all duration-200 hover:translate-y-0.5 hover:bg-brand-yellow/80 hover:shadow-none sm:mt-0`}
          >
            Try for free{" "}
            <Send className="transition-all duration-150 group-hover:rotate-[30deg]" />
            {/* <span className="via-brand-yellow absolute inset-x-0 -bottom-1 h-2 bg-gradient-to-r from-transparent to-transparent" /> */}
          </Button>
        </Link>
      </section>

      <section className="flex flex-wrap items-center justify-center gap-10 py-16">
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

      <section className="flex flex-wrap items-center justify-center py-16">
        <FeaturesSection />
      </section>

      <section className="flex flex-col flex-wrap items-center justify-center py-16">
        <H2 className="text-center text-brand-heading">
          Why students choose PDX and
        </H2>
        <H2 className="text-brand-heading underline sm:pt-2">
          never look back
        </H2>

        <Image
          src={"/home/why_choose_1.png"}
          height={260}
          width={400}
          alt="AI study material generator"
          className="rounded-lg pt-10 shadow-md"
        />

        <Para>AI Study Material Generator</Para>
      </section>

      <section className="px-5 pt-16">
        <H2
          className={`mx-auto mb-12 w-fit text-center text-brand-yellow ${dmserif.className}`}
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

        <Para className="mt-10 text-center">
          Still have any queries? Reach out to us at{" "}
          <span className="text-brand-yellow">{EMAIL}</span>
        </Para>
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
