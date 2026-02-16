import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BarChart } from './BarChart'
import { ChartThemeProvider } from '../../theme/ChartThemeProvider'
import { lightTheme } from '../../theme/defaultTheme'
import { darkTheme } from '../../theme/darkTheme'
import type { ChartTheme } from '../../theme/tokens'

// ---------------------------------------------------------------------------
// Test data
// ---------------------------------------------------------------------------

const singleSeriesData = [
  { label: 'A', value: 10 },
  { label: 'B', value: 20 },
  { label: 'C', value: 30 },
]

const multiSeriesData = [
  { month: 'Jan', car: 120, bus: 45, cycle: 80 },
  { month: 'Feb', car: 150, bus: 50, cycle: 65 },
  { month: 'Mar', car: 90, bus: 60, cycle: 100 },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderBarChart(
  props?: Partial<Parameters<typeof BarChart>[0]>,
  themeProps?: { theme?: 'light' | 'dark' | ChartTheme; overrides?: Partial<ChartTheme> },
) {
  const defaultProps = {
    data: singleSeriesData,
    keys: ['value'] as string[],
    categoryKey: 'label' as string,
    width: 400,
    height: 300,
    ...props,
  }

  if (themeProps) {
    return render(
      <ChartThemeProvider {...themeProps}>
        <BarChart {...defaultProps} />
      </ChartThemeProvider>,
    )
  }

  return render(<BarChart {...defaultProps} />)
}

// ===========================================================================
// 1. BASE RENDERING
// ===========================================================================

describe('BarChart — base rendering', () => {
  it('renders an SVG with role="img"', () => {
    renderBarChart()
    const svg = screen.getByRole('img')
    expect(svg).toBeInTheDocument()
    expect(svg.tagName).toBe('svg')
  })

  it('renders the correct number of bars for single series', () => {
    const { container } = renderBarChart()
    const rects = container.querySelectorAll('rect')
    expect(rects).toHaveLength(singleSeriesData.length)
  })

  it('renders correct bars for multi-series grouped mode', () => {
    const { container } = renderBarChart({
      data: multiSeriesData,
      keys: ['car', 'bus', 'cycle'],
      categoryKey: 'month',
      mode: 'grouped',
    })
    const allRects = container.querySelectorAll('rect')
    const legendRects = container.querySelectorAll('.legend rect')
    const dataBarCount = allRects.length - legendRects.length
    // 3 categories x 3 keys = 9 bars
    expect(dataBarCount).toBe(9)
  })

  it('renders correct bars for multi-series stacked mode', () => {
    const { container } = renderBarChart({
      data: multiSeriesData,
      keys: ['car', 'bus', 'cycle'],
      categoryKey: 'month',
      mode: 'stacked',
    })
    const allRects = container.querySelectorAll('rect')
    const legendRects = container.querySelectorAll('.legend rect')
    const dataBarCount = allRects.length - legendRects.length
    // 3 categories x 3 keys = 9 stacked segments
    expect(dataBarCount).toBe(9)
  })

  it('applies custom margins to the inner <g> transform', () => {
    const margin = { top: 10, right: 10, bottom: 10, left: 10 }
    const { container } = renderBarChart({ margin })
    const g = container.querySelector('svg > g')
    expect(g).toHaveAttribute('transform', 'translate(10, 10)')
  })

  it('renders a <desc> element for accessibility', () => {
    const { container } = renderBarChart({ ariaLabel: 'Test chart' })
    const desc = container.querySelector('desc')
    expect(desc).toHaveTextContent('Test chart')
  })

  it('applies custom aria-label', () => {
    renderBarChart({ ariaLabel: 'Sales data' })
    expect(screen.getByLabelText('Sales data')).toBeInTheDocument()
  })

  it('renders <title> on each data bar', () => {
    const { container } = renderBarChart()
    const titles = container.querySelectorAll('rect > title')
    expect(titles).toHaveLength(singleSeriesData.length)
    expect(titles[0].textContent).toContain('A')
  })

  it('renders a legend when multiple keys are provided', () => {
    const { container } = renderBarChart({
      data: multiSeriesData,
      keys: ['car', 'bus', 'cycle'],
      categoryKey: 'month',
    })
    const legend = container.querySelector('.legend')
    expect(legend).toBeInTheDocument()
  })

  it('does not render a legend for a single key', () => {
    const { container } = renderBarChart()
    const legend = container.querySelector('.legend')
    expect(legend).not.toBeInTheDocument()
  })
})

// ===========================================================================
// 2. EDGE CASES
// ===========================================================================

describe('BarChart — edge cases', () => {
  it('handles empty data without crashing', () => {
    const { container } = renderBarChart({ data: [] })
    const svg = screen.getByRole('img')
    expect(svg).toBeInTheDocument()
    const rects = container.querySelectorAll('rect')
    expect(rects).toHaveLength(0)
  })

  it('handles a single data item', () => {
    const { container } = renderBarChart({
      data: [{ label: 'Only', value: 42 }],
    })
    const rects = container.querySelectorAll('rect')
    expect(rects).toHaveLength(1)
  })
})

// ===========================================================================
// 3. THEME INTEGRATION — DEFAULT (no provider)
// ===========================================================================

describe('BarChart — theme defaults (no provider)', () => {
  it('uses the light theme palette colors by default', () => {
    const { container } = renderBarChart()
    const rect = container.querySelector('rect')
    // First key gets first palette color from light theme
    expect(rect).toHaveAttribute('fill', lightTheme.palette[0])
  })

  it('uses the light theme barBorderRadius by default', () => {
    const { container } = renderBarChart()
    const rect = container.querySelector('rect')
    expect(rect).toHaveAttribute('rx', lightTheme.barBorderRadius)
  })
})

// ===========================================================================
// 4. THEME INTEGRATION — LIGHT PROVIDER
// ===========================================================================

describe('BarChart — light theme provider', () => {
  it('uses light palette colors', () => {
    const { container } = renderBarChart(
      { data: multiSeriesData, keys: ['car', 'bus', 'cycle'], categoryKey: 'month' },
      { theme: 'light' },
    )
    const rects = container.querySelectorAll('rect')
    // In grouped mode, find the first rect for each key
    // car = palette[0], bus = palette[1], cycle = palette[2]
    const firstCarRect = rects[0]
    expect(firstCarRect).toHaveAttribute('fill', lightTheme.palette[0])
  })

  it('injects a <style> tag with CSS variables', () => {
    const { container } = renderBarChart({}, { theme: 'light' })
    const style = container.parentElement?.querySelector('style')
    expect(style).toBeTruthy()
    expect(style?.innerHTML).toContain('--d3c-tick-color')
    expect(style?.innerHTML).toContain('--d3c-font-family')
    expect(style?.innerHTML).toContain('--d3c-palette-0')
  })

  it('injects base CSS class definitions', () => {
    const { container } = renderBarChart({}, { theme: 'light' })
    const style = container.parentElement?.querySelector('style')
    expect(style?.innerHTML).toContain('.d3c-tick-text')
    expect(style?.innerHTML).toContain('.d3c-axis-line')
    expect(style?.innerHTML).toContain('.d3c-grid-line')
    expect(style?.innerHTML).toContain('.d3c-legend-text')
  })

  it('wraps content in a scoped data attribute div', () => {
    const { container } = renderBarChart({}, { theme: 'light' })
    const wrapper = container.querySelector('[style="display: contents;"]')
    expect(wrapper).toBeTruthy()
    const attrs = Array.from(wrapper?.attributes ?? [])
    const scopeAttr = attrs.find((a) => a.name.startsWith('data-d3c-theme-'))
    expect(scopeAttr).toBeTruthy()
  })
})

// ===========================================================================
// 5. THEME INTEGRATION — DARK PROVIDER
// ===========================================================================

describe('BarChart — dark theme provider', () => {
  it('uses light palette colors (dark keeps same palette)', () => {
    const { container } = renderBarChart(
      { data: multiSeriesData, keys: ['car', 'bus', 'cycle'], categoryKey: 'month' },
      { theme: 'dark' },
    )
    const rect = container.querySelector('rect')
    // Dark theme inherits the same palette as light
    expect(rect).toHaveAttribute('fill', darkTheme.palette[0])
  })

  it('injects dark theme CSS variable values', () => {
    const { container } = renderBarChart({}, { theme: 'dark' })
    const style = container.parentElement?.querySelector('style')
    expect(style?.innerHTML).toContain(darkTheme.tickColor)
    expect(style?.innerHTML).toContain(darkTheme.axisLineColor)
    expect(style?.innerHTML).toContain(darkTheme.gridLineColor)
  })
})

// ===========================================================================
// 6. THEME INTEGRATION — CUSTOM OVERRIDES
// ===========================================================================

describe('BarChart — theme overrides', () => {
  const customPalette = ['#ff0000', '#00ff00', '#0000ff']

  it('applies a custom palette from overrides', () => {
    const { container } = renderBarChart(
      { data: multiSeriesData, keys: ['car', 'bus', 'cycle'], categoryKey: 'month' },
      { theme: 'light', overrides: { palette: customPalette } },
    )
    const rects = container.querySelectorAll('rect')
    // First key (car) gets customPalette[0]
    expect(rects[0]).toHaveAttribute('fill', '#ff0000')
  })

  it('applies a custom barBorderRadius from overrides', () => {
    const { container } = renderBarChart(
      {},
      { theme: 'light', overrides: { barBorderRadius: '8' } },
    )
    const rect = container.querySelector('rect')
    expect(rect).toHaveAttribute('rx', '8')
  })

  it('merges overrides with the base theme (non-overridden values remain)', () => {
    const { container } = renderBarChart(
      {},
      { theme: 'light', overrides: { barBorderRadius: '10' } },
    )
    const rect = container.querySelector('rect')
    // barBorderRadius was overridden
    expect(rect).toHaveAttribute('rx', '10')
    // palette was NOT overridden, so default light palette applies
    expect(rect).toHaveAttribute('fill', lightTheme.palette[0])
  })

  it('injects overridden CSS variable values into <style>', () => {
    const { container } = renderBarChart(
      {},
      { theme: 'light', overrides: { tickColor: '#abcdef' } },
    )
    const style = container.parentElement?.querySelector('style')
    expect(style?.innerHTML).toContain('#abcdef')
  })
})

// ===========================================================================
// 7. THEME INTEGRATION — FULLY CUSTOM THEME
// ===========================================================================

describe('BarChart — fully custom theme object', () => {
  const customTheme: ChartTheme = {
    ...lightTheme,
    palette: ['#111111', '#222222', '#333333'],
    barBorderRadius: '6',
    tickColor: '#aabbcc',
    fontFamily: 'Courier',
  }

  it('uses custom palette colors', () => {
    const { container } = renderBarChart(
      { data: multiSeriesData, keys: ['car', 'bus', 'cycle'], categoryKey: 'month' },
      { theme: customTheme },
    )
    const rect = container.querySelector('rect')
    expect(rect).toHaveAttribute('fill', '#111111')
  })

  it('uses custom barBorderRadius', () => {
    const { container } = renderBarChart({}, { theme: customTheme })
    const rect = container.querySelector('rect')
    expect(rect).toHaveAttribute('rx', '6')
  })

  it('injects the custom fontFamily CSS variable', () => {
    const { container } = renderBarChart({}, { theme: customTheme })
    const style = container.parentElement?.querySelector('style')
    expect(style?.innerHTML).toContain('Courier')
  })

  it('injects the custom tickColor CSS variable', () => {
    const { container } = renderBarChart({}, { theme: customTheme })
    const style = container.parentElement?.querySelector('style')
    expect(style?.innerHTML).toContain('#aabbcc')
  })
})

// ===========================================================================
// 8. COLORS PROP vs THEME PALETTE PRECEDENCE
// ===========================================================================

describe('BarChart — colors prop overrides theme palette', () => {
  it('colors prop takes precedence over light theme palette', () => {
    const { container } = renderBarChart({
      data: multiSeriesData,
      keys: ['car', 'bus', 'cycle'],
      categoryKey: 'month',
      colors: { car: '#ff00ff', bus: '#00ffff' },
    })
    const rects = container.querySelectorAll('rect')
    // car gets explicit color
    expect(rects[0]).toHaveAttribute('fill', '#ff00ff')
  })

  it('colors prop takes precedence over custom theme palette', () => {
    const { container } = renderBarChart(
      {
        data: multiSeriesData,
        keys: ['car', 'bus', 'cycle'],
        categoryKey: 'month',
        colors: { car: '#deadbe' },
      },
      { theme: 'light', overrides: { palette: ['#aaa', '#bbb', '#ccc'] } },
    )
    const rects = container.querySelectorAll('rect')
    // car uses explicit color, not the override palette
    expect(rects[0]).toHaveAttribute('fill', '#deadbe')
  })

  it('keys without explicit color fall back to theme palette', () => {
    const { container } = renderBarChart({
      data: multiSeriesData,
      keys: ['car', 'bus', 'cycle'],
      categoryKey: 'month',
      colors: { car: '#ff00ff' },
    })
    const rects = container.querySelectorAll('rect')
    // bus (index 1) has no explicit color -> falls back to palette[1]
    expect(rects[1]).toHaveAttribute('fill', lightTheme.palette[1])
  })
})

// ===========================================================================
// 9. CSS CLASS APPLICATION ON SVG ELEMENTS
// ===========================================================================

describe('BarChart — CSS class application on axes and grid', () => {
  it('applies d3c-tick-text class on axis tick labels', () => {
    const { container } = renderBarChart()
    const tickTexts = container.querySelectorAll('.d3c-tick-text')
    expect(tickTexts.length).toBeGreaterThan(0)
    // All tick text elements should be <text> elements
    tickTexts.forEach((el) => {
      expect(el.tagName).toBe('text')
    })
  })

  it('applies d3c-axis-line class on main axis lines', () => {
    const { container } = renderBarChart()
    const axisLines = container.querySelectorAll('.d3c-axis-line')
    // At least 2: one for x-axis, one for y-axis
    expect(axisLines.length).toBeGreaterThanOrEqual(2)
  })

  it('applies d3c-tick-line class on tick marks', () => {
    const { container } = renderBarChart()
    const tickLines = container.querySelectorAll('.d3c-tick-line')
    expect(tickLines.length).toBeGreaterThan(0)
  })

  it('applies d3c-grid-line class on grid lines', () => {
    const { container } = renderBarChart()
    const gridLines = container.querySelectorAll('.d3c-grid-line')
    expect(gridLines.length).toBeGreaterThan(0)
  })

  it('applies d3c-legend-text class on legend labels when legend is shown', () => {
    const { container } = renderBarChart({
      data: multiSeriesData,
      keys: ['car', 'bus', 'cycle'],
      categoryKey: 'month',
    })
    const legendTexts = container.querySelectorAll('.d3c-legend-text')
    expect(legendTexts.length).toBe(3) // one per key
  })
})

// ===========================================================================
// 10. STACKED MODE WITH THEME
// ===========================================================================

describe('BarChart — stacked mode with theme', () => {
  it('uses theme palette in stacked mode', () => {
    const { container } = renderBarChart({
      data: multiSeriesData,
      keys: ['car', 'bus', 'cycle'],
      categoryKey: 'month',
      mode: 'stacked',
    })
    // In stacked mode, each layer <g> has a fill attribute with its palette color
    const layerGroups = container.querySelectorAll('svg > g > g[fill]')
    const fills = Array.from(layerGroups).map((g) => g.getAttribute('fill'))
    expect(fills).toContain(lightTheme.palette[0])
    expect(fills).toContain(lightTheme.palette[1])
    expect(fills).toContain(lightTheme.palette[2])
  })

  it('uses custom theme palette in stacked mode', () => {
    const customPalette = ['#aa0000', '#00aa00', '#0000aa']
    const { container } = renderBarChart(
      {
        data: multiSeriesData,
        keys: ['car', 'bus', 'cycle'],
        categoryKey: 'month',
        mode: 'stacked',
      },
      { theme: 'light', overrides: { palette: customPalette } },
    )
    const layerGroups = container.querySelectorAll('svg > g > g[fill]')
    const fills = Array.from(layerGroups).map((g) => g.getAttribute('fill'))
    expect(fills).toContain('#aa0000')
    expect(fills).toContain('#00aa00')
    expect(fills).toContain('#0000aa')
  })

  it('applies barBorderRadius in stacked mode', () => {
    const { container } = renderBarChart(
      {
        data: multiSeriesData,
        keys: ['car', 'bus', 'cycle'],
        categoryKey: 'month',
        mode: 'stacked',
      },
      { theme: 'light', overrides: { barBorderRadius: '5' } },
    )
    const rect = container.querySelector('rect')
    expect(rect).toHaveAttribute('rx', '5')
  })
})

// ===========================================================================
// 11. MULTIPLE PROVIDERS (scoping)
// ===========================================================================

describe('BarChart — multiple theme providers', () => {
  it('each provider scopes independently', () => {
    const { container } = render(
      <div>
        <ChartThemeProvider theme="light" overrides={{ palette: ['#aaaaaa'] }}>
          <BarChart
            data={singleSeriesData}
            keys={['value']}
            categoryKey="label"
            width={400}
            height={300}
            ariaLabel="Chart A"
          />
        </ChartThemeProvider>
        <ChartThemeProvider theme="light" overrides={{ palette: ['#bbbbbb'] }}>
          <BarChart
            data={singleSeriesData}
            keys={['value']}
            categoryKey="label"
            width={400}
            height={300}
            ariaLabel="Chart B"
          />
        </ChartThemeProvider>
      </div>,
    )

    const svgs = container.querySelectorAll('svg')
    expect(svgs).toHaveLength(2)

    // Chart A bars use #aaaaaa
    const rectsA = svgs[0].querySelectorAll('rect')
    expect(rectsA[0]).toHaveAttribute('fill', '#aaaaaa')

    // Chart B bars use #bbbbbb
    const rectsB = svgs[1].querySelectorAll('rect')
    expect(rectsB[0]).toHaveAttribute('fill', '#bbbbbb')
  })

  it('renders two separate <style> tags', () => {
    const { container } = render(
      <div>
        <ChartThemeProvider theme="light">
          <span>A</span>
        </ChartThemeProvider>
        <ChartThemeProvider theme="dark">
          <span>B</span>
        </ChartThemeProvider>
      </div>,
    )

    const styles = container.parentElement?.querySelectorAll('style')
    expect(styles?.length).toBeGreaterThanOrEqual(2)
  })
})
