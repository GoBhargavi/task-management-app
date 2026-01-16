# AI Task Manager

A premium, intelligent task management application built with Next.js, Express, and local AI integration.

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

- **Frontend**: Next.js 14, Tailwind CSS, Lucide Icons, Shadcn UI
- **Backend**: Express.js
- **AI Engine**: Ollama (Llama 3, Mistral) or OpenAI (Optional)
- **Database**: PostgreSQL + Prisma (or Local State for demo)
- **Vector DB**: ChromaDB (for semantic search)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- [Ollama](https://ollama.com/) (for local AI features)

### 1. Install Dependencies

```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

### 2. Configure Environment

Create a `.env` file in `backend/`:

```env
PORT=3001
# OpenAI Key (Optional if using Ollama)
OPENAI_API_KEY=your_key_here
# Database (Optional for demo)
DATABASE_URL="postgresql://user:password@localhost:5432/taskdb"
```

### 3. Start the Application

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

## 🧠 AI Setup (Ollama)

1. Download [Ollama](https://ollama.com/).
2. Pull the model used in the backend (e.g., `llama3.2` or `mistral`):
   ```bash
   ollama pull llama3.2:1b
   ```
3. Ensure Ollama is running (`ollama serve`).

## 📄 License

MIT
