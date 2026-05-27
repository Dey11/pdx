"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { GitBranch, Loader2, Mail, ShieldCheck } from "lucide-react";

import { H3 } from "@/components/typography/h3";
import { Muted } from "@/components/typography/muted";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type AuthMode = "sign-in" | "sign-up" | "forgot-password";
type Provider = "google" | "github" | "email";

const providerLabels: Record<Provider, string> = {
  email: "email",
  github: "GitHub",
  google: "Google",
};

const getMessage = (mode: AuthMode) => {
  if (mode === "sign-up") {
    return "Create an account to start generating study material.";
  }

  if (mode === "forgot-password") {
    return "Send a reset link to the email on your PDX account.";
  }

  return "Use the same account for dashboard, credits, and downloads.";
};

const SignIn = () => {
  const router = useRouter();
  const session = authClient.useSession();
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadingProvider, setLoadingProvider] = useState<Provider | null>(null);
  const [lastUsed] = useState<string | null>(() => {
    if (typeof document === "undefined") {
      return null;
    }

    return authClient.getLastUsedLoginMethod();
  });

  useEffect(() => {
    if (session.data?.user) {
      router.replace("/dashboard");
    }
  }, [router, session.data?.user]);

  const title = useMemo(() => {
    if (mode === "sign-up") {
      return "Create your PDX account";
    }

    if (mode === "forgot-password") {
      return "Reset your password";
    }

    return "Welcome back to PDX";
  }, [mode]);

  const handleSocialSignIn = async (provider: "google" | "github") => {
    setError("");
    setSuccess("");
    setLoadingProvider(provider);

    await authClient.signIn.social(
      {
        provider,
        callbackURL: "/dashboard",
      },
      {
        onError: (ctx) => {
          setError(ctx.error.message || `Could not continue with ${providerLabels[provider]}.`);
          setLoadingProvider(null);
        },
      }
    );
  };

  const handleEmailSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoadingProvider("email");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    const name = String(formData.get("name") || "");

    if (mode === "forgot-password") {
      await authClient.$fetch("/request-password-reset", {
        method: "POST",
        body: {
          email,
          redirectTo: "/login/reset-password",
        },
        onSuccess: () => {
          setSuccess("If that email exists, a reset link is on its way.");
        },
        onError: (ctx) => {
          setError(ctx.error.message || "Could not send a reset link.");
        },
      });
      setLoadingProvider(null);
      return;
    }

    if (mode === "sign-up") {
      await authClient.signUp.email(
        {
          email,
          name,
          password,
        },
        {
          onSuccess: () => {
            router.replace("/dashboard");
          },
          onError: (ctx) => {
            setError(ctx.error.message || "Could not create your account.");
            setLoadingProvider(null);
          },
        }
      );
      return;
    }

    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onSuccess: () => {
          router.replace("/dashboard");
        },
        onError: (ctx) => {
          setError(ctx.error.message || "Email or password is incorrect.");
          setLoadingProvider(null);
        },
      }
    );
  };

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center gap-8 md:grid-cols-[0.9fr_1.1fr]">
        <section className="hidden md:block">
          <div className="max-w-sm">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-yellow/30 bg-brand-yellow/10 px-3 py-1 text-sm text-brand-yellow">
              <ShieldCheck className="size-4" />
              Secure study workspace
            </div>
            <h1 className="text-4xl font-semibold leading-tight text-brand-heading">
              Generate, review, and download from one account.
            </h1>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              PDX keeps credits, generation history, and downloads tied to the
              same sign-in identity across every study-material workflow.
            </p>
          </div>
        </section>

        <section className="mx-auto w-full max-w-md rounded-lg border border-border bg-brand-bg p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="mb-6">
            <H3 className="text-brand-heading">{title}</H3>
            <Muted>{getMessage(mode)}</Muted>
          </div>

          {mode !== "forgot-password" && (
            <div className="grid gap-3">
              <Button
                type="button"
                className={cn(
                  "h-11 w-full bg-white text-black hover:bg-white/90",
                  lastUsed === "google" && "ring-2 ring-brand-yellow"
                )}
                disabled={loadingProvider !== null}
                onClick={() => handleSocialSignIn("google")}
              >
                {loadingProvider === "google" ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <span className="text-base font-semibold">G</span>
                )}
                Continue with Google
                {lastUsed === "google" && (
                  <span className="ml-auto text-xs text-black/60">Last used</span>
                )}
              </Button>

              <Button
                type="button"
                className={cn(
                  "h-11 w-full bg-zinc-950 text-white hover:bg-zinc-900",
                  lastUsed === "github" && "ring-2 ring-brand-yellow"
                )}
                disabled={loadingProvider !== null}
                onClick={() => handleSocialSignIn("github")}
              >
                {loadingProvider === "github" ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <GitBranch />
                )}
                Continue with GitHub
                {lastUsed === "github" && (
                  <span className="ml-auto text-xs text-white/60">Last used</span>
                )}
              </Button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-brand-bg px-2 text-xs uppercase text-muted-foreground">
                    Or use email
                  </span>
                </div>
              </div>
            </div>
          )}

          <form className="grid gap-4" onSubmit={handleEmailSubmit}>
            {mode === "sign-up" && (
              <label className="grid gap-2 text-sm text-brand-heading">
                Name
                <Input
                  autoComplete="name"
                  name="name"
                  placeholder="Dey"
                  required
                  type="text"
                  className="text-white"
                />
              </label>
            )}

            <label className="grid gap-2 text-sm text-brand-heading">
              Email
              <Input
                autoComplete="email"
                name="email"
                placeholder="you@college.edu"
                required
                type="email"
                className="text-white"
              />
            </label>

            {mode !== "forgot-password" && (
              <label className="grid gap-2 text-sm text-brand-heading">
                Password
                <Input
                  autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
                  name="password"
                  minLength={8}
                  placeholder="At least 8 characters"
                  required
                  type="password"
                  className="text-white"
                />
              </label>
            )}

            <Button
              className={cn(
                "h-11 w-full bg-brand-yellow text-brand-bg hover:bg-brand-yellow/90",
                lastUsed === "email" && "ring-2 ring-brand-yellow/70"
              )}
              disabled={loadingProvider !== null}
              type="submit"
            >
              {loadingProvider === "email" ? <Loader2 className="animate-spin" /> : <Mail />}
              {mode === "sign-up"
                ? "Create account"
                : mode === "forgot-password"
                  ? "Send reset link"
                  : "Sign in with email"}
              {lastUsed === "email" && mode === "sign-in" && (
                <span className="ml-auto text-xs text-black/60">Last used</span>
              )}
            </Button>
          </form>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
            {mode === "sign-in" ? (
              <>
                <button
                  className="text-muted-foreground transition-colors hover:text-brand-yellow"
                  onClick={() => setMode("forgot-password")}
                  type="button"
                >
                  Forgot password?
                </button>
                <button
                  className="font-medium text-brand-yellow transition-colors hover:text-brand-yellow/80"
                  onClick={() => setMode("sign-up")}
                  type="button"
                >
                  Create account
                </button>
              </>
            ) : (
              <button
                className="font-medium text-brand-yellow transition-colors hover:text-brand-yellow/80"
                onClick={() => setMode("sign-in")}
                type="button"
              >
                Back to sign in
              </button>
            )}
          </div>

          {success && (
            <p className="mt-4 rounded-md border border-brand-green/30 bg-brand-green/10 px-3 py-2 text-sm text-brand-green">
              {success}
            </p>
          )}
          {error && (
            <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
        </section>
      </div>
    </main>
  );
};

export default SignIn;
