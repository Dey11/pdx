const requiredInProduction = [
  "BACKEND_URL",
  "BUCKET_NAME",
  "CLOUDFLARE_ACCOUNT_ID",
  "CLOUDFLARE_ACCESS_KEY_ID",
  "CLOUDFLARE_SECRET_ACCESS_KEY",
  "GOOGLE_API_KEY",
  "REDIS_HOST",
  "REDIS_PORT",
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
