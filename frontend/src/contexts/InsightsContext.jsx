import { createContext, useContext, useState } from 'react'

const InsightsContext = createContext({})

export const useInsights = () => {
  const context = useContext(InsightsContext)
  if (!context) {
    throw new Error('useInsights must be used within an InsightsProvider')
  }
  return context
}

export const InsightsProvider = ({ children }) => {
  const [insights, setInsights] = useState([])

  const value = {
    insights,
    setInsights,
  }

  return (
    <InsightsContext.Provider value={value}>
      {children}
    </InsightsContext.Provider>
  )
}

