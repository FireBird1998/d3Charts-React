import type { ChartTheme } from './tokens'
import { lightTheme } from './defaultTheme'

export const darkTheme: ChartTheme = {
  ...lightTheme,

  tickColor: '#d1d5db',
  axisLineColor: '#6b7280',
  gridLineColor: '#374151',
  legendColor: '#e5e7eb',

  chartBackground: 'transparent',

  pieStrokeColor: '#1f2937',
  pieLabelColor: '#f9fafb',
}
