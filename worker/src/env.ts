// Validation is intentionally prod-only and partial: in development the worker
// is expected to run against a subset of services (e.g. no cloud storage), so
// these are enforced only when NODE_ENV === "production". Presence-only checks;
// values are not validated here.
const requiredInProduction = [
  "BACKEND_URL",
  "BUCKET_NAME",
  "CLOUDFLARE_ACCOUNT_ID",
  "CLOUDFLARE_ACCESS_KEY_ID",
  "CLOUDFLARE_SECRET_ACCESS_KEY",
  "DEEPSEEK_API_KEY",
  "GOOGLE_API_KEY",
  "REDIS_HOST",
  "REDIS_PORT",
  // Shared secret for authenticating callbacks to the web app's
  // /api/generation/* routes. Required in production so callbacks are signed.
  "WORKER_CALLBACK_SECRET",
];

export function validateWorkerEnv() {
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  const missing = requiredInProduction.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required worker environment variables: ${missing.join(", ")}`);
  }
}
