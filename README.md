# AI Task Manager

A premium, intelligent task management application built with Next.js 15, Express 5, and local AI integration.

![Task Manager Dashboard](https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=2072&ixlib=rb-4.0.3)

## ✨ Features

- **🤖 AI-Powered**: 
  - **Task Suggestions**: Get intelligent task ideas based on your goals.
  - **Auto-Categorization**: Automatically categorizes tasks (Work, Health, Personal, etc.).
  - **Task Breakdown**: Breaks down complex goals into actionable steps.
- **🎨 Premium UI**: 
  - Modern Glassmorphism design.
  - Smooth animations and transitions.
  - Dark/Light mode support.
- **📊 Analytics Dashboard**: Visualize your productivity with charts and stats.
- **⚡️ Real-time Updates**: Instant state management with Zustand.

## 🛠 Tech Stack

- **Frontend**: Next.js 15, Tailwind CSS 4, Lucide Icons, Shadcn UI
- **Backend**: Express.js 5
- **AI Engine**: Ollama (Llama 3, Mistral) or OpenAI (Optional)
- **Database**: PostgreSQL + Prisma 6
- **Vector DB**: ChromaDB (for semantic search)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- [Ollama](https://ollama.com/) (for local AI features)
- PostgreSQL (e.g. via Docker)

### 1. Install Dependencies

```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

### 2. Configure Environment

**Backend:**
Copy `backend/.env.example` to `backend/.env` and update the values:

```bash
cp backend/.env.example backend/.env
```

Update `DATABASE_URL` and `JWT_SECRET` in `backend/.env`.

**Frontend:**
Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

### 3. Initialize Database

```bash
cd backend
npx prisma generate
npx prisma push # Or npx prisma migrate dev
```

### 4. Start the Application

**Run Backend:**

```bash
cd backend
npm run dev
```

**Run Frontend:**

```bash
# In root directory
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app!

## 💻 Development

### Linting & Formatting

```bash
# Run Linting
npm run lint

# Run Type Checking
npm run type-check
```

### Testing

```bash
# Run Unit Tests
npm test
```

## 📂 Project Structure

```
├── backend/                # Express.js Backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth & Error middleware
│   │   └── services/       # Business logic (AI, etc.)
│   └── prisma/             # Database schema
├── src/                    # Next.js Frontend
│   ├── app/                # App Router pages
│   ├── components/         # UI Components
│   ├── lib/                # Utilities & Hooks
│   └── store/              # Zustand state store
└── tests/                  # Test files
```

## 🧠 AI Setup (Ollama)

1. Download [Ollama](https://ollama.com/).
2. Pull the model used in the backend (e.g., `llama3.2` or `mistral`):
   ```bash
   ollama pull llama3.2:1b
   ```
3. Ensure Ollama is running (`ollama serve`).

## 📄 License

MIT
