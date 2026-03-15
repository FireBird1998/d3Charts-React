import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useResizeObserver } from './useResizeObserver'

// ---------------------------------------------------------------------------
// ResizeObserver mock — jsdom does not provide one
// ---------------------------------------------------------------------------

type ResizeObserverCallback = (entries: ResizeObserverEntry[]) => void

let resizeCallback: ResizeObserverCallback | null = null
const observeMock = vi.fn()
const disconnectMock = vi.fn()

class MockResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    resizeCallback = callback
  }
  observe = observeMock
  unobserve = vi.fn()
  disconnect = disconnectMock
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeFakeElement(width: number, height: number): HTMLDivElement {
  const el = document.createElement('div')
  el.getBoundingClientRect = () =>
    ({
      width,
      height,
      top: 0,
      left: 0,
      right: width,
      bottom: height,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }) as DOMRect
  return el
}

function fireResize(width: number, height: number) {
  if (!resizeCallback) throw new Error('ResizeObserver callback not registered')
  resizeCallback([{ contentRect: { width, height } } as unknown as ResizeObserverEntry])
}

// ---------------------------------------------------------------------------
// Setup / Teardown
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', MockResizeObserver)
  resizeCallback = null
  observeMock.mockClear()
  disconnectMock.mockClear()
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

// ===========================================================================
// useResizeObserver
// ===========================================================================

describe('useResizeObserver', () => {
  // -------------------------------------------------------------------------
  // P0 — Happy path
  // -------------------------------------------------------------------------

  it('returns a ref and initial null dimensions before the ref is attached', () => {
    const { result } = renderHook(() => useResizeObserver<HTMLDivElement>())
    const [ref, dimensions] = result.current

    expect(ref).toBeDefined()
    expect(ref.current).toBeNull()
    expect(dimensions).toBeNull()
  })

  it('sets initial dimensions via getBoundingClientRect when ref is attached', () => {
    const fakeEl = makeFakeElement(800, 600)

    const { result } = renderHook(() => useResizeObserver<HTMLDivElement>())

    // Simulate attaching the ref to an element, then re-render so the
    // useEffect runs with the element present.
    act(() => {
      ;(result.current[0] as React.MutableRefObject<HTMLDivElement | null>).current = fakeEl
    })

    // Re-render to trigger the effect with the attached ref
    const { result: result2 } = renderHook(() => useResizeObserver<HTMLDivElement>())
    act(() => {
      ;(result2.current[0] as React.MutableRefObject<HTMLDivElement | null>).current = fakeEl
    })

    // Since we need the effect to run, let's use a different approach:
    // render the hook, manually set ref.current, then trigger a re-render
    // with a new debounceMs value so the effect dependency fires.
    const { result: r, rerender } = renderHook(
      ({ debounceMs }: { debounceMs?: number }) => useResizeObserver<HTMLDivElement>(debounceMs),
      { initialProps: { debounceMs: undefined } },
    )

    // Attach the fake element to the ref
    ;(r.current[0] as React.MutableRefObject<HTMLDivElement | null>).current = fakeEl

    // Trigger re-render so the effect runs with debounceMs changing
    rerender({ debounceMs: 0 })

    expect(r.current[1]).toEqual({ width: 800, height: 600 })
    expect(observeMock).toHaveBeenCalledWith(fakeEl)
  })

  it('updates dimensions when ResizeObserver fires', () => {
    const fakeEl = makeFakeElement(400, 300)

    const { result, rerender } = renderHook(
      ({ debounceMs }: { debounceMs?: number }) => useResizeObserver<HTMLDivElement>(debounceMs),
      { initialProps: { debounceMs: undefined } },
    )

    ;(result.current[0] as React.MutableRefObject<HTMLDivElement | null>).current = fakeEl
    rerender({ debounceMs: 0 })

    // Initial dimensions from getBoundingClientRect
    expect(result.current[1]).toEqual({ width: 400, height: 300 })

    // Simulate a resize event
    act(() => {
      fireResize(1024, 768)
    })

    expect(result.current[1]).toEqual({ width: 1024, height: 768 })
  })

  // -------------------------------------------------------------------------
  // P1 — Debounce behavior
  // -------------------------------------------------------------------------

  it('debounces resize updates when debounceMs is provided', () => {
    vi.useFakeTimers()

    const fakeEl = makeFakeElement(200, 100)

    const { result, rerender } = renderHook(
      ({ debounceMs }: { debounceMs?: number }) => useResizeObserver<HTMLDivElement>(debounceMs),
      { initialProps: { debounceMs: undefined } },
    )

    ;(result.current[0] as React.MutableRefObject<HTMLDivElement | null>).current = fakeEl
    rerender({ debounceMs: 300 })

    // Initial dimensions set immediately via getBoundingClientRect
    expect(result.current[1]).toEqual({ width: 200, height: 100 })

    // Fire a resize — should NOT update immediately due to debounce
    act(() => {
      fireResize(500, 400)
    })
    expect(result.current[1]).toEqual({ width: 200, height: 100 })

    // Fire another resize before debounce period elapses — first one cancelled
    act(() => {
      fireResize(600, 500)
    })
    expect(result.current[1]).toEqual({ width: 200, height: 100 })

    // Advance timers past debounce period
    act(() => {
      vi.advanceTimersByTime(300)
    })

    // Only the latest resize value should appear
    expect(result.current[1]).toEqual({ width: 600, height: 500 })
  })

  it('immediately updates dimensions when no debounceMs is provided', () => {
    const fakeEl = makeFakeElement(200, 100)

    const { result, rerender } = renderHook(
      ({ debounceMs }: { debounceMs?: number }) => useResizeObserver<HTMLDivElement>(debounceMs),
      { initialProps: { debounceMs: undefined } },
    )

    ;(result.current[0] as React.MutableRefObject<HTMLDivElement | null>).current = fakeEl
    rerender({ debounceMs: 0 })

    act(() => {
      fireResize(999, 888)
    })

    expect(result.current[1]).toEqual({ width: 999, height: 888 })
  })

  // -------------------------------------------------------------------------
  // P2 — Cleanup
  // -------------------------------------------------------------------------

  it('disconnects the observer on unmount', () => {
    const fakeEl = makeFakeElement(100, 100)

    const { result, rerender, unmount } = renderHook(
      ({ debounceMs }: { debounceMs?: number }) => useResizeObserver<HTMLDivElement>(debounceMs),
      { initialProps: { debounceMs: undefined } },
    )

    ;(result.current[0] as React.MutableRefObject<HTMLDivElement | null>).current = fakeEl
    rerender({ debounceMs: 0 })

    expect(observeMock).toHaveBeenCalled()

    unmount()

    expect(disconnectMock).toHaveBeenCalled()
  })

  it('clears pending debounce timeout on unmount', () => {
    vi.useFakeTimers()

    const fakeEl = makeFakeElement(100, 100)

    const { result, rerender, unmount } = renderHook(
      ({ debounceMs }: { debounceMs?: number }) => useResizeObserver<HTMLDivElement>(debounceMs),
      { initialProps: { debounceMs: undefined } },
    )

    ;(result.current[0] as React.MutableRefObject<HTMLDivElement | null>).current = fakeEl
    rerender({ debounceMs: 500 })

    // Fire a resize to start a debounce timer
    act(() => {
      fireResize(300, 200)
    })

    // Unmount before debounce completes — should not throw or leak
    unmount()

    // Advancing timers after unmount should not cause errors
    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(disconnectMock).toHaveBeenCalled()
  })

  // -------------------------------------------------------------------------
  // P1 — Edge: no element attached
  // -------------------------------------------------------------------------

  it('does not observe when ref is not attached to an element', () => {
    renderHook(() => useResizeObserver<HTMLDivElement>())

    expect(observeMock).not.toHaveBeenCalled()
    expect(disconnectMock).not.toHaveBeenCalled()
  })
})
