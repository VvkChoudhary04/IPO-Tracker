# IPOTrack

> Automated Indian IPO allotment tracking platform with multi-applicant PAN management, registrar monitoring, and instant email alerts.

---

## 📌 Architecture Overview

IPOTrack is architected as a TypeScript monorepo using standard **npm workspaces**:

```
IPOTrack/
├── apps/
│   ├── web/                    # React + Vite + TypeScript + Tailwind CSS (Fintech UI)
│   └── api/                    # Node.js + Express + TypeScript (API Engine & Cron)
├── packages/
│   └── shared/                 # Shared TypeScript models, enums & registrar metadata
├── tsconfig.base.json          # Base TypeScript compiler settings
├── README.md
└── package.json                # Monorepo orchestrator with workspace scripts
```

### Technology Stack
- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, React Router v6, Lucide Icons.
- **Backend**: Node.js, Express, TypeScript, tsx.
- **Planned Database & Queue**: Supabase (PostgreSQL), Prisma ORM, BullMQ + Redis.
- **Notifications**: Resend for transactional email notifications.
- **Registrars Covered**: Link Intime, KFintech, Bigshare, Cameo, Skyline, Purva.

---

## 🛡️ Security & Integrity Principles

1. **Strict PAN Protection**: Permanent Account Numbers (PANs) are masked in all frontend views (`ABCDE****F`) and will be AES-256 encrypted at rest.
2. **No Mock Allotments**: Real allotment results are only confirmed when fetched directly and legitimately from official registrar endpoints.
3. **No CAPTCHA / Restriction Bypasses**: Adheres to documented, sanctioned registrar query flows without evading security controls.
4. **Safe CORS Policy**: API strictly controls Cross-Origin Resource Sharing with whitelisted origins and credential checks.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v20 or newer (tested on Node v26)
- **npm**: v10 or newer

### 2. Install Dependencies
Run from the root directory:
```bash
npm install
```

### 3. Environment Configuration

#### API (`apps/api/.env`):
```env
PORT=4000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
API_PREFIX=/api
```

#### Web (`apps/web/.env`):
```env
VITE_API_URL=http://localhost:4000/api
```

---

## 💻 Running the Applications

### Run Both Simultaneously (Concurrently)
```bash
npm run dev
```

### Or Run Individually:
- **API Server** (`http://localhost:4000`):
  ```bash
  npm run dev:api
  ```
  Health Check: `http://localhost:4000/health` (or `/api/health`)

- **Web Frontend** (`http://localhost:5173`):
  ```bash
  npm run dev:web
  ```

### Build & Typecheck
```bash
# Typecheck all packages and apps
npm run typecheck

# Build all applications
npm run build
```

---

## 🗺️ Roadmap & Increments

- [x] **Phase 1**: Monorepo setup, shared package, Express health-check API, React Vite fintech shell.
- [ ] **Phase 2**: Supabase PostgreSQL configuration & Prisma ORM schemas (Users, Applicants, Applications, IPOs, AllotmentLogs).
- [ ] **Phase 3**: PAN encryption service (AES-256) and applicant profile management API.
- [ ] **Phase 4**: Official registrar fetchers (Link Intime, KFintech, Bigshare) and parser pipeline.
- [ ] **Phase 5**: BullMQ + Redis scheduled workers for automated polling during allotment windows.
- [ ] **Phase 6**: Resend email notification templates on allotment confirmation.

