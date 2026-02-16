# PieChart

An accessible pie/donut chart with configurable inner radius, rounded corners, pad angles, and conditional slice labels.

## Usage

```tsx
import { PieChart } from '@d3charts/react'

const data = [
  { label: 'React', value: 40 },
  { label: 'Vue', value: 25 },
  { label: 'Angular', value: 20 },
  { label: 'Svelte', value: 10 },
  { label: 'Other', value: 5 },
]

<PieChart data={data} width={400} height={400} />
```

### Donut variant

```tsx
<PieChart data={data} width={400} height={400} innerRadius={80} />
```

## Props — `PieChartProps`

| Prop           | Type          | Default            | Description                                  |
| -------------- | ------------- | ------------------ | -------------------------------------------- |
| `data`         | `DataPoint[]` | —                  | Slices to render                             |
| `width`        | `number`      | —                  | SVG width in pixels                          |
| `height`       | `number`      | —                  | SVG height in pixels                         |
| `innerRadius`  | `number`      | `0`                | Inner radius — `0` = full pie, `> 0` = donut |
| `padAngle`     | `number`      | `0.01`             | Padding angle between slices in radians      |
| `cornerRadius` | `number`      | `2`                | Corner radius for rounded slice edges        |
| `colors`       | `string[]`    | Tableau-10 palette | Custom colour palette                        |
| `showLabels`   | `boolean`     | `true`             | Whether to show text labels on slices        |
| `ariaLabel`    | `string`      | `'Pie chart'`      | Accessible label for the `<svg>` element     |

## Internal architecture

1. **Compute outer radius** — `Math.min(width, height) / 2 - 10` to leave a small bleed margin.
2. **Create generators** — `d3-shape`'s `pie()` (with `sort(null)` to preserve data order), `arc()` for slice paths, and a separate `labelArc` centred at 65% of the outer radius for label positioning.
3. **Render SVG** — A centred `<g>` group containing:
   - `<path>` per slice with white stroke separation.
   - Conditional `<text>` labels — only rendered when `showLabels` is true **and** the arc's angular span exceeds `0.3` radians, preventing overlapping labels on tiny slices.

## Accessibility

- `<svg>` has `role="img"` and `aria-label`.
- A `<desc>` element mirrors the aria-label.
- Each `<path>` contains a `<title>` with the format `"Label: Value"`.

## Files

| File                   | Purpose            |
| ---------------------- | ------------------ |
| `PieChart.tsx`         | Component source   |
| `PieChart.test.tsx`    | Vitest + RTL tests |
| `PieChart.stories.tsx` | Storybook stories  |
