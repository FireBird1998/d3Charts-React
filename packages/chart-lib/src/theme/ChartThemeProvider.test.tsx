import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ChartThemeProvider } from './ChartThemeProvider'
import { useChartTheme } from './useChartTheme'
import { lightTheme } from './defaultTheme'
import { darkTheme } from './darkTheme'

/** Helper component that renders theme values as text for assertion. */
function ThemeInspector() {
  const theme = useChartTheme()
  return (
    <div>
      <span data-testid="tick-color">{theme.tickColor}</span>
      <span data-testid="font-family">{theme.fontFamily}</span>
      <span data-testid="palette-0">{theme.palette[0]}</span>
      <span data-testid="pie-stroke">{theme.pieStrokeColor}</span>
    </div>
  )
}

describe('ChartThemeProvider', () => {
  it('renders children without error', () => {
    render(
      <ChartThemeProvider>
        <span>child</span>
      </ChartThemeProvider>,
    )
    expect(screen.getByText('child')).toBeInTheDocument()
  })

  it('injects a <style> tag with CSS variables', () => {
    const { container } = render(
      <ChartThemeProvider>
        <span>hello</span>
      </ChartThemeProvider>,
    )
    const style = container.parentElement?.querySelector('style')
    expect(style).toBeTruthy()
    expect(style?.innerHTML).toContain('--d3c-font-family')
    expect(style?.innerHTML).toContain('--d3c-tick-color')
    expect(style?.innerHTML).toContain('--d3c-palette-0')
  })

  it('provides the light theme by default', () => {
    render(
      <ChartThemeProvider>
        <ThemeInspector />
      </ChartThemeProvider>,
    )
    expect(screen.getByTestId('tick-color')).toHaveTextContent(lightTheme.tickColor)
    expect(screen.getByTestId('palette-0')).toHaveTextContent(lightTheme.palette[0])
  })

  it('provides the dark theme when theme="dark"', () => {
    render(
      <ChartThemeProvider theme="dark">
        <ThemeInspector />
      </ChartThemeProvider>,
    )
    expect(screen.getByTestId('tick-color')).toHaveTextContent(darkTheme.tickColor)
    expect(screen.getByTestId('pie-stroke')).toHaveTextContent(darkTheme.pieStrokeColor)
  })

  it('applies partial overrides on top of preset', () => {
    render(
      <ChartThemeProvider theme="light" overrides={{ tickColor: '#ff0000' }}>
        <ThemeInspector />
      </ChartThemeProvider>,
    )
    expect(screen.getByTestId('tick-color')).toHaveTextContent('#ff0000')
    expect(screen.getByTestId('font-family')).toHaveTextContent(lightTheme.fontFamily)
  })

  it('accepts a fully custom theme object', () => {
    const custom = { ...lightTheme, tickColor: '#abcdef', fontFamily: 'Courier' }
    render(
      <ChartThemeProvider theme={custom}>
        <ThemeInspector />
      </ChartThemeProvider>,
    )
    expect(screen.getByTestId('tick-color')).toHaveTextContent('#abcdef')
    expect(screen.getByTestId('font-family')).toHaveTextContent('Courier')
  })

  it('injects base CSS class definitions', () => {
    const { container } = render(
      <ChartThemeProvider>
        <span>hello</span>
      </ChartThemeProvider>,
    )
    const style = container.parentElement?.querySelector('style')
    expect(style?.innerHTML).toContain('.d3c-tick-text')
    expect(style?.innerHTML).toContain('.d3c-axis-line')
    expect(style?.innerHTML).toContain('.d3c-grid-line')
    expect(style?.innerHTML).toContain('.d3c-legend-text')
  })

  it('scopes CSS to a unique data attribute', () => {
    const { container } = render(
      <ChartThemeProvider>
        <span>hello</span>
      </ChartThemeProvider>,
    )
    const wrapper = container.querySelector('[style="display: contents;"]')
    expect(wrapper).toBeTruthy()
    const attrs = Array.from(wrapper?.attributes ?? [])
    const scopeAttr = attrs.find((a) => a.name.startsWith('data-d3c-theme-'))
    expect(scopeAttr).toBeTruthy()
  })
})

describe('useChartTheme', () => {
  it('returns light theme when no provider is present', () => {
    render(<ThemeInspector />)
    expect(screen.getByTestId('tick-color')).toHaveTextContent(lightTheme.tickColor)
  })
})
