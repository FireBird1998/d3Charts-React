'use client'

import type { ReactNode, RefObject } from 'react'
import { useResizeObserver } from '../../hooks/useResizeObserver'

export interface ResponsiveChartProps {
  /** Minimum width before the chart stops shrinking */
  minWidth?: number
  /** Minimum height before the chart stops shrinking */
  minHeight?: number
  /** Fixed aspect ratio (width/height). If set, height is computed from width. */
  aspectRatio?: number
  /** Debounce resize events in ms */
  debounceMs?: number
  /** CSS class for the container div */
  className?: string
  /** Render function receiving measured width and height */
  children: (dimensions: { width: number; height: number }) => ReactNode
}

export function ResponsiveChart({
  minWidth = 0,
  minHeight = 0,
  aspectRatio,
  debounceMs,
  className,
  children,
}: ResponsiveChartProps) {
  const [ref, dimensions] = useResizeObserver<HTMLDivElement>(debounceMs)

  const width = dimensions ? Math.max(dimensions.width, minWidth) : 0
  const height = aspectRatio
    ? Math.max(width / aspectRatio, minHeight)
    : dimensions
      ? Math.max(dimensions.height, minHeight)
      : 0

  return (
    <div
      // Cast needed: useResizeObserver returns RefObject<T | null> but JSX ref expects RefObject<T> (React 18/19 nullability mismatch)
      ref={ref as RefObject<HTMLDivElement>}
      className={className}
      style={{ width: '100%', height: aspectRatio ? 'auto' : '100%' }}
    >
      {dimensions && children({ width, height })}
    </div>
  )
}
