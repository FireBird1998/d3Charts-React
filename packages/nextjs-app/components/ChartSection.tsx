'use client'

import { type ReactNode } from 'react'
import { ResponsiveChart } from '@firebird1998/d3charts-react'

interface ChartSectionProps {
  title: string
  description?: string
  controls?: ReactNode
  children: (dims: { width: number; height: number }) => ReactNode
  aspectRatio?: number
  minHeight?: number
}

export function ChartSection({
  title,
  description,
  controls,
  children,
  aspectRatio = 16 / 9,
  minHeight = 300,
}: ChartSectionProps) {
  return (
    <section className="mb-8">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
          )}
        </div>
        {controls && <div className="flex items-center gap-2">{controls}</div>}
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <ResponsiveChart aspectRatio={aspectRatio} minHeight={minHeight}>
          {children}
        </ResponsiveChart>
      </div>
    </section>
  )
}
