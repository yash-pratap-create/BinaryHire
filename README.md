# BinaryHire

**BinaryHire** is a modern, full-featured recruitment management platform for managing job openings, candidates, interview pipelines, and hiring analytics.

![BinaryHire](https://img.shields.io/badge/React-19-blue?logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-6-blue?logo=typescript) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss) ![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite)

---

## ✨ Features

- 🔐 **Authentication** — Login with email/password, session persistence, protected routes
- 📊 **Dashboard** — KPI cards, area chart, activity feed, recent candidates table
- 👤 **Candidates CRUD** — Add, edit, delete, view candidates; drag & drop resume upload
- 💼 **Roles CRUD** — Post, edit, close job roles with card view layout
- 🔍 **Search & Pagination** — Debounced search + smart pagination across all list views
- 📈 **Analytics** — 4 chart types: Hiring Funnel (Bar), Trend (Line), Department (Pie), Time-to-Hire (Area)
- 🌙 **Dark Mode** — System preference detection, toggle, localStorage persistence
- 📱 **Responsive** — Mobile hamburger sidebar, responsive tables

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
git clone <repo-url>
cd binaryhire
npm install
```

### Development

Run both the Vite dev server and JSON Server API concurrently:

```bash
# Terminal 1: JSON Server (mock API on port 3001)
node_modules/.bin/json-server.cmd --watch db.json --port 3001

# Terminal 2: Vite dev server
npm run dev:vite
```

Open: [http://localhost:5173](http://localhost:5173)

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@binaryhire.com | admin123 |
| Recruiter | recruiter@binaryhire.com | recruiter123 |

---

## 🏗️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| React 19 + TypeScript | UI framework |
| Vite 8 | Build tool |
| Tailwind CSS 4 | Styling |
| React Router 7 | Routing |
| Context API + useReducer | State management |
| React Hook Form | Form handling |
| Axios | HTTP client |
| Recharts | Charts |
| JSON Server | Mock REST API |
| Lucide React | Icons |

---

## 📁 Project Structure

```
src/
├── types/           TypeScript interfaces
├── context/         AuthContext, ThemeContext
├── hooks/           useSearch, usePagination
├── services/        Axios API services
├── utils/           Helpers (dates, status colors)
├── components/
│   ├── Layout/      Sidebar, Navbar, AppLayout, ProtectedRoute
│   └── UI/          Badge, Button, Modal, Avatar, Pagination, FileUpload, FormFields, Spinner
└── pages/
    ├── Login.tsx
    ├── Dashboard.tsx
    ├── Candidates/  CandidateList, CandidateForm, CandidateDetail
    ├── Roles/       RoleList, RoleForm
    ├── Analytics.tsx
    ├── Profile.tsx
    └── Settings.tsx
```

---

## 🔌 API Endpoints (JSON Server)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /users | List users |
| GET | /candidates | List candidates (supports `?q=` search) |
| POST | /candidates | Create candidate |
| PUT | /candidates/:id | Update candidate |
| PATCH | /candidates/:id | Partial update (e.g., resume) |
| DELETE | /candidates/:id | Delete candidate |
| GET | /roles | List roles |
| POST | /roles | Create role |
| PUT | /roles/:id | Update role |
| DELETE | /roles/:id | Delete role |
| GET | /activity | Recent activity feed |

---

## 📖 Learning Reflection

This project demonstrates:
1. **React Router v7** — Nested routes, lazy loading, protected routes
2. **Context API** — useReducer for auth state, localStorage persistence
3. **Axios** — Interceptors for auth headers and error handling
4. **TypeScript** — Strict typing for all entities, props, and API responses
5. **Tailwind CSS v4** — `@theme` directive, dark mode via class strategy
6. **Recharts** — 4 different chart types with dark mode theming
7. **React Hook Form** — Validation, default values for edit forms

---

## 🎯 Definition of Done

- [x] Authentication works (login/logout, session restore)
- [x] CRUD complete (candidates + roles)
- [x] Dashboard functional with real data
- [x] Responsive layout (mobile sidebar, responsive tables)
- [x] 4 chart types implemented (Analytics page)
- [x] TypeScript compiles without errors (`tsc --noEmit`)
- [x] README complete
