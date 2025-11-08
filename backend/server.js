const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const axios = require('axios');
require('dotenv').config();

const app = express();

// CORS - Allow all for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());



// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ChromaDB base URL
const CHROMA_URL = process.env.CHROMA_URL || 'http://localhost:8000';
const COLLECTION_NAME = 'tasks';

// Initialize ChromaDB collection (HTTP approach)
async function initChroma() {
  try {
    // Create collection if it doesn't exist
    await axios.post(`${CHROMA_URL}/api/v1/collections`, {
      name: COLLECTION_NAME,
      metadata: { description: 'Task embeddings' },
      get_or_create: true,
    });
    console.log('✅ ChromaDB collection ready');
  } catch (error) {
    console.log('⚠️  ChromaDB warning:', error.response?.data || error.message);
    console.log('Continuing without ChromaDB (vector search disabled)');
  }
}

initChroma();

// Helper: Generate embedding
async function getEmbedding(text) {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error('Embedding error:', error);
    return null;
  }
}

// ============================================
// ENDPOINT 1: AI Task Suggestions
// ============================================
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
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'llama3.2:1b',
      prompt: prompt,
      stream: false,
    });

    let aiResponse = response.data.response.trim();
    console.log('🤖 Raw Ollama response:', aiResponse);
    
    // Remove markdown code blocks
    aiResponse = aiResponse
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();
    
    // Extract JSON array
    const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
    
    if (!jsonMatch) {
      console.error('❌ No JSON found');
      return res.json({ 
        tasks: [
          {
            title: `Research about ${context}`,
            description: 'Gather information and resources',
            priority: 'high',
            category: 'work'
          }
        ]
      });
    }
    
    const tasks = JSON.parse(jsonMatch[0]);
    console.log('✅ Parsed tasks:', tasks);
    
    res.json({ tasks });
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({ 
      error: 'Failed to generate tasks',
      details: error.message 
    });
  }
});

// ============================================
// ENDPOINT 2: Break Down Complex Task
// ============================================
app.post('/api/ai/break-down-task', async (req, res) => {
  const { taskTitle } = req.body;

  const prompt = `Break down this complex task into 3-5 smaller, actionable subtasks: "${taskTitle}"

Return ONLY a valid JSON array:
[
  {
    "title": "Subtask title",
    "description": "What to do"
  }
]

Make subtasks specific, ordered logically, and achievable.
Return ONLY the JSON array.`;

  try {
    // Call Ollama
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'llama3.2:1b',
      prompt: prompt,
      stream: false,
    });

    const aiResponse = response.data.response;
    const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
    const subtasks = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    res.json({ subtasks });
  } catch (error) {
    console.error('Ollama Error:', error);
    res.status(500).json({ error: 'Failed to break down task' });
  }
});

// ============================================
// ENDPOINT 3: Auto-Categorize Task
// ============================================
app.post('/api/ai/categorize-task', async (req, res) => {
  const { title, description } = req.body;

  const prompt = `Categorize this task into ONE of these categories: work, personal, health, shopping, other

Task: "${title}"
Description: "${description || 'N/A'}"

Return ONLY the category name in lowercase, nothing else.`;

  try {
    // Call Ollama
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'llama3.2:1b',
      prompt: prompt,
      stream: false,
    });

    const category = response.data.response.trim().toLowerCase();
    const validCategories = ['work', 'personal', 'health', 'shopping', 'other'];
    const finalCategory = validCategories.includes(category) ? category : 'other';

    res.json({ category: finalCategory });
  } catch (error) {
    console.error('Ollama Error:', error);
    res.status(500).json({ error: 'Failed to categorize' });
  }
});

// ============================================
// ENDPOINT 4: Store Task Embedding
// ============================================
app.post('/api/ai/store-task', async (req, res) => {
  const { id, title, description, category, priority } = req.body;

  try {
    const searchText = `${title} ${description || ''} ${category} ${priority}`;
    const embedding = await getEmbedding(searchText);
    
    if (!embedding) throw new Error('Failed to generate embedding');

    // Store in ChromaDB via HTTP
    await axios.post(`${CHROMA_URL}/api/v1/collections/${COLLECTION_NAME}/add`, {
      ids: [id],
      embeddings: [embedding],
      metadatas: [{
        title,
        description: description || '',
        category,
        priority,
      }],
      documents: [searchText],
    });

    res.json({ success: true, message: 'Task stored' });
  } catch (error) {
    console.error('Store Error:', error);
    res.status(500).json({ error: 'Failed to store task' });
  }
});

// ============================================
// ENDPOINT 5: Semantic Search
// ============================================
app.post('/api/ai/search-tasks', async (req, res) => {
  const { query, limit = 5 } = req.body;

  try {
    const queryEmbedding = await getEmbedding(query);
    if (!queryEmbedding) throw new Error('Failed to generate embedding');

    // Query ChromaDB
    const response = await axios.post(
      `${CHROMA_URL}/api/v1/collections/${COLLECTION_NAME}/query`,
      {
        query_embeddings: [queryEmbedding],
        n_results: limit,
      }
    );

    const tasks = response.data.metadatas[0].map((metadata, index) => ({
      id: response.data.ids[0][index],
      ...metadata,
      similarity: response.data.distances[0][index],
    }));

    res.json({ tasks });
  } catch (error) {
    console.error('Search Error:', error);
    res.status(500).json({ error: 'Failed to search' });
  }
});

// ============================================
// Health Check
// ============================================
app.get('/health', async (req, res) => {
  let chromaStatus = false;
  try {
    await axios.get(`${CHROMA_URL}/api/v1/heartbeat`);
    chromaStatus = true;
  } catch (e) {}

  res.json({ 
    status: 'ok', 
    openai: !!process.env.OPENAI_API_KEY,
    chroma: chromaStatus 
  });
});

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`
  ✅ Backend running on http://localhost:${PORT}
  
  Endpoints:
  - POST /api/ai/suggest-tasks
  - POST /api/ai/break-down-task
  - POST /api/ai/categorize-task
  - POST /api/ai/store-task
  - POST /api/ai/search-tasks
  - GET  /health
  `);
});