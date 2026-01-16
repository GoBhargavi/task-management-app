const axios = require('axios');

// Initialize OpenAI only if API key is present (optional for embedding features)
let openai = null;
if (process.env.OPENAI_API_KEY) {
    const OpenAI = require('openai');
    openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });
    console.log('✅ OpenAI initialized for embeddings');
} else {
    console.log('⚠️  OpenAI API key not set - embedding features disabled');
}

// ChromaDB base URL
const CHROMA_URL = process.env.CHROMA_URL || 'http://localhost:8000';
const COLLECTION_NAME = 'tasks';
const OLLAMA_URL = 'http://localhost:11434/api/generate';

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

// Controller Methods

// 1. Suggest Tasks (Ollama)
exports.suggestTasks = async (req, res) => {
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
            model: 'llama3.2:1b',
            prompt: prompt,
            stream: false,
        });

        let aiResponse = response.data.response.trim();

        // Remove markdown code blocks
        aiResponse = aiResponse
            .replace(/```json/gi, '')
            .replace(/```/g, '')
            .trim();

        // Extract JSON array
        const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);

        if (!jsonMatch) {
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
        res.json({ tasks });
    } catch (error) {
        console.error('❌ Suggestion Error:', error.message);
        res.status(500).json({
            error: 'Failed to generate tasks',
            details: error.message
        });
    }
};

// 2. Break Down Task (Ollama)
exports.breakDownTask = async (req, res) => {
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
        const response = await axios.post(OLLAMA_URL, {
            model: 'llama3.2:1b',
            prompt: prompt,
            stream: false,
        });

        const aiResponse = response.data.response;
        const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
        const subtasks = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

        res.json({ subtasks });
    } catch (error) {
        console.error('Breakdown Error:', error.message);
        res.status(500).json({ error: 'Failed to break down task' });
    }
};

// 3. Categorize Task (Ollama)
exports.categorizeTask = async (req, res) => {
    const { title, description } = req.body;

    const prompt = `Categorize this task into ONE of these categories: work, personal, health, shopping, other

Task: "${title}"
Description: "${description || 'N/A'}"

Return ONLY the category name in lowercase, nothing else.`;

    try {
        const response = await axios.post(OLLAMA_URL, {
            model: 'llama3.2:1b',
            prompt: prompt,
            stream: false,
        });

        const category = response.data.response.trim().toLowerCase();
        const validCategories = ['work', 'personal', 'health', 'shopping', 'other'];
        const finalCategory = validCategories.includes(category) ? category : 'other';

        res.json({ category: finalCategory });
    } catch (error) {
        console.error('Categorize Error:', error.message);
        res.status(500).json({ error: 'Failed to categorize' });
    }
};

// 4. Store Task Embedding (ChromaDB + OpenAI)
exports.storeTaskEmbedding = async (req, res) => {
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
        console.error('Store Embedding Error:', error.message);
        // Don't fail the whole request if embedding fails, just log it
        // But since this is a dedicated endpoint, we return 500
        res.status(500).json({ error: 'Failed to store task embedding' });
    }
};

// 5. Search Tasks (ChromaDB + OpenAI)
exports.searchTasks = async (req, res) => {
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
        console.error('Search Error:', error.message);
        res.status(500).json({ error: 'Failed to search' });
    }
};
