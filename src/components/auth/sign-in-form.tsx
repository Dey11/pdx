"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { GitBranch, Loader2, Mail, ShieldCheck } from "lucide-react";

import { H3 } from "@/components/typography/h3";
import { Muted } from "@/components/typography/muted";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type AuthMode = "sign-in" | "sign-up" | "forgot-password";
type Provider = "google" | "github" | "email";

type SignInFormProps = {
  githubEnabled: boolean;
  googleEnabled: boolean;
  passwordResetEnabled: boolean;
};

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

  return "Use the same account for your provider settings, history, and downloads.";
};

export const SignInForm = ({
  githubEnabled,
  googleEnabled,
  passwordResetEnabled,
}: SignInFormProps) => {
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
          setError(
            ctx.error.message ||
              `Could not continue with ${providerLabels[provider]}.`
          );
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
    <main className="bg-background text-foreground min-h-screen px-4 py-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-5xl items-center gap-8 md:grid-cols-[0.9fr_1.1fr]">
        <section className="hidden md:block">
          <div className="max-w-sm">
            <div className="border-brand-yellow/30 bg-brand-yellow/10 text-brand-yellow mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
              <ShieldCheck className="size-4" />
              Secure study workspace
            </div>
            <h1 className="text-brand-heading text-4xl leading-tight font-semibold">
              Generate, review, and download from one account.
            </h1>
            <p className="text-muted-foreground mt-4 text-sm leading-6">
              PDX keeps provider settings, generation history, and downloads
              tied to the same sign-in identity across every study-material
              workflow.
            </p>
          </div>
        </section>

        <section className="border-border bg-brand-bg mx-auto w-full max-w-md rounded-lg border p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="mb-6">
            <H3 className="text-brand-heading">{title}</H3>
            <Muted>{getMessage(mode)}</Muted>
          </div>

          {mode !== "forgot-password" && (googleEnabled || githubEnabled) && (
            <div className="grid gap-3">
              {googleEnabled && (
                <Button
                  type="button"
                  className={cn(
                    "h-11 w-full bg-white text-black hover:bg-white/90",
                    lastUsed === "google" && "ring-brand-yellow ring-2"
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
                    <span className="ml-auto text-xs text-black/60">
                      Last used
                    </span>
                  )}
                </Button>
              )}

              {githubEnabled && (
                <Button
                  type="button"
                  className={cn(
                    "h-11 w-full bg-zinc-950 text-white hover:bg-zinc-900",
                    lastUsed === "github" && "ring-brand-yellow ring-2"
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
                    <span className="ml-auto text-xs text-white/60">
                      Last used
                    </span>
                  )}
                </Button>
              )}

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="border-border w-full border-t" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-brand-bg text-muted-foreground px-2 text-xs uppercase">
                    Or use email
                  </span>
                </div>
              </div>
            </div>
          )}

          <form className="grid gap-4" onSubmit={handleEmailSubmit}>
            {mode === "sign-up" && (
              <label className="text-brand-heading grid gap-2 text-sm">
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

            <label className="text-brand-heading grid gap-2 text-sm">
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
              <label className="text-brand-heading grid gap-2 text-sm">
                Password
                <Input
                  autoComplete={
                    mode === "sign-up" ? "new-password" : "current-password"
                  }
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
                "bg-brand-yellow text-brand-bg hover:bg-brand-yellow/90 h-11 w-full",
                lastUsed === "email" && "ring-brand-yellow/70 ring-2"
              )}
              disabled={loadingProvider !== null}
              type="submit"
            >
              {loadingProvider === "email" ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Mail />
              )}
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
                {passwordResetEnabled ? (
                  <button
                    className="text-muted-foreground hover:text-brand-yellow transition-colors"
                    onClick={() => setMode("forgot-password")}
                    type="button"
                  >
                    Forgot password?
                  </button>
                ) : (
                  <span />
                )}
                <button
                  className="text-brand-yellow hover:text-brand-yellow/80 font-medium transition-colors"
                  onClick={() => setMode("sign-up")}
                  type="button"
                >
                  Create account
                </button>
              </>
            ) : (
              <button
                className="text-brand-yellow hover:text-brand-yellow/80 font-medium transition-colors"
                onClick={() => setMode("sign-in")}
                type="button"
              >
                Back to sign in
              </button>
            )}
          </div>

          {success && (
            <p className="border-brand-green/30 bg-brand-green/10 text-brand-green mt-4 rounded-md border px-3 py-2 text-sm">
              {success}
            </p>
          )}
          {error && (
            <p className="border-destructive/30 bg-destructive/10 text-destructive mt-4 rounded-md border px-3 py-2 text-sm">
              {error}
            </p>
          )}
        </section>
      </div>
    </main>
  );
};
