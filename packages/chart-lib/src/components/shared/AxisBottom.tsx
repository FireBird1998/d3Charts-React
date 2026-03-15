import type { TickLine } from '../../utils/axes'

interface AxisBottomProps {
  ticks: TickLine[]
  /** The full inner height of the chart area (used to position the axis at the bottom) */
  height: number
  /** The full inner width of the chart area (used for the axis line length) */
  width: number
  /** Optional formatter for tick label values */
  tickFormat?: (value: string | number) => string
  /** Optional axis label displayed below the tick labels */
  label?: string
  /** Distance from axis line to label baseline. Derived from margin.bottom by chart components. */
  labelOffset?: number
}

export function AxisBottom({
  ticks,
  height,
  width,
  tickFormat,
  label,
  labelOffset = 36,
}: AxisBottomProps) {
  return (
    <g transform={`translate(0, ${height})`}>
      <line x1={0} x2={width} className="d3c-axis-line" />
      {ticks.map(({ value, offset }) => (
        <g key={String(value)} transform={`translate(${offset}, 0)`}>
          <line y2={6} className="d3c-tick-line" />
          <text y={9} dy="0.71em" textAnchor="middle" className="d3c-tick-text">
            {tickFormat ? tickFormat(value) : String(value)}
          </text>
        </g>
      ))}
      {label && (
        <text x={width / 2} y={labelOffset} textAnchor="middle" className="d3c-axis-label">
          {label}
        </text>
      )}
    </g>
  )
}
