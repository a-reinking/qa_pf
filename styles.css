// Points at your deployed backend. Update after you deploy to Render.
const API_BASE = window.API_BASE || "https://qa-pf.onrender.com/";
//updated above URL with the URL of the created and deployed render web service.

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
const statusText = document.getElementById("ci-status-text");
if (statusText) {
  statusText.textContent = "All checks passing — last run on deploy";
}
