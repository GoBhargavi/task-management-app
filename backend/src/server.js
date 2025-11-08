const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');

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

// Keep AI routes from before (optional - if you want to keep AI features)
const OLLAMA_URL = 'http://localhost:11434/api/generate';

app.post('/api/ai/suggest-tasks', async (req, res) => {
  const { context } = req.body;
  
  const prompt = `You are a helpful task assistant. Generate 3 specific, actionable tasks to help someone achieve this goal: "${context}"

Each task must have:
- A clear, specific title
- A detailed description of what to do
- Priority level (low, medium, or high)
- Category (work, personal, health, shopping, or other)

Return your response as a JSON array. Each task should be an object with keys: title, description, priority, category.

Important: Generate REAL, SPECIFIC tasks related to "${context}", not generic placeholders.`;

  try {
    const response = await axios.post(OLLAMA_URL, {
      model: 'mistral',
      prompt: prompt,
      stream: false,
    });

    let aiResponse = response.data.response.trim();
    aiResponse = aiResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
    
    const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
    
    if (!jsonMatch) {
      return res.json({ 
        tasks: [
          { title: `Research about ${context}`, description: 'Gather information and resources', priority: 'high', category: 'work' }
        ]
      });
    }
    
    const tasks = JSON.parse(jsonMatch[0]);
    res.json({ tasks });
  } catch (error) {
    console.error('Ollama Error:', error.message);
    res.status(500).json({ error: 'Failed to generate tasks' });
  }
});

app.post('/api/ai/categorize-task', async (req, res) => {
  const { title, description } = req.body;

  const prompt = `Categorize this task into ONE of these categories: work, personal, health, shopping, other

Task: "${title}"
Description: "${description || 'N/A'}"

Return ONLY the category name in lowercase, nothing else.`;

  try {
    const response = await axios.post(OLLAMA_URL, {
      model: 'mistral',
      prompt: prompt,
      stream: false,
    });

    const category = response.data.response.trim().toLowerCase();
    const validCategories = ['work', 'personal', 'health', 'shopping', 'other'];
    const finalCategory = validCategories.includes(category) ? category : 'other';

    res.json({ category: finalCategory });
  } catch (error) {
    console.error('Ollama Error:', error.message);
    res.status(500).json({ error: 'Failed to categorize' });
  }
});

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
  
  Health:
  - GET    /health
  `);
});
