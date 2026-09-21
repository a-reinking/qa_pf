const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// In-memory store — fine for a demo/portfolio API, swap for a real DB later.
const submissions = [];

const skills = [
  { category: "Testing", items: ["Manual & exploratory testing", "API testing (Postman, Swagger)", "Test strategy & planning", "Performance testing (JMeter)"] },
  { category: "Tools & platforms", items: ["Azure DevOps", "SQL Server", "Visual Basic", "HTML/CSS"] },
  { category: "Currently building", items: ["Playwright (E2E & API automation)", "JavaScript / TypeScript", "Git-based version control"] },
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

app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: "name, email, and message are all required." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "That email address doesn't look valid." });
  }

  const submission = { id: submissions.length + 1, name, email, message, receivedAt: new Date().toISOString() };
  submissions.push(submission);

  res.status(201).json({ message: "Received — thanks for reaching out.", id: submission.id });
});

// Exposed only so the Playwright/API test suite has something to assert against.
// Remove or protect this before treating the API as production-grade.
app.get("/api/contact/_debug", (req, res) => {
  res.json(submissions);
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`API listening on port ${PORT}`));
}

module.exports = app;
