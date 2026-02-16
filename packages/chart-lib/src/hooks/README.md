# Hooks — `src/hooks/`

Custom React hooks used by chart consumers to build responsive layouts.

## `useResizeObserver`

Tracks the dimensions of a DOM element using the browser `ResizeObserver` API.

### Signature

```ts
function useResizeObserver<T extends HTMLElement>(): [React.RefObject<T | null>, Dimensions | null]
```

### Return value

| Index | Type                         | Description                                     |
| ----- | ---------------------------- | ----------------------------------------------- |
| `[0]` | `React.RefObject<T \| null>` | Ref to attach to the container element          |
| `[1]` | `Dimensions \| null`         | Current `{ width, height }` or `null` initially |

### `Dimensions`

```ts
interface Dimensions {
  width: number
  height: number
}
```

### Usage

```tsx
import { useResizeObserver, BarChart } from '@d3charts/react'

function ResponsiveBarChart() {
  const [ref, dims] = useResizeObserver<HTMLDivElement>()

  return (
    <div ref={ref} style={{ width: '100%', height: 400 }}>
      {dims && (
        <BarChart
          data={data}
          keys={['sales']}
          categoryKey="month"
          width={dims.width}
          height={dims.height}
        />
      )}
    </div>
  )
}
```

### Notes

- The hook returns `null` until the first `ResizeObserver` callback fires, so always guard rendering with a null check.
- The observer is created once on mount and disconnected on unmount — no dependency array triggers re-subscription.
- Accepts any `HTMLElement` subtype via the generic `T` parameter.
