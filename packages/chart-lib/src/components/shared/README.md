# Shared Components — `src/components/shared/`

Reusable SVG primitives composed into chart components. These are **not exported from the package** (except `Legend`) — chart components import them directly.

## `AxisBottom`

Renders a horizontal axis along the bottom of the chart area.

### Props — `AxisBottomProps`

| Prop     | Type         | Description                                      |
| -------- | ------------ | ------------------------------------------------ |
| `ticks`  | `TickLine[]` | Tick data from `getBandTicks` / `getLinearTicks` |
| `height` | `number`     | Inner height — axis is translated to this y      |
| `width`  | `number`     | Inner width — length of the axis baseline        |

### Rendering

1. Wraps everything in `<g transform="translate(0, height)">` to position at the bottom.
2. Draws a horizontal `<line>` from `0` to `width` as the axis baseline.
3. For each tick: a small vertical tick mark (`y2={6}`), and a `<text>` label centred below.

---

## `AxisLeft`

Renders a vertical axis along the left side of the chart area with optional grid lines.

### Props — `AxisLeftProps`

| Prop     | Type         | Description                                |
| -------- | ------------ | ------------------------------------------ |
| `ticks`  | `TickLine[]` | Tick data from `getLinearTicks`            |
| `width`  | `number`     | Inner width — used for dashed grid lines   |
| `height` | `number`     | Inner height — length of the axis baseline |

### Rendering

1. Draws a vertical `<line>` from `y1=0` to `y2=height` as the axis baseline.
2. For each tick:
   - A short tick mark extending left (`x2={-6}`).
   - A dashed horizontal grid line extending right across the chart (`x2={width}`).
   - A `<text>` label right-aligned to the left of the tick mark.

---

## `Legend`

Renders a horizontal colour legend. Exported from the package barrel (`index.ts`).

### Props — `LegendProps`

| Prop    | Type           | Default | Description                       |
| ------- | -------------- | ------- | --------------------------------- |
| `items` | `LegendItem[]` | —       | Legend entries (key + colour)     |
| `x`     | `number`       | `0`     | X translation of the legend group |
| `y`     | `number`       | `0`     | Y translation of the legend group |

### `LegendItem`

```ts
interface LegendItem {
  key: string // label text
  color: string // swatch fill colour
}
```

### Rendering

Each item is spaced `85px` apart horizontally. Each item renders:

- A `12×12` coloured `<rect>` swatch with `rx={2}`.
- A `<text>` label at `fontSize={11}` offset `16px` to the right.

### Usage patterns

**Composed into charts** — `BarChart` includes `Legend` automatically when `keys.length > 1`.

**Standalone** — consumers can import and place it anywhere in an SVG:

```tsx
import { Legend } from '@d3charts/react'
;<svg width={400} height={300}>
  {/* chart content */}
  <Legend
    items={[
      { key: 'Revenue', color: '#4e79a7' },
      { key: 'Expenses', color: '#e15759' },
    ]}
    x={10}
    y={10}
  />
</svg>
```

---

## Dependency on `utils/axes.ts`

Both axis components consume the `TickLine` interface from `../../utils/axes`. They don't call D3 directly — the parent chart is responsible for calling `getBandTicks` / `getLinearTicks` and passing the resulting array as the `ticks` prop. This keeps the axis components pure presentational.
