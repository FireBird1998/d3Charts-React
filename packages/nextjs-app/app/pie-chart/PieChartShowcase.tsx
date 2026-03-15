'use client'

import { useState } from 'react'
import { PieChart } from '@firebird1998/d3charts-react'
import { ChartSection } from '../../components/ChartSection'
import { satisfactionData } from '../../data/chartData'

export function PieChartShowcase() {
  const [showLabels, setShowLabels] = useState(true)

  return (
    <div className="space-y-12">
      <ChartSection
        title="Customer Satisfaction"
        description="Survey results from 5,000 respondents shown as a full pie"
        controls={
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={showLabels}
              onChange={(e) => setShowLabels(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Show labels
          </label>
        }
        aspectRatio={4 / 3}
        minHeight={350}
      >
        {({ width, height }) => (
          <PieChart
            data={satisfactionData}
            width={width}
            height={height}
            showLabels={showLabels}
            colors={['#22c55e', '#86efac', '#fbbf24', '#f97316', '#ef4444']}
            ariaLabel="Customer satisfaction pie chart"
          />
        )}
      </ChartSection>

      <div>
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Donut Variant</h2>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Same data rendered as a donut chart with inner radius, padding, and rounded corners
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="border-b border-gray-100 px-4 py-2 dark:border-gray-800">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Full Pie</span>
            </div>
            <div className="flex items-center justify-center p-6">
              <PieChart
                data={satisfactionData}
                width={300}
                height={300}
                showLabels={showLabels}
                colors={['#22c55e', '#86efac', '#fbbf24', '#f97316', '#ef4444']}
                ariaLabel="Customer satisfaction full pie"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="border-b border-gray-100 px-4 py-2 dark:border-gray-800">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Donut (innerRadius=60)
              </span>
            </div>
            <div className="flex items-center justify-center p-6">
              <PieChart
                data={satisfactionData}
                width={300}
                height={300}
                innerRadius={60}
                padAngle={0.02}
                cornerRadius={4}
                showLabels={showLabels}
                colors={['#22c55e', '#86efac', '#fbbf24', '#f97316', '#ef4444']}
                ariaLabel="Customer satisfaction donut chart"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
