import { useEffect, useRef, useState } from 'react'

export interface Dimensions {
  width: number
  height: number
}

export function useResizeObserver<T extends HTMLElement>(
  debounceMs?: number,
): [React.RefObject<T | null>, Dimensions | null] {
  const ref = useRef<T | null>(null)
  const [dimensions, setDimensions] = useState<Dimensions | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Set initial dimensions immediately
    const { width, height } = element.getBoundingClientRect()
    setDimensions({ width, height })

    let timeoutId: ReturnType<typeof setTimeout> | null = null

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        if (debounceMs) {
          if (timeoutId) clearTimeout(timeoutId)
          timeoutId = setTimeout(() => setDimensions({ width, height }), debounceMs)
        } else {
          setDimensions({ width, height })
        }
      }
    })

    observer.observe(element)

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      observer.disconnect()
    }
  }, [debounceMs])

  return [ref, dimensions]
}
