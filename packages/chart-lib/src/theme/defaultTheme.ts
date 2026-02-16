import type { ChartTheme } from './tokens'

export const lightTheme: ChartTheme = {
  fontFamily: "'Inter', 'Helvetica Neue', system-ui, sans-serif",

  tickFontSize: '12px',
  tickFontWeight: '400',
  tickColor: '#4b5563',

  axisLineColor: '#9ca3af',
  axisLineWidth: '1',

  gridLineColor: '#e5e7eb',
  gridLineWidth: '1',
  gridLineDasharray: '2,2',

  legendFontSize: '11px',
  legendFontWeight: '500',
  legendColor: '#374151',

  chartBackground: 'transparent',

  palette: [
    '#4e79a7',
    '#f28e2b',
    '#e15759',
    '#76b7b2',
    '#59a14f',
    '#edc948',
    '#b07aa1',
    '#ff9da7',
    '#9c755f',
    '#bab0ac',
  ],

  barBorderRadius: '2',

  lineStrokeWidth: '2',
  pointRadius: '3',

  pieStrokeColor: '#ffffff',
  pieStrokeWidth: '1',
  pieLabelColor: '#ffffff',
  pieLabelFontSize: '12px',
  pieLabelFontWeight: '600',
}
