import { DM_Serif_Text } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { connection } from "next/server";
import React from "react";

import { TOTAL_GOAL } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { cn } from "@/lib/utils";

import { Button } from "./button";

const dmserif = DM_Serif_Text({
  weight: "400",
  subsets: ["latin", "latin-ext"],
});

export const WaitlistButton = async () => {
  await connection();
  const currentSignups = await prisma.waitlistUsers.count();
  const totalSignups = TOTAL_GOAL;
  const remainingSignups = totalSignups - currentSignups;
  const progressPercentage = Math.min(
    (currentSignups / totalSignups) * 100,
    100
  );

  return (
    <Link href={"/waitlist"} className="peer mx-auto w-fit">
      <div
        className={`relative w-fit overflow-hidden rounded-2xl p-1 shadow-[0px_0px_20px_#00FF1E] transition-all duration-200 ease-in-out hover:shadow-[0px_0px_40px_#00FF1E]`}
      >
        <div
          className={cn(`absolute bottom-0 left-0 top-0 -z-10 bg-brand-green`)}
          style={{ width: `${progressPercentage}%` }}
        />
        <div
          className={cn(`absolute bottom-0 right-0 top-0 -z-10 bg-[#868686]`)}
          style={{ width: `${100 - progressPercentage}%` }}
        />
        <Button className="peer mx-auto flex items-center gap-x-2 rounded-xl bg-white px-3 py-1.5 text-brand-btn hover:bg-gray-100">
          <span className="font-bold">Join the Waitlist</span>
          <Image src="/home/arrow.svg" alt="Arrow" width={25} height={25} />
        </Button>
      </div>
      <p
        className={`z-10 pt-2 text-center text-sm text-brand-text shadow-xl backdrop-blur-sm ${dmserif.className}`}
      >
        {remainingSignups} Remaining
      </p>
    </Link>
  );
};
