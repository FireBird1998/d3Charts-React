export interface Margin {
  top: number
  right: number
  bottom: number
  left: number
}

export interface DataPoint {
  label: string
  value: number
}

export interface LineDataPoint {
  x: number
  y: number
}

export interface LineSeries {
  id: string
  data: LineDataPoint[]
  color?: string
}

export interface ChartDimensions {
  width: number
  height: number
  margin: Margin
  innerWidth: number
  innerHeight: number
}

export const DEFAULT_MARGIN: Margin = {
  top: 20,
  right: 20,
  bottom: 40,
  left: 50,
}
