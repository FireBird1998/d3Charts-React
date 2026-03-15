'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { ChartThemeProvider } from '@firebird1998/d3charts-react'

interface ThemeContextValue {
  isDark: boolean
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  isDark: false,
  toggle: () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('d3charts-theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const dark = stored ? stored === 'dark' : prefersDark
    setIsDark(dark)
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('d3charts-theme', isDark ? 'dark' : 'light')
  }, [isDark, mounted])

  const toggle = useCallback(() => {
    setIsDark((prev) => !prev)
  }, [])

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      <ChartThemeProvider theme={isDark ? 'dark' : 'light'}>{children}</ChartThemeProvider>
    </ThemeContext.Provider>
  )
}
