import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { AreaChart } from './AreaChart'
import { ChartThemeProvider } from '../../theme/ChartThemeProvider'
import { lightTheme } from '../../theme/defaultTheme'
import { darkTheme } from '../../theme/darkTheme'
import type { ChartTheme } from '../../theme/tokens'

// ---------------------------------------------------------------------------
// Test data
// ---------------------------------------------------------------------------

const singleSeries = [
  {
    id: 'series-1',
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
  },
  {
    id: 'series-b',
    data: [
      { x: 0, y: 5 },
      { x: 1, y: 15 },
    ],
  },
]

const coloredMultiSeries = [
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

const singlePoint = [
  {
    id: 'one-point',
    data: [{ x: 5, y: 42 }],
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderAreaChart(
  props?: Partial<Parameters<typeof AreaChart>[0]>,
  themeProps?: { theme?: 'light' | 'dark' | ChartTheme; overrides?: Partial<ChartTheme> },
) {
  const defaultProps = {
    series: singleSeries,
    width: 400,
    height: 300,
    ...props,
  }

  if (themeProps) {
    return render(
      <ChartThemeProvider {...themeProps}>
        <AreaChart {...defaultProps} />
      </ChartThemeProvider>,
    )
  }

  return render(<AreaChart {...defaultProps} />)
}

// ===========================================================================
// 1. BASE RENDERING
// ===========================================================================

describe('AreaChart — base rendering', () => {
  it('renders an SVG with role="img"', () => {
    renderAreaChart()
    const svg = screen.getByRole('img')
    expect(svg).toBeInTheDocument()
    expect(svg.tagName).toBe('svg')
  })

  it('renders two paths per series (area + line)', () => {
    const { container } = renderAreaChart({ series: multiSeries })
    const paths = container.querySelectorAll('path')
    expect(paths).toHaveLength(multiSeries.length * 2)
  })

  it('renders circles for every data point across all series', () => {
    const { container } = renderAreaChart({ series: multiSeries })
    const circles = container.querySelectorAll('circle')
    const totalPoints = multiSeries.reduce((sum, s) => sum + s.data.length, 0)
    expect(circles).toHaveLength(totalPoints)
  })

  it('applies custom margins to the inner <g> transform', () => {
    const margin = { top: 10, right: 10, bottom: 10, left: 10 }
    const { container } = renderAreaChart({ margin })
    const g = container.querySelector('svg > g')
    expect(g).toHaveAttribute('transform', 'translate(10, 10)')
  })

  it('renders a <desc> element for accessibility', () => {
    const { container } = renderAreaChart({ ariaLabel: 'Revenue trend' })
    const desc = container.querySelector('desc')
    expect(desc).toHaveTextContent('Revenue trend')
  })

  it('applies custom aria-label', () => {
    renderAreaChart({ ariaLabel: 'Sales data' })
    expect(screen.getByLabelText('Sales data')).toBeInTheDocument()
  })

  it('renders <title> on each data point circle', () => {
    const { container } = renderAreaChart()
    const titles = container.querySelectorAll('circle > title')
    expect(titles).toHaveLength(singleSeries[0].data.length)
    expect(titles[0].textContent).toBe('(0, 10)')
  })
})

// ===========================================================================
// 2. EDGE CASES
// ===========================================================================

describe('AreaChart — edge cases', () => {
  it('handles empty series array without crashing', () => {
    const { container } = renderAreaChart({ series: [] })
    const svg = screen.getByRole('img')
    expect(svg).toBeInTheDocument()
    const paths = container.querySelectorAll('path')
    expect(paths).toHaveLength(0)
  })

  it('handles a single data point', () => {
    const { container } = renderAreaChart({ series: singlePoint })
    const circles = container.querySelectorAll('circle')
    expect(circles).toHaveLength(1)
    const paths = container.querySelectorAll('path')
    // 1 area path + 1 line path
    expect(paths).toHaveLength(2)
  })

  it('handles a single series', () => {
    const { container } = renderAreaChart({ series: singleSeries })
    const paths = container.querySelectorAll('path')
    // 1 area path + 1 line path
    expect(paths).toHaveLength(2)
    const circles = container.querySelectorAll('circle')
    expect(circles).toHaveLength(singleSeries[0].data.length)
  })
})

// ===========================================================================
// 3. THEME DEFAULTS (no provider)
// ===========================================================================

describe('AreaChart — theme defaults (no provider)', () => {
  it('uses light theme palette colors by default', () => {
    const { container } = renderAreaChart({ series: multiSeries })
    // Line paths (the ones with fill="none") have stroke set to palette colors
    const linePaths = container.querySelectorAll('path[fill="none"]')
    expect(linePaths[0]).toHaveAttribute('stroke', lightTheme.palette[0])
    expect(linePaths[1]).toHaveAttribute('stroke', lightTheme.palette[1])
  })

  it('uses light theme lineStrokeWidth by default', () => {
    const { container } = renderAreaChart()
    const linePath = container.querySelector('path[fill="none"]')
    expect(linePath).toHaveAttribute('stroke-width', lightTheme.lineStrokeWidth)
  })

  it('uses light theme pointRadius by default', () => {
    const { container } = renderAreaChart()
    const circle = container.querySelector('circle')
    expect(circle).toHaveAttribute('r', lightTheme.pointRadius)
  })
})

// ===========================================================================
// 4. THEME INTEGRATION — LIGHT PROVIDER
// ===========================================================================

describe('AreaChart — light theme provider', () => {
  it('uses light palette colors', () => {
    const { container } = renderAreaChart({ series: multiSeries }, { theme: 'light' })
    const linePaths = container.querySelectorAll('path[fill="none"]')
    expect(linePaths[0]).toHaveAttribute('stroke', lightTheme.palette[0])
    expect(linePaths[1]).toHaveAttribute('stroke', lightTheme.palette[1])
  })

  it('injects a <style> tag with CSS variables', () => {
    const { container } = renderAreaChart({}, { theme: 'light' })
    const style = container.parentElement?.querySelector('style')
    expect(style).toBeTruthy()
    expect(style?.innerHTML).toContain('--d3c-tick-color')
    expect(style?.innerHTML).toContain('--d3c-font-family')
    expect(style?.innerHTML).toContain('--d3c-palette-0')
  })

  it('injects base CSS class definitions', () => {
    const { container } = renderAreaChart({}, { theme: 'light' })
    const style = container.parentElement?.querySelector('style')
    expect(style?.innerHTML).toContain('.d3c-tick-text')
    expect(style?.innerHTML).toContain('.d3c-axis-line')
    expect(style?.innerHTML).toContain('.d3c-grid-line')
  })
})

// ===========================================================================
// 5. THEME INTEGRATION — DARK PROVIDER
// ===========================================================================

describe('AreaChart — dark theme provider', () => {
  it('uses dark palette colors', () => {
    const { container } = renderAreaChart({ series: multiSeries }, { theme: 'dark' })
    const linePaths = container.querySelectorAll('path[fill="none"]')
    expect(linePaths[0]).toHaveAttribute('stroke', darkTheme.palette[0])
  })

  it('injects dark theme CSS variable values', () => {
    const { container } = renderAreaChart({}, { theme: 'dark' })
    const style = container.parentElement?.querySelector('style')
    expect(style?.innerHTML).toContain(darkTheme.tickColor)
    expect(style?.innerHTML).toContain(darkTheme.axisLineColor)
    expect(style?.innerHTML).toContain(darkTheme.gridLineColor)
  })
})

// ===========================================================================
// 6. THEME INTEGRATION — CUSTOM OVERRIDES
// ===========================================================================

describe('AreaChart — theme overrides', () => {
  const customPalette = ['#ff0000', '#00ff00', '#0000ff']

  it('applies a custom palette from overrides', () => {
    const { container } = renderAreaChart(
      { series: multiSeries },
      { theme: 'light', overrides: { palette: customPalette } },
    )
    const linePaths = container.querySelectorAll('path[fill="none"]')
    expect(linePaths[0]).toHaveAttribute('stroke', '#ff0000')
    expect(linePaths[1]).toHaveAttribute('stroke', '#00ff00')
  })

  it('applies a custom lineStrokeWidth from overrides', () => {
    const { container } = renderAreaChart(
      {},
      { theme: 'light', overrides: { lineStrokeWidth: '5' } },
    )
    const linePath = container.querySelector('path[fill="none"]')
    expect(linePath).toHaveAttribute('stroke-width', '5')
  })

  it('merges overrides with the base theme (non-overridden values remain)', () => {
    const { container } = renderAreaChart(
      { series: multiSeries },
      { theme: 'light', overrides: { lineStrokeWidth: '5' } },
    )
    const linePath = container.querySelector('path[fill="none"]')
    // lineStrokeWidth was overridden
    expect(linePath).toHaveAttribute('stroke-width', '5')
    // palette was NOT overridden, so default light palette applies
    expect(linePath).toHaveAttribute('stroke', lightTheme.palette[0])
  })
})

// ===========================================================================
// 7. THEME INTEGRATION — FULLY CUSTOM THEME
// ===========================================================================

describe('AreaChart — fully custom theme object', () => {
  const customTheme: ChartTheme = {
    ...lightTheme,
    palette: ['#111111', '#222222', '#333333'],
    lineStrokeWidth: '4',
    pointRadius: '6',
    tickColor: '#aabbcc',
    fontFamily: 'Courier',
  }

  it('uses custom palette and lineStrokeWidth', () => {
    const { container } = renderAreaChart({ series: multiSeries }, { theme: customTheme })
    const linePaths = container.querySelectorAll('path[fill="none"]')
    expect(linePaths[0]).toHaveAttribute('stroke', '#111111')
    expect(linePaths[0]).toHaveAttribute('stroke-width', '4')
  })

  it('uses custom pointRadius', () => {
    const { container } = renderAreaChart({}, { theme: customTheme })
    const circle = container.querySelector('circle')
    expect(circle).toHaveAttribute('r', '6')
  })
})

// ===========================================================================
// 8. SERIES COLOR PRECEDENCE
// ===========================================================================

describe('AreaChart — series color precedence', () => {
  it('series.color overrides theme palette', () => {
    const seriesWithColor = [
      {
        id: 'explicit',
        data: [
          { x: 0, y: 10 },
          { x: 1, y: 20 },
        ],
        color: '#deadbe',
      },
    ]
    const { container } = renderAreaChart({ series: seriesWithColor })
    const linePath = container.querySelector('path[fill="none"]')
    expect(linePath).toHaveAttribute('stroke', '#deadbe')
    const circle = container.querySelector('circle')
    expect(circle).toHaveAttribute('fill', '#deadbe')
  })

  it('falls back to palette when series.color is not set', () => {
    const seriesNoColor = [
      {
        id: 'no-color',
        data: [
          { x: 0, y: 10 },
          { x: 1, y: 20 },
        ],
      },
    ]
    const { container } = renderAreaChart({ series: seriesNoColor })
    const linePath = container.querySelector('path[fill="none"]')
    expect(linePath).toHaveAttribute('stroke', lightTheme.palette[0])
  })
})

// ===========================================================================
// 9. CSS CLASS APPLICATION
// ===========================================================================

describe('AreaChart — CSS class application on axes and grid', () => {
  it('applies d3c-tick-text class on axis tick labels', () => {
    const { container } = renderAreaChart()
    const tickTexts = container.querySelectorAll('.d3c-tick-text')
    expect(tickTexts.length).toBeGreaterThan(0)
    tickTexts.forEach((el) => {
      expect(el.tagName).toBe('text')
    })
  })

  it('applies d3c-axis-line class on main axis lines', () => {
    const { container } = renderAreaChart()
    const axisLines = container.querySelectorAll('.d3c-axis-line')
    // At least 2: one for x-axis, one for y-axis
    expect(axisLines.length).toBeGreaterThanOrEqual(2)
  })

  it('applies d3c-grid-line class on grid lines', () => {
    const { container } = renderAreaChart()
    const gridLines = container.querySelectorAll('.d3c-grid-line')
    expect(gridLines.length).toBeGreaterThan(0)
  })
})

// ===========================================================================
// 10. FILL OPACITY
// ===========================================================================

describe('AreaChart — fillOpacity', () => {
  it('defaults to 0.3 fill opacity on area paths', () => {
    const { container } = renderAreaChart()
    const areaPaths = container.querySelectorAll('.d3c-area-fill')
    expect(areaPaths).toHaveLength(1)
    areaPaths.forEach((path) => {
      expect(path).toHaveAttribute('fill-opacity', '0.3')
    })
  })

  it('applies a custom fillOpacity value', () => {
    const { container } = renderAreaChart({ fillOpacity: 0.7 })
    const areaPaths = container.querySelectorAll('.d3c-area-fill')
    expect(areaPaths).toHaveLength(1)
    areaPaths.forEach((path) => {
      expect(path).toHaveAttribute('fill-opacity', '0.7')
    })
  })

  it('area paths have aria-hidden="true"', () => {
    const { container } = renderAreaChart({ series: multiSeries })
    const areaPaths = container.querySelectorAll('.d3c-area-fill')
    expect(areaPaths).toHaveLength(multiSeries.length)
    areaPaths.forEach((path) => {
      expect(path).toHaveAttribute('aria-hidden', 'true')
    })
  })
})

// ===========================================================================
// 11. CURVE BEHAVIOR
// ===========================================================================

describe('AreaChart — curve behavior', () => {
  it('defaults to monotoneX curve (path contains curve commands)', () => {
    const { container } = renderAreaChart()
    const linePath = container.querySelector('path[fill="none"]')
    const d = linePath?.getAttribute('d') ?? ''
    // monotoneX produces C (cubic bezier) commands
    expect(d).toContain('C')
  })

  it('curve="linear" produces a different path than the default', () => {
    const { container: defaultContainer } = renderAreaChart()
    const defaultD = defaultContainer.querySelector('path[fill="none"]')?.getAttribute('d')

    const { container: linearContainer } = renderAreaChart({ curve: 'linear' })
    const linearD = linearContainer.querySelector('path[fill="none"]')?.getAttribute('d')

    expect(defaultD).not.toBe(linearD)
    // linear paths use L (line-to) commands, not C (curve)
    expect(linearD).toContain('L')
    expect(linearD).not.toContain('C')
  })

  it('curve="step" is accepted and produces a step-style path', () => {
    const { container } = renderAreaChart({ curve: 'step' })
    const linePath = container.querySelector('path[fill="none"]')
    const d = linePath?.getAttribute('d') ?? ''
    // step curves produce H (horizontal) or V (vertical) line commands or L
    expect(d.length).toBeGreaterThan(0)
    // Step paths should differ from monotoneX (no cubic beziers)
    expect(d).not.toContain('C')
  })
})

// ===========================================================================
// 12. className PROP
// ===========================================================================

describe('AreaChart — className prop', () => {
  it('applies className to the SVG element', () => {
    renderAreaChart({ className: 'my-custom-chart' })
    const svg = screen.getByRole('img')
    expect(svg).toHaveClass('my-custom-chart')
  })
})

// ===========================================================================
// 13. TICK FORMAT PROPS
// ===========================================================================

describe('AreaChart — tickFormat props', () => {
  it('xTickFormat formats x-axis tick labels', () => {
    const { container } = renderAreaChart({
      xTickFormat: (v) => `X:${v}`,
    })
    // AxisBottom renders tick text with the formatter
    const bottomAxis = container.querySelector('svg > g > g[transform^="translate(0,"]')
    const tickTexts = bottomAxis?.querySelectorAll('.d3c-tick-text')
    expect(tickTexts).toBeTruthy()
    expect(tickTexts!.length).toBeGreaterThan(0)
    const firstText = tickTexts![0].textContent
    expect(firstText).toMatch(/^X:/)
  })

  it('yTickFormat formats y-axis tick labels', () => {
    const { container } = renderAreaChart({
      yTickFormat: (v) => `$${v}`,
    })
    // Find tick texts that are formatted with $
    const allTickTexts = container.querySelectorAll('.d3c-tick-text')
    const formattedTexts = Array.from(allTickTexts).filter((el) => el.textContent?.startsWith('$'))
    expect(formattedTexts.length).toBeGreaterThan(0)
  })
})

// ===========================================================================
// 14. MULTI-PROVIDER SCOPING
// ===========================================================================

describe('AreaChart — multiple theme providers', () => {
  it('each provider scopes independently', () => {
    const { container } = render(
      <div>
        <ChartThemeProvider theme="light" overrides={{ palette: ['#aaaaaa'] }}>
          <AreaChart series={singleSeries} width={400} height={300} ariaLabel="Chart A" />
        </ChartThemeProvider>
        <ChartThemeProvider theme="light" overrides={{ palette: ['#bbbbbb'] }}>
          <AreaChart series={singleSeries} width={400} height={300} ariaLabel="Chart B" />
        </ChartThemeProvider>
      </div>,
    )

    const svgs = container.querySelectorAll('svg')
    expect(svgs).toHaveLength(2)

    // Chart A line paths use #aaaaaa
    const linePathsA = svgs[0].querySelectorAll('path[fill="none"]')
    expect(linePathsA[0]).toHaveAttribute('stroke', '#aaaaaa')

    // Chart B line paths use #bbbbbb
    const linePathsB = svgs[1].querySelectorAll('path[fill="none"]')
    expect(linePathsB[0]).toHaveAttribute('stroke', '#bbbbbb')
  })
})

// ===========================================================================
// 15. COLORS PROP
// ===========================================================================

describe('AreaChart — colors prop', () => {
  it('colors prop overrides theme palette', () => {
    const { container } = renderAreaChart({
      series: multiSeries,
      colors: { 'series-a': '#ff00ff', 'series-b': '#00ffff' },
    })
    const linePaths = container.querySelectorAll('path[fill="none"]')
    expect(linePaths[0]).toHaveAttribute('stroke', '#ff00ff')
    expect(linePaths[1]).toHaveAttribute('stroke', '#00ffff')
  })

  it('series.color overrides colors prop', () => {
    const seriesWithColor = [
      {
        id: 'series-a',
        data: [
          { x: 0, y: 10 },
          { x: 1, y: 20 },
        ],
        color: '#deadbe',
      },
    ]
    const { container } = renderAreaChart({
      series: seriesWithColor,
      colors: { 'series-a': '#ff00ff' },
    })
    const linePath = container.querySelector('path[fill="none"]')
    expect(linePath).toHaveAttribute('stroke', '#deadbe')
  })

  it('partial colors map — uncovered series fall back to theme palette', () => {
    const { container } = renderAreaChart({
      series: multiSeries,
      colors: { 'series-a': '#ff00ff' },
    })
    const linePaths = container.querySelectorAll('path[fill="none"]')
    expect(linePaths[0]).toHaveAttribute('stroke', '#ff00ff')
    expect(linePaths[1]).toHaveAttribute('stroke', lightTheme.palette[1])
  })

  it('colors prop works with theme provider', () => {
    const { container } = renderAreaChart(
      {
        series: multiSeries,
        colors: { 'series-a': '#abcdef' },
      },
      { theme: 'dark' },
    )
    const linePaths = container.querySelectorAll('path[fill="none"]')
    expect(linePaths[0]).toHaveAttribute('stroke', '#abcdef')
  })
})

// ===========================================================================
// 16. LEGEND
// ===========================================================================

describe('AreaChart — legend', () => {
  it('renders a legend when multiple series are provided', () => {
    const { container } = renderAreaChart({ series: multiSeries })
    const legend = container.querySelector('.legend')
    expect(legend).toBeInTheDocument()
    const legendTexts = container.querySelectorAll('.d3c-legend-text')
    expect(legendTexts).toHaveLength(multiSeries.length)
  })

  it('does not render a legend for a single series', () => {
    const { container } = renderAreaChart({ series: singleSeries })
    const legend = container.querySelector('.legend')
    expect(legend).toBeNull()
  })

  it('legend items display correct series IDs', () => {
    const { container } = renderAreaChart({ series: multiSeries })
    const legendTexts = container.querySelectorAll('.d3c-legend-text')
    expect(legendTexts[0]).toHaveTextContent('series-a')
    expect(legendTexts[1]).toHaveTextContent('series-b')
  })

  it('legend items use correct colors', () => {
    const { container } = renderAreaChart({
      series: multiSeries,
      colors: { 'series-a': '#ff0000', 'series-b': '#00ff00' },
    })
    const legendRects = container.querySelectorAll('.legend rect')
    expect(legendRects[0]).toHaveAttribute('fill', '#ff0000')
    expect(legendRects[1]).toHaveAttribute('fill', '#00ff00')
  })
})
