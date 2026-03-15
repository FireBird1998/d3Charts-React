import type { ReactNode } from 'react'

interface ChartCardProps {
  title: string
  description: string
  children: ReactNode
  controls?: ReactNode
  className?: string
}

export function ChartCard({
  title,
  description,
  children,
  controls,
  className = '',
}: ChartCardProps) {
  return (
    <div
      className={[
        'bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        </div>
        {controls && <div className="flex gap-1">{controls}</div>}
      </div>
      {children}
    </div>
  )
}
