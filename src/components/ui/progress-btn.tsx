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
        className={
          "relative w-fit overflow-hidden rounded-2xl p-1 shadow-[0px_0px_20px_#00FF1E] transition-all duration-200 ease-in-out hover:shadow-[0px_0px_40px_#00FF1E]"
        }
      >
        <div
          className={cn("bg-brand-green absolute top-0 bottom-0 left-0 -z-10")}
          style={{ width: `${progressPercentage}%` }}
        />
        <div
          className={cn("absolute top-0 right-0 bottom-0 -z-10 bg-[#868686]")}
          style={{ width: `${100 - progressPercentage}%` }}
        />
        <Button className="peer text-brand-btn mx-auto flex items-center gap-x-2 rounded-xl bg-white px-3 py-1.5 hover:bg-gray-100">
          <span className="font-bold">Join the Waitlist</span>
          <Image src="/home/arrow.svg" alt="Arrow" width={25} height={25} />
        </Button>
      </div>
      {remainingSignups > 0 && (
        <p
          className={`text-brand-white z-10 pt-2 text-center text-sm shadow-xl backdrop-blur-sm ${dmserif.className}`}
        >
          {remainingSignups} Remaining
        </p>
      )}
    </Link>
  );
};
