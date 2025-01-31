import { Metadata } from "next";
import { DM_Serif_Text } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { ForwardRefExoticComponent, RefAttributes, Suspense } from "react";

import {
  BookOpenText,
  Clock7,
  FileDown,
  FlaskConical,
  LucideProps,
  Pencil,
  PiggyBank,
  ScanEye,
  Upload,
} from "lucide-react";

import ComparisonTable from "@/components/comparison-table";
import { H1 } from "@/components/typography/h1";
import { H2 } from "@/components/typography/h2";
import { H3 } from "@/components/typography/h3";
import { Muted } from "@/components/typography/muted";
import { Para } from "@/components/typography/para";
import { Button } from "@/components/ui/button";
import VideoPlayer from "@/components/video-player";

const dmserif = DM_Serif_Text({
  weight: "400",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  description:
    "Transform your syllabus into study material PDFs with PDX, our AI-powered platform creates tailored study materials in minutes.",
  openGraph: {
    title: "PDX - Transform Your Study Experience",
    description:
      "Transform your syllabus into study material PDFs with PDX, our AI-powered platform creates tailored study materials in minutes.",
  },
  twitter: {
    title: "PDX - Transform Your Study Experience",
    description:
      "Transform your syllabus into study material PDFs with PDX, our AI-powered platform creates tailored study materials in minutes.",
  },
};

export default function Home() {
  return (
    <main className="mx-auto px-3 pb-10">
      <section className="-my-20 flex min-h-screen flex-col items-center justify-center px-2">
        <div className="mb-10 flex cursor-pointer items-center gap-x-1.5 rounded-xl bg-gradient-to-r from-[#FFFFFF]/50 to-[#FFFFFF]/10 p-2 px-3 transition-all duration-300 hover:shadow-[0px_0px_5px_#00FF1E]">
          <BookOpenText className="size-4 text-brand-btn" />
          <span className="text-xs">Unlock your learning power</span>
        </div>

        <div className="mb-8 text-center">
          <H1
            className={`mx-auto w-fit decoration-brand-green hover:underline`}
          >
            Solve. Learn. Share.
          </H1>
          <Para className="max-w-2xl">
            Turn your syllabus into study material PDFs with{" "}
            <span className="text-brand-green">PDX</span>—your personal
            AI-powered learning solution, providing tailored study materials.
          </Para>

          <p className="text-lg font-semibold text-brand-green">
            {" "}
            Join now to get 75 free credits to test it out
          </p>
        </div>

        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          {pillElements.map((pill) => (
            <Pill key={pill.title} Icon={pill.icon} title={pill.title} />
          ))}
        </div>

        <div className="relative mx-auto flex flex-col items-center justify-center">
          <Link href={"/dashboard"}>
            <Button className="mx-auto flex w-fit gap-1 rounded-3xl bg-brand-heading px-3 text-sm font-semibold shadow-[0px_3px_10px_#00FF1E] transition-colors hover:bg-brand-green hover:text-brand-heading hover:shadow-[0px_0px_15px_#04d31c]">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </section>

      <section>
        <Image
          src={"/home/waves.svg"}
          alt="Waves"
          fill
          priority
          className="-z-10 object-contain object-bottom"
        />
      </section>

      <section className="relative mt-10 px-5 text-center sm:mt-20 sm:pt-10">
        <H2
          className={`mx-auto w-fit decoration-brand-green hover:underline sm:mb-5 ${dmserif.className}`}
        >
          How does PD
          <span className="text-5xl text-brand-green">X</span> work?
        </H2>

        <div className="absolute -left-[20dvw] -z-10 size-[40dvw] rounded-full bg-[#00FF1E] blur-[120px]" />

        <Muted className="mx-auto max-w-6xl pb-10">
          Let’s see how PDX transforms your syllabus into comprehensive study
          materials.
        </Muted>

        <Suspense
          fallback={
            <div className="h-[50vh] w-full animate-pulse bg-gray-300" />
          }
        >
          <VideoPlayer />
        </Suspense>
      </section>

      <section className="pt-32 text-center">
        <H2
          className={`mx-auto mb-5 w-fit decoration-brand-green hover:underline sm:mb-10 ${dmserif.className}`}
        >
          What does PD<span className="text-5xl text-brand-green">X</span>{" "}
          offer?
        </H2>

        <Para className="mx-auto max-w-sm text-center sm:max-w-2xl">
          We generate <span className="font-semibold">high quality</span> and{" "}
          <span className="font-semibold">personalised</span> study materials in
          form of <span className="font-semibold">PDFs</span> and all you need
          to do is provides us your syllabus.
        </Para>

        <Para>Sounds simple right? Well it is that simple.</Para>

        <div className="pt-10">
          <div className="relative mx-auto w-full max-w-5xl rounded-full border-2 border-brand-green">
            <div className="absolute left-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-brand-green" />
            <div className="absolute right-0 size-2 -translate-y-1/2 translate-x-1/2 rounded-full border-2 border-white bg-brand-green" />
            <div className="absolute right-1/3 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-brand-green" />
            <div className="absolute left-1/3 size-2 -translate-y-1/2 translate-x-1/2 rounded-full border-2 border-white bg-brand-green" />
          </div>

          <div className="flex flex-wrap justify-center gap-5 pt-5">
            <OfferingBox offering={offerings[0]} />
            <OfferingBox offering={offerings[1]} />
            <OfferingBox offering={offerings[2]} />
            <OfferingBox offering={offerings[3]} />
          </div>
        </div>

        <Para className="mx-auto max-w-xl">
          Topper or backbencher - we've got you covered! PDX can generate
          anything from last minute notes to detailed materials for your exams
          months away.
        </Para>
      </section>

      <section className="px-5 pt-40">
        <H2
          className={`mx-auto mb-12 w-fit text-center decoration-brand-green hover:underline ${dmserif.className}`}
        >
          Why not use ChatGPT instead?
        </H2>

        <ComparisonTable />
      </section>
    </main>
  );
}

const pillElements = [
  {
    icon: PiggyBank,
    title: "Affordable Price",
  },
  {
    icon: FlaskConical,
    title: "Tailored Materials",
  },
  {
    icon: Clock7,
    title: "Study material in minutes",
  },
];

type PillElement = {
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  title: string;
};

const Pill = ({ Icon, title }: PillElement) => {
  return (
    <div className="flex items-center gap-x-2 rounded-2xl bg-brand-bg px-2 py-1 text-xs text-white hover:shadow-[0px_0px_5px_#00FF1E]">
      <Icon className="size-4 text-brand-green" />
      {title}
    </div>
  );
};

const offerings = [
  {
    id: 1,
    title: "Upload your syllabus",
    text: "Upload your detailed syllabus, the more the divisions, the better the output.",
    icon: Upload,
  },
  {
    id: 2,
    title: "Personalize your PDF",
    text: "Make the PDF best suited for you by choosing from our list of predefined options.",
    icon: Pencil,
  },
  {
    id: 3,
    title: "Review & edit",
    text: "Edit the topics and subtopics proposed by our AI to make it perfect for your needs.",
    icon: ScanEye,
  },
  {
    id: 4,
    title: "Download & share",
    text: "Voila! Your personalized PDF is ready to be downloaded and shared with your friends.",
    icon: FileDown,
  },
];

type OfferingType = {
  id: number;
  title: string;
  text: string;
  icon?: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
};

const OfferingBox = ({ offering }: { offering: OfferingType }) => {
  return (
    <div className="flex w-80 flex-col gap-5 rounded-2xl border border-brand-green bg-[#0a0a0a] p-4 text-left hover:shadow-[0px_0px_5px_#00FF1E]">
      <div className="flex items-center justify-between">
        <div className="size-10 rounded-full border-4 border-[#222222] bg-[#171717] p-2">
          {offering.icon && <offering.icon className="size-4 text-white" />}
        </div>
        <div>Step {offering.id}</div>
      </div>
      <H3>{offering.title}</H3>
      <div className="text-sm">{offering.text}</div>
    </div>
  );
};
