# Utilities — `src/utils/`

Pure helper functions that bridge D3 math with React rendering. These modules have **no React dependency** — they accept D3 scale objects or plain data and return plain values.

## `scales.ts`

Scale factory functions built on top of `d3-scale`.

### `createBandScale(data, rangeEnd)`

Creates a `scaleBand` for categorical x-axes.

| Parameter  | Type          | Description                         |
| ---------- | ------------- | ----------------------------------- |
| `data`     | `DataPoint[]` | Data array (labels become domain)   |
| `rangeEnd` | `number`      | Pixel width of the chart inner area |

**Returns:** `ScaleBand<string>` with `0.2` padding.

### `createLinearScale(domain, range)`

Creates a `scaleLinear` for continuous y-axes.

| Parameter | Type               | Description                                |
| --------- | ------------------ | ------------------------------------------ |
| `domain`  | `[number, number]` | Min/max data values                        |
| `range`   | `[number, number]` | Pixel range (typically `[innerHeight, 0]`) |

**Returns:** `ScaleLinear<number, number>` with `.nice()` applied.

### `getValueExtent(data)`

Returns `[0, max]` for a `DataPoint[]` array — convenient for bar charts where the y-axis starts at zero.

| Parameter | Type          | Description |
| --------- | ------------- | ----------- |
| `data`    | `DataPoint[]` | Data array  |

**Returns:** `[number, number]`

### `getLineExtent(seriesData, accessor)`

Computes `[min, max]` across multiple series for a given accessor (e.g., `d => d.x` or `d => d.y`).

| Parameter    | Type                           | Description                        |
| ------------ | ------------------------------ | ---------------------------------- |
| `seriesData` | `LineDataPoint[][]`            | Array of series data arrays        |
| `accessor`   | `(d: LineDataPoint) => number` | Function extracting the coordinate |

**Returns:** `[number, number]`

---

## `axes.ts`

Tick generation helpers that convert D3 scales into a simple `TickLine[]` array consumed by `AxisBottom` and `AxisLeft`.

### `TickLine` (interface)

```ts
interface TickLine {
  value: string | number
  offset: number // pixel position along the axis
}
```

### `getBandTicks(scale)`

Generates ticks for a categorical (band) axis.

| Parameter | Type                | Description            |
| --------- | ------------------- | ---------------------- |
| `scale`   | `ScaleBand<string>` | The band scale to read |

**Returns:** `TickLine[]` — one entry per domain value, positioned at the band centre.

### `getLinearTicks(scale, count?)`

Generates ticks for a numeric (linear) axis.

| Parameter | Type                          | Default | Description              |
| --------- | ----------------------------- | ------- | ------------------------ |
| `scale`   | `ScaleLinear<number, number>` | —       | The linear scale to read |
| `count`   | `number`                      | `5`     | Suggested tick count     |

**Returns:** `TickLine[]` — D3-generated nice tick values with their pixel offsets.
