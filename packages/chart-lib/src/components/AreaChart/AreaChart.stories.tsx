import type { Meta, StoryObj } from '@storybook/react'
import { AreaChart } from './AreaChart'

const meta: Meta<typeof AreaChart> = {
  title: 'Charts/AreaChart',
  component: AreaChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    curve: {
      control: 'select',
      options: ['linear', 'monotoneX', 'natural', 'step'],
    },
    fillOpacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
    },
    width: { control: { type: 'range', min: 200, max: 1000, step: 50 } },
    height: { control: { type: 'range', min: 150, max: 600, step: 50 } },
    series: { table: { disable: true } },
    margin: { table: { disable: true } },
  },
}

export default meta
type Story = StoryObj<typeof AreaChart>

// ---------------------------------------------------------------------------
// Shared test data
// ---------------------------------------------------------------------------

const stockPriceSeries = [
  {
    id: 'ACME Corp',
    data: [
      { x: 1, y: 142 },
      { x: 2, y: 158 },
      { x: 3, y: 149 },
      { x: 4, y: 175 },
      { x: 5, y: 168 },
      { x: 6, y: 192 },
      { x: 7, y: 187 },
      { x: 8, y: 210 },
      { x: 9, y: 198 },
      { x: 10, y: 225 },
      { x: 11, y: 218 },
      { x: 12, y: 240 },
    ],
  },
]

const temperatureSeries = [
  {
    id: 'New York',
    data: [
      { x: 1, y: 0 },
      { x: 2, y: 2 },
      { x: 3, y: 8 },
      { x: 4, y: 14 },
      { x: 5, y: 20 },
      { x: 6, y: 25 },
      { x: 7, y: 28 },
      { x: 8, y: 27 },
      { x: 9, y: 22 },
      { x: 10, y: 15 },
      { x: 11, y: 8 },
      { x: 12, y: 2 },
    ],
    color: '#e63946',
  },
  {
    id: 'San Francisco',
    data: [
      { x: 1, y: 10 },
      { x: 2, y: 12 },
      { x: 3, y: 13 },
      { x: 4, y: 14 },
      { x: 5, y: 15 },
      { x: 6, y: 17 },
      { x: 7, y: 18 },
      { x: 8, y: 18 },
      { x: 9, y: 19 },
      { x: 10, y: 17 },
      { x: 11, y: 13 },
      { x: 12, y: 10 },
    ],
    color: '#457b9d',
  },
]

const signupSeries = [
  {
    id: 'organic',
    data: [
      { x: 1, y: 320 },
      { x: 2, y: 480 },
      { x: 3, y: 410 },
      { x: 4, y: 560 },
      { x: 5, y: 620 },
      { x: 6, y: 750 },
      { x: 7, y: 690 },
      { x: 8, y: 830 },
    ],
  },
  {
    id: 'paid',
    data: [
      { x: 1, y: 150 },
      { x: 2, y: 220 },
      { x: 3, y: 280 },
      { x: 4, y: 350 },
      { x: 5, y: 410 },
      { x: 6, y: 390 },
      { x: 7, y: 470 },
      { x: 8, y: 520 },
    ],
  },
]

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Default: Story = {
  args: {
    series: stockPriceSeries,
    width: 600,
    height: 400,
    ariaLabel: 'ACME Corp stock price over 12 months',
  },
}

export const MultipleSeries: Story = {
  args: {
    series: temperatureSeries,
    width: 600,
    height: 400,
    ariaLabel: 'Monthly average temperatures for New York and San Francisco',
  },
}

export const CustomColors: Story = {
  args: {
    series: signupSeries,
    width: 600,
    height: 400,
    colors: { organic: '#2a9d8f', paid: '#e76f51' },
    ariaLabel: 'User signups by acquisition channel',
  },
}

export const LinearCurve: Story = {
  args: {
    series: stockPriceSeries,
    width: 600,
    height: 400,
    curve: 'linear' as const,
    ariaLabel: 'Stock price with linear interpolation',
  },
}

export const HighOpacity: Story = {
  args: {
    series: temperatureSeries,
    width: 600,
    height: 400,
    fillOpacity: 0.8,
    ariaLabel: 'Temperature trends with high fill opacity',
  },
}

export const SmallChart: Story = {
  args: {
    series: stockPriceSeries,
    width: 300,
    height: 200,
    ariaLabel: 'Compact stock price chart',
  },
}
