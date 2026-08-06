import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { MdClose, MdDownload, MdDirectionsCar } from 'react-icons/md';
import { floors } from '../data/mockData';

export default function ParkingTicketModal({ slot, reservation, onClose, onFindMyCar, isDark }) {
  if (!slot || !reservation) return null;

  const floorLabel = floors.find((f) => f.id === slot.floor)?.label || slot.floor;
  const entryTime = new Date(reservation.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const plate = reservation.plate || 'MH12XX0000';

  const qrData = JSON.stringify({
    slot: slot.id,
    floor: slot.floor,
    plate,
    reservationId: reservation.id,
    entryTime: reservation.createdAt,
  });

  const cardBg  = isDark ? '#1b1f2e' : '#ffffff';
  const border  = isDark ? 'rgba(43,45,66,0.8)' : '#e4e4ec';
  const text    = isDark ? '#F4F1DE' : '#2B2D42';
  const muted   = isDark ? '#6b6d85' : '#7a7c92';
  const teal    = '#1FA9A6';
  const navy    = '#0B3C5D';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.75)',
          zIndex: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 16, backdropFilter: 'blur(4px)',
        }}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: 380, background: cardBg,
            border: `1px solid ${border}`,
            borderRadius: 20, overflow: 'hidden',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          <div style={{
            background: `linear-gradient(135deg, ${navy}, #0e4870)`,
            padding: '18px 22px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase' }}>MallPark</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginTop: 2 }}>Parking Ticket</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer', borderRadius: 8, padding: 6, color: '#fff', display: 'flex' }}>
                <MdClose size={18} />
              </button>
            </div>
          </div>

          <div style={{ padding: '0 22px' }}>
            <div style={{
              margin: '18px 0 0',
              background: isDark ? 'rgba(11,60,93,0.22)' : '#f0f8ff',
              border: `1px solid ${navy}40`,
              borderRadius: 10, padding: '12px 16px',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <div style={{
                background: navy, borderRadius: 6, padding: '6px 14px',
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <MdDirectionsCar size={16} style={{ color: '#fff' }} />
                <span style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: 1.5, fontFamily: 'monospace' }}>
                  {plate}
                </span>
              </div>
              <p style={{ fontSize: 10, color: muted }}>Registered Vehicle</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, margin: '14px 0' }}>
              {[
                { label: 'Floor',      value: floorLabel },
                { label: 'Slot No.',   value: slot.id, accent: teal },
                { label: 'Entry Time', value: entryTime },
                { label: 'Est. Fee',   value: `₹${slot.fee}/hr`, accent: teal },
                { label: 'Duration',   value: `${reservation.duration || 2} hrs` },
                { label: 'Status',     value: 'Confirmed', accent: '#22c55e' },
              ].map((item) => (
                <div key={item.label} style={{
                  background: isDark ? 'rgba(255,255,255,0.04)' : '#f7f8fb',
                  border: `1px solid ${border}`,
                  borderRadius: 8, padding: '10px 12px',
                }}>
                  <p style={{ fontSize: 10, color: muted, marginBottom: 3 }}>{item.label}</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: item.accent || text }}>{item.value}</p>
                </div>
              ))}
            </div>

            <div style={{ borderTop: `1px dashed ${border}`, margin: '4px 0 14px', position: 'relative' }}>
              <span style={{ position: 'absolute', left: -22, top: -10, width: 20, height: 20, background: isDark ? '#12151e' : '#f0f0f5', borderRadius: '0 10px 10px 0', border: `1px solid ${border}`, borderLeft: 'none' }} />
              <span style={{ position: 'absolute', right: -22, top: -10, width: 20, height: 20, background: isDark ? '#12151e' : '#f0f0f5', borderRadius: '10px 0 0 10px', border: `1px solid ${border}`, borderRight: 'none' }} />
            </div>

            <div style={{ display: 'flex', gap: 18, alignItems: 'center', marginBottom: 18 }}>
              <div style={{
                background: '#ffffff', padding: 10, borderRadius: 10,
                border: `2px solid ${navy}30`, flexShrink: 0,
              }}>
                <QRCodeSVG
                  value={qrData}
                  size={110}
                  bgColor="#ffffff"
                  fgColor={navy}
                  level="M"
                />
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: text, marginBottom: 6 }}>Scan to navigate</p>
                <p style={{ fontSize: 11, color: muted, lineHeight: 1.6 }}>
                  Scan this QR code later to find your parked vehicle and navigate to your slot.
                </p>
                <p style={{ fontSize: 10, color: muted, marginTop: 8 }}>ID: {reservation.id}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, paddingBottom: 18 }}>
              <button
                onClick={() => { onFindMyCar(slot); onClose(); }}
                style={{
                  flex: 1, padding: '10px', borderRadius: 9,
                  background: teal, border: 'none', color: '#fff',
                  fontWeight: 700, fontSize: 13, cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                Mark as Parked
              </button>
              <button
                onClick={onClose}
                style={{
                  flex: 1, padding: '10px', borderRadius: 9,
                  background: 'transparent', border: `1px solid ${border}`,
                  color: muted, fontSize: 13, cursor: 'pointer',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
