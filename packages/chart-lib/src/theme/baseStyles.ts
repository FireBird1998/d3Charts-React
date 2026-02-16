/**
 * Static CSS class definitions that consume the injected CSS custom properties.
 * These are injected alongside the theme variables by ChartThemeProvider.
 *
 * Each class targets SVG elements inside chart components so that presentation
 * attributes (fill, stroke, font-size, etc.) are driven by CSS variables
 * rather than hardcoded inline values.
 *
 * Fallback values mirror the light theme defaults so charts render correctly
 * even without a wrapping ChartThemeProvider.
 */
export const BASE_STYLES = `
.d3c-tick-text {
  font-family: var(--d3c-font-family, 'Inter', 'Helvetica Neue', system-ui, sans-serif);
  font-size: var(--d3c-tick-font-size, 12px);
  font-weight: var(--d3c-tick-font-weight, 400);
  fill: var(--d3c-tick-color, #4b5563);
}

.d3c-axis-line {
  stroke: var(--d3c-axis-line-color, #9ca3af);
  stroke-width: var(--d3c-axis-line-width, 1);
}

.d3c-tick-line {
  stroke: var(--d3c-axis-line-color, #9ca3af);
  stroke-width: var(--d3c-axis-line-width, 1);
}

.d3c-grid-line {
  stroke: var(--d3c-grid-line-color, #e5e7eb);
  stroke-width: var(--d3c-grid-line-width, 1);
  stroke-dasharray: var(--d3c-grid-line-dasharray, 2,2);
}

.d3c-legend-text {
  font-family: var(--d3c-font-family, 'Inter', 'Helvetica Neue', system-ui, sans-serif);
  font-size: var(--d3c-legend-font-size, 11px);
  font-weight: var(--d3c-legend-font-weight, 500);
  fill: var(--d3c-legend-color, #374151);
}
`.trim()
