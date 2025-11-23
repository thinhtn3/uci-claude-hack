const { GoogleGenerativeAI } = require("@google/generative-ai");

class ChatbotService {
  constructor() {
    // Initialize Gemini API
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  }

  parseJsonResponse(text) {
    try {
      // Remove markdown code blocks if present
      let cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      return JSON.parse(cleaned);
    } catch (error) {
      console.error('Failed to parse JSON, returning default structure');
      return {
        message: text,
        insights: [
          "Track all expenses for the rest of the month",
          "Set daily spending limits based on remaining budget",
          "Reduce non-essential purchases until month end"
        ]
      };
    }
  }

  async chat(userMessage, conversationHistory = []) {
    try {
      const prompt = `You are a helpful financial advisor. Respond in JSON format with both a conversational message and actionable insights.

User: ${userMessage}

Respond with this exact JSON structure:
{
  "message": "Your brief conversational response (under 100 words)",
  "insights": [
    "Actionable insight 1",
    "Actionable insight 2",
    "Actionable insight 3"
  ]
}

Provide 3-6 specific, actionable insights for budgeting better for the rest of the month.`;

      const result = await this.model.generateContent(prompt);
      const responseText = result.response.text();
      const parsed = this.parseJsonResponse(responseText);
      
      console.log('🤖 AI Response:', parsed.message);
      console.log('💡 Insights:', parsed.insights);
      
      return {
        success: true,
        message: parsed.message,
        insights: parsed.insights
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
      let context = "You are a helpful financial advisor. Analyze the user's financial data and respond in JSON format.\n\n";
      
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
      
      context += `User: ${userMessage}\n\n`;
      context += `Respond with this exact JSON structure:
{
  "message": "Your brief conversational response (under 100 words)",
  "insights": [
    "Specific actionable insight 1 based on their spending data",
    "Specific actionable insight 2 for this month",
    "Specific actionable insight 3 to reduce costs",
    "Additional insights as needed (3-6 total)"
  ]
}

Base your insights on their actual financial data. Be specific and actionable for the rest of this month.`;

      const result = await this.model.generateContent(context);
      const responseText = result.response.text();
      const parsed = this.parseJsonResponse(responseText);
      
      console.log('🤖 AI Response (with context):', parsed.message);
      console.log('💡 Insights:', parsed.insights);
      
      return {
        success: true,
        message: parsed.message,
        insights: parsed.insights
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