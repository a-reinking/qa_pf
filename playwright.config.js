const { defineConfig, devices } = require("@playwright/test");

// Point these at your deployed site and API before running in CI.
const SITE_URL = process.env.SITE_URL || "http://localhost:8080";
const API_URL = process.env.API_URL || "http://localhost:3000";

module.exports = defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [["html", { outputFolder: "playwright-report", open: "never" }], ["list"]],
  use: {
    baseURL: SITE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    // Site E2E tests only — excludes api.spec.js so those aren't run 3x over.
    { name: "chromium", testIgnore: /api\.spec\.js/, use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-safari", testIgnore: /api\.spec\.js/, use: { ...devices["iPhone 13"] } },
    // API tests get their own project with a longer per-request timeout, since
    // Render's free tier can take 30-50s to wake a spun-down instance on the
    // first request. This keeps a cold start from reading as a real failure.
    {
      name: "api",
      testMatch: /api\.spec\.js/,
      use: { baseURL: API_URL, timeout: 60_000 },
      timeout: 90_000,
    },
  ],
});

module.exports.API_URL = API_URL;
