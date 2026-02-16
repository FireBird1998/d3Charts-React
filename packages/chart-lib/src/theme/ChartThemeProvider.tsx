'use client'

import { createContext, useMemo, useId } from 'react'
import type { ChartTheme, ChartThemeProviderProps } from './tokens'
import { cssVarNames } from './tokens'
import { lightTheme } from './defaultTheme'
import { darkTheme } from './darkTheme'
import { BASE_STYLES } from './baseStyles'

const presets: Record<string, ChartTheme> = {
  light: lightTheme,
  dark: darkTheme,
}

export const ChartThemeContext = createContext<ChartTheme>(lightTheme)

/**
 * Convert a resolved ChartTheme into a CSS string of custom property declarations
 * scoped to a data attribute selector.
 */
function themeToCss(scopeAttr: string, theme: ChartTheme): string {
  const lines: string[] = []

  for (const [key, varName] of Object.entries(cssVarNames)) {
    const value = theme[key as keyof ChartTheme]
    if (typeof value === 'string') {
      lines.push(`  ${varName}: ${value};`)
    }
  }

  theme.palette.forEach((color, i) => {
    lines.push(`  --d3c-palette-${i}: ${color};`)
  })

  return `[${scopeAttr}] {\n${lines.join('\n')}\n}`
}

/**
 * Provides a chart theme to all descendant chart components.
 *
 * Injects CSS custom properties via a `<style>` tag scoped to a unique
 * data attribute, following the CrayonAI/react-ui injection pattern.
 * Multiple providers with different themes can coexist on the same page.
 *
 * @example
 * ```tsx
 * <ChartThemeProvider theme="dark">
 *   <BarChart data={data} keys={['revenue']} categoryKey="month" width={600} height={400} />
 * </ChartThemeProvider>
 * ```
 */
export function ChartThemeProvider({
  theme = 'light',
  overrides,
  children,
}: ChartThemeProviderProps) {
  const id = useId()
  const scopeAttr = `data-d3c-theme-${id.replace(/:/g, '')}`

  const resolved = useMemo<ChartTheme>(() => {
    const base = typeof theme === 'string' ? (presets[theme] ?? lightTheme) : theme
    return overrides ? { ...base, ...overrides } : base
  }, [theme, overrides])

  const cssText = useMemo(
    () => `${themeToCss(scopeAttr, resolved)}\n${BASE_STYLES}`,
    [scopeAttr, resolved],
  )

  return (
    <ChartThemeContext.Provider value={resolved}>
      <style dangerouslySetInnerHTML={{ __html: cssText }} />
      <div {...{ [scopeAttr]: '' }} style={{ display: 'contents' }}>
        {children}
      </div>
    </ChartThemeContext.Provider>
  )
}
