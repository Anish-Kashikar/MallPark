import { useState } from 'react';
import { useParkingStore } from '../store/parkingStore';
import { evChargers } from '../data/mockData';
import { MdEvStation, MdBolt } from 'react-icons/md';

export default function EVCharging() {
  const { theme } = useParkingStore();
  const isDark = theme === 'dark';
  const [filter, setFilter] = useState('all');

  const text = isDark ? '#f4f4f5' : '#18181b';
  const muted = isDark ? '#71717a' : '#52525b';
  const border = isDark ? '#27272a' : '#e4e4e7';
  const cardBg = isDark ? '#18181b' : '#fff';

  const filtered = evChargers.filter((c) => {
    if (filter === 'fast') return c.speed.includes('50');
    if (filter === 'normal') return c.speed.includes('22');
    if (filter === 'available') return c.status === 'available';
    return true;
  });

  const avail = evChargers.filter((c) => c.status === 'available').length;
  const occupied = evChargers.filter((c) => c.status === 'occupied').length;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: text, marginBottom: 4 }}>EV Charging Stations</h1>
        <p style={{ fontSize: 14, color: muted }}>Real-time charger availability across all floors</p>
      </div>

      <div className="ev-summary" style={{ display: 'flex', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Available', value: avail, color: '#22c55e' },
          { label: 'Occupied', value: occupied, color: '#dc2626' },
          { label: 'Total', value: evChargers.length, color: '#facc15' },
        ].map((s) => (
          <div key={s.label} style={{ flex: 1, background: cardBg, border: `1px solid ${border}`, borderRadius: 12, padding: '16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <MdEvStation size={22} style={{ color: s.color }} />
            <div>
              <p style={{ fontSize: 11, color: muted }}>{s.label}</p>
              <p style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="filter-buttons" style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        {['all', 'fast', 'normal', 'available'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 16px', borderRadius: 20, border: `1px solid ${filter === f ? '#facc15' : border}`,
              background: filter === f ? 'rgba(250,204,21,0.15)' : 'transparent',
              color: filter === f ? '#facc15' : muted, fontSize: 13, fontWeight: 500, cursor: 'pointer',
            }}
          >
            {f === 'all' ? 'All' : f === 'fast' ? '⚡ Fast (50kW)' : f === 'normal' ? 'Normal (22kW)' : '✓ Available'}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
        {filtered.map((c) => (
          <div key={c.id} style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 12, padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(250,204,21,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MdBolt style={{ color: '#facc15' }} size={20} />
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14, color: text }}>{c.id}</p>
                  <p style={{ fontSize: 11, color: muted }}>{c.speed}</p>
                </div>
              </div>
              <span style={{
                padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                background: c.status === 'available' ? '#16a34a' : '#dc2626',
                color: '#fff',
              }}>
                {c.status === 'available' ? 'Free' : 'In Use'}
              </span>
            </div>
            <p style={{ fontSize: 12, color: muted, marginBottom: 8 }}>{c.location}</p>
            {c.status === 'occupied' && (
              <p style={{ fontSize: 12, color: '#f59e0b' }}>Est. wait: ~{c.waitTime} min</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
