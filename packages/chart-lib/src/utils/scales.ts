import { min as d3min, max as d3max } from 'd3-array'
import type { LineDataPoint } from '../types'

export function getLineExtent(
  seriesData: LineDataPoint[][],
  accessor: (d: LineDataPoint) => number,
): [number, number] {
  const allValues = seriesData.flatMap((series) => series.map(accessor))
  return [d3min(allValues) ?? 0, d3max(allValues) ?? 0]
}
