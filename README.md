# Andy Reinking — QA Portfolio

A portfolio site that doubles as a working demonstration of QA and automation skills: a static frontend, a small Express backend, and a Playwright suite that tests both — run automatically on every push via GitHub Actions, with the HTML report published as a public link.

## Why it's built this way

Most QA portfolios describe skills. This one demonstrates them: every claim on the site (the contact form works, the layout is responsive, the nav links resolve) is backed by a test that runs in CI and produces a public, inspectable report.

## Stack

- **Frontend** — plain HTML/CSS/JS, deployed on GitHub Pages
- **Backend** — Node/Express API, deployed on Render's free tier
- **Tests** — Playwright, covering:
  - End-to-end checks of the live site (navigation, links, responsive layout, contact form)
  - API tests against the backend's endpoints directly
- **CI** — GitHub Actions runs the full suite on every push to `main` and publishes the HTML report

## Project structure

```
frontend/     static site (index.html, styles.css, script.js)
backend/      Express API (server.js)
tests/        Playwright specs — site.spec.js (E2E), api.spec.js (API)
.github/workflows/playwright.yml   CI pipeline
playwright.config.js
```

## Running locally

**Backend:**
```
cd backend
npm install
npm start        # serves the API on http://localhost:3000
```

**Frontend:** serve `frontend/` with any static server, e.g.
```
npx serve frontend -l 8080
```

**Tests:**
```
npm install
npx playwright install
npm test
```

## Deploying (all free)

1. Push this repo to GitHub.
2. **Frontend:** Settings → Pages → deploy from the `frontend` folder on `main`.
3. **Backend:** create a new Web Service on [Render](https://render.com), point it at this repo's `backend` folder, build command `npm install`, start command `npm start`.
4. Update `API_BASE` in `frontend/script.js` and the report link in `frontend/index.html` with your real URLs.
5. In the repo's Settings → Secrets and variables → Actions, add `SITE_URL` and `API_URL` so CI tests the real deployment.
6. Push to `main` — GitHub Actions runs the suite and publishes the report under `/test-report` on your Pages site.

## Status

Frontend, backend, and test suite are written. Remaining before this reflects a live deployment: push to GitHub, deploy both services, wire up the real URLs above, and confirm CI is green.
