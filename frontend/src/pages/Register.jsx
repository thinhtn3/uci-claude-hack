import { useState } from 'react'
import { Box, Container, Heading, Text, Button, VStack, Input, HStack, Link } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { UserPlus, Mail, Lock, User } from 'lucide-react'
import { Navbar } from '../components'
import { supabase } from '../lib/supabase'

const MotionBox = motion.create(Box)

export default function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
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

      // Redirect to dashboard or home
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
    <Box minH="100vh" h="100vh" bg="#0a0f1e" display="flex" alignItems="center" py={4}>
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
          {/* Registration Card */}
          <Box
            bg="rgba(15, 23, 42, 0.8)"
            backdropFilter="blur(10px)"
            borderWidth="1px"
            borderColor="rgba(51, 65, 85, 0.6)"
            rounded="xl"
            p={6}
            shadow="0 0 40px rgba(6, 182, 212, 0.1)"
          >
            {/* Icon */}
            <Box
              display="flex"
              justifyContent="center"
              mb={3}
            >
              <Box
                p={2}
                bg="rgba(6, 182, 212, 0.1)"
                borderWidth="1px"
                borderColor="rgba(6, 182, 212, 0.3)"
                rounded="lg"
                color="cyan.400"
              >
                <UserPlus size={24} />
              </Box>
            </Box>

            {/* Header */}
            <VStack gap={1} mb={4} textAlign="center">
              <Heading
                size="lg"
                bgGradient="linear(to-r, cyan.300, orange.300)"
                bgClip="text"
                fontWeight="bold"
              >
                Create Account
              </Heading>
              <Text color="gray.400" fontSize="xs">
                Start your financial journey with AI
              </Text>
            </VStack>

            {/* Error Message */}
            {error && (
              <Box
                bg="rgba(239, 68, 68, 0.1)"
                borderWidth="1px"
                borderColor="red.500"
                rounded="md"
                p={2}
                mb={3}
              >
                <Text color="red.400" fontSize="xs" textAlign="center">
                  {error}
                </Text>
              </Box>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <VStack gap={2.5}>
                {/* Name Field */}
                <Box w="full">
                  <Text color="gray.300" fontSize="xs" mb={1}>
                    Full Name
                  </Text>
                  <Box position="relative">
                    <Input
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      bg="rgba(15, 23, 42, 0.6)"
                      borderColor="rgba(51, 65, 85, 0.8)"
                      color="gray.100"
                      _hover={{ borderColor: 'rgba(6, 182, 212, 0.4)' }}
                      _focus={{ borderColor: 'cyan.500', boxShadow: '0 0 0 1px rgba(6, 182, 212, 0.5)' }}
                      _placeholder={{ color: 'gray.600' }}
                      pl={9}
                      size="md"
                      h="40px"
                    />
                    <Box
                      position="absolute"
                      left={3}
                      top="50%"
                      transform="translateY(-50%)"
                      color="gray.500"
                    >
                      <User size={16} />
                    </Box>
                  </Box>
                </Box>

                {/* Email Field */}
                <Box w="full">
                  <Text color="gray.300" fontSize="xs" mb={1}>
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
                      pl={9}
                      size="md"
                      h="40px"
                    />
                    <Box
                      position="absolute"
                      left={3}
                      top="50%"
                      transform="translateY(-50%)"
                      color="gray.500"
                    >
                      <Mail size={16} />
                    </Box>
                  </Box>
                </Box>

                {/* Password Field */}
                <Box w="full">
                  <Text color="gray.300" fontSize="xs" mb={1}>
                    Password
                  </Text>
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
                      pl={9}
                      size="md"
                      h="40px"
                    />
                    <Box
                      position="absolute"
                      left={3}
                      top="50%"
                      transform="translateY(-50%)"
                      color="gray.500"
                    >
                      <Lock size={16} />
                    </Box>
                  </Box>
                </Box>

                {/* Confirm Password Field */}
                <Box w="full">
                  <Text color="gray.300" fontSize="xs" mb={1}>
                    Confirm Password
                  </Text>
                  <Box position="relative">
                    <Input
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      bg="rgba(15, 23, 42, 0.6)"
                      borderColor="rgba(51, 65, 85, 0.8)"
                      color="gray.100"
                      _hover={{ borderColor: 'rgba(6, 182, 212, 0.4)' }}
                      _focus={{ borderColor: 'cyan.500', boxShadow: '0 0 0 1px rgba(6, 182, 212, 0.5)' }}
                      _placeholder={{ color: 'gray.600' }}
                      pl={9}
                      size="md"
                      h="40px"
                    />
                    <Box
                      position="absolute"
                      left={3}
                      top="50%"
                      transform="translateY(-50%)"
                      color="gray.500"
                    >
                      <Lock size={16} />
                    </Box>
                  </Box>
                </Box>

                {/* Submit Button */}
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  w="full"
                  size="md"
                  bg="cyan.500"
                  color="gray.900"
                  fontWeight="bold"
                  mt={2}
                  h="40px"
                  isLoading={loading}
                  loadingText="Creating account..."
                  _hover={{ bg: 'cyan.400', transform: 'translateY(-2px)' }}
                  transition="all 0.2s"
                  isDisabled={loading}
                >
                  Create Account
                </Button>
              </VStack>
            </form>

            {/* Divider */}
            <HStack gap={2} my={3}>
              <Box flex={1} h="1px" bg="rgba(51, 65, 85, 0.6)" />
              <Text color="gray.500" fontSize="xs">or</Text>
              <Box flex={1} h="1px" bg="rgba(51, 65, 85, 0.6)" />
            </HStack>

            {/* Sign In Link */}
            <Text textAlign="center" color="gray.400" fontSize="xs">
              Already have an account?{' '}
              <Link
                color="cyan.400"
                fontWeight="semibold"
                _hover={{ color: 'cyan.300', textDecoration: 'underline' }}
                onClick={() => navigate('/login')}
              >
                Sign in
              </Link>
            </Text>
          </Box>

          {/* Terms */}
          <Text textAlign="center" color="gray.600" fontSize="2xs" mt={3}>
            By creating an account, you agree to our{' '}
            <Link color="gray.500" _hover={{ color: 'gray.400' }}>
              Terms
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
