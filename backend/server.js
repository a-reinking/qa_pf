const express = require("express");
const cors = require("cors");
const { randomUUID } = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const skills = [
  { category: "Testing", items: ["Manual & exploratory testing", "API testing (Postman, Swagger)", "Test strategy & planning", "Performance testing (JMeter)"] },
  { category: "Tools & platforms", items: ["Azure DevOps", "SQL Server", "Visual Basic", "HTML/CSS", "Git/GitHub"] },
  { category: "Automation (hands-on project)", items: ["Playwright (E2E & API automation)", "JavaScript / TypeScript", "Git-based version control"] },
  { category: "AI-assisted testing", items: ["Test strategy & case generation", "AI tooling for issue investigation"] },
  { category: "Leadership", items: ["Built & led QA teams", "Hiring & mentoring testers", "Cross-functional delivery coordination"] },
];

const experience = [
  { role: "QA Engineer", org: "Factor AE", summary: "First dedicated QA hire, working within an AI-driven SDLC." },
  { role: "QA Manager", org: "Intellectual Technology", summary: "Built and led a large QA team across manual and API testing, and test strategy." },
];

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.get("/api/skills", (req, res) => {
  res.json(skills);
});

app.get("/api/experience", (req, res) => {
  res.json(experience);
});

// Sends the contact form submission as a real email via Resend's API,
// instead of only storing it in memory (which never persisted anyway, since
// Render's free tier restarts the process regularly). RESEND_API_KEY and
// CONTACT_EMAIL are set as environment variables on Render — never hardcoded
// here. If they aren't set (e.g. running locally without them configured),
// the form still returns success to the visitor, but nothing gets emailed;
// a warning is logged server-side so that's obvious to notice.
async function sendContactEmail({ name, email, message }) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL;

  if (!apiKey || !to) {
    console.warn("RESEND_API_KEY or CONTACT_EMAIL not set — contact form submission was not emailed.");
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || "QA Portfolio <onboarding@resend.dev>",
      to: [to],
      reply_to: email,
      subject: `Portfolio contact form: ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Resend API responded with ${res.status}: ${body}`);
  }
}

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: "name, email, and message are all required." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "That email address doesn't look valid." });
  }

  try {
    await sendContactEmail({ name, email, message });
  } catch (err) {
    // Don't fail the request over an email-provider hiccup — the person
    // filling out the form still gets a normal success response. Log it
    // server-side so it's visible in Render's logs if delivery is failing.
    console.error("Failed to send contact email:", err);
  }

  res.status(201).json({ message: "Received — thanks for reaching out.", id: randomUUID() });
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`API listening on port ${PORT}`));
}

module.exports = app;
