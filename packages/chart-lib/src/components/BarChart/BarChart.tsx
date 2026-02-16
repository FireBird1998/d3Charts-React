'use client'

import { scaleBand, scaleLinear } from 'd3-scale'
import { stack as d3stack } from 'd3-shape'
import { max as d3max } from 'd3-array'
import type { Margin } from '../../types'
import { getBandTicks, getLinearTicks } from '../../utils/axes'
import { AxisBottom } from '../shared/AxisBottom'
import { AxisLeft } from '../shared/AxisLeft'
import { Legend } from '../shared/Legend'
import { useChartTheme } from '../../theme/useChartTheme'

export interface BarChartProps<
  D extends Record<string, string | number> = Record<string, string | number>,
> {
  /** Row-based data where each row is a category with series values */
  data: D[]
  /** Keys identifying the numeric series to render as bars */
  keys: (keyof D & string)[]
  /** Key identifying the category (x-axis label) in each data row */
  categoryKey: keyof D & string
  /** Width of the SVG in pixels */
  width: number
  /** Height of the SVG in pixels */
  height: number
  /** Margins around the chart area */
  margin?: Margin
  /** Render bars side-by-side (grouped) or stacked */
  mode?: 'grouped' | 'stacked'
  /** Per-key fill colors (takes precedence over theme palette) */
  colors?: Record<string, string>
  /** Accessible label describing the chart */
  ariaLabel?: string
}

const DEFAULT_MARGIN: Margin = { top: 20, right: 20, bottom: 40, left: 50 }

function getColor(
  key: string,
  index: number,
  palette: string[],
  colors?: Record<string, string>,
): string {
  if (colors?.[key]) return colors[key]
  return palette[index % palette.length]
}

export function BarChart<
  D extends Record<string, string | number> = Record<string, string | number>,
>({
  data,
  keys,
  categoryKey,
  width,
  height,
  margin = DEFAULT_MARGIN,
  mode = 'grouped',
  colors,
  ariaLabel = 'Bar chart',
}: BarChartProps<D>) {
  const theme = useChartTheme()
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  const categories = data.map((d) => String(d[categoryKey]))

  const xScale = scaleBand<string>().domain(categories).range([0, innerWidth]).padding(0.2)

  const xTicks = getBandTicks(xScale)

  const colorMap = Object.fromEntries(
    keys.map((key, i) => [key, getColor(key, i, theme.palette, colors)]),
  )

  const showLegend = keys.length > 1
  const rx = Number(theme.barBorderRadius)

  if (mode === 'stacked') {
    // --- Stacked mode ---
    const stackGenerator = d3stack<D, string>().keys(keys)
    const stackedData = stackGenerator(data)

    const yMax = d3max(stackedData, (layer) => d3max(layer, (d) => d[1])) ?? 0

    const yScale = scaleLinear().domain([0, yMax]).range([innerHeight, 0]).nice()

    const yTicks = getLinearTicks(yScale)

    return (
      <svg width={width} height={height} role="img" aria-label={ariaLabel}>
        <desc>{ariaLabel}</desc>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          <AxisLeft ticks={yTicks} width={innerWidth} height={innerHeight} />
          <AxisBottom ticks={xTicks} height={innerHeight} width={innerWidth} />
          {stackedData.map((layer) => (
            <g key={layer.key} fill={colorMap[layer.key]}>
              {layer.map((segment, i) => {
                const category = String(data[i][categoryKey])
                const x = xScale(category) ?? 0
                const y0 = yScale(segment[0])
                const y1 = yScale(segment[1])
                return (
                  <rect
                    key={category}
                    x={x}
                    y={y1}
                    width={xScale.bandwidth()}
                    height={y0 - y1}
                    rx={rx}
                  >
                    <title>{`${category} — ${layer.key}: ${segment[1] - segment[0]}`}</title>
                  </rect>
                )
              })}
            </g>
          ))}
          {showLegend && (
            <Legend
              items={keys.map((key) => ({ key, color: colorMap[key] }))}
              x={innerWidth - keys.length * 90}
              y={-margin.top + 4}
            />
          )}
        </g>
      </svg>
    )
  }

  // --- Grouped mode (default) ---
  const xSubScale = scaleBand<string>().domain(keys).range([0, xScale.bandwidth()]).padding(0.05)

  const yMax = d3max(data, (d) => d3max(keys, (key) => Number(d[key]) || 0)) ?? 0

  const yScale = scaleLinear().domain([0, yMax]).range([innerHeight, 0]).nice()

  const yTicks = getLinearTicks(yScale)

  return (
    <svg width={width} height={height} role="img" aria-label={ariaLabel}>
      <desc>{ariaLabel}</desc>
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <AxisLeft ticks={yTicks} width={innerWidth} height={innerHeight} />
        <AxisBottom ticks={xTicks} height={innerHeight} width={innerWidth} />
        {data.map((d) => {
          const category = String(d[categoryKey])
          const groupX = xScale(category) ?? 0
          return (
            <g key={category} transform={`translate(${groupX}, 0)`}>
              {keys.map((key) => {
                const value = Number(d[key]) || 0
                return (
                  <rect
                    key={key}
                    x={xSubScale(key)}
                    y={yScale(value)}
                    width={xSubScale.bandwidth()}
                    height={innerHeight - yScale(value)}
                    fill={colorMap[key]}
                    rx={rx}
                  >
                    <title>{`${category} — ${key}: ${value}`}</title>
                  </rect>
                )
              })}
            </g>
          )
        })}
        {showLegend && (
          <Legend
            items={keys.map((key) => ({ key, color: colorMap[key] }))}
            x={innerWidth - keys.length * 90}
            y={-margin.top + 4}
          />
        )}
      </g>
    </svg>
  )
}
