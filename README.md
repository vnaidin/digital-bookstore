# Digital Bookstore

Full-stack web application for selling books and merchandise. Built with React + NestJS.

## Tech Stack

**Frontend** — React 18, TypeScript, Vite, Mantine UI, Redux Toolkit (RTK Query), React Router v6, i18next (uk/en)

**Backend** — NestJS v11, Prisma v7 (MySQL via `@prisma/adapter-mariadb`), JWT auth, Swagger, Nodemailer

## Project Structure

```
/               → React frontend (Vite)
/server         → NestJS backend
```

## Getting Started

### Prerequisites

- Node.js 22+
- MySQL database

### Frontend

```bash
npm install
npm run dev        # dev server at http://localhost:5173
```

### Backend

```bash
cd server
npm install        # also runs prisma generate via postinstall
npm run dev        # watch mode at http://localhost:3000
```

API docs available at `http://localhost:3000/api/docs` when running.

## Environment Variables

### Frontend (`.env`)

| Variable               | Description                                     |
| ---------------------- | ----------------------------------------------- |
| `VITE_BE_URL`          | Backend base URL (e.g. `http://localhost:3000`) |
| `VITE_LIQ_PAY_PUBLIC`  | LiqPay public key                               |
| `VITE_LIQ_PAY_PRIVATE` | LiqPay private key                              |
| `VITE_BOT_ID`          | Telegram bot ID (order notifications)           |
| `VITE_CHAT_ID`         | Telegram chat ID (order notifications)          |

### Backend (`server/.env`)

| Variable            | Description                   |
| ------------------- | ----------------------------- |
| `DATABASE_URL`      | MySQL connection string       |
| `JWT_SECRET`        | Secret for signing JWT tokens |
| `EMAIL_SENDER`      | SMTP sender address           |
| `EMAIL_SENDER_PASS` | SMTP sender password          |

## Scripts

### Frontend

| Command             | Description           |
| ------------------- | --------------------- |
| `npm run dev`       | Start Vite dev server |
| `npm run build`     | Production build      |
| `npm run lint`      | ESLint                |
| `npm run typecheck` | TypeScript check      |
| `npm test`          | Vitest unit tests     |

### Backend

| Command                   | Description                     |
| ------------------------- | ------------------------------- |
| `npm run dev`             | Start NestJS in watch mode      |
| `npm run build`           | Compile to `dist/`              |
| `npm run lint`            | ESLint                          |
| `npm test`                | Jest unit tests                 |
| `npm run prisma:generate` | Regenerate Prisma client        |
| `npm run prisma:pull`     | Introspect database schema      |
| `npm run prisma:push`     | Push schema changes to database |
| `npm run seed`            | Seed the database               |

## CI

GitHub Actions runs on every push and PR to `main`:

- **Frontend**: lint → typecheck → test
- **Backend**: lint → test (includes `prisma generate` via postinstall)
