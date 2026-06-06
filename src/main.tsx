import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import AppLoader from './components/AppLoader'
import App from './App'
import './styles/tokens.css'
import './styles/global.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('app')).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AppLoader>
        <App />
      </AppLoader>
    </AuthProvider>
  </QueryClientProvider>
)
