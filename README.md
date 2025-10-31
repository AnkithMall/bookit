# BookIt — Full Stack Booking Application

A full-stack booking app with a React + TypeScript + Tailwind frontend and a NestJS + TypeORM backend. It features experiences listing, details with available slots, checkout with promo validation, bookings, and clean developer ergonomics (seeding, Swagger docs, tests and coverage).

- Frontend: React, Vite, TypeScript, TailwindCSS
- Backend: NestJS 11, TypeORM, SQLite/PostgreSQL, Swagger
- Testing: Jest unit tests (services + controllers) and E2E (Supertest)

Deployed App: [Frontend URL](https://bookit-eight-theta.vercel.app/)

Backend API: [Backend Base URL](https://bookit-backend-bay.vercel.app/)

Swagger Docs: [Backend /docs](https://bookit-backend-bay.vercel.app/docs)

---

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm

### Clone and install
```bash
# clone
 git clone https://github.com/<you>/bookit.git
 cd bookit

# install deps
 pnpm install --filter frontend
 pnpm install --filter my-backend
```

### Run locally
```bash
# backend (in another terminal)
 pnpm --filter my-backend run start:dev
# frontend
 pnpm --filter frontend run dev
```

### Environment
- Frontend `.env.development` (example in `frontend/.env.example`)
  - VITE_API_BASE_URL=http://localhost:3000
- Backend `.env` (optional)
  - PORT=3000
  - DATABASE_URL=postgres://user:pass@host:port/db  # if omitted, SQLite file is used
  - TYPEORM_LOGGING=true|false  # default false

---

## Features
- List experiences with images and prices (₹)
- Details page with slot selection and booking CTA
- Checkout page with promo code validation (percent/flat) and order summary
- Loading spinners and disabled button states during async actions
- Mobile-responsive layout
- Backend auto-seeding for demo data (experiences, slots, promos)
- Swagger docs at `/docs`

---

## Architecture

### High-level
```mermaid
flowchart LR
  FE[Frontend (React/Vite)] -->|HTTP/JSON| BE[NestJS Backend]
  BE -->|TypeORM| DB[(SQLite / PostgreSQL)]
  Devs[[Developers]] --> FE & BE
```

### Backend modules
```mermaid
flowchart LR
  A[AppModule]
  A --> E[ExperiencesModule]
  A --> S[SlotsModule]
  A --> B[BookingsModule]
  A --> P[PromoModule]
  E --> E1[ExperiencesController]
  E --> E2[ExperiencesService]
  S --> S1[SlotsController]
  S --> S2[SlotsService]
  B --> B1[BookingsController]
  B --> B2[BookingsService]
  P --> P1[PromoController]
  P --> P2[PromoService]
```

### Data Model (ERD)
```mermaid
erDiagram
  EXPERIENCES ||--o{ SLOTS : has
  SLOTS ||--o{ BOOKINGS : has

  EXPERIENCES {
    int id PK
    string name
    string location
    string description
    float price
    string image
    string about
    int capacity
  }

  SLOTS {
    int id PK
    string start_time
    string end_time
    boolean is_booked
    int capacity
    int experience_id FK
  }

  BOOKINGS {
    int id PK
    string user_name
    string user_email
    int slot_id FK
  }
```

---

## Workflow
1. User opens the FE, loads experiences from BE.
2. On Details, user selects a slot and proceeds to Checkout.
3. On Checkout, user can apply a promo code; BE validates eligibility and returns discount.
4. User confirms booking; BE enforces slot and experience capacity and creates the booking.
5. Success page shown.

---

## Backend
- NestJS 11 + TypeORM
- DB config:
  - SQLite by default for local (`sql_app.db`)
  - If `DATABASE_URL` is present and reachable, use Postgres.
  - `synchronize` is disabled in production (enable only for dev).
- Seeding: auto-inserts sample data on startup when tables are empty.
- Validation: Global `ValidationPipe` with class-validator DTOs.
- Swagger: `/docs`

### Run
```bash
pnpm --filter my-backend run start:dev
```

### Tests & Coverage
```bash
pnpm --filter my-backend run test       # unit
pnpm --filter my-backend run test:e2e   # e2e
pnpm --filter my-backend run test:cov   # coverage (text + HTML + lcov)
```
Coverage HTML: `my-backend/coverage/lcov-report/index.html`

Recent snapshot: Statements ~57.7%, Branches ~66.4%, Functions ~66.0%, Lines ~57.6%

---

## Frontend
- React + Vite + TS + Tailwind
- Shared `Button` component with improved hover/disabled UX
- Central `Spinner` component for page and in-button loading
- INR currency display (₹)

### Run
```bash
pnpm --filter frontend run dev
```

---

## Deployment
- Frontend: [TBD — Deployed Frontend URL]
- Backend: [TBD — Deployed Backend Base URL]
- Swagger: [TBD — Deployed Swagger Docs URL]

> Add env vars for production builds accordingly. For backend, use migrations in production and disable `synchronize`.

---

## Contributing
- Conventional commits are encouraged.
- Run tests and lint before pushing.

---

## License
UNLICENSED (adjust as needed).
