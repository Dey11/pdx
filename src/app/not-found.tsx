import Link from "next/link";
import React from "react";

import { H1 } from "@/components/typography/h1";
import { H2 } from "@/components/typography/h2";
import { Muted } from "@/components/typography/muted";

const NotFound = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-y-5">
      <H1>Not Found</H1>
      <section className="text-center">
        <H2>
          Please return to the{" "}
          <Link href={"/"} className="underline">
            home page
          </Link>
        </H2>
        <Muted>If you think this is a mistake, please contact us.</Muted>
      </section>
    </div>
  );
};

export default NotFound;
