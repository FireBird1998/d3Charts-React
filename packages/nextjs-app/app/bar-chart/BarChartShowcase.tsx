'use client'

import { useState } from 'react'
import { BarChart } from '@firebird1998/d3charts-react'
import { ChartSection } from '../../components/ChartSection'
import { revenueData, salesData } from '../../data/chartData'

type BarMode = 'grouped' | 'stacked'

export function BarChartShowcase() {
  const [revenueMode, setRevenueMode] = useState<BarMode>('grouped')
  const [salesMode, setSalesMode] = useState<BarMode>('stacked')

  return (
    <div className="space-y-12">
      <ChartSection
        title="Revenue by Region"
        description="Quarterly e-commerce revenue across three regions"
        controls={<ModeToggle value={revenueMode} onChange={setRevenueMode} />}
      >
        {({ width, height }) => (
          <BarChart
            data={revenueData}
            keys={['americas', 'europe', 'asia']}
            categoryKey="quarter"
            width={width}
            height={height}
            mode={revenueMode}
            colors={{ americas: '#3b82f6', europe: '#10b981', asia: '#f59e0b' }}
            ariaLabel="Revenue by region bar chart"
            xAxisLabel="Quarter"
            yAxisLabel="Revenue ($M)"
          />
        )}
      </ChartSection>

      <ChartSection
        title="Sales by Category"
        description="Monthly sales breakdown by product category"
        controls={<ModeToggle value={salesMode} onChange={setSalesMode} />}
      >
        {({ width, height }) => (
          <BarChart
            data={salesData}
            keys={['electronics', 'clothing', 'food']}
            categoryKey="month"
            width={width}
            height={height}
            mode={salesMode}
            colors={{ electronics: '#8b5cf6', clothing: '#ec4899', food: '#14b8a6' }}
            ariaLabel="Sales by category bar chart"
            xAxisLabel="Month"
            yAxisLabel="Sales ($K)"
          />
        )}
      </ChartSection>
    </div>
  )
}

function ModeToggle({ value, onChange }: { value: BarMode; onChange: (mode: BarMode) => void }) {
  return (
    <div className="inline-flex rounded-lg border border-gray-200 bg-gray-100 p-1 dark:border-gray-700 dark:bg-gray-800">
      {(['grouped', 'stacked'] as const).map((mode) => (
        <button
          key={mode}
          onClick={() => onChange(mode)}
          className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
            value === mode
              ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          {mode}
        </button>
      ))}
    </div>
  )
}
