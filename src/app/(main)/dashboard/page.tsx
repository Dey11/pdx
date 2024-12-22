import Image from "next/image";
import React from "react";

import { H1 } from "@/components/typography/h1";
import { H3 } from "@/components/typography/h3";
import { Para } from "@/components/typography/para";
import { Button } from "@/components/ui/button";

const page = () => {
  return (
    <div className="flex h-[80dvh] flex-col items-center justify-center gap-y-10 text-2xl">
      <H1>Coming Soon.</H1>
      <H3>Join our waitlist to get notified when it launches</H3>
      <div className="relative mx-auto">
        <Button className="peer mx-auto flex items-center gap-x-2 rounded-xl bg-white px-3 py-1.5 text-brand-btn shadow-[0px_0px_20px_#00FF1E] transition-all duration-200 ease-in-out hover:bg-gray-100 hover:shadow-[0px_0px_30px_#00FF1E]">
          <span className="font-bold">Join the Waitlist</span>
          <Image src="/home/arrow.svg" alt="Arrow" width={25} height={25} />
        </Button>

        <Image
          src="/home/curved-arrow.svg"
          alt="Arrow"
          className="peer absolute bottom-5 left-10 opacity-0 transition-all duration-300 ease-in-out peer-hover:opacity-100"
          width={20}
          height={20}
        />

        <Para className="peer pl-10 pt-2 text-[10px] opacity-0 transition-all duration-300 ease-in-out peer-hover:opacity-100">
          *Waitlisted users will get a discounted price upon launch
        </Para>
      </div>
    </div>
  );
};

export default page;
