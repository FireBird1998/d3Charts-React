import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PieChart } from './PieChart'

const sampleData = [
  { label: 'A', value: 40 },
  { label: 'B', value: 30 },
  { label: 'C', value: 20 },
  { label: 'D', value: 10 },
]

describe('PieChart', () => {
  it('renders an SVG element', () => {
    render(<PieChart data={sampleData} width={400} height={400} />)
    const svg = screen.getByRole('img')
    expect(svg).toBeInTheDocument()
    expect(svg.tagName).toBe('svg')
  })

  it('renders a path for each data slice', () => {
    const { container } = render(<PieChart data={sampleData} width={400} height={400} />)
    const paths = container.querySelectorAll('path')
    expect(paths).toHaveLength(sampleData.length)
  })

  it('applies the correct aria-label', () => {
    render(<PieChart data={sampleData} width={400} height={400} ariaLabel="Market share" />)
    expect(screen.getByLabelText('Market share')).toBeInTheDocument()
  })

  it('renders a desc element for accessibility', () => {
    const { container } = render(
      <PieChart data={sampleData} width={400} height={400} ariaLabel="Test pie" />,
    )
    const desc = container.querySelector('desc')
    expect(desc).toHaveTextContent('Test pie')
  })

  it('renders title elements for each slice', () => {
    const { container } = render(<PieChart data={sampleData} width={400} height={400} />)
    const titles = container.querySelectorAll('title')
    expect(titles).toHaveLength(sampleData.length)
    expect(titles[0]).toHaveTextContent('A: 40')
  })

  it('uses custom colors when provided', () => {
    const customColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00']
    const { container } = render(
      <PieChart data={sampleData} width={400} height={400} colors={customColors} />,
    )
    const paths = container.querySelectorAll('path')
    expect(paths[0]).toHaveAttribute('fill', '#ff0000')
    expect(paths[1]).toHaveAttribute('fill', '#00ff00')
    expect(paths[2]).toHaveAttribute('fill', '#0000ff')
    expect(paths[3]).toHaveAttribute('fill', '#ffff00')
  })

  it('renders as a donut when innerRadius is set', () => {
    const { container } = render(
      <PieChart data={sampleData} width={400} height={400} innerRadius={80} />,
    )
    const paths = container.querySelectorAll('path')
    // Each path's d attribute should contain arc data (non-empty)
    paths.forEach((path) => {
      const d = path.getAttribute('d')
      expect(d).toBeTruthy()
      expect(d!.length).toBeGreaterThan(0)
    })
  })

  it('hides labels when showLabels is false', () => {
    const { container } = render(
      <PieChart data={sampleData} width={400} height={400} showLabels={false} />,
    )
    const texts = container.querySelectorAll('text')
    expect(texts).toHaveLength(0)
  })

  it('centers the chart group in the SVG', () => {
    const { container } = render(<PieChart data={sampleData} width={400} height={300} />)
    const g = container.querySelector('svg > g')
    expect(g).toHaveAttribute('transform', 'translate(200, 150)')
  })
})
