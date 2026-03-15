import type { LineSeries, DataPoint } from '@firebird1998/d3charts-react'

// Weather (LineChart) — Monthly avg temps for 3 cities
export const weatherData: LineSeries[] = [
  {
    id: 'Tokyo',
    data: [
      { x: 0, y: 5 },
      { x: 1, y: 6 },
      { x: 2, y: 10 },
      { x: 3, y: 15 },
      { x: 4, y: 20 },
      { x: 5, y: 23 },
      { x: 6, y: 27 },
      { x: 7, y: 28 },
      { x: 8, y: 24 },
      { x: 9, y: 18 },
      { x: 10, y: 13 },
      { x: 11, y: 7 },
    ],
  },
  {
    id: 'London',
    data: [
      { x: 0, y: 5 },
      { x: 1, y: 5 },
      { x: 2, y: 7 },
      { x: 3, y: 10 },
      { x: 4, y: 13 },
      { x: 5, y: 17 },
      { x: 6, y: 19 },
      { x: 7, y: 19 },
      { x: 8, y: 16 },
      { x: 9, y: 12 },
      { x: 10, y: 8 },
      { x: 11, y: 5 },
    ],
  },
  {
    id: 'Sydney',
    data: [
      { x: 0, y: 26 },
      { x: 1, y: 26 },
      { x: 2, y: 24 },
      { x: 3, y: 22 },
      { x: 4, y: 18 },
      { x: 5, y: 15 },
      { x: 6, y: 14 },
      { x: 7, y: 15 },
      { x: 8, y: 18 },
      { x: 9, y: 20 },
      { x: 10, y: 22 },
      { x: 11, y: 25 },
    ],
  },
]

// Startup funding (BarChart grouped) — Series A/B/C by sector ($M)
export const fundingData = [
  { sector: 'Fintech', seriesA: 45, seriesB: 85, seriesC: 120 },
  { sector: 'Health', seriesA: 35, seriesB: 60, seriesC: 95 },
  { sector: 'AI/ML', seriesA: 55, seriesB: 110, seriesC: 180 },
  { sector: 'Green', seriesA: 25, seriesB: 50, seriesC: 75 },
]

// Sprint tasks (BarChart stacked)
export const sprintData = [
  { sprint: 'S1', done: 12, inProgress: 5, blocked: 3 },
  { sprint: 'S2', done: 15, inProgress: 4, blocked: 2 },
  { sprint: 'S3', done: 18, inProgress: 6, blocked: 1 },
  { sprint: 'S4', done: 14, inProgress: 8, blocked: 4 },
  { sprint: 'S5', done: 20, inProgress: 3, blocked: 2 },
  { sprint: 'S6', done: 22, inProgress: 5, blocked: 1 },
]

// Browser market share (PieChart)
export const browserData: DataPoint[] = [
  { label: 'Chrome', value: 65 },
  { label: 'Safari', value: 18 },
  { label: 'Firefox', value: 7 },
  { label: 'Edge', value: 5 },
  { label: 'Other', value: 5 },
]

// Budget allocation (PieChart donut)
export const budgetData: DataPoint[] = [
  { label: 'Engineering', value: 45 },
  { label: 'Marketing', value: 20 },
  { label: 'Sales', value: 18 },
  { label: 'Operations', value: 12 },
  { label: 'HR', value: 5 },
]

// Stock performance (AreaChart)
export const stockData: LineSeries[] = [
  {
    id: 'AAPL',
    data: [
      { x: 0, y: 150 },
      { x: 1, y: 155 },
      { x: 2, y: 148 },
      { x: 3, y: 162 },
      { x: 4, y: 170 },
      { x: 5, y: 168 },
      { x: 6, y: 175 },
      { x: 7, y: 180 },
      { x: 8, y: 172 },
      { x: 9, y: 185 },
      { x: 10, y: 190 },
      { x: 11, y: 195 },
    ],
  },
  {
    id: 'GOOGL',
    data: [
      { x: 0, y: 130 },
      { x: 1, y: 132 },
      { x: 2, y: 128 },
      { x: 3, y: 140 },
      { x: 4, y: 145 },
      { x: 5, y: 142 },
      { x: 6, y: 148 },
      { x: 7, y: 152 },
      { x: 8, y: 155 },
      { x: 9, y: 160 },
      { x: 10, y: 158 },
      { x: 11, y: 165 },
    ],
  },
]

export const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]
