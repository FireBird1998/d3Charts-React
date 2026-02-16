import type { ScaleBand, ScaleLinear } from 'd3-scale'

export interface TickLine {
  value: string | number
  offset: number
}

export function getBandTicks(scale: ScaleBand<string>): TickLine[] {
  return scale.domain().map((value) => ({
    value,
    offset: (scale(value) ?? 0) + scale.bandwidth() / 2,
  }))
}

export function getLinearTicks(scale: ScaleLinear<number, number>, count = 5): TickLine[] {
  return scale.ticks(count).map((value) => ({
    value,
    offset: scale(value),
  }))
}
