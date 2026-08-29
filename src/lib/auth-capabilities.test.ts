import { describe, expect, test } from "bun:test";

import { getAuthCapabilities } from "./auth-capabilities";

describe("getAuthCapabilities", () => {
  test("disables optional auth methods when credentials are absent", () => {
    expect(getAuthCapabilities({})).toEqual({
      github: false,
      google: false,
      passwordReset: false,
    });
  });

  test("requires both credentials for each social provider", () => {
    expect(
      getAuthCapabilities({
        AUTH_GITHUB_ID: "github-id",
        AUTH_GOOGLE_SECRET: "google-secret",
      })
    ).toEqual({
      github: false,
      google: false,
      passwordReset: false,
    });
  });

  test("enables only fully configured methods", () => {
    expect(
      getAuthCapabilities({
        AUTH_GITHUB_ID: "github-id",
        AUTH_GITHUB_SECRET: "github-secret",
        AUTH_GOOGLE_ID: "google-id",
        AUTH_GOOGLE_SECRET: "google-secret",
        AUTH_RESEND_KEY: "resend-key",
      })
    ).toEqual({
      github: true,
      google: true,
      passwordReset: true,
    });
  });
});
