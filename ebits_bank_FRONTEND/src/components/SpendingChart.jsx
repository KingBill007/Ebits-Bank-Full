import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import styles from '../styles/spendingChart.module.css';

function aggregateChartData(transactions) {
  if (!transactions || transactions.length === 0) return [];

  const today = new Date();
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const key = date.toISOString().split('T')[0];
    last7Days.push({
      date: key,
      label: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      deposit: 0,
      withdraw: 0,
    });
  }

  transactions.forEach((tx) => {
    const txDate = new Date(tx.date).toISOString().split('T')[0];
    const day = last7Days.find((d) => d.date === txDate);
    if (day) {
      const value = Number(tx.Value);
      if (tx.type === 'Deposit') {
        day.deposit += value;
      } else if (tx.type === 'Withdraw') {
        day.withdraw += value;
      }
    }
  });

  const hasData = last7Days.some((d) => d.deposit > 0 || d.withdraw > 0);
  return hasData ? last7Days : [];
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e0e0e0',
      borderRadius: 8,
      padding: '10px 14px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      fontSize: 13,
    }}>
      <p style={{ margin: 0, fontWeight: 600, color: '#333', marginBottom: 4 }}>{label}</p>
      {payload.map((entry, idx) => (
        <p key={idx} style={{ margin: 0, color: entry.color, fontWeight: 500 }}>
          {entry.name === 'deposit' ? 'Deposits' : 'Withdrawals'}: GH₵ {Number(entry.value).toFixed(2)}
        </p>
      ))}
    </div>
  );
}

function SpendingChart({ data }) {
  const chartData = aggregateChartData(data);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>Spending Overview</span>
        <span className={styles.period}>Last selected 7 days</span>
      </div>
      {chartData.length > 0 ? (
        <div className={styles.chartWrapper}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barGap={4} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: '#718096' }}
                tickLine={false}
                axisLine={{ stroke: '#e8ecf1' }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#718096' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `GH₵${val}`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8faff' }} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span style={{ color: '#4a5568', fontSize: 12 }}>{value === 'deposit' ? 'Deposits' : 'Withdrawals'}</span>}
              />
              <Bar
                dataKey="deposit"
                name="deposit"
                fill="#2e7d32"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
              <Bar
                dataKey="withdraw"
                name="withdraw"
                fill="#c62828"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className={styles.empty}>
          No transaction data in the last 7 days
        </div>
      )}
    </div>
  );
}

export default SpendingChart;
