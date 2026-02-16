import { scaleBand, scaleLinear } from 'd3-scale'
import type { DataPoint, LineDataPoint } from '../types'

export function createBandScale(data: DataPoint[], rangeEnd: number) {
  return scaleBand<string>()
    .domain(data.map((d) => d.label))
    .range([0, rangeEnd])
    .padding(0.2)
}

export function createLinearScale(domain: [number, number], range: [number, number]) {
  return scaleLinear().domain(domain).range(range).nice()
}

export function getValueExtent(data: DataPoint[]): [number, number] {
  const values = data.map((d) => d.value)
  return [0, Math.max(...values)]
}

export function getLineExtent(
  seriesData: LineDataPoint[][],
  accessor: (d: LineDataPoint) => number,
): [number, number] {
  const allValues = seriesData.flatMap((series) => series.map(accessor))
  return [Math.min(...allValues), Math.max(...allValues)]
}
