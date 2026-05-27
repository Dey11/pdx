import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { lastLoginMethod } from "better-auth/plugins";

import { prisma } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";

const isNextBuild = process.env.NEXT_PHASE === "phase-production-build";
const localOnlySecret =
  process.env.NODE_ENV !== "production" || isNextBuild
    ? "local-build-only-better-auth-secret-change-in-production"
    : undefined;
const authSecret =
  process.env.BETTER_AUTH_SECRET ?? process.env.AUTH_SECRET ?? localOnlySecret;
const socialProviders = {
  ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
    ? {
        google: {
          clientId: process.env.AUTH_GOOGLE_ID,
          clientSecret: process.env.AUTH_GOOGLE_SECRET,
        },
      }
    : {}),
  ...(process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET
    ? {
        github: {
          clientId: process.env.AUTH_GITHUB_ID,
          clientSecret: process.env.AUTH_GITHUB_SECRET,
        },
      }
    : {}),
};

if (!authSecret) {
  throw new Error("BETTER_AUTH_SECRET or AUTH_SECRET is required");
}

export const auth = betterAuth({
  secret: authSecret,
  baseURL: process.env.BETTER_AUTH_URL ?? (isNextBuild ? "http://localhost:3000" : undefined),
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    resetPasswordTokenExpiresIn: 60 * 30,
    async sendResetPassword({ user, url }) {
      await sendPasswordResetEmail({
        to: user.email,
        name: user.name,
        resetUrl: url,
      });
    },
  },
  socialProviders,
  plugins: [
    lastLoginMethod(),
    nextCookies(),
  ],
});
