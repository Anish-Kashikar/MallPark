import { useParkingStore } from '../store/parkingStore';
import { MdDarkMode, MdLightMode, MdNotifications, MdAnimation } from 'react-icons/md';

export default function Settings() {
  const { theme, toggleTheme, animationsEnabled, toggleAnimations, notificationsEnabled, toggleNotifications } = useParkingStore();
  const isDark = theme === 'dark';

  const text = isDark ? '#f4f4f5' : '#18181b';
  const muted = isDark ? '#71717a' : '#52525b';
  const border = isDark ? '#27272a' : '#e4e4e7';
  const cardBg = isDark ? '#18181b' : '#fff';

  const settings = [
    {
      icon: isDark ? MdLightMode : MdDarkMode,
      label: isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode',
      desc: `Currently in ${isDark ? 'dark' : 'light'} mode`,
      action: toggleTheme,
      active: true,
    },
    {
      icon: MdNotifications,
      label: 'Notifications',
      desc: 'Live parking updates and alerts',
      action: toggleNotifications,
      active: notificationsEnabled,
    },
    {
      icon: MdAnimation,
      label: 'Animations',
      desc: 'Smooth transitions and motion effects',
      action: toggleAnimations,
      active: animationsEnabled,
    },
  ];

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: text, marginBottom: 4 }}>Settings</h1>
        <p style={{ fontSize: 14, color: muted }}>Customize how MallPark works for you</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {settings.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(250,204,21,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={20} style={{ color: '#facc15' }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: 14, color: text }}>{s.label}</p>
                <p style={{ fontSize: 12, color: muted, marginTop: 1 }}>{s.desc}</p>
              </div>
              <button
                onClick={s.action}
                style={{
                  width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: s.active ? '#facc15' : isDark ? '#3f3f46' : '#d4d4d8',
                  position: 'relative', transition: 'background 0.2s',
                }}
              >
                <span style={{
                  position: 'absolute', top: 2, left: s.active ? 22 : 2, width: 20, height: 20,
                  borderRadius: '50%', background: '#fff', transition: 'left 0.2s',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                }} />
              </button>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 24, background: cardBg, border: `1px solid ${border}`, borderRadius: 12, padding: '18px 20px' }}>
        <p style={{ fontWeight: 600, fontSize: 14, color: text, marginBottom: 6 }}>About MallPark</p>
        <p style={{ fontSize: 13, color: muted, lineHeight: 1.7 }}>
          MallPark v1.0 — A smart parking dashboard simulation.<br />
          Built with React, Vite, Tailwind CSS and Framer Motion.
        </p>
      </div>
    </div>
  );
}
