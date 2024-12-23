"use client";

import { Poppins } from "next/font/google";
import Image from "next/image";
import { useActionState } from "react";

import { Mail, User } from "lucide-react";
import Confetti from "react-confetti";

import { addToWaitlist } from "@/app/actions/waitlist";
import { H2 } from "@/components/typography/h2";
import { Para } from "@/components/typography/para";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ActionResponse } from "@/lib/types/waitlist";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const page = () => {
  const initialState: ActionResponse = {
    success: false,
    message: "",
  };

  const [state, action, isPending] = useActionState(
    addToWaitlist,
    initialState
  );

  return (
    <div className="z-10 flex h-[80dvh] flex-col items-center justify-center">
      <Image
        src={"/waitlist/logo.svg"}
        priority
        alt="logo"
        width={100}
        height={100}
      />

      <div className="px-4 pb-10">
        <H2
          className={`${poppins.className} bg-gradient-to-r from-[#D3D3D3] to-[#8E8B8B] bg-clip-text text-center font-bold text-transparent`}
        >
          Join the waitlist to
        </H2>
        <H2
          className={`${poppins.className} bg-gradient-to-b from-[#00FF1E] to-[#04D31C] bg-clip-text pb-2 text-center font-bold text-transparent lg:text-4xl`}
        >
          Unlock your learning power
        </H2>
      </div>

      <form
        className="z-10 flex w-full max-w-sm flex-col gap-y-2 space-y-2 px-5"
        action={action}
        autoComplete="on"
      >
        <label className="relative">
          <Input
            placeholder="Full name"
            type="text"
            name="name"
            required
            defaultValue={state?.data?.name}
            minLength={3}
            autoComplete="name"
            className="rounded-lg border-[1.6px] border-[#C1C1C1] bg-[#242424] pl-9 placeholder:pl-1 focus:border-0 focus:shadow-[0px_0px_30px_#00FF1E]"
          />
          <User className="absolute left-2 top-1/2 size-5 -translate-y-1/2 text-[#C1C1C1]" />
        </label>
        {state?.errors?.name && (
          <p className="text-center text-xs text-red-500">
            {state?.errors?.name[0]}
          </p>
        )}

        <label className="relative">
          <Input
            placeholder="Email address"
            type="email"
            name="email"
            required
            defaultValue={state?.data?.email}
            minLength={1}
            autoComplete="email"
            className="rounded-lg border-[1.6px] border-[#C1C1C1] bg-[#242424] pl-9 placeholder:pl-1 focus:border-0 focus:shadow-[0px_0px_30px_#00FF1E]"
          />
          <Mail className="absolute left-2 top-1/2 size-5 -translate-y-1/2 text-[#C1C1C1]" />
        </label>
        {state?.errors?.email && (
          <p className="text-center text-xs text-red-500">
            {state?.errors?.email[0]}
          </p>
        )}

        <Button type="submit" disabled={isPending} className="bg-[#242424]">
          {isPending ? "Submitting the form..." : "Join the waitlist"}
        </Button>
        {state.success ? (
          <Para className="text-center text-xs text-green-500">
            {state.message}
          </Para>
        ) : (
          <Para className="text-center text-xs text-red-500">
            {state.message}
          </Para>
        )}

        {state.success && (
          <Confetti
            numberOfPieces={100}
            colors={["#04d31c", "#1e1e1e", "#ffffff"]}
          />
        )}
      </form>
    </div>
  );
};

export default page;
