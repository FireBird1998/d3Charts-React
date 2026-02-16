import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BarChart } from './BarChart'

const sampleData = [
  { label: 'A', value: 10 },
  { label: 'B', value: 20 },
  { label: 'C', value: 30 },
]

describe('BarChart', () => {
  it('renders an SVG element', () => {
    render(<BarChart data={sampleData} width={400} height={300} />)
    const svg = screen.getByRole('img')
    expect(svg).toBeInTheDocument()
    expect(svg.tagName).toBe('svg')
  })

  it('renders the correct number of bars', () => {
    const { container } = render(<BarChart data={sampleData} width={400} height={300} />)
    const rects = container.querySelectorAll('rect')
    expect(rects).toHaveLength(sampleData.length)
  })

  it('applies the correct aria-label', () => {
    render(<BarChart data={sampleData} width={400} height={300} ariaLabel="Sales data" />)
    expect(screen.getByLabelText('Sales data')).toBeInTheDocument()
  })

  it('uses custom color when provided', () => {
    const { container } = render(
      <BarChart data={sampleData} width={400} height={300} color="#ff0000" />,
    )
    const rect = container.querySelector('rect')
    expect(rect).toHaveAttribute('fill', '#ff0000')
  })

  it('renders with custom margins', () => {
    const margin = { top: 10, right: 10, bottom: 10, left: 10 }
    const { container } = render(
      <BarChart data={sampleData} width={400} height={300} margin={margin} />,
    )
    const g = container.querySelector('svg > g')
    expect(g).toHaveAttribute('transform', 'translate(10, 10)')
  })

  it('renders a desc element for accessibility', () => {
    const { container } = render(
      <BarChart data={sampleData} width={400} height={300} ariaLabel="Test chart" />,
    )
    const desc = container.querySelector('desc')
    expect(desc).toHaveTextContent('Test chart')
  })
})
