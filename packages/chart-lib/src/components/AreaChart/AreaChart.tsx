'use client'

import { scaleLinear } from 'd3-scale'
import { line, area } from 'd3-shape'
import { DEFAULT_MARGIN } from '../../types'
import type { LineSeries, Margin } from '../../types'
import { getLinearTicks } from '../../utils/axes'
import { curveMap } from '../../utils/curves'
import type { CurveType } from '../../utils/curves'
import { getLineExtent } from '../../utils/scales'
import { AxisBottom } from '../shared/AxisBottom'
import { AxisLeft } from '../shared/AxisLeft'
import { Legend } from '../shared/Legend'
import { useChartTheme } from '../../theme/useChartTheme'

export interface AreaChartProps {
  /** Array of line series to render as filled areas */
  series: LineSeries[]
  /** Width of the SVG in pixels */
  width: number
  /** Height of the SVG in pixels */
  height: number
  /** Margins around the chart area */
  margin?: Margin
  /** Curve interpolation type */
  curve?: CurveType
  /** Per-series colors keyed by series id (overrides theme palette) */
  colors?: Record<string, string>
  /** Opacity of the filled area (0–1) */
  fillOpacity?: number
  /** Accessible label describing the chart */
  ariaLabel?: string
  /** Custom CSS class name for the SVG element */
  className?: string
  /** Formatter for x-axis tick labels */
  xTickFormat?: (value: string | number) => string
  /** Formatter for y-axis tick labels */
  yTickFormat?: (value: string | number) => string
  /** Label for the x-axis */
  xAxisLabel?: string
  /** Label for the y-axis */
  yAxisLabel?: string
}

export function AreaChart({
  series,
  width,
  height,
  margin = DEFAULT_MARGIN,
  curve = 'monotoneX',
  colors,
  fillOpacity = 0.3,
  ariaLabel = 'Area chart',
  className,
  xTickFormat,
  yTickFormat,
  xAxisLabel,
  yAxisLabel,
}: AreaChartProps) {
  const theme = useChartTheme()
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  const allData = series.map((s) => s.data)
  const [xMin, xMax] = getLineExtent(allData, (d) => d.x)
  const [yMin, yMax] = getLineExtent(allData, (d) => d.y)

  const xScale = scaleLinear().domain([xMin, xMax]).range([0, innerWidth]).nice()
  const yScale = scaleLinear()
    .domain([Math.min(0, yMin), yMax])
    .range([innerHeight, 0])
    .nice()

  const curveFunc = curveMap[curve]

  const lineGenerator = line<{ x: number; y: number }>()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y))
    .curve(curveFunc)

  const areaGenerator = area<{ x: number; y: number }>()
    .x((d) => xScale(d.x))
    .y0(yScale(0))
    .y1((d) => yScale(d.y))
    .curve(curveFunc)

  const xTicks = getLinearTicks(xScale)
  const yTicks = getLinearTicks(yScale)

  const colorMap = Object.fromEntries(
    series.map((s, i) => [
      s.id,
      s.color ?? colors?.[s.id] ?? theme.palette[i % theme.palette.length],
    ]),
  )

  const showLegend = series.length > 1

  const strokeWidth = Number(theme.lineStrokeWidth)
  const pointR = Number(theme.pointRadius)

  return (
    <svg width={width} height={height} role="img" aria-label={ariaLabel} className={className}>
      <desc>{ariaLabel}</desc>
      <rect width={width} height={height} fill={theme.chartBackground} aria-hidden="true" />
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <AxisLeft
          ticks={yTicks}
          width={innerWidth}
          height={innerHeight}
          tickFormat={yTickFormat}
          label={yAxisLabel}
          labelOffset={margin.left - 10}
        />
        <AxisBottom
          ticks={xTicks}
          height={innerHeight}
          width={innerWidth}
          tickFormat={xTickFormat}
          label={xAxisLabel}
          labelOffset={margin.bottom - 6}
        />
        {series.map((s) => {
          const fillColor = colorMap[s.id]
          return (
            <path
              key={`area-${s.id}`}
              className="d3c-area-fill"
              d={areaGenerator(s.data) ?? ''}
              fill={fillColor}
              fillOpacity={fillOpacity}
              aria-hidden="true"
            />
          )
        })}
        {series.map((s) => {
          const strokeColor = colorMap[s.id]
          const pathData = lineGenerator(s.data)
          return (
            <g key={s.id}>
              <path
                d={pathData ?? ''}
                fill="none"
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {s.data.map((point, j) => (
                <circle
                  key={j}
                  cx={xScale(point.x)}
                  cy={yScale(point.y)}
                  r={pointR}
                  fill={strokeColor}
                >
                  <title>{`(${point.x}, ${point.y})`}</title>
                </circle>
              ))}
            </g>
          )
        })}
        {showLegend && (
          <Legend
            items={series.map((s) => ({ key: s.id, color: colorMap[s.id] }))}
            innerWidth={innerWidth}
            marginTop={margin.top}
          />
        )}
      </g>
    </svg>
  )
}
