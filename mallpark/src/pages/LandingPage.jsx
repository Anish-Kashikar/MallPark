import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MdLocalParking, MdEvStation, MdSecurity, MdSearch, MdArrowForward, MdStar, MdArrowDownward } from 'react-icons/md';
import { useParkingStore } from '../store/parkingStore';

function useCounter(target, duration = 1500) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  const start = () => {
    if (started.current) return;
    started.current = true;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  return [count, start];
}

const reviews = [
  { name: 'Aarav Shah', rating: 5, text: 'Found a spot in under 2 minutes! The real-time updates are incredibly accurate.' },
  { name: 'Priya Mehta', rating: 5, text: 'Reserved my spot before leaving home. Stress-free parking experience.' },
  { name: 'Rohan Gupta', rating: 4, text: 'Love the EV charging tracker. Saved me from waiting in line.' },
  { name: 'Sneha Patel', rating: 5, text: 'The floor map is super clear. Easy to understand at a glance.' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useParkingStore();
  const isDark = theme === 'dark';
  const [occupancy, setOccupancy] = useState(72);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);
  const [totalCount, startTotal] = useCounter(500);
  const [visitCount, startVisit] = useCounter(12400);
  const [avgCount, startAvg] = useCounter(18);

  useEffect(() => {
    document.body.className = theme;
    const interval = setInterval(() => {
      setOccupancy((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(30, Math.min(97, prev + delta));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [theme]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !statsVisible) {
          setStatsVisible(true);
          startTotal();
          startVisit();
          startAvg();
        }
      },
      { threshold: 0.4 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [statsVisible]);

  const bg = isDark ? '#09090b' : '#ffffff';
  const text = isDark ? '#f4f4f5' : '#18181b';
  const muted = isDark ? '#71717a' : '#52525b';
  const cardBg = isDark ? '#18181b' : '#f9f9f9';
  const border = isDark ? '#27272a' : '#e4e4e7';

  return (
    <div style={{ background: bg, color: text, minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: isDark ? 'rgba(9,9,11,0.9)' : 'rgba(255,255,255,0.9)',
        borderBottom: `1px solid ${border}`,
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: '#facc15', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontWeight: 900, fontSize: 18, color: '#000' }}>M</span>
            </div>
            <span style={{ fontWeight: 700, fontSize: 17 }}>MallPark</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={toggleTheme} style={{
              padding: '6px 14px', borderRadius: 8, border: `1px solid ${border}`,
              background: 'transparent', color: muted, cursor: 'pointer', fontSize: 13, fontWeight: 500,
            }}>
              {isDark ? '☀ Light' : '🌙 Dark'}
            </button>
            <button onClick={() => navigate('/profile')} className="btn-yellow" style={{ padding: '8px 18px', fontSize: 14 }}>
              Sign in
            </button>
          </div>
        </div>
      </nav>

      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '90px 24px 60px', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px',
            borderRadius: 100, border: `1px solid #facc15`, background: isDark ? 'rgba(250,204,21,0.1)' : 'rgba(250,204,21,0.15)',
            color: '#facc15', fontSize: 12, fontWeight: 600, marginBottom: 24,
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e' }} className="animate-pulse-slow" />
            Live parking data active
          </span>

          <h1 style={{ fontSize: 'clamp(32px, 6vw, 58px)', fontWeight: 800, lineHeight: 1.1, marginBottom: 20 }}>
            Find Parking in<br />
            <span style={{ color: '#facc15' }}>Seconds, Not Minutes</span>
          </h1>
          <p style={{ fontSize: 16, color: muted, maxWidth: 520, margin: '0 auto 32px', lineHeight: 1.7 }}>
            Real-time slot tracking across all floors. Reserve your spot before you arrive and walk straight in.
          </p>

          <div style={{
            display: 'inline-flex', gap: 12, padding: '12px 18px',
            borderRadius: 12, border: `1px solid ${border}`,
            background: isDark ? '#18181b' : '#fff',
            marginBottom: 40, boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }}>
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: 11, color: muted, marginBottom: 2 }}>Today's Occupancy</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: occupancy > 85 ? '#ef4444' : occupancy > 65 ? '#f59e0b' : '#22c55e' }}>
                  {occupancy}%
                </span>
                <div style={{ width: 80, height: 6, borderRadius: 3, background: isDark ? '#27272a' : '#e4e4e7', overflow: 'hidden' }}>
                  <motion.div
                    animate={{ width: `${occupancy}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{ height: '100%', borderRadius: 3, background: occupancy > 85 ? '#ef4444' : occupancy > 65 ? '#f59e0b' : '#22c55e' }}
                  />
                </div>
              </div>
            </div>
            <div style={{ width: 1, background: border }} />
            <div style={{ textAlign: 'left' }}>
              <p style={{ fontSize: 11, color: muted, marginBottom: 2 }}>Available Now</p>
              <span style={{ fontSize: 28, fontWeight: 800, color: '#facc15' }}>
                {Math.floor(500 * (1 - occupancy / 100))}
              </span>
              <span style={{ fontSize: 12, color: muted }}> slots</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/map')} className="btn-yellow" style={{ fontSize: 15, padding: '12px 28px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <MdSearch size={18} />
              Find a Spot
            </button>
            <button onClick={() => navigate('/reservations')} className="btn-outline" style={{ fontSize: 15, padding: '12px 28px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <MdArrowForward size={18} />
              Reserve Now
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          style={{ marginTop: 60, display: 'flex', justifyContent: 'center' }}
        >
          <MdArrowDownward style={{ color: '#facc15', animation: 'bounce 1.5s infinite' }} size={24} />
        </motion.div>
      </section>

      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 70px' }}>
        <p style={{ textAlign: 'center', fontSize: 12, fontWeight: 600, color: '#facc15', letterSpacing: 2, marginBottom: 32, textTransform: 'uppercase' }}>
          Features
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18 }}>
          {[
            { icon: MdLocalParking, title: 'Live Slot Tracking', desc: 'See every slot update in real-time across all 5 floors.' },
            { icon: MdEvStation, title: 'EV Charging', desc: 'Locate and track EV charger availability instantly.' },
            { icon: MdBookmarkIcon, title: 'Easy Reservations', desc: 'Pre-book your spot and arrive stress-free.' },
            { icon: MdSecurity, title: 'Secure & Reliable', desc: 'CCTV monitored, 24-hour attendant on every floor.' },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              style={{
                background: cardBg, border: `1px solid ${border}`,
                borderRadius: 14, padding: '24px 22px',
              }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(250,204,21,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <f.icon style={{ color: '#facc15' }} size={22} />
              </div>
              <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{f.title}</p>
              <p style={{ color: muted, fontSize: 13, lineHeight: 1.6 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section ref={statsRef} style={{ background: isDark ? '#18181b' : '#fafafa', borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 30, textAlign: 'center' }}>
          {[
            { value: totalCount, suffix: ' Slots', label: 'Across 5 Floors' },
            { value: visitCount.toLocaleString(), suffix: '+', label: 'Monthly Visitors' },
            { value: avgCount, suffix: ' min', label: 'Avg. Parking Time' },
          ].map((s, i) => (
            <div key={i}>
              <p style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 800, color: '#facc15' }}>
                {s.value}{s.suffix}
              </p>
              <p style={{ color: muted, fontSize: 14, marginTop: 4 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '70px 24px' }}>
        <p style={{ textAlign: 'center', fontSize: 12, fontWeight: 600, color: '#facc15', letterSpacing: 2, marginBottom: 10, textTransform: 'uppercase' }}>
          How It Works
        </p>
        <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: 'clamp(22px, 4vw, 32px)', marginBottom: 48 }}>
          Park in 3 Simple Steps
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24, textAlign: 'center' }}>
          {[
            { step: '01', title: 'View Live Map', desc: 'Open the interactive map and see which slots are available right now.' },
            { step: '02', title: 'Reserve or Drive In', desc: 'Pre-book your slot or just drive in and pick any green spot.' },
            { step: '03', title: 'Pay & Go', desc: 'Scan QR at exit or pay digitally. Fast, simple, contactless.' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              viewport={{ once: true }}
              style={{ padding: '10px 0' }}
            >
              <span style={{ display: 'inline-block', fontWeight: 900, fontSize: 36, color: '#facc15', fontFamily: 'Space Grotesk, sans-serif', marginBottom: 12 }}>
                {s.step}
              </span>
              <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{s.title}</p>
              <p style={{ color: muted, fontSize: 13, lineHeight: 1.7 }}>{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section style={{ background: isDark ? '#18181b' : '#fafafa', borderTop: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '70px 24px' }}>
          <p style={{ textAlign: 'center', fontSize: 12, fontWeight: 600, color: '#facc15', letterSpacing: 2, marginBottom: 10, textTransform: 'uppercase' }}>
            Reviews
          </p>
          <h2 style={{ textAlign: 'center', fontWeight: 700, fontSize: 'clamp(22px, 4vw, 30px)', marginBottom: 40 }}>
            What Shoppers Say
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 18 }}>
            {reviews.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                style={{ background: isDark ? '#09090b' : '#fff', border: `1px solid ${border}`, borderRadius: 14, padding: '22px 20px' }}
              >
                <div style={{ display: 'flex', gap: 2, marginBottom: 10 }}>
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <MdStar key={j} style={{ color: '#facc15' }} size={16} />
                  ))}
                </div>
                <p style={{ fontSize: 13, color: muted, lineHeight: 1.7, marginBottom: 14 }}>"{r.text}"</p>
                <p style={{ fontSize: 13, fontWeight: 600 }}>{r.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ textAlign: 'center', padding: '80px 24px', background: isDark ? '#09090b' : '#fff' }}>
        <h2 style={{ fontWeight: 800, fontSize: 'clamp(22px, 4vw, 36px)', marginBottom: 14 }}>
          Ready to park <span style={{ color: '#facc15' }}>smarter?</span>
        </h2>
        <p style={{ color: muted, fontSize: 15, marginBottom: 32 }}>
          Open the dashboard and experience real-time parking management.
        </p>
        <button onClick={() => navigate('/dashboard')} className="btn-yellow" style={{ fontSize: 16, padding: '14px 36px' }}>
          Get Started →
        </button>
      </section>

      <footer style={{ borderTop: `1px solid ${border}`, padding: '24px', textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: muted }}>© 2025 MallPark Technologies. All rights reserved.</p>
      </footer>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
      `}</style>
    </div>
  );
}

function MdBookmarkIcon(props) {
  return <MdSecurity {...props} />;
}
