import { describe, it, expect } from 'vitest'
import { getLineExtent } from './scales'
import type { LineDataPoint } from '../types'

// ---------------------------------------------------------------------------
// Test data
// ---------------------------------------------------------------------------

const seriesA: LineDataPoint[] = [
  { x: 1, y: 10 },
  { x: 2, y: 20 },
  { x: 3, y: 30 },
]

const seriesB: LineDataPoint[] = [
  { x: 1, y: 5 },
  { x: 2, y: 50 },
  { x: 3, y: 15 },
]

// ===========================================================================
// getLineExtent
// ===========================================================================

describe('getLineExtent', () => {
  // -------------------------------------------------------------------------
  // P0 — Happy path
  // -------------------------------------------------------------------------

  it('returns correct [min, max] for multi-series data using y accessor', () => {
    const result = getLineExtent([seriesA, seriesB], (d) => d.y)
    expect(result).toEqual([5, 50])
  })

  it('returns correct [min, max] for multi-series data using x accessor', () => {
    const result = getLineExtent([seriesA, seriesB], (d) => d.x)
    expect(result).toEqual([1, 3])
  })

  // -------------------------------------------------------------------------
  // P1 — Boundary / edge cases
  // -------------------------------------------------------------------------

  it('returns correct extent for a single series with a single point', () => {
    const single: LineDataPoint[][] = [[{ x: 42, y: 99 }]]
    expect(getLineExtent(single, (d) => d.x)).toEqual([42, 42])
    expect(getLineExtent(single, (d) => d.y)).toEqual([99, 99])
  })

  it('returns [0, 0] for an empty outer array', () => {
    const result = getLineExtent([], (d) => d.y)
    expect(result).toEqual([0, 0])
  })

  it('returns [0, 0] when all inner series are empty', () => {
    const result = getLineExtent([[], []], (d) => d.y)
    expect(result).toEqual([0, 0])
  })

  it('handles a large array (10 000+ points) without stack overflow', () => {
    const largeSeries: LineDataPoint[] = Array.from({ length: 15_000 }, (_, i) => ({
      x: i,
      y: i * 2,
    }))
    const result = getLineExtent([largeSeries], (d) => d.y)
    expect(result).toEqual([0, 29_998])
  })

  // -------------------------------------------------------------------------
  // P1 — All negative values
  // -------------------------------------------------------------------------

  it('returns correct extent when all values are negative', () => {
    const negativeSeries: LineDataPoint[][] = [
      [
        { x: -10, y: -100 },
        { x: -5, y: -50 },
        { x: -1, y: -200 },
      ],
    ]
    expect(getLineExtent(negativeSeries, (d) => d.y)).toEqual([-200, -50])
    expect(getLineExtent(negativeSeries, (d) => d.x)).toEqual([-10, -1])
  })

  // -------------------------------------------------------------------------
  // P1 — Mixed positive and negative values
  // -------------------------------------------------------------------------

  it('returns correct extent for mixed positive and negative values', () => {
    const mixedSeries: LineDataPoint[][] = [
      [
        { x: -3, y: -15 },
        { x: 0, y: 0 },
        { x: 7, y: 25 },
      ],
      [
        { x: -1, y: 10 },
        { x: 4, y: -30 },
      ],
    ]
    expect(getLineExtent(mixedSeries, (d) => d.y)).toEqual([-30, 25])
    expect(getLineExtent(mixedSeries, (d) => d.x)).toEqual([-3, 7])
  })

  // -------------------------------------------------------------------------
  // P1 — Values including zero
  // -------------------------------------------------------------------------

  it('handles zero values correctly (does not confuse 0 with nullish)', () => {
    const zeroSeries: LineDataPoint[][] = [
      [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
      ],
    ]
    expect(getLineExtent(zeroSeries, (d) => d.y)).toEqual([0, 0])
    expect(getLineExtent(zeroSeries, (d) => d.x)).toEqual([0, 0])
  })
})
