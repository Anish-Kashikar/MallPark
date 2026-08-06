import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useParkingStore } from '../store/parkingStore';
import { analyticsData } from '../data/mockData';
import { MdLocalParking, MdBlock, MdCheck, MdEvStation, MdBookmark, MdStar } from 'react-icons/md';

function StatCard({ icon: Icon, label, value, highlight, isDark }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={isDark ? 'card-dark' : 'card-light'}
      style={{ padding: '20px 22px', display: 'flex', alignItems: 'center', gap: 16 }}
    >
      <div style={{
        width: 42, height: 42, borderRadius: 10,
        background: highlight ? 'rgba(250,204,21,0.15)' : 'rgba(250,204,21,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon style={{ color: '#facc15' }} size={20} />
      </div>
      <div>
        <p style={{ fontSize: 12, color: isDark ? '#71717a' : '#71717a', marginBottom: 2 }}>{label}</p>
        <p style={{ fontSize: 22, fontWeight: 800, color: isDark ? '#f4f4f5' : '#18181b' }}>{value}</p>
      </div>
    </motion.div>
  );
}

export default function Dashboard() {
  const { slots, theme } = useParkingStore();
  const isDark = theme === 'dark';

  const allSlots = useMemo(() => Object.values(slots).flat(), [slots]);

  const stats = useMemo(() => {
    const total = allSlots.length;
    const occupied = allSlots.filter((s) => s.status === 'occupied').length;
    const available = allSlots.filter((s) => s.status === 'available').length;
    const ev = allSlots.filter((s) => s.status === 'ev').length;
    const reserved = allSlots.filter((s) => s.status === 'reserved').length;
    const vip = allSlots.filter((s) => s.status === 'vip').length;
    return { total, occupied, available, ev, reserved, vip };
  }, [allSlots]);

  const occupancyPct = Math.round((stats.occupied / stats.total) * 100);

  const text = isDark ? '#f4f4f5' : '#18181b';
  const muted = isDark ? '#71717a' : '#52525b';
  const border = isDark ? '#27272a' : '#e4e4e7';
  const cardBg = isDark ? '#18181b' : '#fff';

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: text, marginBottom: 4 }}>Dashboard</h1>
        <p style={{ fontSize: 14, color: muted }}>Live overview of MallPark — all floors</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14, marginBottom: 32 }}>
        <StatCard icon={MdLocalParking} label="Total Spaces" value={stats.total} isDark={isDark} />
        <StatCard icon={MdBlock} label="Occupied" value={stats.occupied} isDark={isDark} />
        <StatCard icon={MdCheck} label="Available" value={stats.available} highlight isDark={isDark} />
        <StatCard icon={MdEvStation} label="EV Slots" value={stats.ev} isDark={isDark} />
        <StatCard icon={MdBookmark} label="Reserved" value={stats.reserved} isDark={isDark} />
        <StatCard icon={MdStar} label="VIP Slots" value={stats.vip} isDark={isDark} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 14, padding: '22px 24px' }}>
          <p style={{ fontWeight: 700, fontSize: 15, color: text, marginBottom: 18 }}>Occupancy by Floor</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {analyticsData.floorUsage.map((f) => (
              <div key={f.floor}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: muted }}>{f.floor}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: text }}>{f.used}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 4, background: isDark ? '#27272a' : '#f4f4f5', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${f.used}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{
                      height: '100%', borderRadius: 4,
                      background: f.used > 80 ? '#ef4444' : f.used > 60 ? '#f59e0b' : '#22c55e',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 14, padding: '22px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontWeight: 700, fontSize: 15, color: text, marginBottom: 20, alignSelf: 'flex-start' }}>Current Occupancy</p>
          <OccupancyRing pct={occupancyPct} />
          <p style={{ marginTop: 16, fontSize: 13, color: muted }}>
            {stats.available} slots available right now
          </p>
        </div>
      </div>

      <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 14, padding: '22px 24px' }}>
        <p style={{ fontWeight: 700, fontSize: 15, color: text, marginBottom: 16 }}>Vehicle Type Breakdown</p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {analyticsData.vehicleTypes.map((v) => {
            const colors = ['#facc15', '#22c55e', '#3b82f6', '#8b5cf6', '#f97316'];
            const i = analyticsData.vehicleTypes.indexOf(v);
            return (
              <div key={v.name} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 20, border: `1px solid ${border}`, background: isDark ? '#27272a' : '#f9f9f9' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: colors[i] }} />
                <span style={{ fontSize: 13, color: text }}>{v.name}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: colors[i] }}>{v.value}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function OccupancyRing({ pct }) {
  const r = 60;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const color = pct > 85 ? '#ef4444' : pct > 65 ? '#f59e0b' : '#22c55e';

  return (
    <div style={{ position: 'relative', width: 160, height: 160 }}>
      <svg width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="80" cy="80" r={r} fill="none" stroke="#27272a" strokeWidth="10" />
        <motion.circle
          cx="80" cy="80" r={r} fill="none"
          stroke={color} strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 28, fontWeight: 800, color }}>{pct}%</span>
        <span style={{ fontSize: 11, color: '#71717a' }}>occupied</span>
      </div>
    </div>
  );
}
