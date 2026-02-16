# BarChart

A generic, accessible bar chart supporting **grouped** and **stacked** modes with automatic legend rendering for multi-series data.

## Usage

```tsx
import { BarChart } from '@d3charts/react'

const data = [
  { month: 'Jan', car: 120, bus: 45 },
  { month: 'Feb', car: 150, bus: 50 },
  { month: 'Mar', car: 90, bus: 60 },
]

<BarChart
  data={data}
  keys={['car', 'bus']}
  categoryKey="month"
  width={700}
  height={400}
  mode="grouped"
  colors={{ car: '#e63946', bus: '#457b9d' }}
/>
```

## Props — `BarChartProps<D>`

The component is generic over `D extends Record<string, string | number>`, giving you type-safe access to your data keys.

| Prop          | Type                     | Default                                        | Description                                 |
| ------------- | ------------------------ | ---------------------------------------------- | ------------------------------------------- |
| `data`        | `D[]`                    | —                                              | Row-based data; each row is one category    |
| `keys`        | `(keyof D & string)[]`   | —                                              | Numeric series keys to render as bars       |
| `categoryKey` | `keyof D & string`       | —                                              | Key identifying the category (x-axis label) |
| `width`       | `number`                 | —                                              | SVG width in pixels                         |
| `height`      | `number`                 | —                                              | SVG height in pixels                        |
| `margin`      | `Margin`                 | `{ top: 20, right: 20, bottom: 40, left: 50 }` | Margins around the chart area               |
| `mode`        | `'grouped' \| 'stacked'` | `'grouped'`                                    | Bar layout mode                             |
| `colors`      | `Record<string, string>` | Tableau-10 palette                             | Per-key fill colours                        |
| `ariaLabel`   | `string`                 | `'Bar chart'`                                  | Accessible label for the `<svg>` element    |

## Internal architecture

1. **Compute dimensions** — `innerWidth` / `innerHeight` from `width`, `height`, and `margin`.
2. **Build scales** — `scaleBand` for categories (x), `scaleLinear` for values (y). In stacked mode, `d3-shape`'s `stack()` computes cumulative layers; in grouped mode a nested `scaleBand` subdivides each category.
3. **Generate ticks** — `getBandTicks(xScale)` and `getLinearTicks(yScale)` produce `TickLine[]` arrays.
4. **Render SVG** — `<AxisLeft>`, `<AxisBottom>`, `<rect>` elements per bar, and `<Legend>` when `keys.length > 1`.

## Accessibility

- `<svg>` has `role="img"` and `aria-label`.
- A `<desc>` element mirrors the aria-label.
- Each `<rect>` contains a `<title>` with the format `"Category — Key: Value"` for screen-reader tooltip support.

## Files

| File                   | Purpose            |
| ---------------------- | ------------------ |
| `BarChart.tsx`         | Component source   |
| `BarChart.test.tsx`    | Vitest + RTL tests |
| `BarChart.stories.tsx` | Storybook stories  |
