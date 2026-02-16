import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { LineChart } from './LineChart'

const sampleSeries = [
  {
    id: 'test-series',
    data: [
      { x: 0, y: 10 },
      { x: 1, y: 20 },
      { x: 2, y: 15 },
    ],
  },
]

const multiSeries = [
  {
    id: 'series-a',
    data: [
      { x: 0, y: 10 },
      { x: 1, y: 20 },
    ],
    color: '#ff0000',
  },
  {
    id: 'series-b',
    data: [
      { x: 0, y: 5 },
      { x: 1, y: 15 },
    ],
    color: '#00ff00',
  },
]

describe('LineChart', () => {
  it('renders an SVG element', () => {
    render(<LineChart series={sampleSeries} width={400} height={300} />)
    const svg = screen.getByRole('img')
    expect(svg).toBeInTheDocument()
    expect(svg.tagName).toBe('svg')
  })

  it('renders a path for each series', () => {
    const { container } = render(<LineChart series={multiSeries} width={400} height={300} />)
    const paths = container.querySelectorAll('path')
    expect(paths).toHaveLength(multiSeries.length)
  })

  it('renders data points as circles', () => {
    const { container } = render(<LineChart series={sampleSeries} width={400} height={300} />)
    const circles = container.querySelectorAll('circle')
    expect(circles).toHaveLength(sampleSeries[0].data.length)
  })

  it('applies the correct aria-label', () => {
    render(<LineChart series={sampleSeries} width={400} height={300} ariaLabel="Revenue trend" />)
    expect(screen.getByLabelText('Revenue trend')).toBeInTheDocument()
  })

  it('uses custom series colors', () => {
    const { container } = render(<LineChart series={multiSeries} width={400} height={300} />)
    const paths = container.querySelectorAll('path')
    expect(paths[0]).toHaveAttribute('stroke', '#ff0000')
    expect(paths[1]).toHaveAttribute('stroke', '#00ff00')
  })

  it('renders a desc element for accessibility', () => {
    const { container } = render(
      <LineChart series={sampleSeries} width={400} height={300} ariaLabel="Test line chart" />,
    )
    const desc = container.querySelector('desc')
    expect(desc).toHaveTextContent('Test line chart')
  })
})
