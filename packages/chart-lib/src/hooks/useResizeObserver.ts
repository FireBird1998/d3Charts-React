import { useEffect, useRef, useState } from 'react'

interface Dimensions {
  width: number
  height: number
}

export function useResizeObserver<T extends HTMLElement>(): [
  React.RefObject<T | null>,
  Dimensions | null,
] {
  const ref = useRef<T | null>(null)
  const [dimensions, setDimensions] = useState<Dimensions | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        setDimensions({ width, height })
      }
    })

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [])

  return [ref, dimensions]
}
