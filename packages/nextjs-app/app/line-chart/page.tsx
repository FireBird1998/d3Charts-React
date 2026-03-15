import type { Metadata } from 'next'
import { LineChartShowcase } from './LineChartShowcase'

export const metadata: Metadata = {
  title: 'Line Charts',
}

export default function LineChartPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Line Charts</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Multi-series line and area charts with different interpolation curves. Compare linear,
          monotone, natural, and step curve types side by side.
        </p>
      </div>
      <LineChartShowcase />
    </div>
  )
}
