'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

type Transaction = { amount: number; createdAt: Date }

type Props = {
  transactions: Transaction[]
}

function buildChartData(transactions: Transaction[]) {
  if (transactions.length === 0) return []

  const sorted = [...transactions].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  )

  let cumulative = 0
  return sorted.map((t, i) => {
    cumulative += t.amount
    return {
      label: `#${i + 1} · ${new Date(t.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} ${new Date(t.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`,
      deposit: t.amount,
      terkumpul: cumulative,
    }
  })
}

function formatRupiahShort(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}jt`
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}rb`
  return value.toString()
}

export default function SavingsChart({ transactions }: Props) {
  const data = buildChartData(transactions)

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-slate-400 text-sm">
        Belum ada data transaksi
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorTerkumpul" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 10, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          interval={0}
          tickFormatter={(v) => v.split(' · ')[0]}
        />
        <YAxis
          tickFormatter={formatRupiahShort}
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          width={40}
          domain={[0, (dataMax: number) => Math.max(dataMax * 1.2, 1000)]}
        />
        <Tooltip
          formatter={(value, name) => [
            new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(value)),
            name === 'terkumpul' ? 'Total Terkumpul' : 'Deposit',
          ]}
          labelFormatter={(label) => label.replace(' · ', '\n')}
          contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: 12 }}
        />
        <Area
          type="monotone"
          dataKey="terkumpul"
          stroke="#10b981"
          strokeWidth={2}
          fill="url(#colorTerkumpul)"
          dot={{ fill: '#10b981', r: 3 }}
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
