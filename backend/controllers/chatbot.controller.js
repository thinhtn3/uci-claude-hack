const chatbotService = require('../services/chatbot.service');

class ChatbotController {
  async chat(req, res) {
    try {
      const { message, conversationHistory, financialData } = req.body;

      if (!message || !message.trim()) {
        return res.status(400).json({ 
          error: 'Message is required' 
        });
      }

      console.log('📨 User Message:', message);

      // Call chatbot service with or without financial context
      let result;
      if (financialData) {
        result = await chatbotService.chatWithContext(
          message,
          financialData,
          conversationHistory || []
        );
      } else {
        result = await chatbotService.chat(
          message,
          conversationHistory || []
        );
      }

      if (!result.success) {
        return res.status(500).json({ 
          error: result.error 
        });
      }

      return res.status(200).json({ 
        message: result.message,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Chatbot controller error:', error);
      return res.status(500).json({ 
        error: 'Failed to process chat message' 
      });
    }
  }

  async healthCheck(req, res) {
    try {
      const isConfigured = !!process.env.GEMINI_API_KEY;
      
      return res.status(200).json({ 
        status: 'online',
        configured: isConfigured,
        model: 'gemini-pro'
      });
    } catch (error) {
      console.error('Health check error:', error);
      return res.status(500).json({ 
        error: 'Health check failed' 
      });
    }
  }
}

module.exports = new ChatbotController();

