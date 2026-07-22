"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Loader2 } from "lucide-react";

import { H3 } from "@/components/typography/h3";
import { Muted } from "@/components/typography/muted";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

type ResetPasswordFormProps = {
  token?: string;
};

export const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!token) {
      setError("This reset link is invalid or expired.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get("password") || "");
    const confirmPassword = String(formData.get("confirmPassword") || "");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    await authClient.resetPassword(
      {
        newPassword: password,
        token,
      },
      {
        onSuccess: () => {
          router.replace("/login");
        },
        onError: (ctx) => {
          setError(ctx.error.message || "Could not reset your password.");
          setLoading(false);
        },
      }
    );
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
      <section className="w-full max-w-md rounded-lg border border-border bg-brand-bg p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <div className="mb-6">
          <H3 className="text-brand-heading">Choose a new password</H3>
          <Muted>Use at least 8 characters for your NoteFormula account.</Muted>
        </div>

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <input
            autoComplete="username"
            className="hidden"
            name="email"
            type="email"
          />
          <label className="grid gap-2 text-sm text-brand-heading">
            New password
            <Input
              autoComplete="new-password"
              className="text-white"
              minLength={8}
              name="password"
              required
              type="password"
            />
          </label>
          <label className="grid gap-2 text-sm text-brand-heading">
            Confirm password
            <Input
              autoComplete="new-password"
              className="text-white"
              minLength={8}
              name="confirmPassword"
              required
              type="password"
            />
          </label>
          <Button
            className="h-11 bg-brand-yellow text-brand-bg hover:bg-brand-yellow/90"
            disabled={loading}
            type="submit"
          >
            {loading && <Loader2 className="animate-spin" />}
            Reset password
          </Button>
        </form>

        {error && (
          <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        )}

        <Link
          className="mt-5 block text-sm font-medium text-brand-yellow hover:text-brand-yellow/80"
          href="/login"
        >
          Back to login
        </Link>
      </section>
    </main>
  );
};
