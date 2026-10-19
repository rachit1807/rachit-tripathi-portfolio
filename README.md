# Rachit Tripathi — Developer Portfolio

A responsive portfolio for my software projects, internship contributions, technical skills, training, and education, presented in a cinematic editorial layout.

## Live site

[rachit1807.github.io/rachit-tripathi-portfolio](https://rachit1807.github.io/rachit-tripathi-portfolio/)

This is the existing GitHub Pages URL for the project.

## Featured projects

The portfolio highlights six projects with implementation notes, architecture flows, quality evidence, and demo guidance where available.

1. **[TaskFlow Pro](https://github.com/rachit1807/TaskFlow-Pro)** — React, Vite, Express, and MongoDB project management app with workspaces, roles, Kanban boards, task assignment, comments, attachments, notifications, and activity history. [Live demo](https://taskflow-pro-web.onrender.com/)
2. **[AI Code Review](https://github.com/rachit1807/AI-Code-Review)** — CodeMore internship project using a React client, Express API, MongoDB, and an Ollama model for structured code review feedback. The repository documents API routes and manual Postman checks; its test script is a placeholder, not an automated test suite. [Live demo](https://ai-code-review-n5gt.onrender.com/)
3. **[TeamHub RBAC](https://github.com/rachit1807/TeamHub-RBAC)** — Node.js and Express team workspace app with JWT authentication, role checks, PostgreSQL on the hosted demo, and SQLite for local runs. The repository includes API documentation and a Postman collection. GitHub Actions runs `npm run check` on pushes and pull requests; this checks JavaScript syntax. A Render inspection on October 11, 2026 found its PostgreSQL database available, with expiry scheduled for November 9, 2026. The free web service can take 50 seconds or more to wake after inactivity. [Live demo](https://teamhub-rbac.onrender.com/) · [API health](https://teamhub-rbac.onrender.com/api/health)
4. **[AI Resume Analyzer](https://github.com/rachit1807/AI_RESUME_ANALYZER)** — Flask career platform with PDF text extraction, heuristic ATS-style scoring, TF-IDF role matching, candidate tools, and recruiter workflows. The repository includes `pytest` tests; its README describes isolated SQLite test data and no external email or AI calls. Career helpers use local rules and templates. [Live demo](https://ai-resume-analyzer-rachit.onrender.com/)
5. **[SmartLoanAI](https://github.com/rachit1807/SmartLoanAI)** — Educational React and FastAPI loan workflow demo with an ML estimate, repayment calculations, and a separate document review flow. The repository includes `backend/test_decision_isolation.py`, a regression script using in-memory SQLite, and FastAPI documentation at `/docs`. Uploaded files on the hosted service use local storage and may not survive a restart or redeploy. Use sample data only. [Frontend demo](https://smart-loan-ai-one.vercel.app/) · [API docs](https://smartloanai-api.onrender.com/docs)

6. **[RailYatra](https://github.com/rachit1807/RailYatra)** — Railway booking simulator built with HTML, CSS, JavaScript modules, Express, and PostgreSQL. Includes route search, automatic seat allocation, temporary checkout holds, PNR lookup, downloadable demo tickets, and simulated payment/refund flows. Transactions, inventory row locks, and idempotent checkout protect booking consistency. The repository includes unit tests, PostgreSQL integration tests, and CI checks. All availability, fares, payments, and tickets are simulated; tickets are not valid for travel. [Full-stack demo](https://railyatra-api.onrender.com/) · [Static frontend preview](https://rachit1807.github.io/RailYatra/)

Other work, including [ProductHub API](https://github.com/rachit1807/ProductHub-API), FormGuard, FitForge, and Premium Counter App, is available from the [GitHub profile](https://github.com/rachit1807).

## Internship experience

- **Full-Stack Web Development Intern, CodeMore** — September 29, 2026–present, remote. The ongoing internship covers **26 projects in total**. Selected work includes **[TaskNest](https://github.com/rachit1807/fullstack-app-deployment)** (private task management, list/board views, Express, PostgreSQL, and database-backed sessions), **[TeamHub RBAC](https://github.com/rachit1807/TeamHub-RBAC)** (workspace membership and role-based access), and **[AI Code Review](https://github.com/rachit1807/AI-Code-Review)** (React, Express, MongoDB, Ollama reviews, and PDF reports). The total describes the internship scope, not completed projects. [TaskNest live demo](https://tasknest-rachit.onrender.com/)
- **Front-End Development Intern, Codveda Technologies** — August 26–September 27, 2026, remote. Built the FitForge responsive landing page and Premium Counter App, and collaborated on cross-device UI work using Git and GitHub.

## Training and recognition

- **Front-End Development Internship certificate, Codveda Technologies** — The certificate records internship work from August to September 2026 and is dated October 5, 2026. The original certificate image is included in the portfolio.
- **Department Mentor, Learnovate Enterprises** — Soft Skills Training Program, December 2024.

## Portfolio implementation

A cinematic, streaming-inspired portfolio in dark charcoal, emerald green, and metallic silver. The hero introduces the person, the Originals collection introduces the work, and the remaining chapters cover experience, skills, training, education, the resume, and contact details.

- Semantic HTML, responsive CSS, and vanilla JavaScript; no build step or framework runtime.
- Three-slide intro with previous/next controls and keyboard arrows.
- Six featured projects in a native horizontal rail with arrow controls and category filters.
- Project case-study dialogs retain the original architecture flows, quality notes, screenshots, demo instructions, and external links. Native details remain available when JavaScript is disabled.
- Accessible mobile navigation, skip link, visible keyboard focus, native modal focus containment, Escape dismissal, and focus restoration.
- Chapter progress reflects actual viewing. Reduced-motion preferences disable animated effects.
- The previous headshot is restored in the hero and About section in its natural colours. The hero uses the existing optimized 800 × 800 WebP; the About section and social preview use the original PNG. No grayscale or colour tint is applied to the photographs. The certificate and resume are retained.
- A full-viewport Canvas 2D layer adds soft, cached sun rays, underwater shadows, and transient pointer wakes. Content groups bob and sway with small sine/cosine offsets and damped springs; focused controls stay still.
- The floating toolkit contains 12 labeled buttons with pointer capture for dragging, damped boundary rebounds, pairwise collisions, click impulses, keyboard arrows, and local cursor repulsion. Tools return to gently moving equilibrium positions.
- GSAP 3.13.0 loads from cdnjs through a pinned script tag with an integrity hash and drives the render clock. A native animation-frame fallback keeps motion working if the CDN fails. The normal cursor remains available.
- Pause/resume control, live reduced-motion preference handling, hidden-tab suspension, offscreen-body culling, capped pixel density and frame deltas, and bounded wake counts limit motion and rendering work. With motion paused or disabled, tools form a static grid. The content remains accessible without JavaScript.
- Contact opens the visitor’s email app. Resume links support viewing and downloading the existing PDF.
- No opening screen blocks access to the content.

## Run locally

Serve the repository with a static server so the JavaScript modules can load:

```sh
python3 -m http.server 4173
```

Then open `http://localhost:4173/`. The folder can be opened directly in VS Code.

## Content and styling

| Change                                                                  | File                                       |
| ----------------------------------------------------------------------- | ------------------------------------------ |
| Personal details, experience, skills, six projects and case studies     | `index.html`                               |
| Palette, typography, layouts, responsive breakpoints and motion         | `style.css`                                |
| Navigation, intro, filters, project overlays, progress and interactions | `script.js`                                |
| Resume                                                                  | `assets/resume/Rachit_Tripathi_Resume.pdf` |
| Hero portrait                                                           | `assets/images/portrait.webp`              |
| About and social-preview portrait                                       | `assets/images/profile.png`                |
| Light, motion lifecycle, dragging, and tool interaction                 | `liquid-motion.js`                         |
| Time-based springs, boundaries, collisions, and cursor forces           | `liquid-physics.mjs`                       |
| Physics regression tests                                                | `tests/liquid-physics.test.mjs`            |

Run the physics tests with `node --test tests/liquid-physics.test.mjs`.

Keep CSS and JavaScript query versions in `index.html` current when deploying asset changes.

## Validation

See [TESTING.md](TESTING.md) for checks completed on October 19, 2026, including the external demo timeouts. The redesign preserves every distinct external/resume link from the previous site and the original five featured projects, with RailYatra added as the sixth Original. The CodeMore entry records 26 total internship projects and highlights three selected projects. JavaScript syntax, local assets, anchors, ARIA targets, project dialogs, filtering, keyboard behavior, and desktop, tablet, and mobile widths were checked.

## GitHub Pages

The live address remains:

**https://rachit1807.github.io/rachit-tripathi-portfolio/**

Keep the repository’s existing Pages publishing source. Publish the root containing `index.html`, `style.css`, `script.js`, `liquid-motion.js`, `liquid-physics.mjs`, `.nojekyll`, and `assets/`. Relative asset paths work under `/rachit-tripathi-portfolio/`; no Vite base or rewrite rules are needed. No Sites, Render, or Vercel deployment is required for this portfolio.

## Contact

- [Email](mailto:tripathirachit486@gmail.com)
- [LinkedIn](https://www.linkedin.com/in/rachittripathi2509/)
- [GitHub](https://github.com/rachit1807)

© 2026 Rachit Tripathi.
