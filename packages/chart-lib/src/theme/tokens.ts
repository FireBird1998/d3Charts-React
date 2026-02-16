export interface ChartTheme {
  /** Base font family for all text in the chart */
  fontFamily: string

  /** --- Tick labels --- */
  /** Font size for axis tick labels */
  tickFontSize: string
  /** Font weight for axis tick labels */
  tickFontWeight: string
  /** Fill color for axis tick labels */
  tickColor: string

  /** --- Axis lines --- */
  /** Stroke color for the main axis lines */
  axisLineColor: string
  /** Stroke width for the main axis lines */
  axisLineWidth: string

  /** --- Grid lines --- */
  /** Stroke color for background grid lines */
  gridLineColor: string
  /** Stroke width for background grid lines */
  gridLineWidth: string
  /** Dash pattern for grid lines (SVG stroke-dasharray) */
  gridLineDasharray: string

  /** --- Legend --- */
  /** Font size for legend labels */
  legendFontSize: string
  /** Font weight for legend labels */
  legendFontWeight: string
  /** Fill color for legend labels */
  legendColor: string

  /** --- Chart background --- */
  /** Background color of the chart SVG */
  chartBackground: string

  /** --- Data palette --- */
  /** Ordered color palette for data series (up to 10 entries) */
  palette: string[]

  /** --- Bar chart --- */
  /** Border radius (rx) applied to bar rects */
  barBorderRadius: string

  /** --- Line chart --- */
  /** Stroke width of data lines */
  lineStrokeWidth: string
  /** Radius of data point circles */
  pointRadius: string

  /** --- Pie chart --- */
  /** Stroke color between pie slices */
  pieStrokeColor: string
  /** Stroke width between pie slices */
  pieStrokeWidth: string
  /** Fill color for pie slice labels */
  pieLabelColor: string
  /** Font size for pie slice labels */
  pieLabelFontSize: string
  /** Font weight for pie slice labels */
  pieLabelFontWeight: string
}

export interface ChartThemeProviderProps {
  /** Preset name or a full custom theme object */
  theme?: 'light' | 'dark' | ChartTheme
  /** Partial overrides merged on top of the resolved theme */
  overrides?: Partial<ChartTheme>
  /** React children to render inside the theme scope */
  children: React.ReactNode
}

/**
 * Maps every scalar ChartTheme key to its namespaced CSS custom property.
 * Palette entries are handled separately as --d3c-palette-0 .. --d3c-palette-9.
 */
export const cssVarNames: Record<keyof Omit<ChartTheme, 'palette'>, string> = {
  fontFamily: '--d3c-font-family',
  tickFontSize: '--d3c-tick-font-size',
  tickFontWeight: '--d3c-tick-font-weight',
  tickColor: '--d3c-tick-color',
  axisLineColor: '--d3c-axis-line-color',
  axisLineWidth: '--d3c-axis-line-width',
  gridLineColor: '--d3c-grid-line-color',
  gridLineWidth: '--d3c-grid-line-width',
  gridLineDasharray: '--d3c-grid-line-dasharray',
  legendFontSize: '--d3c-legend-font-size',
  legendFontWeight: '--d3c-legend-font-weight',
  legendColor: '--d3c-legend-color',
  chartBackground: '--d3c-chart-bg',
  barBorderRadius: '--d3c-bar-border-radius',
  lineStrokeWidth: '--d3c-line-stroke-width',
  pointRadius: '--d3c-point-radius',
  pieStrokeColor: '--d3c-pie-stroke-color',
  pieStrokeWidth: '--d3c-pie-stroke-width',
  pieLabelColor: '--d3c-pie-label-color',
  pieLabelFontSize: '--d3c-pie-label-font-size',
  pieLabelFontWeight: '--d3c-pie-label-font-weight',
}
