"use client";

import { useState, useTransition } from "react";

import { H3 } from "../typography/h3";
import { Muted } from "../typography/muted";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const RedeemSection = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isPending, startTransition] = useTransition();

  const redeemCode = async (formData: FormData) => {
    startTransition(async () => {
      try {
        setSuccess("");
        setError("");
        const code = formData.get("coupon") as string;
        if (!code) {
          setError("Please enter a coupon code");
          return;
        }
        if (code.length !== 6) {
          setError("Coupon code must be 6 characters long");
          return;
        }
        const data = await fetch("/api/credits", {
          method: "POST",
          body: JSON.stringify({ code }),
        });
        const res = await data.json();
        setSuccess(res.credits + " coupons redeemed successfully!");
      } catch (err) {
        setError("Invalid code");
        console.error(err);
      }
    });
  };

  return (
    <div className="my-10 w-full rounded-lg bg-brand-bg p-5">
      <H3>Redeem Coupon</H3>
      <Muted>Enter a coupon code to receive additional credits</Muted>

      <form
        action={redeemCode}
        className="m-5 flex flex-col items-center justify-center gap-2 rounded-lg bg-black p-5 sm:flex-row"
      >
        <Input placeholder="Enter coupon code" name="coupon" />
        <Button
          disabled={isPending}
          className="bg-brand-green font-medium hover:bg-brand-green/80"
        >
          Redeem
        </Button>
      </form>

      {success && <p className="text-center text-brand-green">{success}</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
    </div>
  );
};

export default RedeemSection;
