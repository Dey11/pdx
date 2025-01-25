"use client";

import { redirect } from "next/navigation";
import { useState } from "react";

import { signIn, useSession } from "next-auth/react";

import { H3 } from "@/components/typography/h3";
import { Muted } from "@/components/typography/muted";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SignIn = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const session = useSession();

  if (session.data?.user) {
    redirect("/dashboard");
  }

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      setLoading(true);
      const formData = new FormData(event.currentTarget);
      const result = await signIn("resend", {
        email: formData.get("email"),
        redirect: false,
      });
      if (result?.ok) {
        setSuccess(
          "Check your email for the sign-in link. The link to login will be valid for 10 minutes."
        );
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col gap-y-5 rounded-lg bg-brand-bg p-5 shadow-md backdrop-blur-xl">
          <div className="pb-2">
            <H3 className="tracking-wide">Login to UsePdx</H3>
            <Muted>Choose your preferred login method</Muted>
          </div>
          <Button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            variant={"glowy"}
            className="bg-brand-green/90 text-brand-bg hover:bg-brand-green"
            disabled={loading}
          >
            Sign in with Google
          </Button>
          <Button
            onClick={() => signIn("github")}
            variant={"glowy"}
            className="bg-brand-green/90 text-brand-bg hover:bg-brand-green"
            disabled={loading}
          >
            Sign in with GitHub
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted-foreground" />
            </div>

            <div className="relative flex justify-center text-xs uppercase">
              <Muted className="bg-brand-bg px-2 text-xs">
                Or continue with
              </Muted>
            </div>
          </div>
          <form className="flex flex-col gap-y-5" onSubmit={handleFormSubmit}>
            <label className="text-sm">
              Email
              <Input
                type="text"
                name="email"
                placeholder="dey@usepdx.tech"
                className="mt-1 text-white"
              />
            </label>
            <Button
              variant={"glowy"}
              type="submit"
              className="bg-brand-green/80 text-brand-bg hover:bg-brand-green"
              disabled={loading}
            >
              Sign in with Email
            </Button>
          </form>
          {success && (
            <div className="w-62 max-w-[260px] text-wrap text-center text-xs text-green-500">
              {success}
            </div>
          )}
          {error && (
            <div className="w-80 max-w-[260px] text-wrap text-center text-xs text-red-500">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
