import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'D3Charts — Next.js Demo',
  description: 'React chart components powered by D3.js',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          background: '#fafafa',
          color: '#1a1a2e',
          margin: 0,
        }}
      >
        {children}
      </body>
    </html>
  )
}
