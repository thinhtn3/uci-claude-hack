import { useState, useEffect } from 'react'
import { Box, Container, Heading, Text, Button, VStack, HStack, SimpleGrid, Badge } from '@chakra-ui/react'
import { Building2, TrendingUp, TrendingDown, Wallet, CreditCard, Lightbulb, CheckCircle, MessageSquare } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { useAuth } from '../contexts/AuthContext'
import Plot from 'react-plotly.js'
import { loadTransactionData } from '../services/dataService'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const [connectingBank, setConnectingBank] = useState(false)
  const [plaidData, setPlaidData] = useState(null)
  const [dataLoading, setDataLoading] = useState(true)
  const [insights, setInsights] = useState([])
  const [loadingInsights, setLoadingInsights] = useState(false)

  // Load transaction data from CSV
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await loadTransactionData()
        setPlaidData(data)
      } catch (error) {
        console.error('Error loading transaction data:', error)
      } finally {
        setDataLoading(false)
      }
    }
    loadData()
  }, [])

  // Calculate total balance (moved before useEffect to avoid initialization error)
  const totalBalance = plaidData?.accounts?.reduce((sum, account) => {
    return sum + (account.balances.current || 0)
  }, 0) || 0

  // Process transaction data for Sankey diagram
  const getSankeyData = () => {
    if (!plaidData?.transactions) return { nodes: [], links: { source: [], target: [], value: [], color: [] } }
    
    // Categorize transactions
    const categorySpending = {}
    let totalIncome = 0
    
    plaidData.transactions.forEach(tx => {
      if (tx.isExpense) {
        // Expenses
        const category = tx.category?.[0] || 'Other'
        categorySpending[category] = (categorySpending[category] || 0) + tx.amount
      } else {
        // Income
        totalIncome += tx.amount
      }
    })

    // Create nodes
    const nodes = ['Income', 'Available Balance', ...Object.keys(categorySpending)]
    
    // Create links
    const source = []
    const target = []
    const value = []
    const colors = []

    // Income -> Available Balance
    source.push(0) // Income
    target.push(1) // Available Balance
    value.push(totalIncome)
    colors.push('rgba(34, 197, 94, 0.5)') // Green for income

    // Available Balance -> Spending Categories
    Object.entries(categorySpending).forEach(([category, amount], index) => {
      source.push(1) // Available Balance
      target.push(index + 2) // Category nodes start at index 2
      value.push(amount)
      colors.push('rgba(239, 68, 68, 0.4)') // Red for expenses
    })

    return {
      nodes: nodes.map((label, i) => ({
        label,
        color: i === 0 ? '#22c55e' : i === 1 ? '#06b6d4' : '#ef4444'
      })),
      links: {
        source,
        target,
        value,
        color: colors
      }
    }
  }

  const sankeyData = getSankeyData()

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/')
    }
  }, [user, loading, navigate])

  // Fetch insights on dashboard load
  useEffect(() => {
    const fetchInsights = async () => {
      if (!user || loading || !plaidData) return

      setLoadingInsights(true)
      try {
        // Prepare financial data
        const financialData = {
          totalBalance: totalBalance,
          accounts: plaidData.accounts,
          recentTransactions: plaidData.transactions.slice(0, 5),
          spendingByCategory: plaidData.transactions.reduce((acc, tx) => {
            if (tx.amount > 0) {
              const category = tx.category?.[0] || 'Other'
              acc[category] = (acc[category] || 0) + tx.amount
            }
            return acc
          }, {})
        }

        const response = await fetch('http://localhost:8080/api/chatbot/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: 'Analyze my financial situation and provide actionable budgeting insights for the rest of this month.',
            conversationHistory: [],
            financialData: financialData
          })
        })

        const data = await response.json()

        if (response.ok && data.insights && data.insights.length > 0) {
          setInsights(data.insights)
          console.log('💡 Loaded insights:', data.insights)
        }
      } catch (error) {
        console.error('Failed to fetch insights:', error)
      } finally {
        setLoadingInsights(false)
      }
    }

    // Fetch insights after a short delay to let the page load
    const timer = setTimeout(fetchInsights, 500)
    return () => clearTimeout(timer)
  }, [user, loading, plaidData])

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

  // Show loading state while checking authentication or loading data
  if (loading || dataLoading) {
    return (
      <Box minH="100vh" bg="#0a0f1e" display="flex" alignItems="center" justifyContent="center">
        <VStack gap={4}>
          <Text color="cyan.400" fontSize="lg">Loading your financial data...</Text>
          {dataLoading && <Text color="gray.500" fontSize="sm">Parsing transaction history</Text>}
        </VStack>
      </Box>
    )
  }

  // Don't render dashboard if not authenticated (will redirect)
  if (!user || !plaidData) {
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
        <VStack gap={6} align="stretch">
          {/* Welcome Header */}
          <Box>
            <Heading size="xl" color="gray.100" mb={2}>
              Welcome back, {user?.email?.split('@')[0]}
            </Heading>
            <Text color="gray.400">
              Here's your financial overview
            </Text>
          </Box>

          {/* Total Balance Card */}
          <Box
            bg="rgba(15, 23, 42, 0.8)"
            backdropFilter="blur(10px)"
            p={8}
            rounded="xl"
            borderWidth="1px"
            borderColor="rgba(6, 182, 212, 0.3)"
            bgGradient="linear(to-br, rgba(6, 182, 212, 0.1), rgba(15, 23, 42, 0.8))"
          >
            <VStack align="start" gap={2}>
              <HStack gap={2}>
                <Wallet size={20} color="#06b6d4" />
                <Text color="gray.400" fontSize="sm">Total Balance</Text>
              </HStack>
              <Heading size="2xl" color="cyan.300">
                ${totalBalance.toFixed(2)}
              </Heading>
              <Text color="gray.500" fontSize="sm">
                Across {plaidData.accounts.length} accounts
              </Text>
            </VStack>
          </Box>

          {/* Money Flow and Insights - Side by Side */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} gap={6}>
            {/* Money Flow Visualization - Sankey Diagram */}
            <Box>
              <Heading size="md" color="gray.100" mb={4}>
                Money Flow
              </Heading>
              <Box
                bg="rgba(15, 23, 42, 0.8)"
                backdropFilter="blur(10px)"
                p={6}
                rounded="xl"
                borderWidth="1px"
                borderColor="rgba(51, 65, 85, 0.6)"
                overflow="hidden"
              >
                <Plot
                  data={[
                    {
                      type: 'sankey',
                      orientation: 'h',
                      node: {
                        pad: 15,
                        thickness: 20,
                        line: {
                          color: '#334155',
                          width: 2
                        },
                        label: sankeyData.nodes.map(n => n.label),
                        color: sankeyData.nodes.map(n => n.color),
                        customdata: sankeyData.nodes.map(n => n.label),
                        hovertemplate: '%{customdata}<br />$%{value:.2f}<extra></extra>'
                      },
                      link: {
                        source: sankeyData.links.source,
                        target: sankeyData.links.target,
                        value: sankeyData.links.value,
                        color: sankeyData.links.color,
                        hovertemplate: '%{source.label} → %{target.label}<br />$%{value:.2f}<extra></extra>'
                      }
                    }
                  ]}
                  layout={{
                    font: {
                      size: 12,
                      color: '#cbd5e1'
                    },
                    paper_bgcolor: 'rgba(0,0,0,0)',
                    plot_bgcolor: 'rgba(0,0,0,0)',
                    margin: { l: 10, r: 10, t: 10, b: 10 },
                    height: 400
                  }}
                  config={{
                    displayModeBar: false,
                    responsive: true
                  }}
                  style={{ width: '100%' }}
                />
                <Text color="gray.500" fontSize="xs" textAlign="center" mt={2}>
                  Visualizes income flowing to available balance and spending across categories
                </Text>
              </Box>
            </Box>

            {/* AI Insights Box */}
            <Box>
              <HStack justify="space-between" mb={4}>
                <Heading size="md" color="gray.100">
                  AI Insights
                </Heading>
                <HStack gap={1}>
                  <Lightbulb size={18} color="#06b6d4" />
                  <Text color="cyan.400" fontSize="sm" fontWeight="semibold">
                    Powered by AI
                  </Text>
                </HStack>
              </HStack>
              <Box
                bg="rgba(15, 23, 42, 0.8)"
                backdropFilter="blur(10px)"
                p={6}
                rounded="xl"
                borderWidth="1px"
                borderColor="rgba(51, 65, 85, 0.6)"
                h="468px"
                overflowY="auto"
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
                {loadingInsights ? (
                  <VStack align="center" justify="center" h="full" gap={4}>
                    <Box
                      p={4}
                      bg="rgba(6, 182, 212, 0.1)"
                      rounded="full"
                      borderWidth="1px"
                      borderColor="rgba(6, 182, 212, 0.3)"
                    >
                      <Lightbulb size={32} color="#06b6d4" />
                    </Box>
                    <VStack gap={2}>
                      <Text color="gray.300" fontSize="md" fontWeight="semibold">
                        Analyzing your finances...
                      </Text>
                      <Text color="gray.500" fontSize="sm" textAlign="center" maxW="xs">
                        AI is generating personalized insights based on your spending patterns
                      </Text>
                    </VStack>
                  </VStack>
                ) : insights && insights.length > 0 ? (
                  <VStack align="stretch" gap={3}>
                    <Text color="gray.400" fontSize="sm" mb={2}>
                      Actionable tips to improve your budget this month:
                    </Text>
                    {insights.map((insight, index) => (
                      <HStack
                        key={index}
                        align="start"
                        p={3}
                        bg="rgba(6, 182, 212, 0.05)"
                        borderWidth="1px"
                        borderColor="rgba(6, 182, 212, 0.2)"
                        rounded="lg"
                        _hover={{
                          bg: 'rgba(6, 182, 212, 0.1)',
                          borderColor: 'rgba(6, 182, 212, 0.3)',
                        }}
                        transition="all 0.2s"
                      >
                        <Box flexShrink={0} mt={0.5}>
                          <CheckCircle size={16} color="#06b6d4" />
                        </Box>
                        <Text color="gray.200" fontSize="sm" lineHeight="1.6">
                          {insight}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>
                ) : (
                  <VStack align="center" justify="center" h="full" gap={4}>
                    <Box
                      p={4}
                      bg="rgba(6, 182, 212, 0.1)"
                      rounded="full"
                      borderWidth="1px"
                      borderColor="rgba(6, 182, 212, 0.3)"
                    >
                      <Lightbulb size={32} color="#06b6d4" />
                    </Box>
                    <VStack gap={2}>
                      <Text color="gray.300" fontSize="md" fontWeight="semibold">
                        No insights yet
                      </Text>
                      <Text color="gray.500" fontSize="sm" textAlign="center" maxW="xs">
                        Chat with the AI assistant to get personalized budgeting insights based on your financial data
                      </Text>
                    </VStack>
                    <Button
                      size="sm"
                      bg="rgba(6, 182, 212, 0.15)"
                      color="cyan.300"
                      borderWidth="1px"
                      borderColor="cyan.500"
                      _hover={{ bg: 'rgba(6, 182, 212, 0.25)' }}
                      leftIcon={<MessageSquare size={16} />}
                    >
                      Open AI Chat
                    </Button>
                  </VStack>
                )}
              </Box>
            </Box>
          </SimpleGrid>

          {/* Accounts Grid */}
          <Box>
            <Heading size="md" color="gray.100" mb={4}>
              Your Accounts
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
              {plaidData.accounts.map((account) => (
                <Box
                  key={account.account_id}
                  bg="rgba(15, 23, 42, 0.8)"
                  backdropFilter="blur(10px)"
                  p={6}
                  rounded="xl"
                  borderWidth="1px"
                  borderColor="rgba(51, 65, 85, 0.6)"
                  _hover={{ 
                    borderColor: 'rgba(6, 182, 212, 0.5)', 
                    transform: 'translateY(-2px)',
                    shadow: '0 0 20px rgba(6, 182, 212, 0.2)'
                  }}
                  transition="all 0.2s"
                >
                  <VStack align="start" gap={3}>
                    <HStack justify="space-between" w="full">
                      <HStack gap={2}>
                        {account.type === 'credit' ? (
                          <CreditCard size={20} color="#06b6d4" />
                        ) : (
                          <Building2 size={20} color="#06b6d4" />
                        )}
                        <Text color="gray.300" fontSize="sm" fontWeight="semibold">
                          {account.name}
                        </Text>
                      </HStack>
                      <Badge 
                        colorPalette={account.type === 'credit' ? 'orange' : 'cyan'}
                        size="sm"
                      >
                        {account.subtype}
                      </Badge>
                    </HStack>
                    <Text color="gray.500" fontSize="xs">
                      ****{account.mask}
                    </Text>
                    <Box w="full">
                      <Text color="gray.400" fontSize="xs" mb={1}>
                        {account.type === 'credit' ? 'Available Credit' : 'Available Balance'}
                      </Text>
                      <Heading size="lg" color="cyan.300">
                        ${account.balances.available?.toFixed(2)}
                      </Heading>
                      {account.balances.limit && (
                        <Text color="gray.500" fontSize="xs" mt={1}>
                          of ${account.balances.limit.toFixed(2)} limit
                        </Text>
                      )}
                    </Box>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
          </Box>

          {/* Recent Transactions */}
          <Box>
            <HStack justify="space-between" mb={4}>
              <Heading size="md" color="gray.100">
                Recent Transactions
              </Heading>
              <Text color="gray.500" fontSize="sm">
                Last 7 days
              </Text>
            </HStack>
            <Box
              bg="rgba(15, 23, 42, 0.8)"
              backdropFilter="blur(10px)"
              rounded="xl"
              borderWidth="1px"
              borderColor="rgba(51, 65, 85, 0.6)"
              overflow="hidden"
            >
              <VStack gap={0} align="stretch">
                {plaidData.transactions.map((transaction, index) => (
                  <Box
                    key={transaction.transaction_id}
                    p={4}
                    borderBottomWidth={index < plaidData.transactions.length - 1 ? '1px' : '0'}
                    borderColor="rgba(51, 65, 85, 0.6)"
                    _hover={{ bg: 'rgba(6, 182, 212, 0.05)' }}
                    transition="all 0.2s"
                  >
                    <HStack justify="space-between">
                      <HStack gap={3} flex={1}>
                        <Box
                          p={2}
                          bg={transaction.amount < 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'}
                          rounded="lg"
                        >
                          {transaction.amount < 0 ? (
                            <TrendingUp size={18} color="#22c55e" />
                          ) : (
                            <TrendingDown size={18} color="#ef4444" />
                          )}
                        </Box>
                        <VStack align="start" gap={0}>
                          <Text color="gray.200" fontSize="sm" fontWeight="medium">
                            {transaction.name}
                          </Text>
                          <Text color="gray.500" fontSize="xs">
                            {new Date(transaction.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })} • {transaction.category?.[0] || 'Other'}
                          </Text>
                        </VStack>
                      </HStack>
                      <Text 
                        color={transaction.amount < 0 ? 'green.400' : 'gray.200'} 
                        fontSize="md"
                        fontWeight="semibold"
                      >
                        {transaction.amount < 0 ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                      </Text>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </Box>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}
