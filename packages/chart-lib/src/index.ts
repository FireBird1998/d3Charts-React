// Components
export { BarChart } from './components/BarChart/BarChart'
export { LineChart } from './components/LineChart/LineChart'
export { PieChart } from './components/PieChart/PieChart'
export { AreaChart } from './components/AreaChart/AreaChart'
export { ResponsiveChart } from './components/shared/ResponsiveChart'

// Types
export type { BarChartProps } from './components/BarChart/BarChart'
export type { LineChartProps } from './components/LineChart/LineChart'
export type { CurveType } from './utils/curves'
export type { PieChartProps } from './components/PieChart/PieChart'
export type { AreaChartProps } from './components/AreaChart/AreaChart'
export type { ResponsiveChartProps } from './components/shared/ResponsiveChart'
export type { DataPoint, LineDataPoint, LineSeries, Margin, ChartDimensions } from './types'
export { DEFAULT_MARGIN } from './types'

// Theme
export { ChartThemeProvider } from './theme/ChartThemeProvider'
export { useChartTheme } from './theme/useChartTheme'
export { lightTheme } from './theme/defaultTheme'
export { darkTheme } from './theme/darkTheme'
export type { ChartTheme, ChartThemeProviderProps } from './theme/tokens'

// Hooks
export { useResizeObserver } from './hooks/useResizeObserver'
export type { Dimensions } from './hooks/useResizeObserver'
