import type { Meta, StoryObj } from '@storybook/react'
import { PieChart } from './PieChart'

const meta: Meta<typeof PieChart> = {
  title: 'Charts/PieChart',
  component: PieChart,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    innerRadius: { control: { type: 'range', min: 0, max: 150, step: 5 } },
    padAngle: { control: { type: 'range', min: 0, max: 0.1, step: 0.005 } },
    cornerRadius: { control: { type: 'range', min: 0, max: 20, step: 1 } },
    width: { control: { type: 'range', min: 200, max: 800, step: 50 } },
    height: { control: { type: 'range', min: 200, max: 800, step: 50 } },
    showLabels: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof PieChart>

const sampleData = [
  { label: 'React', value: 40 },
  { label: 'Vue', value: 25 },
  { label: 'Angular', value: 20 },
  { label: 'Svelte', value: 10 },
  { label: 'Other', value: 5 },
]

export const Default: Story = {
  args: {
    data: sampleData,
    width: 400,
    height: 400,
  },
}

export const Donut: Story = {
  args: {
    data: sampleData,
    width: 400,
    height: 400,
    innerRadius: 80,
  },
}

export const CustomColors: Story = {
  args: {
    data: sampleData,
    width: 400,
    height: 400,
    colors: ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'],
  },
}

export const NoLabels: Story = {
  args: {
    data: sampleData,
    width: 400,
    height: 400,
    showLabels: false,
  },
}

export const TwoSlices: Story = {
  args: {
    data: [
      { label: 'Yes', value: 70 },
      { label: 'No', value: 30 },
    ],
    width: 300,
    height: 300,
    innerRadius: 60,
  },
}

export const ManySlices: Story = {
  args: {
    data: [
      { label: 'A', value: 15 },
      { label: 'B', value: 12 },
      { label: 'C', value: 18 },
      { label: 'D', value: 8 },
      { label: 'E', value: 22 },
      { label: 'F', value: 10 },
      { label: 'G', value: 5 },
      { label: 'H', value: 14 },
      { label: 'I', value: 9 },
      { label: 'J', value: 7 },
    ],
    width: 450,
    height: 450,
  },
}
