import { useState, useEffect } from 'react'

export function useTheme() {
  const [theme, setTheme] = useState('claro')

  useEffect(() => {
    document.documentElement.dataset.theme = theme === 'escuro' ? 'dark' : 'light'
  }, [theme])

  function toggleTheme() {
    setTheme(t => t === 'escuro' ? 'claro' : 'escuro')
  }

  return { theme, toggleTheme }
}
