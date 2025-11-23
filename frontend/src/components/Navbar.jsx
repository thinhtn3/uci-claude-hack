import { Box, Container, Heading, Button, HStack } from '@chakra-ui/react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, signOut } = useAuth()

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <Box 
      bg="rgba(15, 23, 42, 0.8)" 
      backdropFilter="blur(10px)"
      shadow="sm" 
      position="fixed" 
      top={0}
      left={0}
      right={0}
      zIndex={1000} 
      borderBottom="1px" 
      borderColor="rgba(6, 182, 212, 0.2)"
    >
      <Container maxW="container.xl" py={4}>
        <HStack justify="space-between">
          <Heading 
            size="md" 
            bgGradient="linear(to-r, cyan.400, orange.400)" 
            bgClip="text" 
            fontWeight="bold"
            cursor="pointer"
            onClick={() => navigate('/')}
            _hover={{ bgGradient: "linear(to-r, cyan.300, orange.300)" }}
            color="white"
          >
            AI Financial Advisor
          </Heading>
          <HStack gap={3}>
            {user ? (
              <>
                {location.pathname !== '/' && (
                  <Button 
                    variant="ghost" 
                    color="gray.400" 
                    _hover={{ bg: 'rgba(6, 182, 212, 0.1)', color: 'cyan.300' }} 
                    onClick={() => navigate('/')}
                    p={2}
                    minW="auto"
                  >
                    <Home size={20} />
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  color="gray.400" 
                  _hover={{ bg: 'rgba(6, 182, 212, 0.1)', color: 'cyan.300' }} 
                  onClick={() => navigate('/dashboard')}
                >
                  Dashboard
                </Button>
                <Button 
                  variant="ghost" 
                  color="gray.400" 
                  _hover={{ bg: 'rgba(249, 115, 22, 0.1)', color: 'orange.300' }} 
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                {location.pathname !== '/' && (
                  <Button 
                    variant="ghost" 
                    color="gray.400" 
                    _hover={{ bg: 'rgba(6, 182, 212, 0.1)', color: 'cyan.300' }} 
                    onClick={() => navigate('/')}
                    p={2}
                    minW="auto"
                  >
                    <Home size={20} />
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  color="gray.400" 
                  _hover={{ bg: 'rgba(6, 182, 212, 0.1)', color: 'cyan.300' }} 
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button 
                  bg="rgba(6, 182, 212, 0.15)"
                  color="cyan.300"
                  borderWidth="1px"
                  borderColor="cyan.500"
                  _hover={{ bg: 'rgba(6, 182, 212, 0.25)', borderColor: 'cyan.400' }} 
                  onClick={() => navigate('/register')}
                >
                  Get Started
                </Button>
              </>
            )}
          </HStack>
        </HStack>
      </Container>
    </Box>
  )
}
