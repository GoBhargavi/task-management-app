const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');

// AI Features
router.post('/suggest-tasks', aiController.suggestTasks);
router.post('/break-down-task', aiController.breakDownTask);
router.post('/categorize-task', aiController.categorizeTask);
router.post('/store-task', aiController.storeTaskEmbedding);
router.post('/search-tasks', aiController.searchTasks);

module.exports = router;
