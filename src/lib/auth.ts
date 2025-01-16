import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";

import { prisma } from "./db";

const providers: Provider[] = [
  Google,
  Resend({
    apiKey: process.env.AUTH_RESEND_KEY,
    from: "support@usepdx.tech",
  }),
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  adapter: PrismaAdapter(prisma),
});
