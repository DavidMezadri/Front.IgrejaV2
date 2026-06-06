import { useState, useEffect } from 'react'

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    return (localStorage.getItem('theme') as 'claro' | 'escuro' | null) ?? 'claro'
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme === 'escuro' ? 'dark' : 'light'
    localStorage.setItem('theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme(t => t === 'escuro' ? 'claro' : 'escuro')
  }

  return { theme, toggleTheme }
}
