import { useState, useRef, useEffect } from 'react'
import { 
  Box, 
  VStack, 
  HStack, 
  Input, 
  Button, 
  Text, 
  IconButton,
  Heading
} from '@chakra-ui/react'
import { MessageSquare, Send, X, Bot, User } from 'lucide-react'

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your AI financial assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const messageToSend = inputMessage
    setInputMessage('')
    setIsTyping(true)

    try {
      // Call backend API
      const response = await fetch('http://localhost:8080/api/chatbot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend,
          conversationHistory: messages.slice(-6), // Send last 6 messages (3 exchanges) for faster responses
          financialData: getFinancialContext()
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response')
      }

      const botResponse = {
        id: messages.length + 2,
        text: data.message,
        sender: 'bot',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, botResponse])
    } catch (error) {
      console.error('Chat error:', error)
      
      const errorResponse = {
        id: messages.length + 2,
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        sender: 'bot',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsTyping(false)
    }
  }

  const getFinancialContext = () => {
    // This would come from your app's state management or API
    // For now, returning mock data structure that matches Dashboard data
    try {
      // You can access this from props or context in a real implementation
      return {
        totalBalance: 720.00,
        accounts: [
          { name: 'Plaid Checking', subtype: 'checking', balances: { current: 110.00 } },
          { name: 'Plaid Saving', subtype: 'savings', balances: { current: 210.00 } },
          { name: 'Plaid Credit Card', subtype: 'credit card', balances: { current: 410.00 } }
        ],
        recentTransactions: [
          { name: 'Uber', amount: 89.40 },
          { name: 'McDonald\'s', amount: 12.00 },
          { name: 'Starbucks', amount: 4.33 }
        ],
        spendingByCategory: {
          'Transportation': 89.40,
          'Food and Drink': 16.33,
          'Service': 25.00
        }
      }
    } catch (error) {
      return null
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Box
          position="fixed"
          bottom={6}
          right={6}
          zIndex={1000}
        >
          <Button
            size="lg"
            rounded="full"
            bg="cyan.500"
            color="gray.900"
            p={4}
            h="auto"
            w="auto"
            shadow="0 0 30px rgba(6, 182, 212, 0.5)"
            _hover={{ 
              bg: 'cyan.400', 
              transform: 'scale(1.1)',
              shadow: '0 0 40px rgba(6, 182, 212, 0.7)'
            }}
            transition="all 0.3s"
            onClick={() => setIsOpen(true)}
          >
            <HStack gap={2}>
              <MessageSquare size={24} />
              <Text fontWeight="bold" fontSize="md">Ask AI</Text>
            </HStack>
          </Button>
        </Box>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Box
          position="fixed"
          bottom={6}
          right={6}
          w={{ base: '90vw', sm: '400px' }}
          h={{ base: '80vh', sm: '600px' }}
          bg="rgba(15, 23, 42, 0.98)"
          backdropFilter="blur(20px)"
          borderWidth="1px"
          borderColor="rgba(6, 182, 212, 0.3)"
          rounded="2xl"
          shadow="0 0 50px rgba(6, 182, 212, 0.3)"
          zIndex={1000}
          display="flex"
          flexDirection="column"
          overflow="hidden"
        >
          {/* Header */}
          <Box
            p={4}
            borderBottomWidth="1px"
            borderColor="rgba(6, 182, 212, 0.2)"
            bgGradient="linear(to-r, rgba(6, 182, 212, 0.1), rgba(15, 23, 42, 0.8))"
          >
            <HStack justify="space-between">
              <HStack gap={2}>
                <Box
                  p={2}
                  bg="rgba(6, 182, 212, 0.2)"
                  rounded="lg"
                  color="cyan.400"
                >
                  <Bot size={20} />
                </Box>
                <VStack align="start" gap={0}>
                  <Heading size="sm" color="gray.100">AI Financial Assistant</Heading>
                  <Text fontSize="xs" color="gray.500">
                    {isTyping ? 'Typing...' : 'Online'}
                  </Text>
                </VStack>
              </HStack>
              <IconButton
                size="sm"
                variant="ghost"
                color="gray.400"
                _hover={{ bg: 'rgba(239, 68, 68, 0.1)', color: 'red.400' }}
                onClick={() => setIsOpen(false)}
              >
                <X size={20} />
              </IconButton>
            </HStack>
          </Box>

          {/* Messages */}
          <VStack
            flex={1}
            p={4}
            gap={3}
            overflowY="auto"
            align="stretch"
            css={{
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(15, 23, 42, 0.5)',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(6, 182, 212, 0.3)',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: 'rgba(6, 182, 212, 0.5)',
              },
            }}
          >
            {messages.map((message) => (
              <HStack
                key={message.id}
                justify={message.sender === 'user' ? 'flex-end' : 'flex-start'}
                align="flex-start"
                gap={2}
              >
                {message.sender === 'bot' && (
                  <Box
                    p={1.5}
                    bg="rgba(6, 182, 212, 0.2)"
                    rounded="lg"
                    color="cyan.400"
                    flexShrink={0}
                  >
                    <Bot size={16} />
                  </Box>
                )}
                <Box
                  maxW="75%"
                  p={3}
                  bg={message.sender === 'user' 
                    ? 'rgba(6, 182, 212, 0.2)' 
                    : 'rgba(51, 65, 85, 0.5)'
                  }
                  borderWidth="1px"
                  borderColor={message.sender === 'user'
                    ? 'rgba(6, 182, 212, 0.3)'
                    : 'rgba(51, 65, 85, 0.6)'
                  }
                  rounded="xl"
                  roundedTopLeft={message.sender === 'bot' ? 0 : 'xl'}
                  roundedTopRight={message.sender === 'user' ? 0 : 'xl'}
                >
                  <Text color="gray.200" fontSize="sm">
                    {message.text}
                  </Text>
                  <Text color="gray.600" fontSize="2xs" mt={1}>
                    {message.timestamp.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </Text>
                </Box>
                {message.sender === 'user' && (
                  <Box
                    p={1.5}
                    bg="rgba(6, 182, 212, 0.2)"
                    rounded="lg"
                    color="cyan.400"
                    flexShrink={0}
                  >
                    <User size={16} />
                  </Box>
                )}
              </HStack>
            ))}
            {isTyping && (
              <HStack justify="flex-start" align="flex-start" gap={2}>
                <Box
                  p={1.5}
                  bg="rgba(6, 182, 212, 0.2)"
                  rounded="lg"
                  color="cyan.400"
                  flexShrink={0}
                >
                  <Bot size={16} />
                </Box>
                <Box
                  p={3}
                  bg="rgba(51, 65, 85, 0.5)"
                  borderWidth="1px"
                  borderColor="rgba(51, 65, 85, 0.6)"
                  rounded="xl"
                  roundedTopLeft={0}
                >
                  <HStack gap={1}>
                    <Box w={2} h={2} bg="gray.500" rounded="full" animation="pulse 1.4s ease-in-out infinite" />
                    <Box w={2} h={2} bg="gray.500" rounded="full" animation="pulse 1.4s ease-in-out 0.2s infinite" />
                    <Box w={2} h={2} bg="gray.500" rounded="full" animation="pulse 1.4s ease-in-out 0.4s infinite" />
                  </HStack>
                </Box>
              </HStack>
            )}
            <div ref={messagesEndRef} />
          </VStack>

          {/* Input */}
          <Box
            p={4}
            borderTopWidth="1px"
            borderColor="rgba(6, 182, 212, 0.2)"
            bg="rgba(15, 23, 42, 0.8)"
          >
            <HStack gap={2}>
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about your finances..."
                bg="rgba(15, 23, 42, 0.6)"
                borderColor="rgba(51, 65, 85, 0.8)"
                color="gray.100"
                _hover={{ borderColor: 'rgba(6, 182, 212, 0.4)' }}
                _focus={{ 
                  borderColor: 'cyan.500', 
                  boxShadow: '0 0 0 1px rgba(6, 182, 212, 0.5)' 
                }}
                _placeholder={{ color: 'gray.600' }}
                size="md"
              />
              <IconButton
                colorPalette="cyan"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                size="md"
                bg="cyan.500"
                color="gray.900"
                _hover={{ bg: 'cyan.400' }}
                _disabled={{ 
                  opacity: 0.5, 
                  cursor: 'not-allowed',
                  bg: 'cyan.600'
                }}
              >
                <Send size={18} />
              </IconButton>
            </HStack>
          </Box>
        </Box>
      )}
    </>
  )
}

