'use client'

import { pie, arc } from 'd3-shape'
import type { PieArcDatum } from 'd3-shape'
import type { DataPoint } from '../../types'
import { useChartTheme } from '../../theme/useChartTheme'

export interface PieChartProps {
  /** The data to render as pie slices */
  data: DataPoint[]
  /** Width of the SVG in pixels */
  width: number
  /** Height of the SVG in pixels */
  height: number
  /** Inner radius for donut charts (0 = full pie, > 0 = donut) */
  innerRadius?: number
  /** Padding angle between slices in radians */
  padAngle?: number
  /** Corner radius for rounded slice edges */
  cornerRadius?: number
  /** Custom color palette (takes precedence over theme palette) */
  colors?: string[]
  /** Whether to show labels on slices */
  showLabels?: boolean
  /** Accessible label describing the chart */
  ariaLabel?: string
}

export function PieChart({
  data,
  width,
  height,
  innerRadius = 0,
  padAngle = 0.01,
  cornerRadius = 2,
  colors,
  showLabels = true,
  ariaLabel = 'Pie chart',
}: PieChartProps) {
  const theme = useChartTheme()
  const palette = colors ?? theme.palette
  const outerRadius = Math.min(width, height) / 2 - 10

  const pieGenerator = pie<DataPoint>()
    .value((d) => d.value)
    .sort(null)
    .padAngle(padAngle)

  const arcGenerator = arc<PieArcDatum<DataPoint>>()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .cornerRadius(cornerRadius)

  const labelArc = arc<PieArcDatum<DataPoint>>()
    .innerRadius(outerRadius * 0.65)
    .outerRadius(outerRadius * 0.65)

  const arcs = pieGenerator(data)

  return (
    <svg width={width} height={height} role="img" aria-label={ariaLabel}>
      <desc>{ariaLabel}</desc>
      <g transform={`translate(${width / 2}, ${height / 2})`}>
        {arcs.map((d, i) => {
          const fillColor = palette[i % palette.length]
          return (
            <g key={d.data.label}>
              <path
                d={arcGenerator(d) ?? ''}
                fill={fillColor}
                stroke={theme.pieStrokeColor}
                strokeWidth={Number(theme.pieStrokeWidth)}
              >
                <title>{`${d.data.label}: ${d.data.value}`}</title>
              </path>
              {showLabels && d.endAngle - d.startAngle > 0.3 && (
                <text
                  transform={`translate(${labelArc.centroid(d)})`}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={theme.pieLabelColor}
                  fontSize={theme.pieLabelFontSize}
                  fontWeight={theme.pieLabelFontWeight}
                  pointerEvents="none"
                >
                  {d.data.label}
                </text>
              )}
            </g>
          )
        })}
      </g>
    </svg>
  )
}
