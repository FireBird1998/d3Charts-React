# LineChart

An accessible multi-series line chart with optional smooth curves, data-point circles, and automatic extent calculation.

## Usage

```tsx
import { LineChart } from '@d3charts/react'

const series = [
  {
    id: 'revenue',
    data: [
      { x: 0, y: 10 },
      { x: 1, y: 25 },
      { x: 2, y: 18 },
      { x: 3, y: 35 },
    ],
    color: '#4e79a7',
  },
  {
    id: 'expenses',
    data: [
      { x: 0, y: 15 },
      { x: 1, y: 12 },
      { x: 2, y: 22 },
      { x: 3, y: 20 },
    ],
    color: '#e15759',
  },
]

<LineChart series={series} width={600} height={400} />
```

## Props — `LineChartProps`

| Prop        | Type           | Default                                        | Description                              |
| ----------- | -------------- | ---------------------------------------------- | ---------------------------------------- |
| `series`    | `LineSeries[]` | —                                              | Array of line series to render           |
| `width`     | `number`       | —                                              | SVG width in pixels                      |
| `height`    | `number`       | —                                              | SVG height in pixels                     |
| `margin`    | `Margin`       | `{ top: 20, right: 20, bottom: 40, left: 50 }` | Margins around the chart area            |
| `smooth`    | `boolean`      | `true`                                         | Use `curveMonotoneX` for smooth curves   |
| `ariaLabel` | `string`       | `'Line chart'`                                 | Accessible label for the `<svg>` element |

## Internal architecture

1. **Compute dimensions** — `innerWidth` / `innerHeight` from outer size and margins.
2. **Calculate extents** — `getLineExtent(allData, accessor)` finds `[min, max]` for both x and y across all series.
3. **Build scales** — Two `scaleLinear` instances for x and y, both with `.nice()`.
4. **Create line generator** — `d3-shape`'s `line()` maps data points to SVG path data. When `smooth` is true, `curveMonotoneX` is applied.
5. **Generate ticks** — `getLinearTicks` for both axes.
6. **Render SVG** — `<AxisLeft>`, `<AxisBottom>`, a `<path>` per series, and `<circle>` elements at each data point with `<title>` tooltips.

## Accessibility

- `<svg>` has `role="img"` and `aria-label`.
- A `<desc>` element mirrors the aria-label.
- Each data point `<circle>` contains a `<title>` with the format `"(x, y)"`.

## Files

| File                    | Purpose            |
| ----------------------- | ------------------ |
| `LineChart.tsx`         | Component source   |
| `LineChart.test.tsx`    | Vitest + RTL tests |
| `LineChart.stories.tsx` | Storybook stories  |
