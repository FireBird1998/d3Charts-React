import type { Metadata } from 'next'
import { PieChartShowcase } from './PieChartShowcase'

export const metadata: Metadata = {
  title: 'Pie Charts',
}

export default function PieChartPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pie Charts</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Full pie and donut chart variants with configurable labels, inner radius, and padding.
          Built for clear part-to-whole comparisons.
        </p>
      </div>
      <PieChartShowcase />
    </div>
  )
}
