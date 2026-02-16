import type { TickLine } from '../../utils/axes'

interface AxisBottomProps {
  ticks: TickLine[]
  /** The full inner height of the chart area (used to position the axis at the bottom) */
  height: number
  /** The full inner width of the chart area (used for the axis line length) */
  width: number
}

export function AxisBottom({ ticks, height, width }: AxisBottomProps) {
  return (
    <g transform={`translate(0, ${height})`}>
      <line x1={0} x2={width} stroke="currentColor" />
      {ticks.map(({ value, offset }) => (
        <g key={String(value)} transform={`translate(${offset}, 0)`}>
          <line y2={6} stroke="currentColor" />
          <text y={9} dy="0.71em" textAnchor="middle" fill="currentColor" fontSize={12}>
            {String(value)}
          </text>
        </g>
      ))}
    </g>
  )
}
