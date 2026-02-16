# Contributing

Guidelines for contributing to `@d3charts/react`. Read the [Architecture doc](./ARCHITECTURE.md) first.

## Adding a new chart type

### Checklist

- [ ] Create a directory: `src/components/MyChart/`
- [ ] Create the component file: `MyChart.tsx`
- [ ] Add `'use client'` directive at the top
- [ ] Define and export a `MyChartProps` interface with JSDoc on every prop
- [ ] Include `width`, `height`, `margin?`, and `ariaLabel?` props (standard across all charts)
- [ ] Use D3 for math only — no `d3-selection`, no `d3-transition`
- [ ] Render accessibility attributes (`role="img"`, `aria-label`, `<desc>`, `<title>` on data marks)
- [ ] Create tests: `MyChart.test.tsx`
- [ ] Create stories: `MyChart.stories.tsx` with `tags: ['autodocs']`
- [ ] Export from barrel: add entries to `src/index.ts`
- [ ] Add shared types to `src/types/index.ts` if needed
- [ ] Create a component README: `src/components/MyChart/README.md`

### Template: Props interface

```tsx
export interface MyChartProps {
  /** The data to render */
  data: MyDataType[]
  /** Width of the SVG in pixels */
  width: number
  /** Height of the SVG in pixels */
  height: number
  /** Margins around the chart area */
  margin?: Margin
  /** Accessible label describing the chart */
  ariaLabel?: string
}
```

Every property must have a JSDoc comment. Use shared types from `src/types/index.ts` wherever possible.

### Template: Component skeleton

```tsx
'use client'

import type { Margin } from '../../types'

export interface MyChartProps {
  data: MyDataType[]
  width: number
  height: number
  margin?: Margin
  ariaLabel?: string
}

const DEFAULT_MARGIN: Margin = { top: 20, right: 20, bottom: 40, left: 50 }

export function MyChart({
  data,
  width,
  height,
  margin = DEFAULT_MARGIN,
  ariaLabel = 'My chart',
}: MyChartProps) {
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  // 1. Build D3 scales
  // 2. Generate ticks (if axes are needed)
  // 3. Create shape generators (if needed)

  return (
    <svg width={width} height={height} role="img" aria-label={ariaLabel}>
      <desc>{ariaLabel}</desc>
      <g transform={`translate(${margin.left}, ${margin.top})`}>{/* Axes, data marks, legend */}</g>
    </svg>
  )
}
```

### Template: Test file

```tsx
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MyChart } from './MyChart'

const sampleData = [
  // ...
]

describe('MyChart', () => {
  it('renders an SVG with the correct role and label', () => {
    render(<MyChart data={sampleData} width={400} height={300} />)
    const svg = screen.getByRole('img')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('aria-label', 'My chart')
  })

  it('renders the correct number of data marks', () => {
    const { container } = render(<MyChart data={sampleData} width={400} height={300} />)
    // Assert on data-mark elements (rect, path, circle, etc.)
  })

  it('applies custom margins', () => {
    const margin = { top: 10, right: 10, bottom: 30, left: 40 }
    const { container } = render(
      <MyChart data={sampleData} width={400} height={300} margin={margin} />,
    )
    const g = container.querySelector('g')
    expect(g).toHaveAttribute('transform', `translate(${margin.left}, ${margin.top})`)
  })

  it('supports a custom aria-label', () => {
    render(<MyChart data={sampleData} width={400} height={300} ariaLabel="Custom" />)
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'Custom')
  })
})
```

### Template: Story file

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { MyChart } from './MyChart'

const meta: Meta<typeof MyChart> = {
  title: 'Charts/MyChart',
  component: MyChart,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    width: { control: { type: 'range', min: 200, max: 1000, step: 50 } },
    height: { control: { type: 'range', min: 150, max: 600, step: 50 } },
  },
}

export default meta
type Story = StoryObj<typeof MyChart>

export const Default: Story = {
  args: {
    data: [
      /* sample data */
    ],
    width: 600,
    height: 400,
  },
}
```

---

## Naming and file colocation rules

| Item                | Convention                | Example                |
| ------------------- | ------------------------- | ---------------------- |
| Component directory | PascalCase                | `BarChart/`            |
| Component file      | PascalCase `.tsx`         | `BarChart.tsx`         |
| Test file           | PascalCase `.test.tsx`    | `BarChart.test.tsx`    |
| Story file          | PascalCase `.stories.tsx` | `BarChart.stories.tsx` |
| Utility file        | camelCase `.ts`           | `scales.ts`            |
| Hook file           | camelCase `.ts`           | `useResizeObserver.ts` |
| Shared type file    | `index.ts` in `types/`    | `types/index.ts`       |

All files related to a chart live together in the component directory. No scattering tests or stories into separate `__tests__` or `stories/` trees.

---

## Accessibility requirements

Every chart component **must** satisfy all of the following:

- [ ] `<svg>` has `role="img"` and `aria-label`
- [ ] A `<desc>` element inside `<svg>` mirrors the `ariaLabel` prop
- [ ] Every interactive or data-bearing SVG element (`<rect>`, `<path>`, `<circle>`) has a `<title>` child with a human-readable description
- [ ] Text labels use `fill="currentColor"` so they inherit the host page's colour scheme

---

## Testing standards

Each chart component must have tests covering:

1. **Renders** — SVG with correct `role` and `aria-label`.
2. **Data marks** — Correct count of bars / lines / slices.
3. **Custom margins** — The inner `<g>` transform reflects provided margins.
4. **Custom aria-label** — Overriding the default label.
5. **Edge cases** — Empty data, single item, very large datasets.

Run tests with:

```bash
pnpm test          # single run
pnpm test:watch    # watch mode
```

---

## Storybook standards

- Every story file must include `tags: ['autodocs']` in the meta.
- Use `argTypes` with appropriate controls for numeric ranges, booleans, and select options.
- Include at least a `Default` story and one variant story (e.g., different data shape, different mode).
- Use `parameters: { layout: 'centered' }` for consistent visual presentation.

Run Storybook with:

```bash
pnpm storybook     # dev server on port 6006
```
