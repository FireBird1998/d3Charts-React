import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PieChart } from './PieChart'
import { ChartThemeProvider } from '../../theme/ChartThemeProvider'
import { lightTheme } from '../../theme/defaultTheme'
import { darkTheme } from '../../theme/darkTheme'
import type { ChartTheme } from '../../theme/tokens'

// ---------------------------------------------------------------------------
// Test data
// ---------------------------------------------------------------------------

const sampleData = [
  { label: 'A', value: 40 },
  { label: 'B', value: 30 },
  { label: 'C', value: 20 },
  { label: 'D', value: 10 },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderPieChart(
  props?: Partial<Parameters<typeof PieChart>[0]>,
  themeProps?: { theme?: 'light' | 'dark' | ChartTheme; overrides?: Partial<ChartTheme> },
) {
  const defaultProps = {
    data: sampleData,
    width: 400,
    height: 400,
    ...props,
  }

  if (themeProps) {
    return render(
      <ChartThemeProvider {...themeProps}>
        <PieChart {...defaultProps} />
      </ChartThemeProvider>,
    )
  }

  return render(<PieChart {...defaultProps} />)
}

// ===========================================================================
// 1. BASE RENDERING
// ===========================================================================

describe('PieChart — base rendering', () => {
  it('renders an SVG with role="img"', () => {
    renderPieChart()
    const svg = screen.getByRole('img')
    expect(svg).toBeInTheDocument()
    expect(svg.tagName).toBe('svg')
  })

  it('renders a path for each data slice', () => {
    const { container } = renderPieChart()
    const paths = container.querySelectorAll('path')
    expect(paths).toHaveLength(sampleData.length)
  })

  it('renders a <desc> element for accessibility', () => {
    const { container } = renderPieChart({ ariaLabel: 'Revenue breakdown' })
    const desc = container.querySelector('desc')
    expect(desc).toHaveTextContent('Revenue breakdown')
  })

  it('applies custom aria-label', () => {
    renderPieChart({ ariaLabel: 'Market share' })
    expect(screen.getByLabelText('Market share')).toBeInTheDocument()
  })

  it('renders <title> on each slice with label and value', () => {
    const { container } = renderPieChart()
    const titles = container.querySelectorAll('title')
    expect(titles).toHaveLength(sampleData.length)
    expect(titles[0]).toHaveTextContent('A: 40')
    expect(titles[1]).toHaveTextContent('B: 30')
    expect(titles[2]).toHaveTextContent('C: 20')
    expect(titles[3]).toHaveTextContent('D: 10')
  })
})

// ===========================================================================
// 2. EDGE CASES
// ===========================================================================

describe('PieChart — edge cases', () => {
  it('handles empty data without crashing', () => {
    const { container } = renderPieChart({ data: [] })
    const svg = screen.getByRole('img')
    expect(svg).toBeInTheDocument()
    const paths = container.querySelectorAll('path')
    expect(paths).toHaveLength(0)
  })

  it('handles a single data item', () => {
    const { container } = renderPieChart({ data: [{ label: 'Only', value: 100 }] })
    const paths = container.querySelectorAll('path')
    expect(paths).toHaveLength(1)
    const title = container.querySelector('title')
    expect(title).toHaveTextContent('Only: 100')
  })
})

// ===========================================================================
// 3. THEME DEFAULTS (no provider)
// ===========================================================================

describe('PieChart — theme defaults (no provider)', () => {
  it('uses the light theme palette colors by default', () => {
    const { container } = renderPieChart()
    const paths = container.querySelectorAll('path')
    expect(paths[0]).toHaveAttribute('fill', lightTheme.palette[0])
    expect(paths[1]).toHaveAttribute('fill', lightTheme.palette[1])
  })

  it('uses the light theme pieStrokeColor by default', () => {
    const { container } = renderPieChart()
    const path = container.querySelector('path')
    expect(path).toHaveAttribute('stroke', lightTheme.pieStrokeColor)
  })
})

// ===========================================================================
// 4. THEME INTEGRATION — LIGHT / DARK PROVIDER
// ===========================================================================

describe('PieChart — light theme provider', () => {
  it('uses light palette colors', () => {
    const { container } = renderPieChart({}, { theme: 'light' })
    const paths = container.querySelectorAll('path')
    expect(paths[0]).toHaveAttribute('fill', lightTheme.palette[0])
    expect(paths[1]).toHaveAttribute('fill', lightTheme.palette[1])
  })

  it('injects a <style> tag with CSS variables', () => {
    const { container } = renderPieChart({}, { theme: 'light' })
    const style = container.parentElement?.querySelector('style')
    expect(style).toBeTruthy()
    expect(style?.innerHTML).toContain('--d3c-tick-color')
    expect(style?.innerHTML).toContain('--d3c-font-family')
    expect(style?.innerHTML).toContain('--d3c-palette-0')
  })

  it('injects base CSS class definitions including d3c-pie-label', () => {
    const { container } = renderPieChart({}, { theme: 'light' })
    const style = container.parentElement?.querySelector('style')
    expect(style?.innerHTML).toContain('.d3c-pie-label')
    expect(style?.innerHTML).toContain('.d3c-tick-text')
    expect(style?.innerHTML).toContain('.d3c-axis-line')
  })
})

describe('PieChart — dark theme provider', () => {
  it('uses dark theme pieStrokeColor', () => {
    const { container } = renderPieChart({}, { theme: 'dark' })
    const path = container.querySelector('path')
    expect(path).toHaveAttribute('stroke', darkTheme.pieStrokeColor)
  })

  it('injects dark theme CSS variable values', () => {
    const { container } = renderPieChart({}, { theme: 'dark' })
    const style = container.parentElement?.querySelector('style')
    expect(style?.innerHTML).toContain(darkTheme.tickColor)
    expect(style?.innerHTML).toContain(darkTheme.axisLineColor)
    expect(style?.innerHTML).toContain(darkTheme.gridLineColor)
  })
})

// ===========================================================================
// 5. THEME OVERRIDES
// ===========================================================================

describe('PieChart — theme overrides', () => {
  const customPalette = ['#ff0000', '#00ff00', '#0000ff', '#ffff00']

  it('applies a custom palette from overrides', () => {
    const { container } = renderPieChart(
      {},
      { theme: 'light', overrides: { palette: customPalette } },
    )
    const paths = container.querySelectorAll('path')
    expect(paths[0]).toHaveAttribute('fill', '#ff0000')
    expect(paths[1]).toHaveAttribute('fill', '#00ff00')
    expect(paths[2]).toHaveAttribute('fill', '#0000ff')
    expect(paths[3]).toHaveAttribute('fill', '#ffff00')
  })

  it('colors prop takes precedence over theme palette', () => {
    const explicitColors = ['#dead00', '#beef00', '#cafe00', '#babe00']
    const { container } = renderPieChart(
      { colors: explicitColors },
      { theme: 'light', overrides: { palette: customPalette } },
    )
    const paths = container.querySelectorAll('path')
    expect(paths[0]).toHaveAttribute('fill', '#dead00')
    expect(paths[1]).toHaveAttribute('fill', '#beef00')
  })
})

// ===========================================================================
// 6. CSS CLASS APPLICATION
// ===========================================================================

describe('PieChart — CSS class application', () => {
  it('applies d3c-pie-label class on label text elements', () => {
    const { container } = renderPieChart()
    const labels = container.querySelectorAll('.d3c-pie-label')
    expect(labels.length).toBeGreaterThan(0)
    labels.forEach((el) => {
      expect(el.tagName).toBe('text')
    })
  })

  it('does not render label text elements when showLabels is false', () => {
    const { container } = renderPieChart({ showLabels: false })
    const labels = container.querySelectorAll('.d3c-pie-label')
    expect(labels).toHaveLength(0)
  })
})

// ===========================================================================
// 7. minLabelAngle PROP
// ===========================================================================

describe('PieChart — minLabelAngle prop', () => {
  it('hides labels for small slices with default threshold', () => {
    // D has value 10 out of 100 total => arc angle ~0.628 radians (2π × 10/100)
    // But with padAngle the effective angle is slightly smaller.
    // A has value 40 out of 100 => arc angle ~2.51 radians — always visible.
    // Default minLabelAngle = 0.3, so D (0.628) should still be visible.
    // Use a very small slice to test hiding.
    const dataWithTiny = [
      { label: 'Big', value: 99 },
      { label: 'Tiny', value: 1 },
    ]
    const { container } = renderPieChart({ data: dataWithTiny })
    const labels = container.querySelectorAll('.d3c-pie-label')
    // Tiny slice: arc angle = 2π × 1/100 ≈ 0.063 rad, which is below 0.3 default
    // Only the 'Big' label should render
    const labelTexts = Array.from(labels).map((el) => el.textContent)
    expect(labelTexts).toContain('Big')
    expect(labelTexts).not.toContain('Tiny')
  })

  it('custom threshold changes which labels are visible', () => {
    // With all equal data, each arc = 2π/4 ≈ 1.57 rad
    const equalData = [
      { label: 'W', value: 25 },
      { label: 'X', value: 25 },
      { label: 'Y', value: 25 },
      { label: 'Z', value: 25 },
    ]
    // Set minLabelAngle very high so no labels show
    const { container } = renderPieChart({ data: equalData, minLabelAngle: 10 })
    const labels = container.querySelectorAll('.d3c-pie-label')
    expect(labels).toHaveLength(0)
  })
})

// ===========================================================================
// 8. className PROP
// ===========================================================================

describe('PieChart — className prop', () => {
  it('applies className to the SVG element', () => {
    renderPieChart({ className: 'my-custom-pie' })
    const svg = screen.getByRole('img')
    expect(svg).toHaveClass('my-custom-pie')
  })
})

// ===========================================================================
// 9. MULTI-PROVIDER SCOPING
// ===========================================================================

describe('PieChart — multiple theme providers', () => {
  it('each provider scopes independently', () => {
    const { container } = render(
      <div>
        <ChartThemeProvider theme="light" overrides={{ palette: ['#aaaaaa'] }}>
          <PieChart data={sampleData} width={400} height={400} ariaLabel="Chart A" />
        </ChartThemeProvider>
        <ChartThemeProvider theme="light" overrides={{ palette: ['#bbbbbb'] }}>
          <PieChart data={sampleData} width={400} height={400} ariaLabel="Chart B" />
        </ChartThemeProvider>
      </div>,
    )

    const svgs = container.querySelectorAll('svg')
    expect(svgs).toHaveLength(2)

    // Chart A paths use #aaaaaa (palette has 1 entry, all slices cycle it)
    const pathsA = svgs[0].querySelectorAll('path')
    expect(pathsA[0]).toHaveAttribute('fill', '#aaaaaa')

    // Chart B paths use #bbbbbb
    const pathsB = svgs[1].querySelectorAll('path')
    expect(pathsB[0]).toHaveAttribute('fill', '#bbbbbb')
  })
})
