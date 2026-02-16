import { scaleLinear } from 'd3-scale'
import { line, curveMonotoneX } from 'd3-shape'
import type { LineSeries, Margin } from '../../types'
import { getLinearTicks } from '../../utils/axes'
import { getLineExtent } from '../../utils/scales'
import { AxisBottom } from '../shared/AxisBottom'
import { AxisLeft } from '../shared/AxisLeft'

export interface LineChartProps {
  /** Array of line series to render */
  series: LineSeries[]
  /** Width of the SVG in pixels */
  width: number
  /** Height of the SVG in pixels */
  height: number
  /** Margins around the chart area */
  margin?: Margin
  /** Whether to use smooth curves */
  smooth?: boolean
  /** Accessible label describing the chart */
  ariaLabel?: string
}

const DEFAULT_MARGIN: Margin = { top: 20, right: 20, bottom: 40, left: 50 }
const DEFAULT_COLORS = ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f', '#edc948']

export function LineChart({
  series,
  width,
  height,
  margin = DEFAULT_MARGIN,
  smooth = true,
  ariaLabel = 'Line chart',
}: LineChartProps) {
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

  if (smooth) {
    lineGenerator.curve(curveMonotoneX)
  }

  const xTicks = getLinearTicks(xScale)
  const yTicks = getLinearTicks(yScale)

  return (
    <svg width={width} height={height} role="img" aria-label={ariaLabel}>
      <desc>{ariaLabel}</desc>
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        <AxisLeft ticks={yTicks} width={innerWidth} height={innerHeight} />
        <AxisBottom ticks={xTicks} height={innerHeight} width={innerWidth} />
        {series.map((s, i) => {
          const pathData = lineGenerator(s.data)
          const strokeColor = s.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length]
          return (
            <g key={s.id}>
              <path
                d={pathData ?? ''}
                fill="none"
                stroke={strokeColor}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {s.data.map((point, j) => (
                <circle key={j} cx={xScale(point.x)} cy={yScale(point.y)} r={3} fill={strokeColor}>
                  <title>{`(${point.x}, ${point.y})`}</title>
                </circle>
              ))}
            </g>
          )
        })}
      </g>
    </svg>
  )
}
