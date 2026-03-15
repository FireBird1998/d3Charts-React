'use client'

import { useState } from 'react'
import type { CurveType } from '@firebird1998/d3charts-react'
import { LineChart, AreaChart, ResponsiveChart } from '@firebird1998/d3charts-react'
import { ChartSection } from '../../components/ChartSection'
import { signupData, adoptionData, months } from '../../data/chartData'

const curveTypes: CurveType[] = ['linear', 'monotoneX', 'natural', 'step']

export function LineChartShowcase() {
  const [selectedCurve, setSelectedCurve] = useState<CurveType>('monotoneX')

  return (
    <div className="space-y-12">
      <ChartSection
        title="User Signups"
        description="Daily signups by acquisition channel over 12 months"
        controls={<CurveSelector value={selectedCurve} onChange={setSelectedCurve} />}
      >
        {({ width, height }) => (
          <LineChart
            series={signupData}
            width={width}
            height={height}
            curve={selectedCurve}
            colors={{ Organic: '#3b82f6', Paid: '#f59e0b' }}
            ariaLabel="User signups line chart"
            xAxisLabel="Month"
            yAxisLabel="Signups"
            xTickFormat={(v) => months[Number(v)] ?? String(v)}
          />
        )}
      </ChartSection>

      <ChartSection
        title="Feature Adoption"
        description="Cumulative feature usage over time shown as filled areas"
      >
        {({ width, height }) => (
          <AreaChart
            series={adoptionData}
            width={width}
            height={height}
            curve="monotoneX"
            fillOpacity={0.25}
            colors={{ Dashboard: '#8b5cf6', API: '#06b6d4' }}
            ariaLabel="Feature adoption area chart"
            xAxisLabel="Month"
            yAxisLabel="Active Users"
            xTickFormat={(v) => months[Number(v)] ?? String(v)}
          />
        )}
      </ChartSection>

      <div>
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Curve Comparison
        </h2>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          The same signup data rendered with four different interpolation curves
        </p>
        <div className="grid gap-6 sm:grid-cols-2">
          {curveTypes.map((curve) => (
            <div
              key={curve}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="border-b border-gray-100 px-4 py-2 dark:border-gray-800">
                <span className="text-sm font-medium capitalize text-gray-700 dark:text-gray-300">
                  {curve}
                </span>
              </div>
              <div className="p-4">
                <ResponsiveChart aspectRatio={16 / 10} minHeight={180}>
                  {({ width, height }) => (
                    <LineChart
                      series={signupData}
                      width={width}
                      height={height}
                      margin={{ top: 10, right: 15, bottom: 35, left: 45 }}
                      curve={curve}
                      colors={{ Organic: '#3b82f6', Paid: '#f59e0b' }}
                      ariaLabel={`Signup chart with ${curve} curve`}
                      xTickFormat={(v) => months[Number(v)] ?? String(v)}
                    />
                  )}
                </ResponsiveChart>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CurveSelector({
  value,
  onChange,
}: {
  value: CurveType
  onChange: (curve: CurveType) => void
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as CurveType)}
      className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
    >
      {curveTypes.map((curve) => (
        <option key={curve} value={curve}>
          {curve}
        </option>
      ))}
    </select>
  )
}
