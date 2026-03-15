interface LegendItem {
  key: string
  color: string
}

interface LegendProps {
  items: LegendItem[]
  /** Width of the inner chart area (used for positioning) */
  innerWidth: number
  /** Top margin of the chart (used for vertical positioning) */
  marginTop: number
  /** Width allocated per legend item in pixels */
  itemWidth?: number
  /** Horizontal position of the legend */
  position?: 'top-right' | 'top-left' | 'top-center'
}

export function Legend({
  items,
  innerWidth,
  marginTop,
  itemWidth = 85,
  position = 'top-right',
}: LegendProps) {
  const totalWidth = items.length * itemWidth

  let x: number
  if (position === 'top-left') {
    x = 0
  } else if (position === 'top-center') {
    x = (innerWidth - totalWidth) / 2
  } else {
    x = innerWidth - totalWidth
  }

  const y = -marginTop + 4

  return (
    <g className="legend" transform={`translate(${x}, ${y})`}>
      {items.map((item, i) => (
        <g key={item.key} transform={`translate(${i * itemWidth}, 0)`}>
          <rect width={12} height={12} fill={item.color} rx={2} />
          <text x={16} y={10} className="d3c-legend-text">
            {item.key}
          </text>
        </g>
      ))}
    </g>
  )
}
