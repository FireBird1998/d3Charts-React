'use client'

import { useContext } from 'react'
import type { ChartTheme } from './tokens'
import { ChartThemeContext } from './ChartThemeProvider'

/**
 * Returns the current chart theme from the nearest `ChartThemeProvider`.
 * Falls back to the light theme when no provider is present.
 */
export function useChartTheme(): ChartTheme {
  return useContext(ChartThemeContext)
}
