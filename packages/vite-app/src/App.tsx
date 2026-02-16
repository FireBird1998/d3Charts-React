import { BarChart, LineChart } from '@d3charts/react'

const barData = [
  { label: 'Jan', value: 30 },
  { label: 'Feb', value: 80 },
  { label: 'Mar', value: 45 },
  { label: 'Apr', value: 60 },
  { label: 'May', value: 20 },
  { label: 'Jun', value: 90 },
  { label: 'Jul', value: 55 },
]

const lineSeries = [
  {
    id: 'revenue',
    data: [
      { x: 0, y: 10 },
      { x: 1, y: 25 },
      { x: 2, y: 18 },
      { x: 3, y: 35 },
      { x: 4, y: 28 },
      { x: 5, y: 42 },
      { x: 6, y: 38 },
    ],
    color: '#4e79a7',
  },
  {
    id: 'expenses',
    data: [
      { x: 0, y: 15 },
      { x: 1, y: 12 },
      { x: 2, y: 22 },
      { x: 3, y: 20 },
      { x: 4, y: 30 },
      { x: 5, y: 25 },
      { x: 6, y: 32 },
    ],
    color: '#e15759',
  },
]

export function App() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ marginBottom: '0.5rem', fontSize: '1.75rem', fontWeight: 700 }}>
        D3Charts Demo
      </h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        React components powered by D3.js math — consumed via <code>@d3charts/react</code>
      </p>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Bar Chart</h2>
        <div
          style={{
            background: '#fff',
            padding: '1rem',
            borderRadius: 8,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <BarChart data={barData} width={700} height={400} />
        </div>
      </section>

      <section>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Line Chart</h2>
        <div
          style={{
            background: '#fff',
            padding: '1rem',
            borderRadius: 8,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
        >
          <LineChart series={lineSeries} width={700} height={400} />
        </div>
      </section>
    </div>
  )
}
