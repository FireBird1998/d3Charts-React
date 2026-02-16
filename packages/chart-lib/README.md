# @d3charts/react

<!-- badges -->

![build](https://img.shields.io/badge/build-passing-brightgreen)
![version](https://img.shields.io/badge/version-0.0.1-blue)
![coverage](https://img.shields.io/badge/coverage-TBD-yellow)

A lightweight, accessible React charting library powered by D3 math. SVG-first, with React owning the DOM and D3 handling the computations.

## Install

```bash
# npm
npm install @d3charts/react

# pnpm
pnpm add @d3charts/react

# yarn
yarn add @d3charts/react
```

**Peer dependencies:** `react >= 18` and `react-dom >= 18`.

## Quick start

```tsx
import { BarChart } from '@d3charts/react'

const data = [
  { month: 'Jan', sales: 30 },
  { month: 'Feb', sales: 80 },
  { month: 'Mar', sales: 45 },
  { month: 'Apr', sales: 60 },
]

function App() {
  return <BarChart data={data} keys={['sales']} categoryKey="month" width={600} height={400} />
}
```

## Exported API

### Components

| Export      | Description                                             |
| ----------- | ------------------------------------------------------- |
| `BarChart`  | Grouped or stacked bar chart with auto-legend           |
| `LineChart` | Multi-series line chart with optional smooth curves     |
| `PieChart`  | Pie/donut chart with configurable radius and labels     |
| `Legend`    | Standalone horizontal colour legend (SVG `<g>` element) |

### Types

| Export             | Description                                     |
| ------------------ | ----------------------------------------------- |
| `BarChartProps<D>` | Props for `BarChart` — generic over data shape  |
| `LineChartProps`   | Props for `LineChart`                           |
| `PieChartProps`    | Props for `PieChart`                            |
| `DataPoint`        | `{ label: string; value: number }`              |
| `LineDataPoint`    | `{ x: number; y: number }`                      |
| `LineSeries`       | `{ id: string; data: LineDataPoint[]; color? }` |
| `Margin`           | `{ top, right, bottom, left }`                  |
| `ChartDimensions`  | Pre-computed outer + inner dimensions           |

### Hooks

| Export              | Description                                           |
| ------------------- | ----------------------------------------------------- |
| `useResizeObserver` | Returns a ref and live `{ width, height }` dimensions |

## Examples

### Responsive bar chart

```tsx
import { useResizeObserver, BarChart } from '@d3charts/react'

function ResponsiveBarChart({ data }) {
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

### Multi-series line chart

```tsx
import { LineChart } from '@d3charts/react'
;<LineChart
  series={[
    {
      id: 'revenue',
      data: [
        { x: 0, y: 10 },
        { x: 1, y: 25 },
      ],
      color: '#4e79a7',
    },
    {
      id: 'expenses',
      data: [
        { x: 0, y: 15 },
        { x: 1, y: 12 },
      ],
      color: '#e15759',
    },
  ]}
  width={600}
  height={400}
/>
```

### Donut chart

```tsx
import { PieChart } from '@d3charts/react'
;<PieChart
  data={[
    { label: 'React', value: 40 },
    { label: 'Vue', value: 25 },
    { label: 'Svelte', value: 10 },
  ]}
  width={400}
  height={400}
  innerRadius={80}
/>
```

## Documentation

| Document                                               | Description                                |
| ------------------------------------------------------ | ------------------------------------------ |
| [Architecture](./docs/ARCHITECTURE.md)                 | Design philosophy, layer diagram, D3 usage |
| [Contributing](./docs/CONTRIBUTING.md)                 | New-chart checklist, templates, standards  |
| [Types](./src/types/README.md)                         | Shared interfaces and constants            |
| [Utilities](./src/utils/README.md)                     | Scale factories and tick generators        |
| [Hooks](./src/hooks/README.md)                         | `useResizeObserver` reference              |
| [Shared components](./src/components/shared/README.md) | AxisBottom, AxisLeft, Legend               |

## Development

```bash
pnpm install          # install dependencies
pnpm dev              # watch mode build
pnpm test             # run tests
pnpm storybook        # launch Storybook on port 6006
pnpm build            # production build
pnpm build-storybook  # build static Storybook
```

## License

MIT
