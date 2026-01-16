const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');
const aiRoutes = require('./routes/ai.routes');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    database: 'connected',
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`
  ✅ Server running on http://localhost:${PORT}
  
  📚 API Endpoints:
  
  Auth:
  - POST   /api/auth/register
  - POST   /api/auth/login
  - GET    /api/auth/me
  
  Tasks:
  - GET    /api/tasks
  - GET    /api/tasks/:id
  - POST   /api/tasks
  - PUT    /api/tasks/:id
  - DELETE /api/tasks/:id
  - GET    /api/tasks/stats/dashboard
  
  AI:
  - POST   /api/ai/suggest-tasks
  - POST   /api/ai/categorize-task
  - POST   /api/ai/break-down-task
  - POST   /api/ai/store-task
  - POST   /api/ai/search-tasks
  
  Health:
  - GET    /health
  `);
});
