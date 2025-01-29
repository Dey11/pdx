import { Metadata } from "next";
import { DM_Serif_Text } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { ForwardRefExoticComponent, RefAttributes, Suspense } from "react";

import {
  BookOpenText,
  Clock7,
  FlaskConical,
  LucideProps,
  PiggyBank,
} from "lucide-react";

import ComparisonTable from "@/components/comparison-table";
import { H1 } from "@/components/typography/h1";
import { H2 } from "@/components/typography/h2";
import { H4 } from "@/components/typography/h4";
import { Para } from "@/components/typography/para";
import { Button } from "@/components/ui/button";
import { WaitlistButton } from "@/components/ui/progress-btn";
import { cn } from "@/lib/utils";

const dmserif = DM_Serif_Text({
  weight: "400",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  description:
    "Transform your syllabus into perfectly designed PDFs with PDX. Our AI-powered platform creates tailored study materials in minutes, making learning more efficient and accessible.",
  openGraph: {
    title: "PDX - Transform Your Study Experience",
    description:
      "Transform your syllabus into perfectly designed PDFs with PDX. Our AI-powered platform creates tailored study materials in minutes, making learning more efficient and accessible.",
  },
  twitter: {
    title: "PDX - Transform Your Study Experience",
    description:
      "Transform your syllabus into perfectly designed PDFs with PDX. Our AI-powered platform creates tailored study materials in minutes, making learning more efficient and accessible.",
  },
};

export default function Home() {
  return (
    <main className="mx-auto pb-10">
      <section className="flex min-h-screen flex-col items-center justify-center px-2 sm:-my-10">
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
            Turn your syllabus into perfectly designed{" "}
            <span className="text-brand-green">PDFs with PDX</span>—your
            personal AI-powered learning solution, providing tailored study
            materials for efficient learning
          </Para>
        </div>

        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          {pillElements.map((pill) => (
            <Pill key={pill.title} Icon={pill.icon} title={pill.title} />
          ))}
        </div>

        <div className="relative mx-auto flex flex-col items-center justify-center">
          {/* <Suspense fallback={<div className="h-28"></div>}> */}
          {/* <WaitlistButton /> */}
          <Link href={"/dashboard"}>
            {/* <Button className="rounded-2xl shadow-[0px_3px_10px_#04D31C] hover:bg-brand-heading/90 hover:shadow-[0px_0px_15px_#04d31c]"> */}
            <Button className="mx-auto flex w-fit gap-1 rounded-3xl bg-brand-heading px-3 text-sm font-semibold shadow-[0px_3px_10px_#00FF1E] transition-colors hover:bg-brand-green hover:text-brand-heading hover:shadow-[0px_0px_15px_#04d31c]">
              Go to Dashboard
            </Button>
          </Link>
          {/* <Image
            src="/home/curved-arrow.svg"
            alt="Arrow"
            className="peer absolute bottom-5 left-6 opacity-100 transition-all duration-300 ease-in-out peer-hover:opacity-100 lg:opacity-0"
            width={20}
            height={20}
          />

          <Para className="opacity:100 peer pt-0 text-[10px] backdrop-blur-lg transition-all duration-300 ease-in-out peer-hover:opacity-100 lg:opacity-0">
            *Waitlisted users will get a discounted price upon launch
          </Para> */}
          {/* </Suspense> */}
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
          Simplify your next study session with PD
          <span className="text-5xl text-brand-green">X</span>
        </H2>

        <div className="absolute -left-[20dvw] -z-10 size-[40dvw] rounded-full bg-[#00FF1E] blur-[120px]" />
        {/* <div className="absolute -left-[50dvw] -z-10 size-[60dvw] rounded-full bg-[#00FF1E] blur-[120px]" /> */}

        <Para className="mx-auto max-w-6xl">
          PDX is designed to revolutionize how students and learners access
          study materials. We take the hassle out of preparing for exams or
          understanding complex syllabi by turning your syllabus into custom,
          AI-generated study resources. With PDX, you get professionally
          designed PDFs that are comprehensive, easy to read, and tailored to
          your exact needs. Our platform is affordable, fast, and efficient,
          ensuring you save time and effort while focusing on what truly
          matters—studying smarter. Whether you're collaborating with friends
          using our credit-sharing model or working solo, PDX delivers
          high-quality materials in minutes, making learning more accessible and
          convenient than ever before. Say goodbye to information overload and
          hello to organized, focused, and reliable study guides with PDX.
        </Para>
      </section>

      <section className="pt-32 text-center">
        <H2
          className={`mx-auto mb-10 w-fit decoration-brand-green hover:underline sm:mb-20 ${dmserif.className}`}
        >
          What does PD<span className="text-5xl text-brand-green">X</span>{" "}
          offer?
        </H2>

        <div className="flex flex-wrap items-center justify-center gap-5 px-5">
          <OfferBox
            className="z-10 -mr-6 rotate-[-5deg]"
            key={Offerings[0].title}
            title={Offerings[0].title}
            text={Offerings[0].text}
            imgUrl={Offerings[0].imgUrl}
          />
          <OfferBox
            className="z-20 -mt-5 rotate-[3deg] sm:-mt-20"
            key={Offerings[1].title}
            title={Offerings[1].title}
            text={Offerings[1].text}
            imgUrl={Offerings[1].imgUrl}
          />
          <OfferBox
            className="z-30 -mt-5 rotate-[-5deg] sm:-ml-10"
            key={Offerings[2].title}
            title={Offerings[2].title}
            text={Offerings[2].text}
            imgUrl={Offerings[2].imgUrl}
          />
          <OfferBox
            className="z-40 -mt-5 rotate-[3deg] sm:-ml-8 sm:-mt-20"
            key={Offerings[3].title}
            title={Offerings[3].title}
            text={Offerings[3].text}
            imgUrl={Offerings[3].imgUrl}
          />
        </div>
      </section>

      <section className="px-5 pt-40">
        <H2
          className={`mx-auto mb-12 w-fit text-center decoration-brand-green hover:underline ${dmserif.className}`}
        >
          Why is PD<span className="text-5xl text-brand-green">X</span> better
          than ChatGPT
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

const Offerings = [
  {
    title: "Split & Save",
    text: "Transform syllabi and PYQs into expertly designed PDFs, offering comprehensive study materials at your fingertips.",
    imgUrl: "/home/dollar.svg",
  },
  {
    title: "Community",
    text: "Contribute your modules to our community, sell them at a lower price, and earn a share of every sale while helping others.",
    imgUrl: "/home/person.svg",
  },
  {
    title: "Quality",
    text: "Contribute your modules to our community, sell them at a lower price, and earn a share of every sale while helping others.",
    imgUrl: "/home/star.svg",
  },
  {
    title: "PDFs with PDX",
    text: "Transform syllabi and PYQs into expertly designed PDFs, offering comprehensive study materials at your fingertips.",
    imgUrl: "/home/list.svg",
  },
];

type OfferBoxElement = {
  title: string;
  text: string;
  imgUrl: string;
  className?: string;
};

const OfferBox = ({ title, text, imgUrl, className }: OfferBoxElement) => {
  return (
    <div
      className={cn(
        "relative flex size-52 flex-col rounded-xl bg-[#737373]/30 shadow-[0px_0px_30px_#ffffff_inset] backdrop-blur-sm transition-all delay-100 duration-200 ease-in-out hover:shadow-[0px_0px_20px_#04D31C]",
        className
      )}
    >
      <H4 className="flex-grow p-4 text-start">{title}</H4>
      <Image
        src={imgUrl}
        alt="Image"
        className="absolute right-0 -z-10"
        width={120}
        height={120}
      />
      <Para className="p-4 text-start text-xs">{text}</Para>
    </div>
  );
};
