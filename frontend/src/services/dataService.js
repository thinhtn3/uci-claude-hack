// Parse CSV data and transform into the format expected by Dashboard
export const parseTransactionsCSV = (csvText) => {
  const lines = csvText.trim().split('\n')
  const headers = lines[0].split(',')
  
  const transactions = []
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue
    
    const values = lines[i].split(',')
    if (values.length < 4) continue
    
    const date = values[0]
    const description = values[1]
    const category = values[2]
    const amount = parseFloat(values[3])
    
    transactions.push({
      transaction_id: `tx_${i}`,
      account_id: 'acc_1',
      amount: Math.abs(amount), // Convert to positive for display
      date: date,
      name: description,
      merchant_name: description,
      category: [category],
      pending: false,
      payment_channel: 'other',
      isExpense: amount < 0 // Track if it's an expense
    })
  }
  
  return transactions
}

export const calculateAccountBalances = (transactions) => {
  // Calculate total spent and income
  const totalSpent = transactions
    .filter(tx => tx.isExpense)
    .reduce((sum, tx) => sum + tx.amount, 0)
  
  const totalIncome = transactions
    .filter(tx => !tx.isExpense)
    .reduce((sum, tx) => sum + tx.amount, 0)
  
  // Create mock accounts with calculated balances
  const checkingBalance = Math.max(5000 - (totalSpent * 0.6), 100)
  const savingsBalance = Math.max(10000 - (totalSpent * 0.3), 200)
  const creditAvailable = 2000
  
  return [
    {
      account_id: 'acc_1',
      name: 'Checking Account',
      official_name: 'Primary Checking',
      type: 'depository',
      subtype: 'checking',
      mask: '0000',
      balances: {
        available: checkingBalance,
        current: checkingBalance,
        limit: null,
        iso_currency_code: 'USD'
      }
    },
    {
      account_id: 'acc_2',
      name: 'Savings Account',
      official_name: 'High Yield Savings',
      type: 'depository',
      subtype: 'savings',
      mask: '1111',
      balances: {
        available: savingsBalance,
        current: savingsBalance,
        limit: null,
        iso_currency_code: 'USD'
      }
    },
    {
      account_id: 'acc_3',
      name: 'Credit Card',
      official_name: 'Rewards Credit Card',
      type: 'credit',
      subtype: 'credit card',
      mask: '3333',
      balances: {
        available: creditAvailable,
        current: creditAvailable,
        limit: 2000,
        iso_currency_code: 'USD'
      }
    }
  ]
}

export const getRecentTransactions = (transactions, limit = 20) => {
  // Sort by date descending and return most recent
  return transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit)
}

export const loadTransactionData = async () => {
  try {
    const response = await fetch('/data/transactions.csv')
    const csvText = await response.text()
    const transactions = parseTransactionsCSV(csvText)
    const accounts = calculateAccountBalances(transactions)
    const recentTransactions = getRecentTransactions(transactions, 20)
    
    return {
      accounts,
      transactions: recentTransactions
    }
  } catch (error) {
    console.error('Failed to load transaction data:', error)
    throw error
  }
}

