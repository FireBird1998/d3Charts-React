import Link from 'next/link'
import { PreviewCards } from './PreviewCards'

export default function Home() {
  return (
    <div>
      <section className="py-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          D3Charts for React
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          A composable charting library that uses D3 for math and React for rendering. Fully
          responsive, theme-aware, and accessible out of the box.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/bar-chart"
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            Explore Charts
          </Link>
          <a
            href="https://github.com/AkshayFirebird1998/D3Charts"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            GitHub
          </a>
        </div>
      </section>

      <section className="py-8">
        <h2 className="mb-6 text-center text-2xl font-semibold text-gray-900 dark:text-white">
          Chart Types
        </h2>
        <PreviewCards />
      </section>
    </div>
  )
}
