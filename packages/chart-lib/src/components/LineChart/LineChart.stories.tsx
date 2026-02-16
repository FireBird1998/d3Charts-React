import type { Meta, StoryObj } from '@storybook/react'
import { LineChart } from './LineChart'

const meta: Meta<typeof LineChart> = {
  title: 'Charts/LineChart',
  component: LineChart,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    smooth: { control: 'boolean' },
    width: { control: { type: 'range', min: 200, max: 1000, step: 50 } },
    height: { control: { type: 'range', min: 150, max: 600, step: 50 } },
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
    smooth: false,
  },
}

export const SmallChart: Story = {
  args: {
    series: singleSeries,
    width: 300,
    height: 200,
  },
}
