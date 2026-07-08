# PortfolioOS

A modern, premium Portfolio Content Management System — update your portfolio without touching code.

## Stack

| Layer    | Technologies                                              |
| -------- | --------------------------------------------------------- |
| Frontend | React 19, TypeScript, Vite, PrimeReact, Tailwind, Framer Motion |
| Backend  | Node.js, Express, JWT, Prisma, PostgreSQL                 |
| DevOps   | ESLint, Prettier, Husky, Vercel, Render, Neon              |

## Prerequisites

- **Node.js** 20+
- **npm** 10+
- **PostgreSQL** (local or [Neon](https://neon.tech))

## Quick Start

```bash
# Install all dependencies (root + workspaces)
npm install

# Copy environment templates
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start both servers
npm run dev
```

| Service  | URL                   |
| -------- | --------------------- |
| Frontend | http://localhost:5173 |
| Backend  | http://localhost:5000 |

## Project Structure

```
portfolio-os/
├── frontend/     # Public portfolio + admin dashboard (React)
├── backend/      # REST API (Express + Prisma)
└── package.json  # Monorepo root (npm workspaces)
```

## Scripts

| Command            | Description                    |
| ------------------ | ------------------------------ |
| `npm run dev`      | Run frontend + backend         |
| `npm run build`    | Production build both packages |
| `npm run lint`     | Lint all packages              |
| `npm run format`   | Format with Prettier           |
