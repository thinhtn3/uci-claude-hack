import { useState } from 'react'
import { Box, Container, Heading, Text, Button, VStack, Input, HStack, Link } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { LogIn, Mail, Lock } from 'lucide-react'
import { Navbar } from '../components'
import { supabase } from '../lib/supabase'

const MotionBox = motion.create(Box)

export default function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Set the session in Supabase client so AuthContext can track it
      if (data.session?.access_token && data.session?.refresh_token) {
        const { error } = await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token
        })

        if (error) {
          throw new Error('Failed to set session: ' + error.message)
        }
      }

      // Redirect to dashboard
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <Box minH="100vh" bg="#0a0f1e" display="flex" alignItems="center" py={12}>
      <Navbar />
      
      {/* Background gradient effect */}
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient="radial(circle at 20% 30%, rgba(6, 182, 212, 0.1), transparent 50%), radial(circle at 80% 70%, rgba(249, 115, 22, 0.08), transparent 50%)"
        zIndex={0}
      />

      <Container maxW="md" position="relative" zIndex={1}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Login Card */}
          <Box
            bg="rgba(15, 23, 42, 0.8)"
            backdropFilter="blur(10px)"
            borderWidth="1px"
            borderColor="rgba(51, 65, 85, 0.6)"
            rounded="2xl"
            p={8}
            shadow="0 0 40px rgba(6, 182, 212, 0.1)"
          >
            {/* Icon */}
            <Box
              display="flex"
              justifyContent="center"
              mb={6}
            >
              <Box
                p={4}
                bg="rgba(6, 182, 212, 0.1)"
                borderWidth="1px"
                borderColor="rgba(6, 182, 212, 0.3)"
                rounded="xl"
                color="cyan.400"
              >
                <LogIn size={32} />
              </Box>
            </Box>

            {/* Header */}
            <VStack gap={2} mb={8} textAlign="center">
              <Heading
                size="xl"
                bgGradient="linear(to-r, cyan.300, orange.300)"
                bgClip="text"
                fontWeight="bold"
              >
                Welcome Back
              </Heading>
              <Text color="gray.400" fontSize="sm">
                Sign in to continue to your account
              </Text>
            </VStack>

            {/* Error Message */}
            {error && (
              <Box
                bg="rgba(239, 68, 68, 0.1)"
                borderWidth="1px"
                borderColor="red.500"
                rounded="md"
                p={3}
                mb={4}
              >
                <Text color="red.400" fontSize="sm" textAlign="center">
                  {error}
                </Text>
              </Box>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <VStack gap={4}>
                {/* Email Field */}
                <Box w="full">
                  <Text color="gray.300" fontSize="sm" mb={2}>
                    Email Address
                  </Text>
                  <Box position="relative">
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      bg="rgba(15, 23, 42, 0.6)"
                      borderColor="rgba(51, 65, 85, 0.8)"
                      color="gray.100"
                      _hover={{ borderColor: 'rgba(6, 182, 212, 0.4)' }}
                      _focus={{ borderColor: 'cyan.500', boxShadow: '0 0 0 1px rgba(6, 182, 212, 0.5)' }}
                      _placeholder={{ color: 'gray.600' }}
                      pl={10}
                      size="lg"
                    />
                    <Box
                      position="absolute"
                      left={3}
                      top="50%"
                      transform="translateY(-50%)"
                      color="gray.500"
                    >
                      <Mail size={18} />
                    </Box>
                  </Box>
                </Box>

                {/* Password Field */}
                <Box w="full">
                  <HStack justify="space-between" mb={2}>
                    <Text color="gray.300" fontSize="sm">
                      Password
                    </Text>
                    <Link
                      color="cyan.400"
                      fontSize="xs"
                      _hover={{ color: 'cyan.300', textDecoration: 'underline' }}
                    >
                      Forgot password?
                    </Link>
                  </HStack>
                  <Box position="relative">
                    <Input
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      bg="rgba(15, 23, 42, 0.6)"
                      borderColor="rgba(51, 65, 85, 0.8)"
                      color="gray.100"
                      _hover={{ borderColor: 'rgba(6, 182, 212, 0.4)' }}
                      _focus={{ borderColor: 'cyan.500', boxShadow: '0 0 0 1px rgba(6, 182, 212, 0.5)' }}
                      _placeholder={{ color: 'gray.600' }}
                      pl={10}
                      size="lg"
                    />
                    <Box
                      position="absolute"
                      left={3}
                      top="50%"
                      transform="translateY(-50%)"
                      color="gray.500"
                    >
                      <Lock size={18} />
                    </Box>
                  </Box>
                </Box>

                {/* Submit Button */}
                <Button
                  type="submit"
                  w="full"
                  size="lg"
                  bg="cyan.500"
                  color="gray.900"
                  fontWeight="bold"
                  mt={4}
                  isLoading={loading}
                  loadingText="Signing in..."
                  _hover={{ bg: 'cyan.400', transform: 'translateY(-2px)' }}
                  transition="all 0.2s"
                  isDisabled={loading}
                >
                  Sign In
                </Button>
              </VStack>
            </form>

            {/* Divider */}
            <HStack gap={3} my={6}>
              <Box flex={1} h="1px" bg="rgba(51, 65, 85, 0.6)" />
              <Text color="gray.500" fontSize="sm">or</Text>
              <Box flex={1} h="1px" bg="rgba(51, 65, 85, 0.6)" />
            </HStack>

            {/* Sign Up Link */}
            <Text textAlign="center" color="gray.400" fontSize="sm">
              Don't have an account?{' '}
              <Link
                color="cyan.400"
                fontWeight="semibold"
                _hover={{ color: 'cyan.300', textDecoration: 'underline' }}
                onClick={() => navigate('/register')}
              >
                Create account
              </Link>
            </Text>
          </Box>

          {/* Terms */}
          <Text textAlign="center" color="gray.600" fontSize="xs" mt={6}>
            By signing in, you agree to our{' '}
            <Link color="gray.500" _hover={{ color: 'gray.400' }}>
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link color="gray.500" _hover={{ color: 'gray.400' }}>
              Privacy Policy
            </Link>
          </Text>
        </MotionBox>
      </Container>
    </Box>
  )
}
