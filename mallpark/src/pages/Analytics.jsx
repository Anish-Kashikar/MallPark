import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { useParkingStore } from '../store/parkingStore';
import { analyticsData } from '../data/mockData';

const PALETTE_COLORS = ['#1FA9A6', '#E63946', '#0B3C5D', '#facc15', '#8b5cf6'];

const peakHour = analyticsData.hourly.reduce((a, b) => a.occupancy > b.occupancy ? a : b);
const maxOccupiedFloor = analyticsData.floorUsage.reduce((a, b) => a.used > b.used ? a : b);
const avgDuration = (analyticsData.parkingHistory.reduce((sum, d) => sum + d.avgDuration, 0) / analyticsData.parkingHistory.length).toFixed(1);
const todayVisitors = analyticsData.parkingHistory[analyticsData.parkingHistory.length - 1].visitors;

export default function Analytics() {
  const { theme } = useParkingStore();
  const isDark = theme === 'dark';

  const text     = isDark ? '#F4F1DE' : '#2B2D42';
  const muted    = isDark ? '#8a8ea8' : '#7a7c92';
  const border   = isDark ? 'rgba(43,45,66,0.7)' : '#e0e0ee';
  const cardBg   = isDark ? '#1b1f2e' : '#ffffff';
  const gridCol  = isDark ? 'rgba(43,45,66,0.5)' : '#ebebf8';
  const teal     = '#1FA9A6';
  const navy     = '#0B3C5D';

  const tooltipStyle = { background: isDark ? '#1b1f2e' : '#fff', border: `1px solid ${border}`, borderRadius: 8, fontSize: 12 };

  const ChartCard = ({ title, children, span }) => (
    <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 14, padding: '20px 22px', gridColumn: span }}>
      <p style={{ fontWeight: 700, fontSize: 14, color: text, marginBottom: 18 }}>{title}</p>
      {children}
    </div>
  );

  const StatPill = ({ label, value, sub, color }) => (
    <div style={{
      background: cardBg, border: `1px solid ${border}`, borderRadius: 12,
      padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      <p style={{ fontSize: 11, color: muted, fontWeight: 600 }}>{label}</p>
      <p style={{ fontSize: 26, fontWeight: 800, color: color || text, lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ fontSize: 10, color: muted, marginTop: 2 }}>{sub}</p>}
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: text, marginBottom: 4 }}>Analytics</h1>
        <p style={{ fontSize: 14, color: muted }}>Parking trends, history, and real-time insights</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
        <StatPill label="Today's Visitors" value={todayVisitors} sub="Sunday estimate" color={teal} />
        <StatPill label="Avg. Duration" value={`${avgDuration}h`} sub="This week" color={teal} />
        <StatPill label="Peak Hour" value={peakHour.hour} sub={`${peakHour.occupancy}% occupied`} color="#E63946" />
        <StatPill label="Busiest Floor" value={maxOccupiedFloor.floor} sub={`${maxOccupiedFloor.used}% usage today`} color={navy === '#0B3C5D' ? (isDark ? '#5aafd4' : navy) : navy} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <ChartCard title="Hourly Occupancy Today">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={analyticsData.hourly}>
              <CartesianGrid stroke={gridCol} strokeDasharray="3 3" />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: muted }} />
              <YAxis tick={{ fontSize: 10, fill: muted }} unit="%" />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="occupancy" stroke={teal} strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Weekly Visitors">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analyticsData.weekly}>
              <CartesianGrid stroke={gridCol} strokeDasharray="3 3" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: muted }} />
              <YAxis tick={{ fontSize: 10, fill: muted }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="visitors" fill={teal} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <ChartCard title="Vehicle Type Distribution">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={analyticsData.vehicleTypes} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={72} innerRadius={32}>
                {analyticsData.vehicleTypes.map((_, i) => (
                  <Cell key={i} fill={PALETTE_COLORS[i % PALETTE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(v, n) => [`${v}%`, n]} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: muted }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Floor Usage Comparison">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analyticsData.floorUsage} layout="vertical">
              <CartesianGrid stroke={gridCol} strokeDasharray="3 3" />
              <XAxis type="number" unit="%" tick={{ fontSize: 10, fill: muted }} />
              <YAxis dataKey="floor" type="category" tick={{ fontSize: 10, fill: muted }} width={62} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="used" fill={teal} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 14, padding: '20px 22px' }}>
        <p style={{ fontWeight: 700, fontSize: 14, color: text, marginBottom: 6 }}>Parking History — This Week</p>
        <p style={{ fontSize: 12, color: muted, marginBottom: 18 }}>Daily visitors and average time spent per vehicle</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={analyticsData.parkingHistory}>
              <CartesianGrid stroke={gridCol} strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: muted }} />
              <YAxis tick={{ fontSize: 10, fill: muted }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="visitors" name="Visitors" fill={teal} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={analyticsData.parkingHistory}>
              <CartesianGrid stroke={gridCol} strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: muted }} />
              <YAxis tick={{ fontSize: 10, fill: muted }} unit="h" />
              <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}h`, 'Avg Duration']} />
              <Line type="monotone" dataKey="avgDuration" name="Avg Stay" stroke="#E63946" strokeWidth={2.5} dot={{ r: 3, fill: '#E63946' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
