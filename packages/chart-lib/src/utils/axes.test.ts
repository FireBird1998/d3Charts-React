import { describe, it, expect } from 'vitest'
import { scaleBand, scaleLinear } from 'd3-scale'
import { getBandTicks, getLinearTicks } from './axes'

// ===========================================================================
// getBandTicks
// ===========================================================================

describe('getBandTicks', () => {
  // -------------------------------------------------------------------------
  // P0 — Happy path
  // -------------------------------------------------------------------------

  it('returns a tick for each domain value with offset at band center', () => {
    const scale = scaleBand<string>().domain(['A', 'B', 'C']).range([0, 300]).padding(0)

    const ticks = getBandTicks(scale)

    expect(ticks).toHaveLength(3)

    // Each band is 100px wide (300 / 3), center at 50, 150, 250
    expect(ticks[0]).toEqual({ value: 'A', offset: 50 })
    expect(ticks[1]).toEqual({ value: 'B', offset: 150 })
    expect(ticks[2]).toEqual({ value: 'C', offset: 250 })
  })

  it('computes correct offsets when padding is applied', () => {
    const scale = scaleBand<string>().domain(['X', 'Y']).range([0, 200]).padding(0.5)

    const ticks = getBandTicks(scale)
    const bandwidth = scale.bandwidth()

    expect(ticks).toHaveLength(2)

    // Verify each offset equals scale(value) + bandwidth/2
    for (const tick of ticks) {
      const expectedOffset = (scale(tick.value as string) ?? 0) + bandwidth / 2
      expect(tick.offset).toBeCloseTo(expectedOffset, 5)
    }
  })

  // -------------------------------------------------------------------------
  // P1 — Boundary: single domain value
  // -------------------------------------------------------------------------

  it('returns a single tick for a single domain value', () => {
    const scale = scaleBand<string>().domain(['Only']).range([0, 200]).padding(0)

    const ticks = getBandTicks(scale)

    expect(ticks).toHaveLength(1)
    expect(ticks[0].value).toBe('Only')
    // Band spans entire range (200px), center at 100
    expect(ticks[0].offset).toBe(100)
  })

  // -------------------------------------------------------------------------
  // P1 — Boundary: empty domain
  // -------------------------------------------------------------------------

  it('returns an empty array for an empty domain', () => {
    const scale = scaleBand<string>().domain([]).range([0, 300])

    const ticks = getBandTicks(scale)

    expect(ticks).toEqual([])
  })
})

// ===========================================================================
// getLinearTicks
// ===========================================================================

describe('getLinearTicks', () => {
  // -------------------------------------------------------------------------
  // P0 — Happy path
  // -------------------------------------------------------------------------

  it('returns ticks with correct offset values from the scale', () => {
    const scale = scaleLinear().domain([0, 100]).range([0, 500])

    const ticks = getLinearTicks(scale)

    expect(ticks.length).toBeGreaterThan(0)

    // Each tick offset must equal scale(tick.value)
    for (const tick of ticks) {
      expect(tick.offset).toBe(scale(tick.value as number))
    }
  })

  it('returns tick values that lie within the domain', () => {
    const scale = scaleLinear().domain([0, 100]).range([0, 500])

    const ticks = getLinearTicks(scale)

    for (const tick of ticks) {
      expect(tick.value as number).toBeGreaterThanOrEqual(0)
      expect(tick.value as number).toBeLessThanOrEqual(100)
    }
  })

  // -------------------------------------------------------------------------
  // P1 — Custom count parameter
  // -------------------------------------------------------------------------

  it('respects a custom tick count', () => {
    const scale = scaleLinear().domain([0, 100]).range([0, 500])

    const ticks2 = getLinearTicks(scale, 2)
    const ticks10 = getLinearTicks(scale, 10)

    // D3 treats count as a hint, so we check relative sizes
    // A count of 2 should produce fewer ticks than a count of 10
    expect(ticks2.length).toBeLessThanOrEqual(ticks10.length)
    // Both should still have valid offsets
    for (const tick of ticks2) {
      expect(tick.offset).toBe(scale(tick.value as number))
    }
  })

  it('uses default count of 5 when no count is provided', () => {
    const scale = scaleLinear().domain([0, 100]).range([0, 500])

    const ticksDefault = getLinearTicks(scale)
    const ticksExplicit5 = getLinearTicks(scale, 5)

    // Same count hint should produce the same ticks
    expect(ticksDefault).toEqual(ticksExplicit5)
  })

  // -------------------------------------------------------------------------
  // P1 — Negative domain
  // -------------------------------------------------------------------------

  it('produces ticks for a negative domain', () => {
    const scale = scaleLinear().domain([-100, 0]).range([0, 400])

    const ticks = getLinearTicks(scale)

    expect(ticks.length).toBeGreaterThan(0)

    for (const tick of ticks) {
      expect(tick.value as number).toBeGreaterThanOrEqual(-100)
      expect(tick.value as number).toBeLessThanOrEqual(0)
      expect(tick.offset).toBe(scale(tick.value as number))
    }
  })
})
