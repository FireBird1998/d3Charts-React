'use client'

import Link from 'next/link'
import { BarChart, LineChart, PieChart } from '@firebird1998/d3charts-react'
import { revenueData, signupData, satisfactionData } from '../data/chartData'

const cards = [
  {
    href: '/bar-chart',
    title: 'Bar Charts',
    description: 'Grouped and stacked bars for categorical comparisons',
  },
  {
    href: '/line-chart',
    title: 'Line Charts',
    description: 'Multi-series lines and areas with curve options',
  },
  {
    href: '/pie-chart',
    title: 'Pie Charts',
    description: 'Pie and donut charts with label control',
  },
]

export function PreviewCards() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map(({ href, title, description }, i) => (
        <Link
          key={href}
          href={href}
          className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="flex items-center justify-center bg-gray-50 p-4 dark:bg-gray-800/50">
            {i === 0 && (
              <BarChart
                data={revenueData}
                keys={['americas', 'europe', 'asia']}
                categoryKey="quarter"
                width={280}
                height={180}
                margin={{ top: 10, right: 10, bottom: 30, left: 40 }}
                ariaLabel="Revenue preview chart"
              />
            )}
            {i === 1 && (
              <LineChart
                series={signupData}
                width={280}
                height={180}
                margin={{ top: 10, right: 10, bottom: 30, left: 40 }}
                ariaLabel="Signups preview chart"
              />
            )}
            {i === 2 && (
              <PieChart
                data={satisfactionData}
                width={200}
                height={180}
                ariaLabel="Satisfaction preview chart"
              />
            )}
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
              {title}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
