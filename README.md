# 🚀 AI Task Manager

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/Express.js-5-black?logo=express)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)](https://prisma.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)

> A premium, intelligent task management application featuring a local AI integration for smart suggestions, semantic task breakdown, and auto-categorization.

![Task Manager Dashboard](https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=2072&ixlib=rb-4.0.3)

---

## ✨ Key Features

*   **🤖 AI-Powered Intelligence**: 
    *   **Smart Suggestions**: Get intelligent task ideas based on your overarching goals.
    *   **Auto-Categorization**: Automatically classifies tasks into domains like Work, Health, and Personal.
    *   **Task Breakdown**: Recursively breaks down complex goals into actionable substeps.
*   **🎨 Premium User Experience**: 
    *   Sleek Modern Glassmorphism design elements.
    *   Smooth layout animations and seamless page transitions.
    *   Native Dark/Light mode support.
*   **📊 Insights & Analytics**: Visualize your productivity over time with interactive charts.
*   **⚡️ Highly Responsive**: Instant state updates and real-time reflections using Zustand.

---

## 🛠 Tech Stack

| Domain | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | [Next.js 15](https://nextjs.org) | App Router, SSR/SSG capabilities |
| **UI/Styling** | [Tailwind CSS 4](https://tailwindcss.com) & [Shadcn UI](https://ui.shadcn.com/) | Atomic styling and unstyled radix components |
| **Backend** | [Express.js 5](https://expressjs.com) | Highly robust Node.js REST API layer |
| **Database** | [PostgreSQL](https://postgresql.org) + [Prisma 6](https://prisma.io) | Relational database handling with type-safe ORM |
| **AI Engine** | [Ollama](https://ollama.com/) | Local LLM inference (Llama 3, Mistral) |
| **Vector Search**| [ChromaDB](https://www.trychroma.com/) | Local vector database for semantic task search |

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

*   **Docker Desktop**
*   **Ollama** (Required for local AI processing)

### One-Click Deploy (Recommended)

You can spin up the entire application (Database, Backend API, and Frontend) with a single command:

```bash
# Clone the repository
git clone <your-repo-url>
cd task-management-app

# Build and start all services using Docker Compose
docker compose up --build -d
```

Your system is now online!
*   **Web Dashboard**: [http://localhost:3000](http://localhost:3000)
*   **API Server**: [http://localhost:3001](http://localhost:3001)

### Manual Setup (For Development)

**1. Clone & Install Dependencies:**

```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

### 2. Environment Configuration

You will need to configure environment variables for both the root (frontend) and backend.

**Backend `.env`:**
```bash
cp backend/.env.example backend/.env
```
Update your `DATABASE_URL` (pointing to your local Postgres) and generate a `JWT_SECRET`.

**Frontend `.env.local`:**
```bash
cp .env.example .env.local
```

### 3. Database Initialization

Navigate into the backend directory and synchronize the Prisma schema:

```bash
cd backend
npx prisma generate
npx prisma db push  # or 'npx prisma migrate dev' if deploying migrations
```

### 4. Running the Application

In separate terminal windows, spin up both servers:

**Backend Engine**
```bash
cd backend
npm run dev
```

**Next.js Frontend**
```bash
# Back in the project root
npm run dev
```

Your frontend is now available at [http://localhost:3000](http://localhost:3000).

---

## 🧠 AI Setup (Ollama)

For the intelligence engine to operate, ensure Ollama is installed and running with the appropriate models:

1. Download [Ollama](https://ollama.com/).
2. Pull the required models:
   ```bash
   ollama pull llama3.2:1b
   ollama pull mistral # if needed
   ```
3. Ensure the daemon is running locally (`ollama serve`).

---

## 📂 Architecture

```
task-management-app/
├── backend/                  # Dedicated Express.js API Server
│   ├── src/
│   │   ├── controllers/      # Route logic handlers
│   │   ├── middleware/       # Authentication, validation, and error traps
│   │   ├── routes/           # Express router definitions
│   │   └── services/         # Core business & AI integration logic
│   └── prisma/               # Schema definitions and migrations
├── src/                      # Next.js Application
│   ├── app/                  # File-system based router (App directory)
│   ├── components/           # React elements (UI, layouts, forms)
│   ├── lib/                  # Utilities, fetchers, and formatting hooks
│   └── store/                # Zustand global state configurations
└── tests/                    # End-to-end and unit testing suites
```

---

## 📝 Scripts & Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` / `npm run type-check` - Code quality checks
- `npm test` - Run Jest test suites
- `npm run test:e2e` - Run Playwright E2E tests

## 🛡 License

This project is licensed under the MIT License.
