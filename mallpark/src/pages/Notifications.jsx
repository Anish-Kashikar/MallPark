import { useParkingStore } from '../store/parkingStore';
import { MdNotifications, MdDoneAll } from 'react-icons/md';

const notifColors = {
  available: '#22c55e',
  confirmed: '#3b82f6',
  warning: '#f59e0b',
  ev: '#7c3aed',
  info: '#71717a',
};

export default function Notifications() {
  const { notifications, markAllRead, theme } = useParkingStore();
  const isDark = theme === 'dark';

  const text = isDark ? '#f4f4f5' : '#18181b';
  const muted = isDark ? '#71717a' : '#52525b';
  const border = isDark ? '#27272a' : '#e4e4e7';
  const cardBg = isDark ? '#18181b' : '#fff';

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: text, marginBottom: 4 }}>Notifications</h1>
          <p style={{ fontSize: 14, color: muted }}>{unread} unread</p>
        </div>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'transparent', border: `1px solid ${border}`, borderRadius: 8, padding: '7px 14px', color: muted, fontSize: 13, cursor: 'pointer' }}
          >
            <MdDoneAll size={16} />
            Mark all read
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {notifications.length === 0 ? (
          <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 14, padding: '48px', textAlign: 'center' }}>
            <MdNotifications size={40} style={{ color: muted, marginBottom: 12 }} />
            <p style={{ color: muted }}>No notifications yet</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              style={{
                background: n.read ? cardBg : isDark ? '#1f1f23' : '#ffffef',
                border: `1px solid ${n.read ? border : 'rgba(250,204,21,0.3)'}`,
                borderRadius: 10, padding: '14px 16px',
                display: 'flex', alignItems: 'center', gap: 14,
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: notifColors[n.type] || '#71717a', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, color: text, fontWeight: n.read ? 400 : 600 }}>{n.message}</p>
                <p style={{ fontSize: 11, color: muted, marginTop: 2 }}>{n.time}</p>
              </div>
              {!n.read && (
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#facc15', flexShrink: 0 }} />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
