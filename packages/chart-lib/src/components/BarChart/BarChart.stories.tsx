import type { Meta, StoryObj } from '@storybook/react'
import { BarChart } from './BarChart'

const meta: Meta<typeof BarChart> = {
  title: 'Charts/BarChart',
  component: BarChart,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    mode: {
      control: 'select',
      options: ['grouped', 'stacked'],
    },
    width: { control: { type: 'range', min: 200, max: 1000, step: 50 } },
    height: { control: { type: 'range', min: 150, max: 600, step: 50 } },
  },
}

export default meta
type Story = StoryObj<typeof BarChart>

// --- Single-series data ---
const singleSeriesData = [
  { month: 'Jan', sales: 30 },
  { month: 'Feb', sales: 80 },
  { month: 'Mar', sales: 45 },
  { month: 'Apr', sales: 60 },
  { month: 'May', sales: 20 },
  { month: 'Jun', sales: 90 },
  { month: 'Jul', sales: 55 },
]

// --- Multi-series data ---
const vehicleSalesData = [
  { month: 'Jan', car: 120, bus: 45, cycle: 80 },
  { month: 'Feb', car: 150, bus: 50, cycle: 65 },
  { month: 'Mar', car: 90, bus: 60, cycle: 100 },
  { month: 'Apr', car: 130, bus: 55, cycle: 75 },
  { month: 'May', car: 110, bus: 40, cycle: 90 },
  { month: 'Jun', car: 160, bus: 65, cycle: 70 },
]

export const SingleSeries: Story = {
  args: {
    data: singleSeriesData,
    keys: ['sales'],
    categoryKey: 'month',
    width: 600,
    height: 400,
  },
}

export const Grouped: Story = {
  args: {
    data: vehicleSalesData,
    keys: ['car', 'bus', 'cycle'],
    categoryKey: 'month',
    width: 700,
    height: 400,
    mode: 'grouped',
  },
}

export const Stacked: Story = {
  args: {
    data: vehicleSalesData,
    keys: ['car', 'bus', 'cycle'],
    categoryKey: 'month',
    width: 700,
    height: 400,
    mode: 'stacked',
  },
}

export const CustomColors: Story = {
  args: {
    data: vehicleSalesData,
    keys: ['car', 'bus', 'cycle'],
    categoryKey: 'month',
    width: 700,
    height: 400,
    mode: 'grouped',
    colors: {
      car: '#e63946',
      bus: '#457b9d',
      cycle: '#2a9d8f',
    },
  },
}

export const StackedCustomColors: Story = {
  args: {
    data: vehicleSalesData,
    keys: ['car', 'bus', 'cycle'],
    categoryKey: 'month',
    width: 700,
    height: 400,
    mode: 'stacked',
    colors: {
      car: '#264653',
      bus: '#e9c46a',
      cycle: '#f4a261',
    },
  },
}
