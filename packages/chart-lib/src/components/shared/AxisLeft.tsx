import type { TickLine } from '../../utils/axes'

interface AxisLeftProps {
  ticks: TickLine[]
  /** The full inner width of the chart area (used for grid lines) */
  width: number
  /** The full inner height of the chart area (used for the axis line length) */
  height: number
  /** Optional formatter for tick label values */
  tickFormat?: (value: string | number) => string
  /** Optional axis label displayed to the left of the tick labels */
  label?: string
  /** Distance from axis line to label center (positive = further left). Derived from margin.left by chart components. */
  labelOffset?: number
}

export function AxisLeft({
  ticks,
  width,
  height,
  tickFormat,
  label,
  labelOffset = 40,
}: AxisLeftProps) {
  return (
    <g>
      <line y1={0} y2={height} className="d3c-axis-line" />
      {ticks.map(({ value, offset }) => (
        <g key={String(value)} transform={`translate(0, ${offset})`}>
          <line x2={-6} className="d3c-tick-line" />
          <line x2={width} className="d3c-grid-line" />
          <text x={-9} dy="0.32em" textAnchor="end" className="d3c-tick-text">
            {tickFormat ? tickFormat(value) : String(value)}
          </text>
        </g>
      ))}
      {label && (
        <text
          transform={`translate(${-labelOffset}, ${height / 2}) rotate(-90)`}
          textAnchor="middle"
          className="d3c-axis-label"
        >
          {label}
        </text>
      )}
    </g>
  )
}
