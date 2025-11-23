const express = require('express');
const chatbotController = require('../controllers/chatbot.controller');

const router = express.Router();

// POST /api/chatbot/chat - Send a message to the chatbot
router.post('/chat', chatbotController.chat);

// GET /api/chatbot/health - Check chatbot health status
router.get('/health', chatbotController.healthCheck);

module.exports = router;

