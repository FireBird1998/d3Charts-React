import type { Metadata } from 'next'
import { BarChartShowcase } from './BarChartShowcase'

export const metadata: Metadata = {
  title: 'Bar Charts',
}

export default function BarChartPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bar Charts</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Grouped and stacked bar charts for comparing categorical data across multiple series.
          Toggle between modes to see different visualizations of the same data.
        </p>
      </div>
      <BarChartShowcase />
    </div>
  )
}
