const { test, expect } = require("@playwright/test");
const { API_URL } = require("../playwright.config.js");

test.describe("API — health and data endpoints", () => {
  test("GET /api/health returns ok", async ({ request }) => {
    const res = await request.get(`${API_URL}/api/health`);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.status).toBe("ok");
  });

  test("GET /api/skills returns the expected categories", async ({ request }) => {
    const res = await request.get(`${API_URL}/api/skills`);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    const categories = body.map((group) => group.category);
    expect(categories).toEqual(
      expect.arrayContaining(["Testing", "Tools & platforms",  "Automation (hands-on project)", "AI-assisted testing", "Leadership"])
    );
  });

  test("GET /api/experience returns both roles in order", async ({ request }) => {
    const res = await request.get(`${API_URL}/api/experience`);
    const body = await res.json();
    expect(body).toHaveLength(2);
    expect(body[0].org).toBe("Factor AE");
    expect(body[1].org).toBe("Intellectual Technology");
  });
});

test.describe("API — contact endpoint", () => {
  test("rejects a submission missing required fields", async ({ request }) => {
    const res = await request.post(`${API_URL}/api/contact`, {
      data: { name: "Incomplete" },
    });
    expect(res.status()).toBe(400);
  });

  test("rejects a submission with a malformed email", async ({ request }) => {
    const res = await request.post(`${API_URL}/api/contact`, {
      data: { name: "Test", email: "nope", message: "Hi" },
    });
    expect(res.status()).toBe(400);
  });

  test("accepts a well-formed submission", async ({ request }) => {
    const res = await request.post(`${API_URL}/api/contact`, {
      data: { name: "Test User", email: "test@example.com", message: "Hello!" },
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body).toHaveProperty("id");
  });
});
