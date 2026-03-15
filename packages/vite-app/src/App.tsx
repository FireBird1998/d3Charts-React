import { useState, useCallback } from 'react'
import {
  BarChart,
  LineChart,
  PieChart,
  AreaChart,
  ResponsiveChart,
  ChartThemeProvider,
} from '@firebird1998/d3charts-react'
import type { CurveType } from '@firebird1998/d3charts-react'
import { ThemeToggle } from './components/ThemeToggle'
import { ChartCard } from './components/ChartCard'
import { ControlPanel } from './components/ControlPanel'
import {
  weatherData,
  fundingData,
  sprintData,
  browserData,
  budgetData,
  stockData,
  months,
} from './data/chartData'

export function App() {
  const [isDark, setIsDark] = useState(
    () => typeof window !== 'undefined' && localStorage.getItem('theme') === 'dark',
  )
  const [barMode, setBarMode] = useState<'grouped' | 'stacked'>('grouped')
  const [curveType, setCurveType] = useState<CurveType>('monotoneX')

  const handleThemeChange = useCallback((dark: boolean) => setIsDark(dark), [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <ChartThemeProvider theme={isDark ? 'dark' : 'light'}>
        {/* Header */}
        <header className="relative py-16 px-6 text-center">
          <div className="absolute top-6 right-6">
            <ThemeToggle onChange={handleThemeChange} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            @firebird1998/d3charts-react
          </h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            React charting components powered by D3 math. Zero DOM conflicts. Just props in, SVG
            out.
          </p>
        </header>

        {/* Gallery */}
        <main className="max-w-7xl mx-auto px-4 pb-16 grid gap-8 sm:grid-cols-1 lg:grid-cols-2">
          {/* Row 1: Bar charts */}
          <ChartCard
            title="Startup Funding by Sector"
            description="Series A/B/C investment amounts across sectors"
            controls={
              <ControlPanel
                items={[
                  { label: 'Grouped', value: 'grouped' as const },
                  { label: 'Stacked', value: 'stacked' as const },
                ]}
                selected={barMode}
                onChange={setBarMode}
              />
            }
          >
            <ResponsiveChart aspectRatio={16 / 10}>
              {({ width, height }) => (
                <BarChart
                  data={fundingData}
                  keys={['seriesA', 'seriesB', 'seriesC']}
                  categoryKey="sector"
                  width={width}
                  height={height}
                  mode={barMode}
                  colors={{ seriesA: '#6366f1', seriesB: '#8b5cf6', seriesC: '#a78bfa' }}
                  yAxisLabel="Investment ($M)"
                  yTickFormat={(v) => `$${v}M`}
                />
              )}
            </ResponsiveChart>
          </ChartCard>

          <ChartCard title="Sprint Velocity" description="Task completion by status across sprints">
            <ResponsiveChart aspectRatio={16 / 10}>
              {({ width, height }) => (
                <BarChart
                  data={sprintData}
                  keys={['done', 'inProgress', 'blocked']}
                  categoryKey="sprint"
                  width={width}
                  height={height}
                  mode="stacked"
                  colors={{ done: '#22c55e', inProgress: '#f59e0b', blocked: '#ef4444' }}
                  yAxisLabel="Tasks"
                />
              )}
            </ResponsiveChart>
          </ChartCard>

          {/* Row 2: Line chart (full width) */}
          <ChartCard
            title="Monthly Temperatures"
            description="Average temperatures across major cities"
            className="lg:col-span-2"
            controls={
              <ControlPanel
                items={[
                  { label: 'Smooth', value: 'monotoneX' as const },
                  { label: 'Linear', value: 'linear' as const },
                  { label: 'Natural', value: 'natural' as const },
                  { label: 'Step', value: 'step' as const },
                ]}
                selected={curveType}
                onChange={setCurveType}
              />
            }
          >
            <ResponsiveChart aspectRatio={21 / 9}>
              {({ width, height }) => (
                <LineChart
                  series={weatherData}
                  width={width}
                  height={height}
                  curve={curveType}
                  xTickFormat={(v) => months[Number(v)] ?? String(v)}
                  yTickFormat={(v) => `${v}\u00B0C`}
                  xAxisLabel="Month"
                  yAxisLabel="Temperature"
                />
              )}
            </ResponsiveChart>
          </ChartCard>

          {/* Row 3: Pie charts */}
          <ChartCard title="Browser Market Share" description="Global usage statistics for 2024">
            <ResponsiveChart aspectRatio={1} minHeight={300}>
              {({ width, height }) => (
                <PieChart
                  data={browserData}
                  width={width}
                  height={height}
                  colors={['#4285f4', '#ff6d01', '#e94235', '#34a853', '#9aa0a6']}
                />
              )}
            </ResponsiveChart>
          </ChartCard>

          <ChartCard title="Budget Allocation" description="Department budget distribution">
            <ResponsiveChart aspectRatio={1} minHeight={300}>
              {({ width, height }) => (
                <PieChart
                  data={budgetData}
                  width={width}
                  height={height}
                  innerRadius={Math.min(width, height) / 5}
                  colors={['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#6b7280']}
                />
              )}
            </ResponsiveChart>
          </ChartCard>

          {/* Row 4: Area chart (full width) */}
          <ChartCard
            title="Stock Performance"
            description="12-month stock price comparison"
            className="lg:col-span-2"
          >
            <ResponsiveChart aspectRatio={21 / 9}>
              {({ width, height }) => (
                <AreaChart
                  series={stockData}
                  width={width}
                  height={height}
                  fillOpacity={0.2}
                  xTickFormat={(v) => months[Number(v)] ?? String(v)}
                  yTickFormat={(v) => `$${v}`}
                  xAxisLabel="Month"
                  yAxisLabel="Price ($)"
                  colors={{ AAPL: '#007aff', GOOGL: '#34a853' }}
                />
              )}
            </ResponsiveChart>
          </ChartCard>
        </main>

        {/* Footer */}
        <footer className="py-8 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
          Built with D3.js + React &mdash;{' '}
          <a
            href="https://github.com/FireBird1998/d3Charts-React"
            className="underline hover:text-gray-700 dark:hover:text-gray-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </footer>
      </ChartThemeProvider>
    </div>
  )
}
