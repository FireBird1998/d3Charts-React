# Types — `src/types/`

Shared TypeScript interfaces and constants used across all chart components.

## Interfaces

### `Margin`

Defines spacing around the chart area inside the SVG.

| Property | Type     | Description             |
| -------- | -------- | ----------------------- |
| `top`    | `number` | Top margin in pixels    |
| `right`  | `number` | Right margin in pixels  |
| `bottom` | `number` | Bottom margin in pixels |
| `left`   | `number` | Left margin in pixels   |

### `DataPoint`

A single labelled numeric value. Used by `BarChart` (via the generic constraint) and `PieChart`.

| Property | Type     | Description             |
| -------- | -------- | ----------------------- |
| `label`  | `string` | Category / slice name   |
| `value`  | `number` | Numeric value to render |

### `LineDataPoint`

A single x/y coordinate for line charts.

| Property | Type     | Description      |
| -------- | -------- | ---------------- |
| `x`      | `number` | Horizontal value |
| `y`      | `number` | Vertical value   |

### `LineSeries`

A named series of points rendered as one line.

| Property | Type              | Description                     |
| -------- | ----------------- | ------------------------------- |
| `id`     | `string`          | Unique identifier for the line  |
| `data`   | `LineDataPoint[]` | Ordered array of x/y points     |
| `color`  | `string?`         | Optional stroke colour override |

### `ChartDimensions`

Pre-computed dimensions for a chart, combining outer size with margins.

| Property      | Type     | Description                           |
| ------------- | -------- | ------------------------------------- |
| `width`       | `number` | Outer SVG width                       |
| `height`      | `number` | Outer SVG height                      |
| `margin`      | `Margin` | Margins applied                       |
| `innerWidth`  | `number` | `width - margin.left - margin.right`  |
| `innerHeight` | `number` | `height - margin.top - margin.bottom` |

## Constants

### `DEFAULT_MARGIN`

```ts
export const DEFAULT_MARGIN: Margin = {
  top: 20,
  right: 20,
  bottom: 40,
  left: 50,
}
```

Provides sensible defaults. Each chart component also declares its own local copy so it can be used independently.
