import type { LineSeries, DataPoint } from '@firebird1998/d3charts-react'

// E-commerce revenue (BarChart) — quarterly by region
export const revenueData = [
  { quarter: 'Q1', americas: 120, europe: 85, asia: 65 },
  { quarter: 'Q2', americas: 140, europe: 90, asia: 80 },
  { quarter: 'Q3', americas: 135, europe: 95, asia: 90 },
  { quarter: 'Q4', americas: 165, europe: 110, asia: 105 },
]

// User signups (LineChart) — daily for 2 channels
export const signupData: LineSeries[] = [
  {
    id: 'Organic',
    data: [
      { x: 1, y: 120 },
      { x: 2, y: 135 },
      { x: 3, y: 145 },
      { x: 4, y: 160 },
      { x: 5, y: 155 },
      { x: 6, y: 180 },
      { x: 7, y: 200 },
      { x: 8, y: 195 },
      { x: 9, y: 210 },
      { x: 10, y: 225 },
      { x: 11, y: 240 },
      { x: 12, y: 260 },
    ],
  },
  {
    id: 'Paid',
    data: [
      { x: 1, y: 80 },
      { x: 2, y: 95 },
      { x: 3, y: 110 },
      { x: 4, y: 105 },
      { x: 5, y: 130 },
      { x: 6, y: 140 },
      { x: 7, y: 155 },
      { x: 8, y: 165 },
      { x: 9, y: 170 },
      { x: 10, y: 180 },
      { x: 11, y: 195 },
      { x: 12, y: 210 },
    ],
  },
]

// Customer satisfaction (PieChart)
export const satisfactionData: DataPoint[] = [
  { label: 'Very Satisfied', value: 42 },
  { label: 'Satisfied', value: 28 },
  { label: 'Neutral', value: 15 },
  { label: 'Dissatisfied', value: 10 },
  { label: 'Very Dissatisfied', value: 5 },
]

// Sales by category (BarChart stacked)
export const salesData = [
  { month: 'Jan', electronics: 45, clothing: 32, food: 28 },
  { month: 'Feb', electronics: 52, clothing: 28, food: 30 },
  { month: 'Mar', electronics: 48, clothing: 35, food: 32 },
  { month: 'Apr', electronics: 55, clothing: 38, food: 35 },
  { month: 'May', electronics: 60, clothing: 42, food: 38 },
  { month: 'Jun', electronics: 58, clothing: 40, food: 36 },
]

// Feature adoption (AreaChart)
export const adoptionData: LineSeries[] = [
  {
    id: 'Dashboard',
    data: [
      { x: 1, y: 500 },
      { x: 2, y: 650 },
      { x: 3, y: 800 },
      { x: 4, y: 950 },
      { x: 5, y: 1100 },
      { x: 6, y: 1300 },
      { x: 7, y: 1500 },
      { x: 8, y: 1650 },
      { x: 9, y: 1800 },
      { x: 10, y: 2000 },
      { x: 11, y: 2200 },
      { x: 12, y: 2500 },
    ],
  },
  {
    id: 'API',
    data: [
      { x: 1, y: 200 },
      { x: 2, y: 280 },
      { x: 3, y: 350 },
      { x: 4, y: 420 },
      { x: 5, y: 500 },
      { x: 6, y: 580 },
      { x: 7, y: 650 },
      { x: 8, y: 720 },
      { x: 9, y: 800 },
      { x: 10, y: 880 },
      { x: 11, y: 960 },
      { x: 12, y: 1050 },
    ],
  },
]

export const months = [
  '',
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
