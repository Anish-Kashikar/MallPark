import { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdDashboard, MdMap, MdBookmark, MdBarChart,
  MdCalculate, MdEvStation, MdNotifications, MdSettings,
  MdMenu, MdClose, MdLightMode, MdDarkMode, MdPerson, MdLogout,
} from 'react-icons/md';
import { useParkingStore } from '../store/parkingStore';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: MdDashboard },
  { path: '/map', label: 'Parking Map', icon: MdMap },
  { path: '/reservations', label: 'Reservations', icon: MdBookmark },
  { path: '/analytics', label: 'Analytics', icon: MdBarChart },
  { path: '/fee-estimator', label: 'Fee Estimator', icon: MdCalculate },
  { path: '/ev-charging', label: 'EV Charging', icon: MdEvStation },
  { path: '/notifications', label: 'Notifications', icon: MdNotifications },
  { path: '/settings', label: 'Settings', icon: MdSettings },
  { path: '/profile', label: 'Profile', icon: MdPerson },
];

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 768);
  const { theme, toggleTheme, notifications, user, signOut } = useParkingStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isDark = theme === 'dark';
  const unreadCount = notifications.filter((n) => !n.read).length;

  const sidebarBg = isDark ? '#18181b' : '#f9f9f9';
  const borderColor = isDark ? '#27272a' : '#e4e4e7';
  const mainBg = isDark ? '#09090b' : '#f4f4f5';
  const navBg = isDark ? 'rgba(9,9,11,0.95)' : 'rgba(255,255,255,0.95)';
  const muted = isDark ? '#71717a' : '#71717a';

  return (
    <div className="app-shell" style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: mainBg }}>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            key="sidebar"
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="app-sidebar"
            style={{
              position: 'fixed', left: 0, top: 0, height: '100%', zIndex: 30,
              width: 256, display: 'flex', flexDirection: 'column',
              background: sidebarBg, borderRight: `1px solid ${borderColor}`,
            }}
          >
          <Link to="/">  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '20px', borderBottom: `1px solid ${borderColor}` }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: '#facc15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontWeight: 900, fontSize: 18, color: '#000' }}>M</span>
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 14, color: isDark ? '#f4f4f5' : '#18181b' }}>MallPark</p>
                <p style={{ fontSize: 11, color: muted }}>Smart Parking</p>
              </div>
            </div>
            </Link>
            <nav style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {navItems.map((item) => {
                const active = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 12px', borderRadius: 9, border: 'none', cursor: 'pointer',
                      background: active ? '#facc15' : 'transparent',
                      color: active ? '#000' : isDark ? '#a1a1aa' : '#52525b',
                      fontWeight: active ? 700 : 500, fontSize: 13,
                      transition: 'all 0.15s', textAlign: 'left',
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = isDark ? '#27272a' : '#e4e4e7';
                        e.currentTarget.style.color = isDark ? '#f4f4f5' : '#18181b';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = isDark ? '#a1a1aa' : '#52525b';
                      }
                    }}
                  >
                    <Icon size={18} />
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.path === '/notifications' && unreadCount > 0 && (
                      <span style={{
                        fontSize: 10, background: '#ef4444', color: '#fff', borderRadius: '50%',
                        width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div style={{ padding: '14px 16px', borderTop: `1px solid ${borderColor}` }}>
              <p style={{ fontSize: 11, textAlign: 'center', color: isDark ? '#3f3f46' : '#a1a1aa' }}>
                MallPark v1.0 — Live Demo
              </p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="app-content" style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        marginLeft: sidebarOpen ? 256 : 0,
        transition: 'margin-left 0.3s ease',
        minWidth: 0, overflow: 'hidden',
      }}>
        <header style={{
          height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 20px', position: 'sticky', top: 0, zIndex: 20,
          background: navBg, borderBottom: `1px solid ${borderColor}`,
          backdropFilter: 'blur(10px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {user ? <><button onClick={() => navigate('/profile')} style={{ border: 'none', background: 'transparent', color: muted, cursor: 'pointer', fontSize: 13 }}>{user.name}</button><button onClick={signOut} title="Sign out" style={{ border: 'none', background: 'transparent', color: muted, cursor: 'pointer', padding: 5 }}><MdLogout size={18} /></button></> : <button onClick={() => navigate('/profile')} style={{ border: 'none', background: 'transparent', color: muted, cursor: 'pointer', fontSize: 13 }}>Sign in</button>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ padding: 8, borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: muted }}
            onMouseEnter={(e) => e.currentTarget.style.background = isDark ? '#27272a' : '#e4e4e7'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            {sidebarOpen ? <MdClose size={20} /> : <MdMenu size={20} />}
          </button>
          </div>

          <button
            onClick={toggleTheme}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
              borderRadius: 8, border: `1px solid ${borderColor}`, background: 'transparent',
              color: muted, cursor: 'pointer', fontSize: 13, fontWeight: 500,
            }}
          >
            {isDark ? <MdLightMode size={17} /> : <MdDarkMode size={17} />}
            <span>{isDark ? 'Light' : 'Dark'}</span>
          </button>
        </header>

        <main className="app-main" style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
