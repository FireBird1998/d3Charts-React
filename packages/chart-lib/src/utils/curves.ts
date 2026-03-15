import { curveMonotoneX, curveLinear, curveNatural, curveStep } from 'd3-shape'

export const curveMap = {
  linear: curveLinear,
  monotoneX: curveMonotoneX,
  natural: curveNatural,
  step: curveStep,
} as const

export type CurveType = keyof typeof curveMap
