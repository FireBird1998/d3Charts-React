import type { Meta, StoryObj } from '@storybook/react'
import { within, expect } from '@storybook/test'
import type { ReactNode } from 'react'
import { BarChart } from './BarChart'
import { ChartThemeProvider } from '../../theme/ChartThemeProvider'
import { lightTheme } from '../../theme/defaultTheme'
import { darkTheme } from '../../theme/darkTheme'
import type { ChartTheme } from '../../theme/tokens'

// ---------------------------------------------------------------------------
// Shared test data
// ---------------------------------------------------------------------------

const singleSeriesData = [
  { month: 'Jan', sales: 30 },
  { month: 'Feb', sales: 80 },
  { month: 'Mar', sales: 45 },
  { month: 'Apr', sales: 60 },
  { month: 'May', sales: 20 },
  { month: 'Jun', sales: 90 },
  { month: 'Jul', sales: 55 },
]

const vehicleSalesData = [
  { month: 'Jan', car: 120, bus: 45, cycle: 80 },
  { month: 'Feb', car: 150, bus: 50, cycle: 65 },
  { month: 'Mar', car: 90, bus: 60, cycle: 100 },
  { month: 'Apr', car: 130, bus: 55, cycle: 75 },
  { month: 'May', car: 110, bus: 40, cycle: 90 },
  { month: 'Jun', car: 160, bus: 65, cycle: 70 },
]

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta: Meta<typeof BarChart> = {
  title: 'Charts/BarChart',
  component: BarChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    width: {
      control: { type: 'range', min: 200, max: 1000, step: 50 },
      description: 'Width of the SVG in pixels',
    },
    height: {
      control: { type: 'range', min: 150, max: 600, step: 50 },
      description: 'Height of the SVG in pixels',
    },
    mode: {
      control: 'select',
      options: ['grouped', 'stacked'],
      description: 'Bar grouping mode',
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible label for the chart',
    },
    // Complex props: hide from controls panel since they need structured data
    data: { table: { disable: true } },
    keys: { table: { disable: true } },
    categoryKey: { table: { disable: true } },
    colors: { table: { disable: true } },
    margin: { table: { disable: true } },
  },
}

export default meta
type Story = StoryObj<typeof BarChart>

// ---------------------------------------------------------------------------
// Helper: wraps a chart in a theme provider + optional dark background
// ---------------------------------------------------------------------------

function ThemeWrapper({ theme, children }: { theme: 'light' | 'dark'; children: ReactNode }) {
  if (theme === 'dark') {
    return (
      <ChartThemeProvider theme="dark">
        <div style={{ background: '#1f2937', padding: 24, borderRadius: 8 }}>{children}</div>
      </ChartThemeProvider>
    )
  }
  return <ChartThemeProvider theme="light">{children}</ChartThemeProvider>
}

// ===========================================================================
// BASIC STORIES (controls-compatible via args)
// ===========================================================================

export const SingleSeries: Story = {
  args: {
    data: singleSeriesData,
    keys: ['sales'],
    categoryKey: 'month',
    width: 600,
    height: 400,
    ariaLabel: 'Monthly sales',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const svg = canvas.getByRole('img')

    await expect(svg).toBeInTheDocument()
    await expect(svg.tagName).toBe('svg')
    await expect(svg).toHaveAttribute('aria-label', 'Monthly sales')

    const desc = svg.querySelector('desc')
    await expect(desc).toHaveTextContent('Monthly sales')

    const rects = svg.querySelectorAll('rect')
    await expect(rects.length).toBe(singleSeriesData.length)

    const legend = svg.querySelector('.legend')
    await expect(legend).toBeNull()
  },
}

export const Grouped: Story = {
  args: {
    data: vehicleSalesData,
    keys: ['car', 'bus', 'cycle'],
    categoryKey: 'month',
    width: 700,
    height: 400,
    mode: 'grouped',
    ariaLabel: 'Vehicle sales — grouped',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const svg = canvas.getByRole('img')

    const legend = svg.querySelector('.legend')
    await expect(legend).not.toBeNull()

    const legendTexts = legend?.querySelectorAll('.d3c-legend-text')
    await expect(legendTexts?.length).toBe(3)

    const allRects = svg.querySelectorAll('rect')
    const legendRects = svg.querySelectorAll('.legend rect')
    await expect(allRects.length - legendRects.length).toBe(18)
  },
}

export const Stacked: Story = {
  args: {
    data: vehicleSalesData,
    keys: ['car', 'bus', 'cycle'],
    categoryKey: 'month',
    width: 700,
    height: 400,
    mode: 'stacked',
    ariaLabel: 'Vehicle sales — stacked',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const svg = canvas.getByRole('img')

    const innerG = svg.querySelector('g')
    const layerGroups = innerG?.querySelectorAll(':scope > g[fill]')
    await expect(layerGroups?.length).toBe(3)

    const fills = Array.from(layerGroups ?? []).map((g) => g.getAttribute('fill'))
    await expect(fills).toContain(lightTheme.palette[0])
    await expect(fills).toContain(lightTheme.palette[1])
    await expect(fills).toContain(lightTheme.palette[2])
  },
}

export const CustomColors: Story = {
  args: {
    data: vehicleSalesData,
    keys: ['car', 'bus', 'cycle'],
    categoryKey: 'month',
    width: 700,
    height: 400,
    mode: 'grouped',
    colors: {
      car: '#e63946',
      bus: '#457b9d',
      cycle: '#2a9d8f',
    },
    ariaLabel: 'Vehicle sales — custom colors',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const svg = canvas.getByRole('img')

    const rects = svg.querySelectorAll('rect:not(.legend rect)')
    const firstRect = rects[0]
    await expect(firstRect).toHaveAttribute('fill', '#e63946')
  },
}

export const StackedCustomColors: Story = {
  args: {
    data: vehicleSalesData,
    keys: ['car', 'bus', 'cycle'],
    categoryKey: 'month',
    width: 700,
    height: 400,
    mode: 'stacked',
    colors: {
      car: '#264653',
      bus: '#e9c46a',
      cycle: '#f4a261',
    },
    ariaLabel: 'Vehicle sales — stacked custom',
  },
}

// ===========================================================================
// THEME STORIES (controls still work for width/height/mode via args + decorator)
// ===========================================================================

export const LightThemeDefault: Story = {
  name: 'Theme: Light (default palette)',
  decorators: [
    (Story) => (
      <ThemeWrapper theme="light">
        <Story />
      </ThemeWrapper>
    ),
  ],
  args: {
    data: vehicleSalesData,
    keys: ['car', 'bus', 'cycle'],
    categoryKey: 'month',
    width: 700,
    height: 400,
    mode: 'grouped',
    ariaLabel: 'Light theme bar chart',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const svg = canvas.getByRole('img')

    const firstRect = svg.querySelector('rect')
    await expect(firstRect).toHaveAttribute('fill', lightTheme.palette[0])
    await expect(firstRect).toHaveAttribute('rx', lightTheme.barBorderRadius)

    const tickTexts = svg.querySelectorAll('.d3c-tick-text')
    await expect(tickTexts.length).toBeGreaterThan(0)

    const axisLines = svg.querySelectorAll('.d3c-axis-line')
    await expect(axisLines.length).toBeGreaterThanOrEqual(2)

    const gridLines = svg.querySelectorAll('.d3c-grid-line')
    await expect(gridLines.length).toBeGreaterThan(0)

    const tickLines = svg.querySelectorAll('.d3c-tick-line')
    await expect(tickLines.length).toBeGreaterThan(0)

    const styleEl = canvasElement.parentElement?.querySelector('style')
    await expect(styleEl).not.toBeNull()
    await expect(styleEl?.innerHTML).toContain('--d3c-tick-color')
    await expect(styleEl?.innerHTML).toContain('--d3c-palette-0')
    await expect(styleEl?.innerHTML).toContain('.d3c-tick-text')
  },
}

export const DarkTheme: Story = {
  name: 'Theme: Dark',
  decorators: [
    (Story) => (
      <ThemeWrapper theme="dark">
        <Story />
      </ThemeWrapper>
    ),
  ],
  args: {
    data: vehicleSalesData,
    keys: ['car', 'bus', 'cycle'],
    categoryKey: 'month',
    width: 700,
    height: 400,
    mode: 'grouped',
    ariaLabel: 'Dark theme bar chart',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const svg = canvas.getByRole('img')

    const firstRect = svg.querySelector('rect')
    await expect(firstRect).toHaveAttribute('fill', darkTheme.palette[0])

    const styleEl = canvasElement.parentElement?.querySelector('style')
    await expect(styleEl?.innerHTML).toContain(darkTheme.tickColor)
    await expect(styleEl?.innerHTML).toContain(darkTheme.axisLineColor)
    await expect(styleEl?.innerHTML).toContain(darkTheme.gridLineColor)
  },
}

export const CustomPaletteOverride: Story = {
  name: 'Theme: Custom palette override',
  decorators: [
    (Story) => (
      <ChartThemeProvider
        theme="light"
        overrides={{ palette: ['#6366f1', '#ec4899', '#14b8a6'], barBorderRadius: '6' }}
      >
        <Story />
      </ChartThemeProvider>
    ),
  ],
  args: {
    data: vehicleSalesData,
    keys: ['car', 'bus', 'cycle'],
    categoryKey: 'month',
    width: 700,
    height: 400,
    mode: 'grouped',
    ariaLabel: 'Custom palette bar chart',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const svg = canvas.getByRole('img')

    const firstRect = svg.querySelector('rect')
    await expect(firstRect).toHaveAttribute('fill', '#6366f1')
    await expect(firstRect).toHaveAttribute('rx', '6')
  },
}

export const CustomFontOverride: Story = {
  name: 'Theme: Custom font + tick styling',
  decorators: [
    (Story) => (
      <ChartThemeProvider
        theme="light"
        overrides={{
          fontFamily: "'JetBrains Mono', monospace",
          tickFontSize: '14px',
          tickFontWeight: '600',
          tickColor: '#6366f1',
          axisLineColor: '#6366f1',
          gridLineColor: '#e0e7ff',
          legendFontSize: '13px',
          legendColor: '#4338ca',
        }}
      >
        <Story />
      </ChartThemeProvider>
    ),
  ],
  args: {
    data: vehicleSalesData,
    keys: ['car', 'bus', 'cycle'],
    categoryKey: 'month',
    width: 700,
    height: 400,
    mode: 'grouped',
    ariaLabel: 'Custom font bar chart',
  },
  play: async ({ canvasElement }) => {
    const styleEl = canvasElement.parentElement?.querySelector('style')

    await expect(styleEl?.innerHTML).toContain("'JetBrains Mono', monospace")
    await expect(styleEl?.innerHTML).toContain('14px')
    await expect(styleEl?.innerHTML).toContain('#6366f1')
    await expect(styleEl?.innerHTML).toContain('#e0e7ff')
    await expect(styleEl?.innerHTML).toContain('13px')
    await expect(styleEl?.innerHTML).toContain('#4338ca')
  },
}

export const ColorsOverrideTheme: Story = {
  name: 'Theme: colors prop overrides theme palette',
  decorators: [
    (Story) => (
      <ChartThemeProvider theme="light" overrides={{ palette: ['#aaaaaa', '#bbbbbb', '#cccccc'] }}>
        <Story />
      </ChartThemeProvider>
    ),
  ],
  args: {
    data: vehicleSalesData,
    keys: ['car', 'bus', 'cycle'],
    categoryKey: 'month',
    width: 700,
    height: 400,
    mode: 'grouped',
    colors: { car: '#ff0000' },
    ariaLabel: 'Colors override bar chart',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const svg = canvas.getByRole('img')

    const rects = svg.querySelectorAll('rect')
    await expect(rects[0]).toHaveAttribute('fill', '#ff0000')
    await expect(rects[1]).toHaveAttribute('fill', '#bbbbbb')
  },
}

export const StackedDarkTheme: Story = {
  name: 'Theme: Stacked bars in dark mode',
  decorators: [
    (Story) => (
      <ThemeWrapper theme="dark">
        <Story />
      </ThemeWrapper>
    ),
  ],
  args: {
    data: vehicleSalesData,
    keys: ['car', 'bus', 'cycle'],
    categoryKey: 'month',
    width: 700,
    height: 400,
    mode: 'stacked',
    ariaLabel: 'Stacked dark bar chart',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const svg = canvas.getByRole('img')

    const innerG = svg.querySelector('g')
    const layerGroups = innerG?.querySelectorAll(':scope > g[fill]')
    await expect(layerGroups?.length).toBe(3)

    const fills = Array.from(layerGroups ?? []).map((g) => g.getAttribute('fill'))
    await expect(fills).toContain(darkTheme.palette[0])

    const rect = svg.querySelector('rect')
    await expect(rect).toHaveAttribute('rx', darkTheme.barBorderRadius)
  },
}

export const FullyCustomTheme: Story = {
  name: 'Theme: Fully custom theme object',
  decorators: [
    (Story) => {
      const brandTheme: ChartTheme = {
        ...lightTheme,
        fontFamily: "'IBM Plex Sans', sans-serif",
        tickFontSize: '13px',
        tickColor: '#1e3a5f',
        axisLineColor: '#1e3a5f',
        gridLineColor: '#d4e4f7',
        gridLineDasharray: '4,4',
        legendFontSize: '12px',
        legendColor: '#1e3a5f',
        palette: ['#0055ff', '#ff4400', '#00cc88'],
        barBorderRadius: '4',
      }
      return (
        <ChartThemeProvider theme={brandTheme}>
          <Story />
        </ChartThemeProvider>
      )
    },
  ],
  args: {
    data: vehicleSalesData,
    keys: ['car', 'bus', 'cycle'],
    categoryKey: 'month',
    width: 700,
    height: 400,
    mode: 'grouped',
    ariaLabel: 'Brand theme bar chart',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const svg = canvas.getByRole('img')

    const firstRect = svg.querySelector('rect')
    await expect(firstRect).toHaveAttribute('fill', '#0055ff')
    await expect(firstRect).toHaveAttribute('rx', '4')

    const styleEl = canvasElement.parentElement?.querySelector('style')
    await expect(styleEl?.innerHTML).toContain("'IBM Plex Sans', sans-serif")
    await expect(styleEl?.innerHTML).toContain('#1e3a5f')
    await expect(styleEl?.innerHTML).toContain('4,4')
  },
}

export const SideBySideThemes: Story = {
  name: 'Theme: Light vs Dark side-by-side',
  // This story uses a custom render because it shows two charts simultaneously
  render: (args) => (
    <div style={{ display: 'flex', gap: 24 }}>
      <ChartThemeProvider theme="light">
        <div>
          <h3 style={{ textAlign: 'center', margin: '0 0 8px' }}>Light</h3>
          <BarChart {...args} width={400} height={300} />
        </div>
      </ChartThemeProvider>
      <ChartThemeProvider theme="dark">
        <div style={{ background: '#1f2937', padding: 16, borderRadius: 8 }}>
          <h3 style={{ textAlign: 'center', margin: '0 0 8px', color: '#f9fafb' }}>Dark</h3>
          <BarChart {...args} width={400} height={300} />
        </div>
      </ChartThemeProvider>
    </div>
  ),
  args: {
    data: vehicleSalesData,
    keys: ['car', 'bus', 'cycle'],
    categoryKey: 'month',
    mode: 'grouped',
    ariaLabel: 'Side-by-side bar chart',
  },
  play: async ({ canvasElement }) => {
    const svgs = canvasElement.querySelectorAll('svg')
    await expect(svgs.length).toBe(2)

    const lightRect = svgs[0].querySelector('rect')
    const darkRect = svgs[1].querySelector('rect')
    await expect(lightRect).toHaveAttribute('fill', lightTheme.palette[0])
    await expect(darkRect).toHaveAttribute('fill', darkTheme.palette[0])

    const styles = canvasElement.parentElement?.querySelectorAll('style')
    await expect(styles?.length ?? 0).toBeGreaterThanOrEqual(2)
  },
}

// ===========================================================================
// EDGE CASE STORIES
// ===========================================================================

export const EmptyData: Story = {
  name: 'Edge: Empty data array',
  args: {
    data: [],
    keys: ['value'],
    categoryKey: 'label',
    width: 400,
    height: 300,
    ariaLabel: 'Empty bar chart',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const svg = canvas.getByRole('img')
    await expect(svg).toBeInTheDocument()

    const rects = svg.querySelectorAll('rect')
    await expect(rects.length).toBe(0)
  },
}

export const SingleDataPoint: Story = {
  name: 'Edge: Single data point',
  args: {
    data: [{ label: 'Only', value: 42 }],
    keys: ['value'],
    categoryKey: 'label',
    width: 400,
    height: 300,
    ariaLabel: 'Single item bar chart',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const svg = canvas.getByRole('img')

    const rects = svg.querySelectorAll('rect')
    await expect(rects.length).toBe(1)

    const title = rects[0].querySelector('title')
    await expect(title?.textContent).toContain('42')
  },
}
