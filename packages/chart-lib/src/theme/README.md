# Theme System

The `@d3charts/react` theme system provides full control over chart styling through CSS custom properties and a React context provider.

## Quick Start

```tsx
import { ChartThemeProvider, BarChart } from '@d3charts/react'

// Light mode (default)
<BarChart data={data} keys={['revenue']} categoryKey="month" width={600} height={400} />

// Dark mode
<ChartThemeProvider theme="dark">
  <BarChart data={data} keys={['revenue']} categoryKey="month" width={600} height={400} />
</ChartThemeProvider>
```

Charts work without a `<ChartThemeProvider>` wrapper — they fall back to the light theme defaults via CSS `var()` fallbacks and the default React context value.

## API

### `<ChartThemeProvider>`

| Prop        | Type                              | Default   | Description                                           |
| ----------- | --------------------------------- | --------- | ----------------------------------------------------- |
| `theme`     | `'light' \| 'dark' \| ChartTheme` | `'light'` | Preset name or a full custom theme object             |
| `overrides` | `Partial<ChartTheme>`             | —         | Partial overrides merged on top of the resolved theme |
| `children`  | `React.ReactNode`                 | —         | Chart components to theme                             |

### `useChartTheme()`

Hook that returns the current `ChartTheme` from the nearest provider. Falls back to the light theme when no provider is present.

```tsx
import { useChartTheme } from '@d3charts/react'

function MyCustomChart() {
  const theme = useChartTheme()
  const color = theme.palette[0]
  // ...
}
```

## Presets

### Light Theme (default)

The light theme uses neutral grays for axes and grid, with a Tableau-10-inspired data palette.

### Dark Theme

The dark theme inverts the axis/grid/legend colors for dark backgrounds while keeping the same data palette.

## Customization

### Partial Overrides

Override specific tokens while inheriting the rest from a preset:

```tsx
<ChartThemeProvider
  theme="light"
  overrides={{
    fontFamily: "'JetBrains Mono', monospace",
    tickFontSize: '14px',
    palette: ['#6366f1', '#ec4899', '#14b8a6'],
  }}
>
  <BarChart ... />
</ChartThemeProvider>
```

### Fully Custom Theme

Pass a complete `ChartTheme` object:

```tsx
import type { ChartTheme } from '@d3charts/react'

const myTheme: ChartTheme = {
  fontFamily: "'IBM Plex Sans', sans-serif",
  tickFontSize: '13px',
  tickFontWeight: '400',
  tickColor: '#333333',
  axisLineColor: '#666666',
  axisLineWidth: '1',
  gridLineColor: '#eeeeee',
  gridLineWidth: '1',
  gridLineDasharray: '4,4',
  legendFontSize: '12px',
  legendFontWeight: '500',
  legendColor: '#333333',
  chartBackground: 'transparent',
  palette: ['#0055ff', '#ff4400', '#00cc88'],
  barBorderRadius: '4',
  lineStrokeWidth: '2.5',
  pointRadius: '4',
  pieStrokeColor: '#ffffff',
  pieStrokeWidth: '2',
  pieLabelColor: '#ffffff',
  pieLabelFontSize: '13px',
  pieLabelFontWeight: '600',
}

<ChartThemeProvider theme={myTheme}>
  ...
</ChartThemeProvider>
```

## How It Works

The provider uses the **CrayonAI/react-ui style injection pattern**:

1. Resolves the theme (preset name or custom object, merged with overrides).
2. Converts the `ChartTheme` to a CSS string of `--d3c-*` custom property declarations.
3. Injects the CSS via `<style dangerouslySetInnerHTML>`.
4. Scopes the variables to a unique `data-d3c-theme-*` attribute on a wrapper `<div style="display: contents">`.
5. Provides the resolved theme object via React context for `useChartTheme()`.

Multiple providers with different themes can coexist on the same page because each gets a unique scope attribute via `useId()`.

## Token Reference

### Typography

| Token        | CSS Variable        | Default (Light)                                    |
| ------------ | ------------------- | -------------------------------------------------- |
| `fontFamily` | `--d3c-font-family` | `'Inter', 'Helvetica Neue', system-ui, sans-serif` |

### Tick Labels

| Token            | CSS Variable             | Default (Light) |
| ---------------- | ------------------------ | --------------- |
| `tickFontSize`   | `--d3c-tick-font-size`   | `12px`          |
| `tickFontWeight` | `--d3c-tick-font-weight` | `400`           |
| `tickColor`      | `--d3c-tick-color`       | `#4b5563`       |

### Axis Lines

| Token           | CSS Variable            | Default (Light) |
| --------------- | ----------------------- | --------------- |
| `axisLineColor` | `--d3c-axis-line-color` | `#9ca3af`       |
| `axisLineWidth` | `--d3c-axis-line-width` | `1`             |

### Grid Lines

| Token               | CSS Variable                | Default (Light) |
| ------------------- | --------------------------- | --------------- |
| `gridLineColor`     | `--d3c-grid-line-color`     | `#e5e7eb`       |
| `gridLineWidth`     | `--d3c-grid-line-width`     | `1`             |
| `gridLineDasharray` | `--d3c-grid-line-dasharray` | `2,2`           |

### Legend

| Token              | CSS Variable               | Default (Light) |
| ------------------ | -------------------------- | --------------- |
| `legendFontSize`   | `--d3c-legend-font-size`   | `11px`          |
| `legendFontWeight` | `--d3c-legend-font-weight` | `500`           |
| `legendColor`      | `--d3c-legend-color`       | `#374151`       |

### Chart Background

| Token             | CSS Variable     | Default (Light) |
| ----------------- | ---------------- | --------------- |
| `chartBackground` | `--d3c-chart-bg` | `transparent`   |

### Data Palette

| Token     | CSS Variables                               | Default (Light)   |
| --------- | ------------------------------------------- | ----------------- |
| `palette` | `--d3c-palette-0` through `--d3c-palette-9` | Tableau 10 colors |

### Bar Chart

| Token             | CSS Variable              | Default (Light) |
| ----------------- | ------------------------- | --------------- |
| `barBorderRadius` | `--d3c-bar-border-radius` | `2`             |

### Line Chart

| Token             | CSS Variable              | Default (Light) |
| ----------------- | ------------------------- | --------------- |
| `lineStrokeWidth` | `--d3c-line-stroke-width` | `2`             |
| `pointRadius`     | `--d3c-point-radius`      | `3`             |

### Pie Chart

| Token                | CSS Variable                  | Default (Light) |
| -------------------- | ----------------------------- | --------------- |
| `pieStrokeColor`     | `--d3c-pie-stroke-color`      | `#ffffff`       |
| `pieStrokeWidth`     | `--d3c-pie-stroke-width`      | `1`             |
| `pieLabelColor`      | `--d3c-pie-label-color`       | `#ffffff`       |
| `pieLabelFontSize`   | `--d3c-pie-label-font-size`   | `12px`          |
| `pieLabelFontWeight` | `--d3c-pie-label-font-weight` | `600`           |

## CSS Classes

The provider injects these CSS classes that shared SVG components use:

| Class              | Applied to                       | Properties                                |
| ------------------ | -------------------------------- | ----------------------------------------- |
| `.d3c-tick-text`   | Axis tick labels (`<text>`)      | font-family, font-size, font-weight, fill |
| `.d3c-axis-line`   | Main axis lines (`<line>`)       | stroke, stroke-width                      |
| `.d3c-tick-line`   | Tick mark lines (`<line>`)       | stroke, stroke-width                      |
| `.d3c-grid-line`   | Background grid lines (`<line>`) | stroke, stroke-width, stroke-dasharray    |
| `.d3c-legend-text` | Legend labels (`<text>`)         | font-family, font-size, font-weight, fill |

## SCSS Bridge

For developers extending the library, SCSS files provide a typed bridge to the CSS variables:

- **`cssVarMap.scss`** — SCSS variables that resolve to `var(--d3c-*)` with fallbacks.
- **`_mixins.scss`** — Composable mixins like `@mixin tick-text`, `@mixin axis-line`.
- **`chartBase.scss`** — Class definitions using the mixins (SCSS source of truth for `baseStyles.ts`).

```scss
@use '../theme/mixins' as *;

.my-custom-label {
  @include tick-text;
  font-size: var(--d3c-tick-font-size, 14px); // override just one property
}
```
