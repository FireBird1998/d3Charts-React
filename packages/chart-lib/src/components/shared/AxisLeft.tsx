import type { TickLine } from '../../utils/axes'

interface AxisLeftProps {
  ticks: TickLine[]
  /** The full inner width of the chart area (used for grid lines) */
  width: number
  /** The full inner height of the chart area (used for the axis line length) */
  height: number
}

export function AxisLeft({ ticks, width, height }: AxisLeftProps) {
  return (
    <g>
      <line y1={0} y2={height} className="d3c-axis-line" />
      {ticks.map(({ value, offset }) => (
        <g key={String(value)} transform={`translate(0, ${offset})`}>
          <line x2={-6} className="d3c-tick-line" />
          <line x2={width} className="d3c-grid-line" />
          <text x={-9} dy="0.32em" textAnchor="end" className="d3c-tick-text">
            {String(value)}
          </text>
        </g>
      ))}
    </g>
  )
}
