import { useState, useEffect } from 'react'
import { Box, Container, Heading, Text, Button, VStack, HStack } from '@chakra-ui/react'
import { Building2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../components'
import { useAuth } from '../contexts/AuthContext'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const [connectingBank, setConnectingBank] = useState(false)

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/')
    }
  }, [user, loading, navigate])

  const handleConnectBank = async () => {
    setConnectingBank(true)
    try {
      // TODO: Implement Plaid Link integration
      const token = localStorage.getItem('access_token')
      
      // For now, just show alert
      // In production, this would:
      // 1. Request link_token from backend
      // 2. Open Plaid Link UI
      // 3. Exchange public_token for access_token
      // 4. Store bank connection in Supabase
      
      alert('Plaid bank connection will be implemented here. This will open the Plaid Link UI to securely connect your bank account.')
    } catch (error) {
      console.error('Error connecting bank:', error)
      alert('Failed to connect bank. Please try again.')
    } finally {
      setConnectingBank(false)
    }
  }

  // Show loading state while checking authentication
  if (loading) {
    return (
      <Box minH="100vh" bg="#0a0f1e" display="flex" alignItems="center" justifyContent="center">
        <Text color="cyan.400" fontSize="lg">Loading...</Text>
      </Box>
    )
  }

  // Don't render dashboard if not authenticated (will redirect)
  if (!user) {
    return null
  }

  return (
    <Box minH="100vh" bg="#0a0f1e">
      <Navbar />
      
      {/* Background gradient */}
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient="radial(circle at 20% 20%, rgba(6, 182, 212, 0.05), transparent 50%)"
        zIndex={0}
      />

      <Container maxW="container.xl" position="relative" zIndex={1} pt={24} pb={12}>
        {/* Bank Connection Call to Action */}
        <Box
          bg="rgba(15, 23, 42, 0.8)"
          backdropFilter="blur(10px)"
          p={12}
          rounded="xl"
          borderWidth="2px"
          borderColor="rgba(6, 182, 212, 0.3)"
          textAlign="center"
        >
          <VStack gap={6}>
            <Box
              p={5}
              bg="rgba(6, 182, 212, 0.1)"
              borderWidth="1px"
              borderColor="rgba(6, 182, 212, 0.3)"
              rounded="xl"
              color="cyan.400"
            >
              <Building2 size={64} />
            </Box>
            <Heading size="xl" color="gray.100">
              Connect Your Bank Account
            </Heading>
            <Text color="gray.400" maxW="lg" fontSize="lg">
              Securely link your bank account with Plaid to automatically track transactions, 
              get AI-powered insights, and manage your finances intelligently.
            </Text>
            <HStack gap={4} mt={4}>
              <Button
                bg="cyan.500"
                color="gray.900"
                size="lg"
                fontWeight="bold"
                leftIcon={<Building2 size={20} />}
                isLoading={connectingBank}
                loadingText="Connecting..."
                _hover={{ bg: 'cyan.400', transform: 'translateY(-2px)' }}
                transition="all 0.2s"
                onClick={handleConnectBank}
                shadow="0 0 20px rgba(6, 182, 212, 0.3)"
                px={8}
              >
                Connect with Plaid
              </Button>
              <Button
                variant="outline"
                color="gray.400"
                borderColor="gray.600"
                size="lg"
                _hover={{ borderColor: 'gray.500', color: 'gray.300' }}
                onClick={() => window.open('https://plaid.com/how-we-handle-data/', '_blank')}
              >
                Learn about security
              </Button>
            </HStack>
            <Text color="gray.600" fontSize="sm" mt={4}>
              🔒 Your data is encrypted and secure. Plaid never stores your bank credentials.
            </Text>
          </VStack>
        </Box>
      </Container>
    </Box>
  )
}
