// Points at your deployed backend. Update after you deploy to Render.
const API_BASE = (window.API_BASE || "https://qa-pf.onrender.com/").replace(/\/+$/, "");

const form = document.getElementById("contact-form");
const statusEl = document.getElementById("form-status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusEl.textContent = "Sending…";
  statusEl.className = "";

  const payload = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    message: form.message.value.trim(),
  };

  try {
    const res = await fetch(`${API_BASE}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

    statusEl.textContent = "Message sent — thanks, I'll get back to you.";
    statusEl.className = "ok";
    form.reset();
  } catch (err) {
    statusEl.textContent = "Couldn't send that right now — please try again in a moment.";
    statusEl.className = "err";
  }
});

// Optional: reflect a real CI badge once you wire up GitHub Actions.
// Replace this with a fetch to the GitHub Actions API or a status badge image.
//const statusText = document.getElementById("ci-status-text");
//if (statusText) {
  //statusText.textContent = "All checks passing — last run on deploy";
//}
// Show the real status of the latest CI run, pulled from GitHub's public API.
const statusText = document.getElementById("ci-status-text");
const statusDot = document.querySelector(".automation-status .dot");

if (statusText) {
  fetch("https://api.github.com/repos/a-reinking/qa_pf/actions/workflows/playwright.yml/runs?branch=main&per_page=1")
    .then((res) => {
      if (!res.ok) throw new Error(`GitHub API responded with ${res.status}`);
      return res.json();
    })
    .then((data) => {
      const run = data.workflow_runs && data.workflow_runs[0];
      if (!run) throw new Error("No runs found");

      const when = new Date(run.updated_at).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });

      if (run.status !== "completed") {
        statusText.textContent = `Test run in progress — started ${when}`;
      } else if (run.conclusion === "success") {
        statusText.textContent = `All checks passing — last run ${when}`;
      } else {
        statusText.textContent = `Latest run did not pass (${run.conclusion}) — ${when}`;
        if (statusDot) statusDot.style.background = "#B3261E";
      }
    })
    .catch(() => {
      statusText.textContent = "See the latest test report below";
    });
}
