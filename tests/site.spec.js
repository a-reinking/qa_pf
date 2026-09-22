const { test, expect } = require("@playwright/test");

test.describe("Portfolio site — navigation and content", () => {
  test("loads with the expected hero content", async ({ page }) => {
    await page.goto("./");
    await expect(page.locator("h1")).toHaveText("Andy Reinking");
    await expect(page.locator(".role")).toContainText("QA Engineer");
  });

  test("every nav link scrolls to a matching section", async ({ page }) => {
    await page.goto("./");
    const links = ["experience", "skills", "automation", "contact"];

    for (const id of links) {
      await page.click(`.site-header nav a[href="#${id}"]`);
      await expect(page.locator(`#${id}`)).toBeInViewport();
    }
  });

  test("has no broken internal links", async ({ page }) => {
    await page.goto("./");
    const hrefs = await page.locator("a[href^='#']").evaluateAll((els) => els.map((e) => e.getAttribute("href")));

    for (const href of hrefs) {
      const target = page.locator(href);
      await expect(target).toHaveCount(1);
    }
  });

  test("experience section lists both roles", async ({ page }) => {
    await page.goto("./");
    const roles = page.locator(".timeline-role");
    await expect(roles).toHaveCount(2);
    await expect(roles.nth(0)).toHaveText("QA Engineer");
    await expect(roles.nth(1)).toHaveText("QA Manager");
  });
});

test.describe("Portfolio site — responsive layout", () => {
  const widths = [
    { name: "mobile", width: 375, height: 812 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "desktop", width: 1440, height: 900 },
  ];

  for (const { name, width, height } of widths) {
    test(`renders without horizontal overflow at ${name} width`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto("./");
      const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      expect(hasOverflow).toBeFalsy();
    });
  }
});

test.describe("Portfolio site — contact form", () => {
  test("rejects submission with an invalid email", async ({ page }) => {
    await page.goto("./");
    await page.fill("#name", "Test User");
    await page.fill("#email", "not-an-email");
    await page.fill("#message", "Hello there");
    // Browser-native validation should block submission before our JS runs.
    const isValid = await page.locator("#email").evaluate((el) => el.checkValidity());
    expect(isValid).toBeFalsy();
  });

  test("submits successfully with valid data", async ({ page }) => {
    await page.goto("./");
    await page.fill("#name", "Jordan Recruiter");
    await page.fill("#email", "jordan@example.com");
    await page.fill("#message", "Loved the portfolio — let's talk.");
    await page.click("button[type=submit]");
    await expect(page.locator("#form-status")).toHaveText(/sent/i, { timeout: 10000 });
  });
});
