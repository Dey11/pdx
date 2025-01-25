import { Suspense } from "react";

import {
  BookOpen,
  Brain,
  FileText,
  Lightbulb,
  PenTool,
  Users,
} from "lucide-react";

import RecentMaterials from "@/components/dashboard/recent-materials";
import { H1 } from "@/components/typography/h1";
import { H2 } from "@/components/typography/h2";
import { H3 } from "@/components/typography/h3";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

type Tool = {
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  description: string;
  live: boolean;
  href: string;
};

const tools = [
  {
    icon: Brain,
    name: "AI Study Material Generator",
    description: "Create custom study materials with AI assistance",
    live: true,
    href: "/dashboard/generate",
  },
  {
    icon: FileText,
    name: "Interactive Flashcards",
    description: "Boost your memory with dynamic flashcards",
    live: false,
    href: "/tools/flashcards",
  },
  {
    icon: Users,
    name: "Collaborative Study Groups",
    description: "Join or create study groups with peers",
    live: false,
    href: "/tools/generate",
  },
  {
    icon: PenTool,
    name: "Smart Quiz Creator",
    description: "Generate quizzes from your study materials",
    live: false,
    href: "/tools/generate",
  },
];

const page = async () => {
  const session = await auth();

  return (
    <div className="container mx-auto max-w-[1400px] p-5">
      <H1 className="text-4xl text-brand-green md:text-5xl">
        Welcome back, {session?.user?.name}
      </H1>

      <section className="grid w-full grid-cols-1 gap-5 pt-5 md:grid-cols-2">
        <div className="rounded-xl border bg-brand-bg p-5">
          <H2 className="flex items-center gap-x-3 text-xl sm:text-2xl md:text-3xl">
            <BookOpen className="size-5 text-brand-green md:size-8" />
            Recent Study Materials
          </H2>

          <Suspense>
            <RecentMaterials />
          </Suspense>
        </div>
        <div className="flex flex-col justify-between rounded-xl border bg-brand-bg p-5">
          <H2 className="flex items-center gap-x-3 text-xl sm:text-2xl md:text-3xl">
            <Lightbulb className="size-5 text-brand-green md:size-8" />
            Motivational Quotes
          </H2>

          <p className="mt-5 border-l-4 border-brand-green pl-4 text-sm italic sm:text-base">
            "When studying a new concept, try to explain it in your own words as
            if you're teaching it to someone else. This technique, known as the
            'Feynman Technique,' helps identify gaps in your understanding and
            reinforces your learning."
          </p>
          <p className="mt-2 flex justify-end text-xs text-muted-foreground sm:text-base">
            - Richard Feynman
          </p>
        </div>
      </section>

      <section className="my-10">
        <H2 className="text-brand-green">Featured Tools</H2>

        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool, index) => {
            return <FeaturedTool key={index} tool={tool} />;
          })}
        </div>
      </section>
    </div>
  );
};

export default page;

const FeaturedTool = ({ tool }: { tool: Tool }) => {
  return (
    <div className="flex flex-col items-center justify-between gap-y-4 rounded-xl border bg-brand-bg p-5 text-center">
      <tool.icon className="size-8 text-brand-green" />
      <H3 className="flex items-center gap-x-3">{tool.name}</H3>
      <p className="text-sm text-muted-foreground">{tool.description}</p>
      <Button
        className="bg-brand-green text-brand-bg hover:bg-brand-green/90"
        variant={"glowy"}
        disabled={!tool.live}
      >
        {tool.live ? "Try Now" : "Coming soon"}
      </Button>
    </div>
  );
};
