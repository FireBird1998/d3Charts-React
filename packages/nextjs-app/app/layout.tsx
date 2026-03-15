import type { Metadata } from 'next'
import { ThemeProvider } from '../components/ThemeProvider'
import { Navigation } from '../components/Navigation'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | D3Charts',
    default: 'D3Charts — Next.js Demo',
  },
  description: 'React charting components powered by D3.js',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var s=localStorage.getItem('d3charts-theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme:dark)').matches;if(d)document.documentElement.classList.add('dark')}catch(_){}`,
          }}
        />
      </head>
      <body className="bg-gray-50 text-gray-900 transition-colors dark:bg-gray-950 dark:text-gray-100">
        <ThemeProvider>
          <Navigation />
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
          <footer className="border-t border-gray-200 py-8 text-center text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
            Built with D3.js + React
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}
