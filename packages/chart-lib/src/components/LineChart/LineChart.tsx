'use client'

import { scaleLinear } from 'd3-scale'
import { line, curveMonotoneX, curveLinear, curveNatural, curveStep } from 'd3-shape'
import { DEFAULT_MARGIN } from '../../types'
import type { LineSeries, Margin } from '../../types'
import { getLinearTicks } from '../../utils/axes'
import { getLineExtent } from '../../utils/scales'
import { AxisBottom } from '../shared/AxisBottom'
import { AxisLeft } from '../shared/AxisLeft'
import { useChartTheme } from '../../theme/useChartTheme'
import { Legend } from '../shared/Legend'

export type CurveType = 'linear' | 'monotoneX' | 'natural' | 'step'

const curveMap = {
  linear: curveLinear,
  monotoneX: curveMonotoneX,
  natural: curveNatural,
  step: curveStep,
} as const

export interface LineChartProps {
  /** Array of line series to render */
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
  /** Accessible label describing the chart */
  ariaLabel?: string
  /** Custom CSS class name for the SVG element */
  className?: string
  /** Formatter for x-axis tick labels */
  xTickFormat?: (value: string | number) => string
  /** Formatter for y-axis tick labels */
  yTickFormat?: (value: string | number) => string
}

export function LineChart({
  series,
  width,
  height,
  margin = DEFAULT_MARGIN,
  curve = 'monotoneX',
  colors,
  ariaLabel = 'Line chart',
  className,
  xTickFormat,
  yTickFormat,
}: LineChartProps) {
  const theme = useChartTheme()
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  const allData = series.map((s) => s.data)
  const [xMin, xMax] = getLineExtent(allData, (d) => d.x)
  const [yMin, yMax] = getLineExtent(allData, (d) => d.y)

  const xScale = scaleLinear().domain([xMin, xMax]).range([0, innerWidth]).nice()
  const yScale = scaleLinear().domain([yMin, yMax]).range([innerHeight, 0]).nice()

  const lineGenerator = line<{ x: number; y: number }>()
    .x((d) => xScale(d.x))
    .y((d) => yScale(d.y))
    .curve(curveMap[curve])

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
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <AxisLeft ticks={yTicks} width={innerWidth} height={innerHeight} tickFormat={yTickFormat} />
        <AxisBottom
          ticks={xTicks}
          height={innerHeight}
          width={innerWidth}
          tickFormat={xTickFormat}
        />
        {series.map((s, i) => {
          const pathData = lineGenerator(s.data)
          const strokeColor = colorMap[s.id]
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
        {/* TODO: Legend positioning is hardcoded; see ADR-004 Risk #4 */}
        {showLegend && (
          <Legend
            items={series.map((s) => ({ key: s.id, color: colorMap[s.id] }))}
            x={innerWidth - series.length * 90}
            y={-margin.top + 4}
          />
        )}
      </g>
    </svg>
  )
}
