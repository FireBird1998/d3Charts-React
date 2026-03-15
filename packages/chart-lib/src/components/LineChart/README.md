# LineChart

An accessible multi-series line chart with configurable curve interpolation, data-point circles, and automatic extent calculation.

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

| Prop          | Type                                  | Default                                        | Description                                                            |
| ------------- | ------------------------------------- | ---------------------------------------------- | ---------------------------------------------------------------------- |
| `series`      | `LineSeries[]`                        | —                                              | Array of line series to render                                         |
| `width`       | `number`                              | —                                              | SVG width in pixels                                                    |
| `height`      | `number`                              | —                                              | SVG height in pixels                                                   |
| `margin`      | `Margin`                              | `{ top: 20, right: 20, bottom: 40, left: 50 }` | Margins around the chart area                                          |
| `curve`       | `CurveType`                           | `'monotoneX'`                                  | Curve interpolation (`'linear'`, `'monotoneX'`, `'natural'`, `'step'`) |
| `colors`      | `Record<string, string>`              | —                                              | Per-series colors keyed by series id                                   |
| `ariaLabel`   | `string`                              | `'Line chart'`                                 | Accessible label for the `<svg>` element                               |
| `className`   | `string`                              | —                                              | Custom CSS class name for the SVG element                              |
| `xTickFormat` | `(value: string \| number) => string` | —                                              | Formatter for x-axis tick labels                                       |
| `yTickFormat` | `(value: string \| number) => string` | —                                              | Formatter for y-axis tick labels                                       |

### Color precedence

1. `series[].color` — inline per-series override (highest priority)
2. `colors[series.id]` — prop-level keyed map
3. Theme palette — automatic fallback by index

## Internal architecture

1. **Compute dimensions** — `innerWidth` / `innerHeight` from outer size and margins.
2. **Calculate extents** — `getLineExtent(allData, accessor)` finds `[min, max]` for both x and y across all series.
3. **Build scales** — Two `scaleLinear` instances for x and y, both with `.nice()`.
4. **Create line generator** — `d3-shape`'s `line()` maps data points to SVG path data. The `curve` prop selects the interpolation function.
5. **Generate ticks** — `getLinearTicks` for both axes.
6. **Render SVG** — `<AxisLeft>`, `<AxisBottom>`, a `<path>` per series, `<circle>` elements at each data point with `<title>` tooltips, and a `<Legend>` when multiple series are present.

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
