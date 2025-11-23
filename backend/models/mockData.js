// Mock data generator for transactions

const categories = [
  'Food & Dining',
  'Shopping',
  'Transportation',
  'Bills & Utilities',
  'Entertainment',
  'Healthcare',
  'Groceries',
  'Travel',
  'Personal Care',
  'Other'
];

const merchants = {
  'Food & Dining': ['Starbucks', 'McDonald\'s', 'Chipotle', 'Subway', 'Pizza Hut', 'Local Restaurant', 'Cafe Luna'],
  'Shopping': ['Amazon', 'Target', 'Walmart', 'Best Buy', 'Apple Store', 'Nike', 'H&M'],
  'Transportation': ['Uber', 'Lyft', 'Shell Gas', 'Chevron', 'Public Transit', 'Airport Parking'],
  'Bills & Utilities': ['Electric Company', 'Water Utility', 'Internet Provider', 'Phone Bill', 'Rent Payment'],
  'Entertainment': ['Netflix', 'Spotify', 'Movie Theater', 'Concert Tickets', 'Gaming Store'],
  'Healthcare': ['CVS Pharmacy', 'Doctor Visit', 'Dentist', 'Medical Lab', 'Health Insurance'],
  'Groceries': ['Whole Foods', 'Trader Joe\'s', 'Safeway', 'Costco', 'Local Market'],
  'Travel': ['Airbnb', 'Hotel', 'United Airlines', 'Expedia', 'Car Rental'],
  'Personal Care': ['Salon', 'Gym Membership', 'Spa', 'Barber Shop'],
  'Other': ['Miscellaneous', 'Cash Withdrawal', 'Transfer', 'Online Purchase']
};

const incomeDescriptions = ['Salary', 'Freelance Work', 'Investment Return', 'Bonus', 'Side Project', 'Refund'];

function getRandomDate(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
}

function getRandomAmount(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function generateTransactions(userId, count = 80) {
  const transactions = [];
  let id = 1;

  // Generate income transactions (20% of total)
  const incomeCount = Math.floor(count * 0.2);
  for (let i = 0; i < incomeCount; i++) {
    transactions.push({
      id: id++,
      userId,
      amount: getRandomAmount(1000, 5000),
      type: 'income',
      category: 'Income',
      description: incomeDescriptions[Math.floor(Math.random() * incomeDescriptions.length)],
      date: getRandomDate(Math.floor(Math.random() * 90)),
      isManual: false,
      createdAt: new Date().toISOString()
    });
  }

  // Generate expense transactions (80% of total)
  const expenseCount = count - incomeCount;
  for (let i = 0; i < expenseCount; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const merchantList = merchants[category];
    const merchant = merchantList[Math.floor(Math.random() * merchantList.length)];
    
    let amount;
    if (category === 'Bills & Utilities') {
      amount = getRandomAmount(50, 300);
    } else if (category === 'Shopping' || category === 'Travel') {
      amount = getRandomAmount(20, 500);
    } else if (category === 'Groceries') {
      amount = getRandomAmount(30, 200);
    } else if (category === 'Food & Dining') {
      amount = getRandomAmount(10, 80);
    } else {
      amount = getRandomAmount(15, 150);
    }

    transactions.push({
      id: id++,
      userId,
      amount,
      type: 'expense',
      category,
      description: merchant,
      date: getRandomDate(Math.floor(Math.random() * 90)),
      isManual: false,
      createdAt: new Date().toISOString()
    });
  }

  // Sort by date (newest first)
  transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  return transactions;
}

module.exports = {
  categories,
  generateTransactions
};
