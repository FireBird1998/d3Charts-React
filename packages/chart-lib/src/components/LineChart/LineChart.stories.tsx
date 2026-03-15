import type { Meta, StoryObj } from '@storybook/react'
import { LineChart } from './LineChart'

const meta: Meta<typeof LineChart> = {
  title: 'Charts/LineChart',
  component: LineChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    curve: {
      control: 'select',
      options: ['linear', 'monotoneX', 'natural', 'step'],
    },
    width: { control: { type: 'range', min: 200, max: 1000, step: 50 } },
    height: { control: { type: 'range', min: 150, max: 600, step: 50 } },
    series: { table: { disable: true } },
    margin: { table: { disable: true } },
  },
}

export default meta
type Story = StoryObj<typeof LineChart>

const singleSeries = [
  {
    id: 'revenue',
    data: [
      { x: 0, y: 10 },
      { x: 1, y: 25 },
      { x: 2, y: 18 },
      { x: 3, y: 35 },
      { x: 4, y: 28 },
      { x: 5, y: 42 },
      { x: 6, y: 38 },
    ],
  },
]

const multiSeries = [
  {
    id: 'revenue',
    data: [
      { x: 0, y: 10 },
      { x: 1, y: 25 },
      { x: 2, y: 18 },
      { x: 3, y: 35 },
      { x: 4, y: 28 },
      { x: 5, y: 42 },
    ],
    color: '#4e79a7',
  },
  {
    id: 'expenses',
    data: [
      { x: 0, y: 15 },
      { x: 1, y: 12 },
      { x: 2, y: 22 },
      { x: 3, y: 20 },
      { x: 4, y: 30 },
      { x: 5, y: 25 },
    ],
    color: '#e15759',
  },
]

export const Default: Story = {
  args: {
    series: singleSeries,
    width: 600,
    height: 400,
  },
}

export const MultipleSeries: Story = {
  args: {
    series: multiSeries,
    width: 600,
    height: 400,
  },
}

export const StraightLines: Story = {
  args: {
    series: singleSeries,
    width: 600,
    height: 400,
    curve: 'linear' as const,
  },
}

export const SmallChart: Story = {
  args: {
    series: singleSeries,
    width: 300,
    height: 200,
  },
}

const multiSeriesNoColor = [
  {
    id: 'revenue',
    data: [
      { x: 0, y: 10 },
      { x: 1, y: 25 },
      { x: 2, y: 18 },
      { x: 3, y: 35 },
      { x: 4, y: 28 },
      { x: 5, y: 42 },
    ],
  },
  {
    id: 'expenses',
    data: [
      { x: 0, y: 15 },
      { x: 1, y: 12 },
      { x: 2, y: 22 },
      { x: 3, y: 20 },
      { x: 4, y: 30 },
      { x: 5, y: 25 },
    ],
  },
]

export const CustomColors: Story = {
  args: {
    series: multiSeriesNoColor,
    width: 600,
    height: 400,
    colors: { revenue: '#e63946', expenses: '#457b9d' },
  },
}
