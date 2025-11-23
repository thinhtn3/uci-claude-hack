const { GoogleGenerativeAI } = require("@google/generative-ai");

class ChatbotService {
  constructor() {
    // Initialize Gemini API
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  }

  async chat(userMessage, conversationHistory = []) {
    try {
      const prompt = `You are a helpful financial advisor. Give brief advice (under 100 words).

User: ${userMessage}`;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      
      console.log('🤖 AI Response:', response);
      
      return {
        success: true,
        message: response
      };
    } catch (error) {
      console.error('Chatbot service error:', error);
      return {
        success: false,
        error: error.message || 'Failed to process message'
      };
    }
  }

  async chatWithContext(userMessage, userFinancialData, conversationHistory = []) {
    try {
      // Build financial context
      let context = "You are a helpful financial advisor. Give brief, actionable advice (under 100 words).\n\n";
      
      if (userFinancialData) {
        context += "User's Financial Data:\n";
        
        if (userFinancialData.totalBalance) {
          context += `- Total Balance: $${userFinancialData.totalBalance}\n`;
        }
        
        if (userFinancialData.accounts && userFinancialData.accounts.length > 0) {
          context += `- Accounts: ${userFinancialData.accounts.length}\n`;
          userFinancialData.accounts.forEach(acc => {
            context += `  • ${acc.name}: $${acc.balances.current}\n`;
          });
        }
        
        if (userFinancialData.recentTransactions && userFinancialData.recentTransactions.length > 0) {
          context += `- Recent Transactions:\n`;
          userFinancialData.recentTransactions.slice(0, 5).forEach(tx => {
            context += `  • ${tx.name}: $${tx.amount}\n`;
          });
        }
        
        if (userFinancialData.spendingByCategory) {
          context += `- Spending by Category:\n`;
          Object.entries(userFinancialData.spendingByCategory).forEach(([cat, amt]) => {
            context += `  • ${cat}: $${amt}\n`;
          });
        }
        
        context += "\n";
      }
      
      // Add conversation history (last 3 exchanges)
      const recentHistory = conversationHistory.slice(-6);
      if (recentHistory.length > 0) {
        context += "Recent Conversation:\n";
        recentHistory.forEach(msg => {
          const role = msg.sender === 'user' ? 'User' : 'Assistant';
          context += `${role}: ${msg.text}\n`;
        });
        context += "\n";
      }
      
      context += `User: ${userMessage}\nAssistant:`;

      const result = await this.model.generateContent(context);
      const response = result.response.text();
      
      console.log('🤖 AI Response (with context):', response);
      
      return {
        success: true,
        message: response
      };
    } catch (error) {
      console.error('Chatbot service error:', error);
      return {
        success: false,
        error: error.message || 'Failed to process message'
      };
    }
  }
}

module.exports = new ChatbotService();