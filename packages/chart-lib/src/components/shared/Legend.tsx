interface LegendItem {
  key: string
  color: string
}

interface LegendProps {
  items: LegendItem[]
  /** X position of the legend group */
  x?: number
  /** Y position of the legend group */
  y?: number
}

export function Legend({ items, x = 0, y = 0 }: LegendProps) {
  const itemWidth = 85
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
