# TarifYol

TarifYol is a bilingual (Deutsch & Türkçe) information, customer-support, and mediation website for electricity, gas, and internet tariffs in Germany. Kfz comparison remains a clearly labelled external self-service partner path.

## Structure

- `frontend/` — dependency-free HTML, CSS, and vanilla JavaScript; the GitHub Pages deployment artifact
- `backend/` — intentionally reserved project area; no backend is required for the current static site
- `.github/workflows/` — GitHub Pages deployment workflow

## Local preview

Serve the repository root with a static web server and open `frontend/index.html`, or open the file directly in a browser for basic review.

## Deployment

The GitHub Actions workflow deploys `frontend/` to GitHub Pages on pushes to `main`. Production domain: `https://tarifyol.de` (configured through `frontend/CNAME`). Configure GitHub Pages, DNS, and HTTPS in the repository/domain settings before production use.

Do not commit secrets, credentials, or private customer data.
