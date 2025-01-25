"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useSession } from "next-auth/react";

import { H3 } from "../typography/h3";
import { H4 } from "../typography/h4";
import { Muted } from "../typography/muted";
import { Button } from "../ui/button";

const BillingSection = () => {
  const session = useSession();
  const [credits, setCredits] = useState(0);

  const fetchCreditDetails = async () => {
    try {
      const data = await fetch("/api/credits");
      const res = await data.json();
      setCredits(res.credits);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCreditDetails();
  }, [session]);

  return (
    <div className="my-10 w-full rounded-lg bg-brand-bg p-5">
      <H3>Billing Information</H3>
      <Muted>Manage your account credits and billing details</Muted>

      <div className="m-5 flex flex-row flex-wrap items-center justify-between gap-2 rounded-lg bg-black p-5">
        <div className="">
          <H4>Available credits</H4>
          <Muted>Use these for generating study materials</Muted>
        </div>
        <div className="rounded-2xl bg-brand-bg/50 p-2">{credits}</div>
      </div>

      <Link href="/pricing" className="mt-4">
        <Button className="w-full bg-brand-green hover:bg-brand-green/80">
          Buy more credits
        </Button>
      </Link>
    </div>
  );
};

export default BillingSection;
