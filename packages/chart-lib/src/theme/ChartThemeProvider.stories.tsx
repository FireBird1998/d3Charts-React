import type { Meta, StoryObj } from '@storybook/react'
import { ChartThemeProvider } from './ChartThemeProvider'
import { BarChart } from '../components/BarChart/BarChart'
import { LineChart } from '../components/LineChart/LineChart'
import { PieChart } from '../components/PieChart/PieChart'

const meta: Meta<typeof ChartThemeProvider> = {
  title: 'Theme/ChartThemeProvider',
  component: ChartThemeProvider,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    theme: {
      control: 'select',
      options: ['light', 'dark'],
    },
  },
}

export default meta
type Story = StoryObj<typeof ChartThemeProvider>

const barData = [
  { month: 'Jan', car: 120, bus: 45, cycle: 80 },
  { month: 'Feb', car: 150, bus: 50, cycle: 65 },
  { month: 'Mar', car: 90, bus: 60, cycle: 100 },
  { month: 'Apr', car: 130, bus: 55, cycle: 75 },
  { month: 'May', car: 110, bus: 40, cycle: 90 },
  { month: 'Jun', car: 160, bus: 65, cycle: 70 },
]

const lineData = [
  {
    id: 'series-a',
    data: [
      { x: 0, y: 10 },
      { x: 1, y: 45 },
      { x: 2, y: 30 },
      { x: 3, y: 60 },
      { x: 4, y: 50 },
      { x: 5, y: 80 },
    ],
  },
  {
    id: 'series-b',
    data: [
      { x: 0, y: 5 },
      { x: 1, y: 25 },
      { x: 2, y: 50 },
      { x: 3, y: 35 },
      { x: 4, y: 65 },
      { x: 5, y: 55 },
    ],
  },
]

const pieData = [
  { label: 'React', value: 40 },
  { label: 'Vue', value: 25 },
  { label: 'Svelte', value: 20 },
  { label: 'Angular', value: 15 },
]

export const LightTheme: Story = {
  args: {
    theme: 'light',
  },
  render: (args) => (
    <ChartThemeProvider {...args}>
      <BarChart
        data={barData}
        keys={['car', 'bus', 'cycle']}
        categoryKey="month"
        width={600}
        height={350}
        mode="grouped"
      />
    </ChartThemeProvider>
  ),
}

export const DarkTheme: Story = {
  args: {
    theme: 'dark',
  },
  render: (args) => (
    <ChartThemeProvider {...args}>
      <div style={{ background: '#1f2937', padding: 24, borderRadius: 8 }}>
        <BarChart
          data={barData}
          keys={['car', 'bus', 'cycle']}
          categoryKey="month"
          width={600}
          height={350}
          mode="grouped"
        />
      </div>
    </ChartThemeProvider>
  ),
}

export const CustomOverrides: Story = {
  args: {
    theme: 'light',
    overrides: {
      fontFamily: "'JetBrains Mono', monospace",
      tickFontSize: '14px',
      tickColor: '#6366f1',
      axisLineColor: '#6366f1',
      gridLineColor: '#e0e7ff',
      palette: ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#ef4444'],
    },
  },
  render: (args) => (
    <ChartThemeProvider {...args}>
      <BarChart
        data={barData}
        keys={['car', 'bus', 'cycle']}
        categoryKey="month"
        width={600}
        height={350}
        mode="stacked"
      />
    </ChartThemeProvider>
  ),
}

export const MultipleCharts: Story = {
  args: {
    theme: 'light',
  },
  render: (args) => (
    <ChartThemeProvider {...args}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        <BarChart
          data={barData}
          keys={['car', 'bus', 'cycle']}
          categoryKey="month"
          width={600}
          height={300}
          mode="grouped"
        />
        <LineChart series={lineData} width={600} height={300} />
        <PieChart data={pieData} width={300} height={300} />
      </div>
    </ChartThemeProvider>
  ),
}

export const DarkMultipleCharts: Story = {
  args: {
    theme: 'dark',
  },
  render: (args) => (
    <ChartThemeProvider {...args}>
      <div
        style={{
          background: '#1f2937',
          padding: 24,
          borderRadius: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: 32,
        }}
      >
        <BarChart
          data={barData}
          keys={['car', 'bus', 'cycle']}
          categoryKey="month"
          width={600}
          height={300}
          mode="grouped"
        />
        <LineChart series={lineData} width={600} height={300} />
        <PieChart data={pieData} width={300} height={300} />
      </div>
    </ChartThemeProvider>
  ),
}
