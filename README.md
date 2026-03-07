# 💀 RotDash

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Version](https://img.shields.io/badge/version-0.1.0-ff69b4.svg)](./package.json)
[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org)
[![Bun](https://img.shields.io/badge/bun-1.3.10-fbf0df.svg?logo=bun)](https://bun.sh)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Coming%20soon-47a248?logo=mongodb)](https://mongodb.com)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)
[![Maintained](https://img.shields.io/badge/Maintained%3F-yes-green.svg)]()
[![macOS](https://img.shields.io/badge/macOS-supported-999999?logo=apple)](https://apple.com)
[![Linux](https://img.shields.io/badge/Linux-supported-fcc624?logo=linux)](https://linux.org)
[![Windows](https://img.shields.io/badge/Windows-supported-0078d6?logo=windows)](https://microsoft.com)
[![Code style: ESLint](https://img.shields.io/badge/code%20style-ESLint-4b32c3?logo=eslint)](https://eslint.org)
[![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9D%A4%EF%B8%8F-red.svg)]()
[![Indie Hacker](https://img.shields.io/badge/Indie-Hacker-orange.svg)]()
[![Rot Score](https://img.shields.io/badge/Rot%20Score-Track%20it-8b4513.svg)]()

> See which of your projects are alive — and which are rotting.

RotDash is a brutally honest dashboard that tracks how inactive your projects have become. If you haven't touched something in 60 days, it's probably already dead.

---

## What problem does it solve?

Many developers have dozens of unfinished side projects, MVPs abandoned after a weekend, and repos forgotten for months. RotDash answers one question:

**Which of my projects are silently rotting?**

RotDash is **not** a project manager. It's a **project decay detector**. No Jira, no Linear, no Notion — just honest visibility into what's dying on your hard drive.

---

## Features

- **Project tracking** — Add projects with status (idea / mvp / shipped), tags, and links
- **Rot score** — Days since last activity. The higher, the deader.
- **Activity status** — Hot → Warm → Stale → Cold → Glacier (mapped from your last update)
- **Task management** — Track tasks per project; completion feeds the activity graph
- **Activity graph** — Tasks completed per day over the last 30 days
- **Dashboard** — Summary metrics, project grid sorted by rot score, filters (status, activity, tags, search)
- **Soft deletes** — Nothing is permanently deleted; recover if you change your mind

---

## Tech stack

- **Frontend:** Next.js (App Router), React, TailwindCSS, ShadCN UI, Recharts
- **Backend:** Next.js API routes
- **Database:** MongoDB
- **Dev:** Docker Compose (local MongoDB)
- **Deploy:** Vercel + MongoDB Atlas

---

## Getting started

### Prerequisites

- Node.js 18+
- [Bun](https://bun.sh) 1.3.10 (see `.bumrc`)
- Docker & Docker Compose (for local MongoDB and production image)

### Development

```bash
# Install dependencies
bun install

# Run the dev server
bun dev
```

Open [http://localhost:3000](http://localhost:3000).

### Docker

Build and run the production image (uses Bun 1.3.10 from `.bumrc`):

```bash
# Build
docker build -t rotdash .

# Run
docker run -p 3000:3000 rotdash
```

For local MongoDB:

```bash
docker compose -f aux/docker-compose.yaml up -d
```

> **Note:** MongoDB integration is in progress. Once connected, run `docker compose -f aux/docker-compose.yaml up -d` before starting the app.

---

## Why open source?

RotDash is built for indie hackers and solo builders who live with too many side projects. Open sourcing it means:

- **Transparency** — You can see exactly what's being tracked and how
- **Self-hosting** — Run it locally or on your own infra, no vendor lock-in
- **Community** — Others can extend it, report rot in their own projects, and contribute back
- **Indie spirit** — Built by someone in the same boat; shared with the same community

---

## Next steps (roadmap)

- [ ] MongoDB schema + connection setup
- [ ] Project CRUD API endpoints
- [ ] Task CRUD API endpoints
- [ ] ShadCN UI + Recharts integration
- [ ] Dashboard page (summary, activity graph, project grid)
- [ ] Project modal with inline editing
- [ ] Filtering and pagination
- [ ] Docker Compose for local MongoDB
- [ ] Rot score recalculation logic
- [ ] Deploy to Vercel + MongoDB Atlas

---

## License

RotDash is licensed under the [GNU Affero General Public License v3.0](LICENSE) (AGPL-3.0).
