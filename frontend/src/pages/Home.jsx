import { Box, Container, Heading, Text, Button, VStack, HStack, SimpleGrid, Icon } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Brain, TrendingUp, Receipt, MessageSquare, Shield, Zap } from 'lucide-react'
import { Navbar } from '../components'

const MotionBox = motion.create(Box)

export default function Home() {
  const navigate = useNavigate()

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Get personalized financial advice powered by Claude AI'
    },
    {
      icon: TrendingUp,
      title: 'Smart Analytics',
      description: 'Visualize your spending patterns and trends'
    },
    {
      icon: Receipt,
      title: 'Receipt Scanning',
      description: 'Upload receipts and extract data automatically'
    },
    {
      icon: MessageSquare,
      title: 'AI Chat Assistant',
      description: 'Ask questions about your finances anytime'
    },
    {
      icon: Shield,
      title: 'Bank Integration',
      description: 'Securely connect your bank accounts with Plaid'
    },
    {
      icon: Zap,
      title: 'Real-Time Updates',
      description: 'Track your finances in real-time'
    }
  ]

  return (
    <Box minH="100vh" bg="#0a0f1e">
      <Navbar />

      {/* Hero Section */}
      <Box 
        position="relative"
        bg="#0f172a"
        color="white" 
        py={20}
        overflow="hidden"
      >
        {/* Gradient overlay */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgGradient="radial(circle at 30% 50%, rgba(6, 182, 212, 0.15), transparent 50%), radial(circle at 70% 50%, rgba(249, 115, 22, 0.1), transparent 50%)"
          zIndex={0}
        />
        
        <Container maxW="container.xl" position="relative" zIndex={1}>
          <VStack gap={6} textAlign="center" maxW="3xl" mx="auto">
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Heading size="3xl" fontWeight="bold" color="gray.50">
                Take Control of Your Finances with AI
              </Heading>
            </MotionBox>
            
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Text fontSize="xl" color="gray.400">
                Smart insights, automated tracking, and personalized advice 
                powered by Claude AI. Your personal financial advisor, 24/7.
              </Text>
            </MotionBox>

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <HStack gap={4} mt={4}>
                <Button 
                  size="lg" 
                  bg="cyan.500"
                  color="gray.900" 
                  fontWeight="bold"
                  _hover={{ bg: 'cyan.400', transform: 'translateY(-2px)' }}
                  transition="all 0.2s"
                  onClick={() => navigate('/register')}
                >
                  Start Free Trial
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  color="gray.300" 
                  borderColor="gray.600"
                  _hover={{ bg: 'rgba(255, 255, 255, 0.05)', borderColor: 'gray.500', color: 'white' }}
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
              </HStack>
            </MotionBox>
          </VStack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxW="container.xl" py={20}>
        <VStack gap={12}>
          <VStack gap={4} textAlign="center">
            <Heading size="2xl" color="gray.100">Powerful Features</Heading>
            <Text fontSize="lg" color="gray.500" maxW="2xl">
              Everything you need to manage your finances intelligently
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={8} w="full">
            {features.map((feature, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Box
                  bg="rgba(15, 23, 42, 0.6)"
                  backdropFilter="blur(10px)"
                  p={8}
                  rounded="xl"
                  borderWidth="1px"
                  borderColor="rgba(51, 65, 85, 0.6)"
                  _hover={{ 
                    borderColor: 'rgba(6, 182, 212, 0.5)', 
                    bg: 'rgba(15, 23, 42, 0.8)',
                    transform: 'translateY(-4px)',
                    shadow: '0 0 20px rgba(6, 182, 212, 0.2)'
                  }}
                  transition="all 0.3s"
                >
                  <VStack align="start" gap={4}>
                    <Box
                      p={3}
                      bg="rgba(6, 182, 212, 0.1)"
                      borderWidth="1px"
                      borderColor="rgba(6, 182, 212, 0.3)"
                      rounded="lg"
                      color="cyan.400"
                    >
                      <Icon as={feature.icon} boxSize={6} />
                    </Box>
                    <Heading size="md" color="gray.200">{feature.title}</Heading>
                    <Text color="gray.500" fontSize="sm">{feature.description}</Text>
                  </VStack>
                </Box>
              </MotionBox>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>

      {/* CTA Section */}
      <Box 
        position="relative"
        bg="#0f172a"
        color="white" 
        py={16}
        borderTop="1px"
        borderColor="rgba(51, 65, 85, 0.5)"
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgGradient="radial(circle at 50% 50%, rgba(6, 182, 212, 0.1), transparent 70%)"
          zIndex={0}
        />
        
        <Container maxW="container.md" position="relative" zIndex={1}>
          <VStack gap={6} textAlign="center">
            <Heading size="xl" color="gray.100">Ready to Get Started?</Heading>
            <Text fontSize="lg" color="gray.400">
              Join thousands of users already improving their financial health
            </Text>
            <Button 
              size="lg" 
              bg="cyan.500"
              color="gray.900"
              fontWeight="bold"
              _hover={{ bg: 'cyan.400', transform: 'translateY(-2px)' }}
              transition="all 0.2s"
              onClick={() => navigate('/register')}
            >
              Create Your Free Account
            </Button>
          </VStack>
        </Container>
      </Box>

      {/* Footer */}
      <Box bg="#0a0f1e" color="white" py={8} borderTop="1px" borderColor="rgba(51, 65, 85, 0.3)">
        <Container maxW="container.xl">
          <Text textAlign="center" color="gray.600" fontSize="sm">
            © 2025 AI Financial Advisor. All rights reserved.
          </Text>
        </Container>
      </Box>
    </Box>
  )
}
