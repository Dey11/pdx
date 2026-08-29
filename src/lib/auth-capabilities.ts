export type AuthCapabilities = {
  github: boolean;
  google: boolean;
  passwordReset: boolean;
};

type AuthEnvironment = Partial<
  Record<
    | "AUTH_GITHUB_ID"
    | "AUTH_GITHUB_SECRET"
    | "AUTH_GOOGLE_ID"
    | "AUTH_GOOGLE_SECRET"
    | "AUTH_RESEND_KEY",
    string
  >
>;

/** Derives the auth methods that are fully configured for this runtime. */
export const getAuthCapabilities = (
  environment: AuthEnvironment = {
    AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID,
    AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
    AUTH_RESEND_KEY: process.env.AUTH_RESEND_KEY,
  }
): AuthCapabilities => ({
  github: Boolean(environment.AUTH_GITHUB_ID && environment.AUTH_GITHUB_SECRET),
  google: Boolean(environment.AUTH_GOOGLE_ID && environment.AUTH_GOOGLE_SECRET),
  passwordReset: Boolean(environment.AUTH_RESEND_KEY),
});
